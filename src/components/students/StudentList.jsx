import StudentRow from "./StudentRow";

export default function StudentList({
  alumnos = [],
  loading = false,
  onSelectAlumno,
  onPaymentClick,
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-800 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (alumnos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="font-medium">No hay alumnos</p>
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
                Teléfono
              </th>
              <th className="hidden lg:table-cell text-left px-6 py-4 text-sm font-semibold text-gray-300">
                Actividad
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                Estado
              </th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                Vencimiento
              </th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {alumnos.map((alumno) => (
              <StudentRow
                key={alumno.id}
                alumno={alumno}
                student={alumno}
                onSelectAlumno={onSelectAlumno}
                onPaymentClick={onPaymentClick}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
