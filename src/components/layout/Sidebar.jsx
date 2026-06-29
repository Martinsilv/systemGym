import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  ClipboardList,
  QrCode,
  Dumbbell,
  X,
} from "lucide-react";
import { useGym } from "../../context/GymContext";
import logoMono from "../../assets/logomono1.png";
const navItems = [
  {
    to: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    color: "text-emerald-400",
  },
  { to: "/checkin", icon: QrCode, label: "Check-in", color: "text-blue-400" },
  { to: "/alumnos", icon: Users, label: "Alumnos", color: "text-purple-400" },
  { to: "/pagos", icon: DollarSign, label: "Pagos", color: "text-green-400" },
  {
    to: "/asistencias",
    icon: ClipboardList,
    label: "Asistencias",
    color: "text-orange-400",
  },
  {
    to: "/actividades",
    icon: Dumbbell,
    label: "Actividades",
    color: "text-pink-400",
  },
];

export default function Sidebar({ open, onClose }) {
  const { gymConfig } = useGym();

  return (
    <>
      {/* Overlay en mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed left-0 top-0 h-full w-64
        bg-gray-900 border-r border-gray-800
        z-50 transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:z-auto
        flex flex-col
      `}
      >
        {/* Header del sidebar */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg overflow-hidden shadow-md">
              <img
                src={logoMono}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-semibold text-white text-sm">
              {gymConfig.nombre}
            </span>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-gray-300 p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, color }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg
                font-medium text-sm transition-all duration-200
                ${
                  isActive
                    ? `bg-gray-800 text-white border-l-2 border-blue-500 pl-3.5`
                    : `text-gray-400 hover:text-gray-300 hover:bg-gray-800/50`
                }
              `}
            >
              {/*     <Icon size={18} className={isActive ? color : ""} /> */}
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">GymSystem v1.0</p>
        </div>
      </aside>
    </>
  );
}
