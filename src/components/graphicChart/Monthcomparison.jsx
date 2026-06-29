import { useState, useEffect } from "react";
import { getAsistenciasMes } from "../../services/attendanceService";
import {
  getIngresosMes,
  compararIngresosEntreMeses,
} from "../../services/paymentService";
import { TrendingUp, TrendingDown, Minus, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export default function MonthComparison() {
  const [mes1, setMes1] = useState(null);
  const [mes2, setMes2] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ahora = new Date();
  const meses = [];

  // Generar lista de últimos 12 meses
  for (let i = 11; i >= 0; i--) {
    const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    const mes = fecha.getMonth() + 1;
    const ano = fecha.getFullYear();
    const nombre = fecha.toLocaleString("es-AR", {
      month: "long",
      year: "numeric",
    });
    meses.push({
      mes,
      ano,
      nombre,
      value: `${ano}-${String(mes).padStart(2, "0")}`,
    });
  }

  // Seleccionar por defecto mes anterior y actual
  useEffect(() => {
    if (meses.length >= 2) {
      setMes1(meses[meses.length - 2].value);
      setMes2(meses[meses.length - 1].value);
    }
  }, []);

  useEffect(() => {
    if (mes1 && mes2) {
      fetchComparison();
    }
  }, [mes1, mes2]);

  const fetchComparison = async () => {
    setLoading(true);
    setError(null);
    try {
      const [m1, a1] = mes1.split("-").map(Number);
      const [m2, a2] = mes2.split("-").map(Number);

      console.log("🔍 Cargando datos para:");
      console.log(`  Mes 1: ${m1}/${a1}`);
      console.log(`  Mes 2: ${m2}/${a2}`);

      const [asistencias1, asistencias2, ingresos] = await Promise.all([
        getAsistenciasMes(m1, a1),
        getAsistenciasMes(m2, a2),
        compararIngresosEntreMeses(m1, a1, m2, a2),
      ]);

      console.log("📊 Datos de asistencias:");
      console.log("  Asistencias Mes 1:", asistencias1);
      console.log("  Asistencias Mes 2:", asistencias2);
      console.log("📈 Datos de ingresos:", ingresos);

      // Validar que los datos tienen la estructura esperada
      if (!ingresos || !ingresos.mes1 || !ingresos.mes2) {
        throw new Error("Estructura de datos de ingresos incorrecta");
      }

      // Asegurar que ano y mes son números
      const mes1Data = {
        mes: Number(ingresos.mes1.mes) || m1,
        ano: Number(ingresos.mes1.ano) || a1,
        total: ingresos.mes1.total || 0,
      };

      const mes2Data = {
        mes: Number(ingresos.mes2.mes) || m2,
        ano: Number(ingresos.mes2.ano) || a2,
        total: ingresos.mes2.total || 0,
      };

      console.log("✅ Datos de ingresos procesados:");
      console.log("  Mes 1:", mes1Data);
      console.log("  Mes 2:", mes2Data);

      const asistenciasData = {
        mes1: {
          mes: m1,
          ano: a1,
          total: asistencias1.length,
          nombreMes:
            meses.find((x) => x.mes === m1 && x.ano === a1)?.nombre || "",
        },
        mes2: {
          mes: m2,
          ano: a2,
          total: asistencias2.length,
          nombreMes:
            meses.find((x) => x.mes === m2 && x.ano === a2)?.nombre || "",
        },
      };

      const asistenciasDif =
        asistenciasData.mes2.total - asistenciasData.mes1.total;
      const asistenciasPorcentaje =
        asistenciasData.mes1.total !== 0
          ? ((asistenciasDif / asistenciasData.mes1.total) * 100).toFixed(2)
          : 0;

      setComparisonData({
        asistencias: {
          ...asistenciasData,
          diferencia: asistenciasDif,
          porcentaje: asistenciasPorcentaje,
          mejorada: asistenciasDif > 0,
        },
        ingresos: {
          mes1: mes1Data,
          mes2: mes2Data,
          diferencia: mes2Data.total - mes1Data.total,
          porcentaje:
            mes1Data.total !== 0
              ? (
                  ((mes2Data.total - mes1Data.total) / mes1Data.total) *
                  100
                ).toFixed(2)
              : 0,
          mejorada: mes2Data.total > mes1Data.total,
        },
      });
    } catch (error) {
      console.error("❌ Error en comparación:", error);
      setError(error.message);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = (mejorada) => {
    if (mejorada === true)
      return <TrendingUp size={20} className="text-green-500" />;
    if (mejorada === false)
      return <TrendingDown size={20} className="text-red-500" />;
    return <Minus size={20} className="text-gray-500" />;
  };

  const getTrendColor = (mejorada) => {
    if (mejorada === true) return "text-green-400";
    if (mejorada === false) return "text-red-400";
    return "text-gray-400";
  };

  // Función segura para formatear fecha
  const formatearFecha = (mes, ano) => {
    try {
      const mesNum = Number(mes);
      const anoNum = Number(ano);

      if (isNaN(mesNum) || isNaN(anoNum)) {
        console.warn(`⚠️ Valores inválidos: mes=${mes}, ano=${ano}`);
        return "Fecha inválida";
      }

      if (mesNum < 1 || mesNum > 12 || anoNum < 2000 || anoNum > 2100) {
        console.warn(`⚠️ Valores fuera de rango: mes=${mesNum}, ano=${anoNum}`);
        return "Fecha fuera de rango";
      }

      const fecha = new Date(`${anoNum}-${String(mesNum).padStart(2, "0")}-01`);
      const resultado = fecha.toLocaleString("es-AR", {
        month: "long",
        year: "numeric",
      });

      console.log(`📅 Fecha formateada: ${mesNum}/${anoNum} -> ${resultado}`);
      return resultado;
    } catch (err) {
      console.error("❌ Error formateando fecha:", err);
      return "Error en fecha";
    }
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={24} className="text-blue-500" />
          <h2 className="text-xl font-semibold text-white">
            Comparativa mensual
          </h2>
        </div>

        {/* Selectores de meses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mes anterior
            </label>
            <select
              value={mes1 || ""}
              onChange={(e) => setMes1(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">Seleccionar mes</option>
              {meses.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mes a comparar
            </label>
            <select
              value={mes2 || ""}
              onChange={(e) => setMes2(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
            >
              <option value="">Seleccionar mes</option>
              {meses.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/20 border border-red-800 rounded-lg">
          <p className="text-red-400 text-sm">
            <strong>Error:</strong> {error}
          </p>
          <p className="text-red-300 text-xs mt-2">
            Abre la consola (F12) para más detalles
          </p>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          <div className="h-32 bg-gray-800 rounded-lg animate-pulse"></div>
          <div className="h-32 bg-gray-800 rounded-lg animate-pulse"></div>
        </div>
      ) : comparisonData ? (
        <div className="space-y-6">
          {/* Comparación de Asistencias */}
          <div className="border border-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Asistencias
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">
                  {comparisonData.asistencias.mes1.nombreMes}
                </p>
                <p className="text-3xl font-bold text-blue-400">
                  {comparisonData.asistencias.mes1.total}
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">
                  {comparisonData.asistencias.mes2.nombreMes}
                </p>
                <p className="text-3xl font-bold text-blue-400">
                  {comparisonData.asistencias.mes2.total}
                </p>
              </div>
            </div>

            {/* Diferencia */}
            <div className="bg-gray-800/70 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Variación</p>
                <div className="flex items-center gap-2">
                  {getTrendIcon(comparisonData.asistencias.mejorada)}
                  <span
                    className={`text-2xl font-bold ${getTrendColor(
                      comparisonData.asistencias.mejorada,
                    )}`}
                  >
                    {comparisonData.asistencias.diferencia > 0 ? "+" : ""}
                    {comparisonData.asistencias.diferencia}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">Porcentaje</p>
                <p
                  className={`text-2xl font-bold ${getTrendColor(
                    comparisonData.asistencias.mejorada,
                  )}`}
                >
                  {comparisonData.asistencias.diferencia > 0 ? "+" : ""}
                  {comparisonData.asistencias.porcentaje}%
                </p>
              </div>
            </div>
          </div>

          {/* Comparación de Ingresos */}
          <div className="border border-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Ingresos</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">
                  {formatearFecha(
                    comparisonData.ingresos.mes1.mes,
                    comparisonData.ingresos.mes1.ano,
                  )}
                </p>
                <p className="text-3xl font-bold text-green-400">
                  ${comparisonData.ingresos.mes1.total.toLocaleString("es-AR")}
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">
                  {formatearFecha(
                    comparisonData.ingresos.mes2.mes,
                    comparisonData.ingresos.mes2.ano,
                  )}
                </p>
                <p className="text-3xl font-bold text-green-400">
                  ${comparisonData.ingresos.mes2.total.toLocaleString("es-AR")}
                </p>
              </div>
            </div>

            {/* Diferencia */}
            <div className="bg-gray-800/70 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Variación</p>
                <div className="flex items-center gap-2">
                  {getTrendIcon(comparisonData.ingresos.mejorada)}
                  <span
                    className={`text-2xl font-bold ${getTrendColor(
                      comparisonData.ingresos.mejorada,
                    )}`}
                  >
                    {comparisonData.ingresos.diferencia > 0 ? "+" : ""}$
                    {Math.abs(
                      comparisonData.ingresos.diferencia,
                    ).toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm mb-1">Porcentaje</p>
                <p
                  className={`text-2xl font-bold ${getTrendColor(
                    comparisonData.ingresos.mejorada,
                  )}`}
                >
                  {comparisonData.ingresos.diferencia > 0 ? "+" : ""}
                  {comparisonData.ingresos.porcentaje}%
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400">Sin datos para comparar</p>
        </div>
      )}
    </div>
  );
}
