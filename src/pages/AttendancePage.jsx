import { useState, useEffect } from "react";
import {
  getAsistenciasMesActual,
  getResumenAsistenciasMes,
} from "../services/attendanceService";
import { formatearFecha } from "../utils/dateUtils";
import { firestoreTimestampToDate } from "../utils/statusUtils";
import { Search, Users, TrendingUp, Dumbbell } from "lucide-react";
import AttendanceList from "../components/attendance/AttendanceList";
import toast from "react-hot-toast";

export default function AttendancePage() {
  const [asistencias, setAsistencias] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAsistencias();
  }, []);

  const fetchAsistencias = async () => {
    setLoading(true);
    try {
      const dataAsistencias = await getAsistenciasMesActual();
      setAsistencias(dataAsistencias);

      const dataResumen = await getResumenAsistenciasMes();
      setResumen(dataResumen);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar asistencias");
    } finally {
      setLoading(false);
    }
  };

  // Filtrado
  const asistenciasFiltradas = asistencias.filter((asistencia) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      asistencia.nombreAlumno.toLowerCase().includes(q) ||
      asistencia.dni.includes(q) ||
      asistencia.actividad.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Asistencias</h1>
        <p className="text-gray-400 text-sm mt-1">
          Registro de entrada de alumnos
        </p>
      </div>

      {/* Resumen del mes */}
      {resumen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Total de asistencias */}
          <div className="bg-gradient-to-br from-blue-900/40 to-blue-900/20 border border-blue-800/50 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">
                  Asistencias este mes
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {resumen.total}
                </p>
              </div>
              <Users className="text-blue-500" size={32} />
            </div>
          </div>

          {/* Alumnos únicos */}
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/20 border border-purple-800/50 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">
                  Alumnos únicos
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {Object.keys(resumen.porAlumno).length}
                </p>
              </div>
              <TrendingUp className="text-purple-500" size={32} />
            </div>
          </div>

          {/* Promedio diario */}
          <div className="bg-gradient-to-br from-green-900/40 to-green-900/20 border border-green-800/50 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">
                  Promedio por día
                </p>
                <p className="text-3xl font-bold text-white mt-2">
                  {Object.keys(resumen.dias).length > 0
                    ? (
                        resumen.total / Object.keys(resumen.dias).length
                      ).toFixed(1)
                    : 0}
                </p>
              </div>
              <Dumbbell className="text-green-500" size={32} />
            </div>
          </div>
        </div>
      )}

      {/* Asistencias por actividad */}
      {resumen && Object.keys(resumen.porActividad).length > 0 && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Asistencias por actividad
          </h2>
          <div className="space-y-2">
            {Object.entries(resumen.porActividad)
              .sort(([, a], [, b]) => b - a)
              .map(([actividad, count]) => (
                <div
                  key={actividad}
                  className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
                >
                  <span className="text-gray-300">{actividad}</span>
                  <span className="font-semibold text-blue-400">
                    {count} {count === 1 ? "asistencia" : "asistencias"}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Top 10 alumnos con más asistencias */}
      {resumen && Object.keys(resumen.porAlumno).length > 0 && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">
            Alumnos más activos
          </h2>
          <div className="space-y-2">
            {Object.entries(resumen.porAlumno)
              .sort(([, a], [, b]) => b.count - a.count)
              .slice(0, 10)
              .map(([alumnoId, data]) => (
                <div
                  key={alumnoId}
                  className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
                >
                  <span className="text-gray-300">{data.nombre}</span>
                  <span className="font-semibold text-green-400">
                    {data.count} {data.count === 1 ? "visita" : "visitas"}
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

      {/* Tabla de asistencias */}
      <AttendanceList asistencias={asistenciasFiltradas} loading={loading} />
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
      <Users size={48} className="mx-auto mb-4 opacity-50" />
      <p className="font-medium text-lg">
        {hasSearch
          ? "No se encontraron asistencias"
          : "No hay asistencias registradas"}
      </p>
    </div>
  );
}
