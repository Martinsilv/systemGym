import { formatearFecha, formatearHora } from "../../utils/dateUtils";

export default function AttendanceList({ asistencias = [], loading = false }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (asistencias.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="font-medium">No hay asistencias registradas</p>
      </div>
    );
  }

  return (
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
                Fecha
              </th>
              <th className="hidden md:table-cell text-left px-6 py-4 text-sm font-semibold text-gray-300">
                Hora
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {asistencias.map((asistencia) => (
              <tr
                key={asistencia.id}
                className="hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="font-medium text-white">
                      {asistencia.nombreAlumno}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-gray-400">
                    {asistencia.dni}
                  </span>
                </td>
                <td className="hidden sm:table-cell px-6 py-4">
                  <span className="text-gray-400">{asistencia.actividad}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-gray-400 text-sm">
                    {asistencia.fecha}
                  </span>
                </td>
                <td className="hidden md:table-cell px-6 py-4">
                  <span className="text-gray-400 text-sm">
                    {formatearHora(asistencia.fechaHora)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
