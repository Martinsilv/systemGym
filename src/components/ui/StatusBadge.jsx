import { calcularEstado, getStatusClasses } from "../../utils/statusUtils";

export default function StatusBadge({ fechaVencimiento, size = "md" }) {
  const estado = calcularEstado(fechaVencimiento);
  const clases = getStatusClasses(estado.status);

  const sizeClass = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`
      inline-flex items-center gap-1.5 rounded-full font-medium
      ${sizeClass} ${clases.bg} ${clases.text}
    `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${clases.dot}`} />
      {estado.label}
    </span>
  );
}
