import { useState, useEffect } from "react";
import {
  getActividades,
  crearActividad,
  desactivarActividad,
} from "../services/activityService";
import { validarActividad } from "../utils/validators";
import { Plus, Trash2, DollarSign, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export default function ActivitiesPage() {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precioMensual: "",
    duracionDias: "30",
  });
  const [errores, setErrores] = useState({});
  const [loadingForm, setLoadingForm] = useState(false);

  useEffect(() => {
    fetchActividades();
  }, []);

  const fetchActividades = async () => {
    setLoading(true);
    try {
      const data = await getActividades();
      setActividades(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar actividades");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { errores: nuevosErrores, valido } = validarActividad(formData);

    if (!valido) {
      setErrores(nuevosErrores);
      return;
    }

    setLoadingForm(true);
    try {
      await crearActividad(formData);
      toast.success("✅ Actividad creada correctamente");
      setFormData({
        nombre: "",
        descripcion: "",
        precioMensual: "",
        duracionDias: "30",
      });
      setErrores({});
      setShowForm(false);
      fetchActividades();
    } catch (error) {
      console.error(error);
      toast.error("❌ Error al crear actividad");
    } finally {
      setLoadingForm(false);
    }
  };

  const handleDelete = async (actividadId) => {
    if (
      !window.confirm("¿Estás seguro de que quieres desactivar esta actividad?")
    )
      return;

    try {
      await desactivarActividad(actividadId);
      toast.success("✅ Actividad desactivada");
      fetchActividades();
    } catch (error) {
      console.error(error);
      toast.error("❌ Error al desactivar actividad");
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Actividades</h1>
          <p className="text-gray-400 text-sm mt-1">
            {actividades.length} actividades activas
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg"
        >
          <Plus size={18} />
          Nueva actividad
        </button>
      </div>

      {/* Grid de actividades */}
      {loading ? (
        <ActivitySkeleton />
      ) : actividades.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {actividades.map((actividad) => (
            <div
              key={actividad.id}
              className="bg-gray-900 rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all"
            >
              {/* Header de la card */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white">
                    {actividad.nombre}
                  </h3>
                  {actividad.descripcion && (
                    <p className="text-gray-400 text-sm mt-1">
                      {actividad.descripcion}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(actividad.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors p-2 hover:bg-red-900/20 rounded-lg"
                  title="Desactivar actividad"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Información */}
              <div className="space-y-3 border-t border-gray-800 pt-4">
                <div className="flex items-center gap-3">
                  <DollarSign size={18} className="text-green-500" />
                  <div>
                    <p className="text-gray-400 text-sm">Precio mensual</p>
                    <p className="text-white font-semibold">
                      ${actividad.precioMensual.toLocaleString("es-AR")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-blue-500" />
                  <div>
                    <p className="text-gray-400 text-sm">Duración</p>
                    <p className="text-white font-semibold">
                      {actividad.duracionDias} días
                    </p>
                  </div>
                </div>
              </div>

              {/* Fecha de creación */}
              <div className="mt-4 pt-4 border-t border-gray-800">
                <p className="text-gray-500 text-xs">
                  Creada el{" "}
                  {new Date(
                    actividad.createdAt?.toDate?.() || actividad.createdAt,
                  ).toLocaleDateString("es-AR")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Nueva actividad */}
      {showForm && (
        <Modal title="Nueva actividad" onClose={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre de la actividad
              </label>
              <input
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Musculación, Yoga, Crossfit..."
                className={inputClass(errores.nombre)}
                disabled={loadingForm}
              />
              {errores.nombre && (
                <p className="text-xs text-red-400 mt-1">{errores.nombre}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Descripción (opcional)
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción de la actividad..."
                rows={2}
                className={`${inputClass()} resize-none`}
                disabled={loadingForm}
              />
            </div>

            {/* Precio mensual */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Precio mensual ($)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  name="precioMensual"
                  value={formData.precioMensual}
                  onChange={handleChange}
                  placeholder="15000"
                  min="0"
                  step="100"
                  className={`${inputClass(errores.precioMensual)} pl-8`}
                  disabled={loadingForm}
                />
              </div>
              {errores.precioMensual && (
                <p className="text-xs text-red-400 mt-1">
                  {errores.precioMensual}
                </p>
              )}
            </div>

            {/* Duración */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duración (días)
              </label>
              <input
                type="number"
                name="duracionDias"
                value={formData.duracionDias}
                onChange={handleChange}
                placeholder="30"
                min="1"
                className={inputClass(errores.duracionDias)}
                disabled={loadingForm}
              />
              {errores.duracionDias && (
                <p className="text-xs text-red-400 mt-1">
                  {errores.duracionDias}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loadingForm}
                className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium transition-colors"
              >
                {loadingForm ? "Creando..." : "Crear actividad"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function inputClass(hasError) {
  return `
    w-full px-4 py-3 rounded-lg
    bg-gray-800 border-2 ${
      hasError
        ? "border-red-400 focus:border-red-500"
        : "border-gray-700 focus:border-blue-500"
    }
    text-white placeholder-gray-500
    focus:outline-none transition-colors
  `;
}

function ActivitySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="h-64 bg-gray-800 rounded-xl animate-pulse"
        ></div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 text-gray-400">
      <DollarSign size={48} className="mx-auto mb-4 opacity-50" />
      <p className="font-medium text-lg">No hay actividades registradas</p>
      <p className="text-sm mt-2 text-gray-500">
        Crea tu primera actividad para empezar
      </p>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-800">
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
