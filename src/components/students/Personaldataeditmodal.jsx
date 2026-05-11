import { useState } from "react";
import { updateDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "../../services/firebase";
import { calcularEdad } from "../../utils/dateUtils";
import Button from "../ui/Button";

export default function PersonalDataEditModal({ alumno, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre: alumno.nombre || "",
    apellido: alumno.apellido || "",
    telefono: alumno.telefono || "",
    fechaNacimiento: alumno.fechaNacimiento
      ? new Date(alumno.fechaNacimiento.toDate()).toISOString().split("T")[0]
      : "",
    observacionesSalud: alumno.observacionesSalud || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!formData.nombre.trim()) {
      setError("El nombre es requerido");
      return;
    }
    if (!formData.apellido.trim()) {
      setError("El apellido es requerido");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const alumnoRef = doc(db, "alumnos", alumno.id);

      const edad = formData.fechaNacimiento
        ? calcularEdad(formData.fechaNacimiento)
        : alumno.edad;

      await updateDoc(alumnoRef, {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        telefono: formData.telefono.trim(),
        fechaNacimiento: formData.fechaNacimiento
          ? Timestamp.fromDate(new Date(formData.fechaNacimiento))
          : alumno.fechaNacimiento,
        edad,
        observacionesSalud: formData.observacionesSalud.trim(),
        updatedAt: Timestamp.fromDate(new Date()),
      });

      // Retornar el alumno actualizado
      onSuccess({
        ...alumno,
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        telefono: formData.telefono.trim(),
        fechaNacimiento: formData.fechaNacimiento
          ? Timestamp.fromDate(new Date(formData.fechaNacimiento))
          : alumno.fechaNacimiento,
        edad,
        observacionesSalud: formData.observacionesSalud.trim(),
      });
    } catch (err) {
      setError(err.message || "Error al guardar los cambios");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Nombre
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          placeholder="Juan"
        />
      </div>

      {/* Apellido */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Apellido
        </label>
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          placeholder="Pérez"
        />
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Teléfono
        </label>
        <input
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          placeholder="3794567890"
        />
      </div>

      {/* Fecha de Nacimiento */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Fecha de Nacimiento
        </label>
        <input
          type="date"
          name="fechaNacimiento"
          value={formData.fechaNacimiento}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
        />
      </div>

      {/* Observaciones de Salud */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Observaciones de Salud
        </label>
        <textarea
          name="observacionesSalud"
          value={formData.observacionesSalud}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition resize-none"
          placeholder="Ej: Lesión de rodilla, alergia a..."
          rows="3"
        />
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Botones */}
      <div className="flex gap-3 pt-4 border-t border-gray-700">
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          className="flex-1"
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </form>
  );
}
