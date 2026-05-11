import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudents } from "../hooks/useStudents";
import { Search, Plus, UserX } from "lucide-react";
import StudentList from "../components/students/StudentList";
import StudentForm from "../components/students/StudentForm";
import StudentModal from "./student"; // 🔥 IMPORTAR EL MODAL
import PaymentForm from "../components/payments/PaymentForm";

export default function StudentsPage() {
  const {
    alumnos: alumnosFiltrados,
    loading,
    search,
    setSearch,
    todosLosAlumnos,
  } = useStudents();

  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [alumnoParaPago, setAlumnoParaPago] = useState(null);

  // 🔥 NUEVOS ESTADOS PARA EL MODAL DE EDITAR
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  // 🔥 FUNCIÓN ACTUALIZADA PARA ABRIR EL MODAL EN LUGAR DE NAVEGAR
  const handleSelectAlumno = (alumno) => {
    console.log("📱 Abriendo modal para alumno:", alumno);
    setSelectedAlumno(alumno);
    setIsStudentModalOpen(true);
  };

  // 🔥 CERRAR MODAL
  const handleCloseModal = () => {
    setIsStudentModalOpen(false);
    setSelectedAlumno(null);
  };

  // 🔥 CUANDO SE GUARDA EN EL MODAL
  const handleModalSuccess = () => {
    console.log("✅ Alumno actualizado");
    handleCloseModal();
    // Si necesitás recargar la lista, hacelo aquí
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Alumnos</h1>
          <p className="text-gray-400 text-sm mt-1">
            {todosLosAlumnos.length} alumnos registrados
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg"
        >
          <Plus size={18} />
          Nuevo alumno
        </button>
      </div>

      {/* Buscador */}
      <div className="relative mb-6">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          size={18}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, apellido o DNI..."
          className="
            w-full pl-11 pr-4 py-3 rounded-lg
            bg-gray-800 border border-gray-700
            focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
            text-white placeholder-gray-500
            transition-colors
          "
        />
      </div>

      {/* Lista de alumnos */}
      {loading ? (
        <TableSkeleton />
      ) : alumnosFiltrados.length === 0 ? (
        <EmptyState hasSearch={search.length > 0} />
      ) : (
        <StudentList
          alumnos={alumnosFiltrados}
          loading={loading}
          onSelectAlumno={handleSelectAlumno}
          onPaymentClick={(alumno) => setAlumnoParaPago(alumno)}
        />
      )}

      {/* Modal: Nuevo alumno */}
      {showForm && (
        <Modal title="Nuevo alumno" onClose={() => setShowForm(false)}>
          <StudentForm
            onSuccess={() => {
              setShowForm(false);
            }}
          />
        </Modal>
      )}

      {/* 🔥 Modal: Editar/Ver alumno */}
      {isStudentModalOpen && selectedAlumno && (
        <StudentModal
          alumno={selectedAlumno}
          onClose={handleCloseModal}
          onSuccess={handleModalSuccess}
        />
      )}

      {/* Modal: Registrar pago */}
      {alumnoParaPago && (
        <Modal title="Registrar pago" onClose={() => setAlumnoParaPago(null)}>
          <PaymentForm
            alumno={alumnoParaPago}
            onSuccess={() => {
              setAlumnoParaPago(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-800 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState({ hasSearch }) {
  return (
    <div className="text-center py-16 text-gray-400">
      <UserX size={48} className="mx-auto mb-4 opacity-50" />
      <p className="font-medium text-lg">
        {hasSearch ? "No se encontraron alumnos" : "No hay alumnos registrados"}
      </p>
      {!hasSearch && (
        <p className="text-sm mt-2 text-gray-500">
          Comienza agregando tu primer alumno
        </p>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-800">
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="font-semibold text-lg text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 text-2xl transition-colors"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
