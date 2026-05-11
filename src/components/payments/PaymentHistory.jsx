import { formatearFecha } from "../../utils/dateUtils";
import { firestoreTimestampToDate } from "../../utils/statusUtils";

export default function PaymentHistory({
  pagos = [],
  loading = false,
  alumnoNombre = null,
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (pagos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="font-medium">
          {alumnoNombre
            ? `No hay pagos registrados para ${alumnoNombre}`
            : "No hay pagos registrados"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {pagos.map((pago) => (
        <div
          key={pago.id}
          className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-medium text-white">{pago.actividad}</p>
              <p className="text-xs text-gray-400">
                Fecha de pago: {formatearFecha(pago.fechaPago)}
              </p>
            </div>
            <span className="text-lg font-bold text-green-400">
              ${pago.monto.toLocaleString("es-AR")}
            </span>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>
              Vencimiento anterior:{" "}
              {formatearFecha(pago.fechaVencimientoAnterior)}
            </p>
            <p>
              Nuevo vencimiento: {formatearFecha(pago.fechaVencimientoNueva)}
            </p>
            {pago.observaciones && <p>Nota: {pago.observaciones}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
