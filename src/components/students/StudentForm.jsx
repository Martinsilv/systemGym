import { useState, useEffect } from "react";
import { registrarAlumno } from "../../services/studentService";
import { getActividades } from "../../services/activityService";
import { validarAlumno } from "../../utils/validators";
import { calcularEdad } from "../../utils/dateUtils";
import { Phone } from "lucide-react";
import toast from "react-hot-toast";

const initialState = {
  nombre: "",
  apellido: "",
  dni: "",
  telefono: "",
  fechaNacimiento: "",
  actividad: "",
  observacionesSalud: "",
};

export default function StudentForm({ onSuccess }) {
  const [form, setForm] = useState(initialState);
  const [errores, setErrores] = useState({});
  const [loading, setLoading] = useState(false);
  const [actividades, setActividades] = useState([]);
  const [loadingActividades, setLoadingActividades] = useState(true);

  // Cargar actividades al montar
  useEffect(() => {
    async function fetchActividades() {
      try {
        const data = await getActividades();
        setActividades(data);
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, actividad: data[0].id }));
        }
      } catch (error) {
        console.error("Error al cargar actividades:", error);
        toast.error("No se pudieron cargar las actividades");
      } finally {
        setLoadingActividades(false);
      }
    }
    fetchActividades();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { errores: nuevosErrores, valido } = validarAlumno(form);

    if (!valido) {
      setErrores(nuevosErrores);
      return;
    }

    setLoading(true);
    try {
      // Buscar la actividad seleccionada para obtener su nombre
      const actividadSeleccionada = actividades.find(
        (a) => a.id === form.actividad,
      );

      await registrarAlumno({
        ...form,
        actividad: actividadSeleccionada?.nombre || "Sin actividad",
      });
      toast.success("✅ Alumno registrado correctamente");
      setForm(initialState);
      if (actividades.length > 0) {
        setForm((prev) => ({ ...prev, actividad: actividades[0].id }));
      }
      setErrores({});
      onSuccess?.();
    } catch (error) {
      if (error.message.includes("DNI")) {
        setErrores({ dni: error.message });
      } else {
        toast.error("❌ Error al registrar el alumno");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const edadCalculada = form.fechaNacimiento
    ? calcularEdad(form.fechaNacimiento)
    : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Nombre */}
        <FormField label="Nombre" error={errores.nombre}>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Juan"
            className={inputClass(errores.nombre)}
            disabled={loading}
          />
        </FormField>

        {/* Apellido */}
        <FormField label="Apellido" error={errores.apellido}>
          <input
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            placeholder="Pérez"
            className={inputClass(errores.apellido)}
            disabled={loading}
          />
        </FormField>

        {/* DNI */}
        <FormField label="DNI" error={errores.dni}>
          <input
            name="dni"
            value={form.dni}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "dni",
                  value: e.target.value.replace(/\D/g, ""),
                },
              })
            }
            placeholder="38123456"
            maxLength={8}
            className={inputClass(errores.dni)}
            disabled={loading}
          />
        </FormField>

        {/* Teléfono */}
        <FormField label="Teléfono" error={errores.telefono}>
          <div className="relative">
            <Phone
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="+54 9 3794 123456"
              className={inputClass(errores.telefono, "pl-11")}
              disabled={loading}
            />
          </div>
        </FormField>

        {/* Fecha de nacimiento */}
        <FormField
          label={`Fecha de nacimiento${edadCalculada ? ` (${edadCalculada} años)` : ""}`}
          error={errores.fechaNacimiento}
        >
          <input
            type="date"
            name="fechaNacimiento"
            value={form.fechaNacimiento}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
            className={inputClass(errores.fechaNacimiento)}
            disabled={loading}
          />
        </FormField>

        {/* Actividad */}
        <FormField label="Actividad" error={errores.actividad}>
          <select
            name="actividad"
            value={form.actividad}
            onChange={handleChange}
            className={inputClass(errores.actividad)}
            disabled={loading || loadingActividades || actividades.length === 0}
          >
            <option value="">Selecciona una actividad</option>
            {actividades.map((act) => (
              <option key={act.id} value={act.id}>
                {act.nombre} - ${act.precioMensual.toLocaleString("es-AR")}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      {/* Observaciones de salud */}
      <FormField
        label="Observaciones de salud (opcional)"
        error={errores.observacionesSalud}
      >
        <textarea
          name="observacionesSalud"
          value={form.observacionesSalud}
          onChange={handleChange}
          placeholder="Alergias, lesiones, condiciones médicas..."
          rows={3}
          className={`${inputClass()} resize-none`}
          disabled={loading}
        />
      </FormField>

      <button
        type="submit"
        disabled={loading || loadingActividades || actividades.length === 0}
        className="
          w-full py-3 rounded-xl
          bg-blue-600 hover:bg-blue-700
          disabled:opacity-60 disabled:cursor-not-allowed
          text-white font-semibold
          transition-colors
        "
      >
        {loading ? "Registrando..." : "Registrar alumno"}
      </button>
    </form>
  );
}

function FormField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-300">{label}</label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

function inputClass(hasError, extraClass = "") {
  return `
    w-full px-4 py-3 rounded-xl
    bg-gray-800 dark:bg-gray-700
    border-2 ${
      hasError
        ? "border-red-400 focus:border-red-500"
        : "border-gray-600 dark:border-gray-600 focus:border-blue-500"
    }
    text-white dark:text-white
    placeholder-gray-500
    focus:outline-none transition-colors
    ${extraClass}
  `;
}
