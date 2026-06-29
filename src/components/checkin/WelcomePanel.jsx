import { useEffect, useState } from "react";
import { Clock3, CalendarDays, Dumbbell } from "lucide-react";
import logomono from "../../assets/logomono1.png";
import logoLetras from "../../assets/letralogo.png";
export default function WelcomePanel() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hora = now.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const fecha = now.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full  h-full mb-16 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute  bg-blue-500/10 blur-3xl rounded-full"></div>
      <div className="absolute  bg-cyan-500/10 blur-3xl rounded-full bottom-0 right-0"></div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-4">
        {/* Logo */}
        <div className="animate-pulse ">
          <img src={logomono} alt="Logo" className="w-28 h-28" />
        </div>

        {/* Logo Letras */}
        <img
          src={logoLetras}
          alt="Logo Letras"
          className="w-120 object-contain absolute -top-35"
        />

        {/* Hora */}
        <div className="flex items-center mt-24 gap-4">
          <Clock3 className="text-cyan-500 " size={25} />
          <span className="text-5xl font-bold text-white tracking-wider font-sans">
            {hora}
          </span>
        </div>

        {/* Fecha */}
        <div className="flex items-center gap-2 text-gray-300">
          <CalendarDays size={18} className="text-blue-400" />
          <span className="capitalize">{fecha}</span>
        </div>

        {/* Texto */}
      </div>
    </div>
  );
}
