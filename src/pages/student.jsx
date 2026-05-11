import { useState, useEffect } from "react";
import PaymentForm from "../components/payments/PaymentForm";
import { X } from "lucide-react";

import { actualizarAlumno, darDeBajaAlumno } from "../services/studentService";

export default function StudentModal({ alumno, onClose, onSuccess }) {
  const [tab, setTab] = useState("pago");
  const [loading, setLoading] = useState(false);

  // 🔥 ACTUALIZAR TAB CUANDO CAMBIA LA PROP
  useEffect(() => {
    if (alumno?.openTab) {
      setTab(alumno.openTab);
    } else {
      setTab("pago");
    }
  }, [alumno?.openTab, alumno?.id]);

  const [form, setForm] = useState({
    nombre: alumno.nombre || "",
    apellido: alumno.apellido || "",
    telefono: alumno.telefono || "",
    actividad: alumno.actividad || "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 GUARDAR CAMBIOS
  const handleSave = async () => {
    try {
      setLoading(true);

      await actualizarAlumno(alumno.id, form);

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error actualizando alumno:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ELIMINAR ALUMNO
  const handleDelete = async () => {
    const confirmar = confirm("¿Seguro que querés dar de baja este alumno?");

    if (!confirmar) return;

    try {
      setLoading(true);

      await darDeBajaAlumno(alumno.id);

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error eliminando alumno:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!alumno) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-gray-900 rounded-xl border border-gray-700 shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">
            {alumno.nombre} {alumno.apellido}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setTab("pago")}
            className={`flex-1 py-3 text-sm font-medium ${
              tab === "pago"
                ? "text-white border-b-2 border-green-500"
                : "text-gray-400"
            }`}
          >
            Pago
          </button>

          <button
            onClick={() => setTab("editar")}
            className={`flex-1 py-3 text-sm font-medium ${
              tab === "editar"
                ? "text-white border-b-2 border-blue-500"
                : "text-gray-400"
            }`}
          >
            Editar
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* TAB PAGO */}
          {tab === "pago" && (
            <PaymentForm
              alumno={alumno}
              onSuccess={() => {
                onSuccess?.();
                onClose();
              }}
            />
          )}

          {/* TAB EDITAR */}
          {tab === "editar" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                />

                <input
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  placeholder="Apellido"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
                />
              </div>

              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="Teléfono"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
              />

              <input
                name="actividad"
                value={form.actividad}
                onChange={handleChange}
                placeholder="Actividad"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white"
              />

              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
              >
                Guardar cambios
              </button>

              {/* 🔥 ELIMINAR */}
              <button
                onClick={handleDelete}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition"
              >
                Eliminar alumno
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
