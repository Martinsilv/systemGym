import { useState, useRef } from "react";
import { buscarAlumnoPorDNI } from "../../services/studentService";
import { registrarAsistencia } from "../../services/attendanceService";
import { calcularEstado } from "../../utils/statusUtils";

import { Search } from "lucide-react";
import toast from "react-hot-toast";

export default function CheckinForm({ onCheckinSuccess }) {
  const [dni, setDni] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dni.trim()) return;

    setLoading(true);

    try {
      const alumno = await buscarAlumnoPorDNI(dni);

      if (!alumno) {
        toast.error("🔍 Alumno no registrado");
        setLoading(false);
        setDni("");
        inputRef.current?.focus();
        return;
      }

      await registrarAsistencia(alumno);

      const estado = calcularEstado(alumno.fechaVencimiento);
      const dias = estado.diasRestantes;

      if (estado.status === "vencido") {
        toast.error(`❌ ${alumno.nombre}, tu cuota mensual está vencida`, {
          style: {
            fontSize: "18px",
            padding: "18px 22px",
            maxWidth: "500px",
          },
        });
      } else if (estado.status === "por-vencer") {
        toast(
          `⚠️ Bienvenido ${alumno.nombre}, tu cuota ${
            dias === 0
              ? "vence hoy"
              : `vence en ${dias} ${dias === 1 ? "día" : "días"}`
          }`,

          {
            style: {
              fontSize: "18px",
              padding: "18px 22px",
              maxWidth: "500px",
            },
          },
        );
      } else {
        toast.success(` Bienvenido ${alumno.nombre}!`, {
          style: {
            fontSize: "20px",

            padding: "18px 22px",
            maxWidth: "500px",
          },
        });
      }
      onCheckinSuccess?.({
        alumno,
        estado,
        hora: new Date(),
      });

      setDni("");
    } catch (error) {
      console.error(error);
      toast.error("❌ Error al procesar check-in");
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          size={20}
        />
        <input
          ref={inputRef}
          type="text"
          value={dni}
          onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
          placeholder="Ingresá tu DNI"
          autoFocus
          className="
            w-full pl-12 pr-4 py-4 
            text-2xl font-mono tracking-widest
            bg-gray-800
            border-2 border-gray-700
            rounded-xl
            focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
            text-white placeholder-gray-600
            transition-all duration-200
          "
          maxLength={8}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !dni.trim()}
        className="
          w-full py-4 rounded-xl
          bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800
          disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
          text-white font-semibold text-lg
          transition-all duration-200
          shadow-lg hover:shadow-xl disabled:shadow-none
        "
      >
        {loading ? "Verificando..." : "✓ Registrar entrada"}
      </button>
    </form>
  );
}
