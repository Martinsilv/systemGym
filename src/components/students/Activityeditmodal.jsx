import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { actualizarActividad } from "../../services/studentService";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/firebase";
import Button from "../ui/Button";

export default function ActivityEditModal({ alumno, onSuccess }) {
  const [actividades, setActividades] = useState([]);
  const [actividadesDisponibles, setActividadesDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarActividades = async () => {
      try {
        const snapshot = await getDocs(collection(db, "actividades"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre,
          descripcion: doc.data().descripcion,
          precio: doc.data().precio,
        }));
        setActividadesDisponibles(data);
      } catch (err) {
        console.error("Error al cargar actividades:", err);
      }
    };

    cargarActividades();
  }, []);

  useEffect(() => {
    // Inicializar con la actividad actual del alumno
    if (alumno.actividad) {
      setActividades([alumno.actividad]);
    }
  }, [alumno]);

  const agregarActividad = () => {
    if (!selectedActivity) {
      setError("Selecciona una actividad");
      return;
    }

    const actividadYaAgregada = actividades.includes(selectedActivity);
    if (actividadYaAgregada) {
      setError("Esta actividad ya está asignada");
      return;
    }

    setActividades([...actividades, selectedActivity]);
    setSelectedActivity("");
    setError("");
  };

  const removerActividad = (actividad) => {
    setActividades(actividades.filter((a) => a !== actividad));
  };

  const guardarActividades = async () => {
    try {
      setLoading(true);
      setError("");

      // Guardar la primera actividad (o la última en caso de múltiples)
      const actividadPrincipal =
        actividades.length > 0 ? actividades[0] : "Sin actividad";

      await actualizarActividad(alumno.id, actividadPrincipal);

      // Retornar el alumno actualizado
      onSuccess({
        ...alumno,
        actividad: actividadPrincipal,
      });
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Selector de actividades */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Seleccionar Actividad
        </label>
        <div className="flex gap-2">
          <select
            value={selectedActivity}
            onChange={(e) => {
              setSelectedActivity(e.target.value);
              setError("");
            }}
            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          >
            <option value="">Elige una actividad...</option>
            {actividadesDisponibles.map((act) => (
              <option key={act.id} value={act.nombre}>
                {act.nombre} - ${act.precio}
              </option>
            ))}
          </select>
          <button
            onClick={agregarActividad}
            disabled={!selectedActivity}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 rounded-lg transition flex items-center gap-2 text-white font-semibold"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      {/* Lista de actividades seleccionadas */}
      <div>
        <label className="block text-sm font-semibold text-white mb-2">
          Actividades Asignadas
        </label>
        <div className="space-y-2">
          {actividades.length === 0 ? (
            <p className="text-gray-400 text-sm p-3 bg-gray-800/50 rounded-lg">
              Sin actividades seleccionadas
            </p>
          ) : (
            actividades.map((actividad) => (
              <div
                key={actividad}
                className="flex items-center justify-between p-3 bg-blue-900/30 border border-blue-500/50 rounded-lg"
              >
                <span className="text-white font-medium">{actividad}</span>
                <button
                  onClick={() => removerActividad(actividad)}
                  className="p-1 hover:bg-red-600/50 rounded transition text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-3 pt-4 border-t border-gray-700">
        <Button
          onClick={guardarActividades}
          disabled={loading}
          variant="primary"
          className="flex-1"
        >
          {loading ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </div>
  );
}
