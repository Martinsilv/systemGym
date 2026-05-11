import { useState, useEffect } from "react";
import { registrarPago } from "../../services/paymentService";
import { getActividades } from "../../services/activityService";
import { calcularEstado } from "../../utils/statusUtils";
import {
  calcularNuevaFechaVencimiento,
  formatearFecha,
} from "../../utils/dateUtils";
import { firestoreTimestampToDate } from "../../utils/statusUtils";
import { DollarSign } from "lucide-react";
import toast from "react-hot-toast";

export default function PaymentForm({ alumno, onSuccess }) {
  const [monto, setMonto] = useState("");
  const [actividad, setActividad] = useState(alumno.actividad);
  const [duracionDias, setDuracionDias] = useState(30);
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);
  const [actividades, setActividades] = useState([]);

  // Cargar actividades
  useEffect(() => {
    async function fetch() {
      try {
        const data = await getActividades();
        setActividades(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetch();
  }, []);

  if (!alumno) return null;

  const estado = calcularEstado(alumno.fechaVencimiento);

  // Obtener precio de la actividad seleccionada
  const actividadSeleccionada = actividades.find((a) => a.nombre === actividad);
  const precioDefault = actividadSeleccionada?.precioMensual || 0;

  // Mostrar preview de cuándo va a vencer después del pago
  const vencimientoActual = alumno.fechaVencimiento
    ? firestoreTimestampToDate(alumno.fechaVencimiento)
    : null;
  const nuevaFechaPreview = calcularNuevaFechaVencimiento(
    vencimientoActual,
    duracionDias,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!monto || Number(monto) <= 0) {
      toast.error("❌ Ingresá un monto válido");
      return;
    }

    setLoading(true);
    try {
      const resultado = await registrarPago(
        alumno,
        monto,
        actividad || "Sin actividad",
        duracionDias,
        observaciones,
      );
      toast.success(
        `✅ Pago registrado. Vence: ${formatearFecha(resultado.nuevaFechaVencimiento)}`,
      );
      setMonto("");
      setObservaciones("");
      onSuccess?.();
    } catch (error) {
      console.error(error);
      toast.error("❌ Error al registrar el pago");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-700">
      {/* Info del alumno */}
      <div className="mb-6 pb-6 border-b border-gray-700">
        <h3 className="font-semibold text-lg text-white">
          {alumno.nombre} {alumno.apellido}
        </h3>
        <p className="text-sm text-gray-400">DNI: {alumno.dni}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-gray-400">Estado actual:</span>
          <span
            className={`text-sm font-medium ${
              estado.status === "activo"
                ? "text-green-400"
                : estado.status === "por-vencer"
                  ? "text-yellow-400"
                  : "text-red-400"
            }`}
          >
            {estado.label}
          </span>
        </div>
        {/* Preview de la nueva fecha */}
        <p className="text-sm text-blue-400 mt-2">
          Nuevo vencimiento:{" "}
          <strong>{formatearFecha(nuevaFechaPreview)}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Monto */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Monto del pago
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              $
            </span>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder={precioDefault || "0"}
              min="0"
              step="100"
              className="
                w-full pl-8 pr-4 py-3 rounded-lg
                bg-gray-700 border border-gray-600
                focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
                text-white text-lg font-semibold placeholder-gray-500
              "
            />
          </div>
          {precioDefault > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              Precio sugerido: ${precioDefault.toLocaleString("es-AR")}
            </p>
          )}
        </div>

        {/* Actividad */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Actividad
          </label>
          <select
            value={actividad}
            onChange={(e) => setActividad(e.target.value)}
            className="
              w-full px-4 py-3 rounded-lg
              bg-gray-700 border border-gray-600
              focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
              text-white
            "
          >
            <option value="">Selecciona una actividad</option>
            {actividades.map((act) => (
              <option key={act.id} value={act.nombre}>
                {act.nombre} - ${act.precioMensual.toLocaleString("es-AR")}
              </option>
            ))}
          </select>
        </div>

        {/* Duración */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Duración (días)
          </label>
          <input
            type="number"
            value={duracionDias}
            onChange={(e) => setDuracionDias(Number(e.target.value))}
            min="1"
            className="
              w-full px-4 py-3 rounded-lg
              bg-gray-700 border border-gray-600
              focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
              text-white
            "
          />
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Observaciones (opcional)
          </label>
          <input
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Pago en efectivo, transferencia, tarjeta..."
            className="
              w-full px-4 py-3 rounded-lg
              bg-gray-700 border border-gray-600
              focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
              text-white placeholder-gray-500
            "
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="
            w-full py-3 rounded-lg
            bg-green-600 hover:bg-green-700
            disabled:opacity-60 disabled:cursor-not-allowed
            text-white font-semibold
            flex items-center justify-center gap-2
            transition-colors
          "
        >
          <DollarSign size={18} />
          {loading ? "Registrando..." : "Registrar pago"}
        </button>
      </form>
    </div>
  );
}
