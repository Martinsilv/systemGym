import { useState, useEffect } from "react";
import { getTodosPagos, getResumenIngresos } from "../services/paymentService";
import { formatearFecha, formatearHora } from "../utils/dateUtils";
import { firestoreTimestampToDate } from "../utils/statusUtils";
import { DollarSign, TrendingUp, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function PaymentsPage() {
  const [pagos, setPagos] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPagos();
  }, []);

  const fetchPagos = async () => {
    setLoading(true);
    try {
      const dataPagos = await getTodosPagos(500);
      setPagos(dataPagos);

      const dataResumen = await getResumenIngresos();
      setResumen(dataResumen);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar pagos");
    } finally {
      setLoading(false);
    }
  };

  // Filtrado
  const pagosFiltrados = pagos.filter((pago) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      pago.nombreAlumno.toLowerCase().includes(q) ||
      pago.dni.includes(q) ||
      pago.actividad.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Pagos</h1>
        <p className="text-gray-400 text-sm mt-1">Historial de ingresos</p>
      </div>

      {/* Resumen de ingresos */}
      {resumen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total mes actual */}
          <div className="bg-gradient-to-br from-green-900/40 to-green-900/20 border border-green-800/50 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">
                  Ingresos este mes
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  ${(resumen.totalMes || 0).toLocaleString("es-AR")}
                </p>
              </div>
              <DollarSign className="text-green-500" size={32} />
            </div>
          </div>

          {/* Total general */}
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-900/20 border border-blue-800/50 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">
                  Total histórico
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  ${(resumen.totalMes || 0).toLocaleString("es-AR")}
                </p>
              </div>
              <TrendingUp className="text-blue-500" size={32} />
            </div>
          </div>

          {/* Pagos registrados */}
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/20 border border-purple-800/50 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">
                  Pagos registrados
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {pagos.length}
                </p>
              </div>
              <DollarSign className="text-purple-500" size={32} />
            </div>
          </div>
        </div>
      )}

      {/* Ingresos por actividad */}
      {resumen && Object.keys(resumen.porActividad).length > 0 && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Ingresos por actividad
          </h2>
          <div className="space-y-2">
            {Object.entries(resumen.porActividad).map(([actividad, monto]) => (
              <div
                key={actividad}
                className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
              >
                <span className="text-gray-300">{actividad}</span>
                <span className="font-semibold text-green-400">
                  ${(monto || 0).toLocaleString("es-AR")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buscador */}
      <div className="relative mb-6">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          size={18}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por alumno, DNI o actividad..."
          className="
            w-full pl-11 pr-4 py-3 rounded-lg
            bg-gray-800 border border-gray-700
            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            text-white placeholder-gray-500
          "
        />
      </div>

      {/* Tabla de pagos */}
      {loading ? (
        <TableSkeleton />
      ) : pagosFiltrados.length === 0 ? (
        <EmptyState hasSearch={search.length > 0} />
      ) : (
        <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-800 border-b border-gray-700">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                    Alumno
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                    DNI
                  </th>
                  <th className="hidden sm:table-cell text-left px-6 py-4 text-sm font-semibold text-gray-300">
                    Actividad
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                    Monto
                  </th>
                  <th className="hidden md:table-cell text-left px-6 py-4 text-sm font-semibold text-gray-300">
                    Fecha
                  </th>
                  <th className="hidden lg:table-cell text-left px-6 py-4 text-sm font-semibold text-gray-300">
                    Vence
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {pagosFiltrados.map((pago) => (
                  <tr
                    key={pago.id}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-white">
                        {pago.nombreAlumno}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-gray-400">
                        {pago.dni}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-6 py-4">
                      <span className="text-gray-400">{pago.actividad}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-green-400">
                        ${pago.monto.toLocaleString("es-AR")}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <span className="text-gray-400 text-sm">
                        {formatearFecha(pago.fechaPago)}
                      </span>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4">
                      <span className="text-gray-400 text-sm">
                        {formatearFecha(pago.fechaVencimientoNueva)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-800 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState({ hasSearch }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <DollarSign size={48} className="mx-auto mb-4 opacity-50" />
      <p className="font-medium text-lg">
        {hasSearch ? "No se encontraron pagos" : "No hay pagos registrados"}
      </p>
    </div>
  );
}
