import { useState } from "react";
import { User, CheckCircle2 } from "lucide-react";
import CheckinForm from "../components/checkin/CheckinForm";

// 🔥 IMPORTÁ TU MODAL (ajustá la ruta si hace falta)
import PaymentModal from "../pages/student";
import WelcomePanel from "../components/checkin/WelcomePanel";

export default function CheckinPage() {
  const [estadoVisual, setEstadoVisual] = useState(null);
  const [ultimoCheckin, setUltimoCheckin] = useState(null);

  // 🔥 NUEVOS ESTADOS
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const playSound = (estado) => {
    let sound = "";

    if (estado === "activo") sound = "/sounds/success.mp3";
    else if (estado === "por-vencer") sound = "/sounds/warning.mp3";
    else sound = "/sounds/error.mp3";

    const audio = new Audio(sound);
    audio.volume = 1;

    audio.play().catch((err) => {
      console.log("Error reproduciendo sonido:", err);
    });
  };

  // 🔥 FUNCIÓN PARA ABRIR MODAL
  const handlePayment = (alumno) => {
    setSelectedAlumno(alumno);
    setIsPaymentOpen(true);
  };

  return (
    <div
      className={`
    min-h-screen flex flex-col items-center justify-center p-6 transition-all duration-500
    ${
      estadoVisual === "activo"
        ? "bg-linear-to-br from-green-950 via-gray-950 to-green-950"
        : estadoVisual === "por-vencer"
          ? "bg-linear-to-br from-yellow-900 via-gray-900 to-yellow-900"
          : estadoVisual === "vencido"
            ? "bg-linear-to-br from-red-950 via-gray-900 to-red-950"
            : "bg-linear-to-br from-gray-950 via-gray-900 to-gray-950"
    }
  `}
    >
      <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6">
        {/* IZQUIERDA — CHECK IN */}
        <div className="w-full md:w-1/2">
          {/* Card principal de check-in */}
          <div
            className={`
    rounded-2xl shadow-2xl p-8 border transition-all duration-300
    ${
      estadoVisual === "activo"
        ? "bg-green-900/40 border-green-500"
        : estadoVisual === "por-vencer"
          ? "bg-yellow-900/40 border-yellow-500"
          : estadoVisual === "vencido"
            ? "bg-red-900/40 border-red-500"
            : "bg-gray-900 border-gray-800"
    }
  `}
          >
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-blue-500/20 rounded-xl mb-4">
                <User className="text-blue-400" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-white">Check-in</h1>
              <p className="text-gray-400 mt-2 text-sm">
                Ingresá tu DNI para registrar tu asistencia
              </p>
            </div>

            <CheckinForm
              onCheckinSuccess={(data) => {
                setUltimoCheckin(data);
                setEstadoVisual(data.estado.status);

                setTimeout(() => {
                  setEstadoVisual(null);
                }, 3000);

                playSound(data.estado.status);
              }}
            />
          </div>
        </div>

        {/* DERECHA — ÚLTIMO CHECKIN */}
        {/* DERECHA */}
        <div className="w-full md:w-1/2 mt-7 relative h-80">
          {/* PANEL DE BIENVENIDA */}
          <div
            className={`
      absolute inset-0 transition-all duration-700
      ${
        ultimoCheckin
          ? "opacity-0 scale-95 pointer-events-none"
          : "opacity-100 scale-100"
      }
    `}
          >
            <WelcomePanel />
          </div>

          {/* CARD DEL ÚLTIMO CHECK-IN */}
          <div
            className={`
      absolute inset-0 transition-all duration-700
      ${
        ultimoCheckin
          ? "opacity-100 scale-100"
          : "opacity-0 scale-95 pointer-events-none"
      }
    `}
          >
            {ultimoCheckin && (
              <div className="w-full bg-gray-900 rounded-2xl p-6 border border-gray-700 shadow-lg h-80 flex flex-col justify-between">
                {/* Sección 1: Usuario */}
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 p-2.5 rounded-xl bg-green-400/15">
                      <CheckCircle2 size={22} className="text-green-400" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-base">
                        {ultimoCheckin.alumno.nombre}{" "}
                        {ultimoCheckin.alumno.apellido}
                      </h3>

                      <p className="text-gray-500 text-xs mt-0.5">
                        {ultimoCheckin.alumno.actividad}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sección 2 */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-800">
                  <div className="flex justify-between items-center">
                    <label className="text-gray-500 text-xs uppercase tracking-wide">
                      Hora
                    </label>

                    <span className="text-gray-200 text-sm font-medium">
                      {ultimoCheckin.hora.toLocaleTimeString("es-AR")}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <label className="text-gray-500 text-xs uppercase tracking-wide">
                      Estado
                    </label>

                    <span
                      className={`
                text-xs font-bold px-2.5 py-1.5 rounded-md
                ${
                  ultimoCheckin.estado.status === "activo"
                    ? "bg-green-500/25 text-green-300"
                    : ultimoCheckin.estado.status === "por-vencer"
                      ? "bg-yellow-500/25 text-yellow-300"
                      : "bg-red-500/25 text-red-300"
                }
              `}
                    >
                      {ultimoCheckin.estado.status === "activo"
                        ? "AL DÍA"
                        : ultimoCheckin.estado.status === "por-vencer"
                          ? "POR VENCER"
                          : "VENCIDO"}
                    </span>
                  </div>

                  {ultimoCheckin.estado.status === "por-vencer" && (
                    <div className="flex justify-between items-center">
                      <label className="text-gray-500 text-xs uppercase tracking-wide">
                        Aviso
                      </label>

                      <span className="text-yellow-300 text-sm font-medium">
                        {ultimoCheckin.estado.diasRestantes === 0
                          ? "⚠️ Vence hoy"
                          : `Faltan ${ultimoCheckin.estado.diasRestantes} ${
                              ultimoCheckin.estado.diasRestantes === 1
                                ? "día"
                                : "días"
                            } para vencer`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Acción */}
                {(ultimoCheckin.estado.status === "por-vencer" ||
                  ultimoCheckin.estado.status === "vencido") && (
                  <button
                    onClick={() => handlePayment(ultimoCheckin.alumno)}
                    className={`
              w-full py-3 rounded-xl font-semibold transition-all duration-300
              flex items-center justify-center gap-2
              ${
                ultimoCheckin.estado.status === "por-vencer"
                  ? "bg-yellow-500 hover:bg-yellow-600 text-black shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  : "bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5"
              }
            `}
                  >
                    💳 <span>Pagar ahora</span>
                  </button>
                )}

                {ultimoCheckin.estado.status === "activo" && (
                  <div className="text-center py-3 px-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <p className="text-green-300 text-sm font-medium">
                      ✓ Membresía activa y al día
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔥 MODAL DE PAGO */}
      {isPaymentOpen && (
        <PaymentModal
          alumno={selectedAlumno}
          onClose={() => setIsPaymentOpen(false)}
        />
      )}

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-500">
        <p>Sistema de Asistencia - GymSystem</p>
      </div>
    </div>
  );
}
