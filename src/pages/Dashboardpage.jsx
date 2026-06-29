import { useState, useEffect } from "react";
import { getAllAlumnos } from "../services/studentService";
import { getTodosPagos, getResumenIngresos } from "../services/paymentService";
import {
  getAsistenciasHoy,
  getResumenAsistenciasMes,
} from "../services/attendanceService";
import { calcularEstado } from "../utils/statusUtils";
import { getNombreMes } from "../utils/dateUtils";
import AttendanceChart from "../components/graphicChart/Attendancechart";
import RevenueChart from "../components/graphicChart/Revenuechart";
//import MonthComparison from "../components/graphicChart/MonthComparison";
import {
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [asistenciasHoy, setAsistenciasHoy] = useState([]);
  const [alumnosVencidos, setAlumnosVencidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'attendance', 'revenue', 'comparison'

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [
        alumnos,
        pagos,
        asistenciasHoyData,
        resumenAsistencias,
        resumenIngresos,
      ] = await Promise.all([
        getAllAlumnos(),
        getTodosPagos(500),
        getAsistenciasHoy(),
        getResumenAsistenciasMes(),
        getResumenIngresos(),
      ]);

      const activos = alumnos.filter(
        (a) => calcularEstado(a.fechaVencimiento).status === "activo",
      ).length;
      const porVencer = alumnos.filter(
        (a) => calcularEstado(a.fechaVencimiento).status === "por-vencer",
      ).length;
      const vencidos = alumnos.filter(
        (a) => calcularEstado(a.fechaVencimiento).status === "vencido",
      ).length;

      setStats({
        totalAlumnos: alumnos.length,
        alumnosActivos: activos,
        alumnosPorVencer: porVencer,
        alumnosVencidos: vencidos,
        asistenciasHoy: asistenciasHoyData.length,
        asistenciasMes: resumenAsistencias.total,
        ingresosMes: resumenIngresos.totalMes,
        ingresosTotal: resumenIngresos.totalTodos,
        pagosRegistrados: pagos.length,
      });

      setAsistenciasHoy(asistenciasHoyData.slice(0, 5));
      setAlumnosVencidos(
        alumnos
          .filter(
            (a) => calcularEstado(a.fechaVencimiento).status === "vencido",
          )
          .slice(0, 5),
      );
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          Resumen general del gimnasio
        </p>
        <p className="text-gray-500 text-xs mt-2">{getNombreMes()}</p>
      </div>

      {/* Tabs de navegación */}
      <div className="mb-8 flex flex-wrap gap-2 border-b border-gray-800">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === "overview"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Resumen
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === "attendance"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Asistencias
        </button>
        <button
          onClick={() => setActiveTab("revenue")}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === "revenue"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Ingresos
        </button>
        {/*  <button
          onClick={() => setActiveTab("comparison")}
          className={`px-4 py-3 font-medium transition-colors ${
            activeTab === "comparison"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Comparativa
        </button> */}
      </div>

      {/* Tab: Resumen General */}
      {activeTab === "overview" && (
        <>
          {/* Grid principal de estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={<Users size={28} />}
              title="Total Alumnos"
              value={stats?.totalAlumnos || 0}
              color="blue"
              subtext={`${stats?.alumnosActivos || 0} activos`}
            />

            <StatCard
              icon={<DollarSign size={28} />}
              title="Ingresos este mes"
              value={`$${(stats?.ingresosMes || 0).toLocaleString("es-AR")}`}
              color="green"
              subtext={`${stats?.pagosRegistrados || 0} pagos`}
            />

            <StatCard
              icon={<Activity size={28} />}
              title="Asistencias hoy"
              value={stats?.asistenciasHoy || 0}
              color="purple"
              subtext={`${stats?.asistenciasMes || 0} este mes`}
            />

            <StatCard
              icon={<AlertCircle size={28} />}
              title="Por cobrar"
              value={stats?.alumnosPorVencer || 0}
              color="orange"
              subtext={`${stats?.alumnosVencidos || 0} vencidas`}
            />
          </div>

          {/* Segundo nivel de información */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Estado de membresías */}
            <div className="lg:col-span-1 bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 size={20} className="text-green-500" />
                Estado de Membresías
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-800/50">
                  <span className="text-green-300 text-sm">Al día</span>
                  <span className="text-xl font-bold text-green-400">
                    {stats?.alumnosActivos || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-900/20 rounded-lg border border-yellow-800/50">
                  <span className="text-yellow-300 text-sm">Por vencer</span>
                  <span className="text-xl font-bold text-yellow-400">
                    {stats?.alumnosPorVencer || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-900/20 rounded-lg border border-red-800/50">
                  <span className="text-red-300 text-sm">Vencidas</span>
                  <span className="text-xl font-bold text-red-400">
                    {stats?.alumnosVencidos || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Últimas asistencias */}
            <div className="lg:col-span-1 bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock size={20} className="text-blue-500" />
                Últimas entradas
              </h2>
              <div className="space-y-2">
                {asistenciasHoy.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">
                    Sin asistencias hoy
                  </p>
                ) : (
                  asistenciasHoy.map((asistencia) => (
                    <div
                      key={asistencia.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-800/50 rounded transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                        <span className="text-gray-300 text-sm truncate">
                          {asistencia.nombreAlumno}
                        </span>
                      </div>
                      <span className="text-gray-500 text-xs ml-2 flex-shrink-0">
                        {new Date(
                          asistencia.fechaHora.toDate?.() ||
                            asistencia.fechaHora,
                        ).toLocaleTimeString("es-AR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Alumnos con membresía vencida */}
            <div className="lg:col-span-1 bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-red-500" />
                Necesitan cobro
              </h2>
              <div className="space-y-2">
                {alumnosVencidos.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-4">
                    Todos al día
                  </p>
                ) : (
                  alumnosVencidos.map((alumno) => (
                    <div
                      key={alumno.id}
                      className="flex items-center justify-between p-2 hover:bg-gray-800/50 rounded transition-colors border-l-2 border-red-500"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-300 text-sm font-medium truncate">
                          {alumno.apellido}, {alumno.nombre}
                        </p>
                        <p className="text-gray-500 text-xs">Vencida</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-4">
              Acciones rápidas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <QuickActionButton
                icon={<Users size={20} />}
                label="Nuevo alumno"
                href="/alumnos"
                color="blue"
              />
              <QuickActionButton
                icon={<DollarSign size={20} />}
                label="Registrar pago"
                href="/alumnos"
                color="green"
              />
              <QuickActionButton
                icon={<Activity size={20} />}
                label="Check-in"
                href="/checkin"
                color="purple"
              />
              <QuickActionButton
                icon={<Calendar size={20} />}
                label="Ver asistencias"
                href="/asistencias"
                color="orange"
              />
            </div>
          </div>
        </>
      )}

      {/* Tab: Gráfico de Asistencias */}
      {activeTab === "attendance" && (
        <div className="space-y-6">
          <AttendanceChart />
        </div>
      )}

      {/* Tab: Gráfico de Ingresos */}
      {activeTab === "revenue" && (
        <div className="space-y-6">
          <RevenueChart />
        </div>
      )}

      {/* Tab: Comparativa */}
      {activeTab === "comparison" && (
        <div className="space-y-6">
          <MonthComparison />
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, title, value, color, subtext }) {
  const colorMap = {
    blue: {
      bg: "from-blue-900/40 to-blue-900/20",
      border: "border-blue-800/50",
      icon: "text-blue-500",
    },
    green: {
      bg: "from-green-900/40 to-green-900/20",
      border: "border-green-800/50",
      icon: "text-green-500",
    },
    purple: {
      bg: "from-purple-900/40 to-purple-900/20",
      border: "border-purple-800/50",
      icon: "text-purple-500",
    },
    orange: {
      bg: "from-orange-900/40 to-orange-900/20",
      border: "border-orange-800/50",
      icon: "text-orange-500",
    },
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`bg-gradient-to-br ${scheme.bg} border ${scheme.border} rounded-xl p-6`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {subtext && <p className="text-gray-500 text-xs mt-1">{subtext}</p>}
        </div>
        <div className={`${scheme.icon}`}>{icon}</div>
      </div>
    </div>
  );
}

function QuickActionButton({ icon, label, href, color }) {
  const colorMap = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    orange: "bg-orange-600 hover:bg-orange-700",
  };

  return (
    <a
      href={href}
      className={`${colorMap[color]} text-white rounded-lg p-4 flex flex-col items-center gap-2 transition-colors shadow-md hover:shadow-lg`}
    >
      {icon}
      <span className="text-sm font-medium text-center">{label}</span>
    </a>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="h-10 bg-gray-800 rounded-lg w-1/3 animate-pulse"></div>
        <div className="h-4 bg-gray-800 rounded-lg w-1/4 mt-2 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-gray-800 rounded-xl animate-pulse"
          ></div>
        ))}
      </div>
    </div>
  );
}
