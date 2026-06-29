import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getAsistenciasUltimos12Meses } from "../../services/attendanceService";
import { TrendingUp, Users } from "lucide-react";

export default function AttendanceChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("line"); // 'line' o 'bar'

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceData = async () => {
    try {
      const porMes = await getAsistenciasUltimos12Meses();

      // Convertir a array ordenado
      const meses = Object.keys(porMes).sort();
      const chartData = meses.map((mesAno) => {
        const [ano, mes] = mesAno.split("-");
        const fecha = new Date(ano, parseInt(mes) - 1);
        const nombreMes = fecha.toLocaleString("es-AR", {
          month: "short",
          year: "numeric",
        });

        return {
          mesAno,
          nombreMes,
          asistencias: porMes[mesAno],
        };
      });

      setData(chartData);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="h-96 bg-gray-800 rounded-xl animate-pulse"></div>;
  }

  if (data.length === 0) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center">
        <Users size={32} className="text-gray-500 mx-auto mb-2" />
        <p className="text-gray-400">Sin datos de asistencias</p>
      </div>
    );
  }

  const totalAsistencias = data.reduce((sum, d) => sum + d.asistencias, 0);
  const promedio = Math.round(totalAsistencias / data.length);
  const maxMes = Math.max(...data.map((d) => d.asistencias));

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={24} className="text-blue-500" />
            <h2 className="text-xl font-semibold text-white">
              Asistencias últimos 12 meses
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("line")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "line"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Línea
            </button>
            <button
              onClick={() => setViewMode("bar")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "bar"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Barras
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <p className="text-gray-400 text-xs mb-1">Total</p>
            <p className="text-2xl font-bold text-blue-400">
              {totalAsistencias}
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <p className="text-gray-400 text-xs mb-1">Promedio/mes</p>
            <p className="text-2xl font-bold text-green-400">{promedio}</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <p className="text-gray-400 text-xs mb-1">Pico</p>
            <p className="text-2xl font-bold text-purple-400">{maxMes}</p>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="nombreMes"
                stroke="#9CA3AF"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#E5E7EB",
                }}
                formatter={(value) => [`${value} asistencias`, "Total"]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="asistencias"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: "#3B82F6", r: 5 }}
                activeDot={{ r: 7 }}
                name="Asistencias"
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="nombreMes"
                stroke="#9CA3AF"
                style={{ fontSize: "12px" }}
              />
              <YAxis stroke="#9CA3AF" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#E5E7EB",
                }}
                formatter={(value) => [`${value} asistencias`, "Total"]}
              />
              <Legend />
              <Bar
                dataKey="asistencias"
                fill="#3B82F6"
                name="Asistencias"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Tabla de datos */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <p className="text-sm font-semibold text-gray-400 mb-3">
          Detalle por mes
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-2 px-2 text-gray-400 font-medium">
                  Mes
                </th>
                <th className="text-right py-2 px-2 text-gray-400 font-medium">
                  Asistencias
                </th>
              </tr>
            </thead>
            <tbody>
              {data.slice(-6).map((item) => (
                <tr
                  key={item.mesAno}
                  className="border-b border-gray-800/50 hover:bg-gray-800/30"
                >
                  <td className="py-2 px-2 text-gray-300">{item.nombreMes}</td>
                  <td className="text-right py-2 px-2 text-blue-400 font-semibold">
                    {item.asistencias}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
