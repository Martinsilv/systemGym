import { Menu, Moon, Sun, QrCode } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useGym } from "../../context/GymContext";
import { Link } from "react-router-dom";

export default function Header({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();
  const { gymConfig } = useGym();

  return (
    <header
      className="
      h-16 px-4 sm:px-6
      bg-gray-900
      border-b border-gray-800
      flex items-center justify-between
      sticky top-0 z-40
      shadow-sm
    "
    >
      {/* Logo + nombre */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors"
        >
          <Menu size={20} />
        </button>

        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
            G
          </div>
          <span className="font-semibold text-white hidden sm:block text-lg">
            {gymConfig.nombre}
          </span>
        </Link>
      </div>

      {/* Acciones derechas */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Botón rápido a check-in */}
        <Link
          to="/checkin"
          className="
            p-2 sm:px-3 sm:py-2 rounded-lg
            bg-blue-600 hover:bg-blue-700
            text-white transition-colors
            flex items-center gap-2 text-sm font-medium
             sm:flex
          "
          title="Ir a check-in"
        >
          <QrCode size={18} />
          <span>Check-in</span>
        </Link>

        {/* Toggle de tema */}
        <button
          onClick={toggleTheme}
          className="
            p-2 rounded-lg
            bg-gray-800 hover:bg-gray-700
            text-gray-400 hover:text-gray-300
            transition-colors
          "
          aria-label="Cambiar tema"
          title={`Cambiar a ${theme === "light" ? "oscuro" : "claro"}`}
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </header>
  );
}
