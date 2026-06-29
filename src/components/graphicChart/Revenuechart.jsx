import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getIngresosUltimos12Meses } from "../../services/paymentService";
import { TrendingUp, DollarSign } from "lucide-react";

export default function RevenueChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("area"); // 'area', 'line' o 'bar'

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const fetchRevenueData = async () => {
    try {
      const porMes = await getIngresosUltimos12Meses();

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
          ingresos: Math.round(porMes[mesAno]),
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
        <DollarSign size={32} className="text-gray-500 mx-auto mb-2" />
        <p className="text-gray-400">Sin datos de ingresos</p>
      </div>
    );
  }

  const totalIngresos = data.reduce((sum, d) => sum + d.ingresos, 0);
  const promedio = Math.round(totalIngresos / data.length);
  const maxMes = Math.max(...data.map((d) => d.ingresos));
  const minMes = Math.min(...data.map((d) => d.ingresos));

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={24} className="text-green-500" />
            <h2 className="text-xl font-semibold text-white">
              Ingresos últimos 12 meses
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("area")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "area"
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Área
            </button>
            <button
              onClick={() => setViewMode("line")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "line"
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Línea
            </button>
            <button
              onClick={() => setViewMode("bar")}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                viewMode === "bar"
                  ? "bg-green-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              Barras
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <p className="text-gray-400 text-xs mb-1">Total</p>
            <p className="text-xl font-bold text-green-400">
              ${(totalIngresos / 1000).toFixed(1)}k
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <p className="text-gray-400 text-xs mb-1">Promedio/mes</p>
            <p className="text-xl font-bold text-blue-400">
              ${(promedio / 1000).toFixed(1)}k
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <p className="text-gray-400 text-xs mb-1">Mejor mes</p>
            <p className="text-xl font-bold text-purple-400">
              ${(maxMes / 1000).toFixed(1)}k
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
            <p className="text-gray-400 text-xs mb-1">Menor mes</p>
            <p className="text-xl font-bold text-orange-400">
              ${(minMes / 1000).toFixed(1)}k
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === "area" ? (
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="nombreMes"
                stroke="#9CA3AF"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#9CA3AF"
                style={{ fontSize: "12px" }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#E5E7EB",
                }}
                formatter={(value) => [
                  `$${value.toLocaleString("es-AR")}`,
                  "Ingresos",
                ]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="ingresos"
                stroke="#10B981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorIngresos)"
                name="Ingresos"
                dot={{ fill: "#10B981", r: 5 }}
                activeDot={{ r: 7 }}
              />
            </AreaChart>
          ) : viewMode === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="nombreMes"
                stroke="#9CA3AF"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="#9CA3AF"
                style={{ fontSize: "12px" }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#E5E7EB",
                }}
                formatter={(value) => [
                  `$${value.toLocaleString("es-AR")}`,
                  "Ingresos",
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="ingresos"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: "#10B981", r: 5 }}
                activeDot={{ r: 7 }}
                name="Ingresos"
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
              <YAxis
                stroke="#9CA3AF"
                style={{ fontSize: "12px" }}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#E5E7EB",
                }}
                formatter={(value) => [
                  `$${value.toLocaleString("es-AR")}`,
                  "Ingresos",
                ]}
              />
              <Legend />
              <Bar
                dataKey="ingresos"
                fill="#10B981"
                name="Ingresos"
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
                  Ingresos
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
                  <td className="text-right py-2 px-2 text-green-400 font-semibold">
                    ${item.ingresos.toLocaleString("es-AR")}
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
