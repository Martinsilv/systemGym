import { calcularEstado, getStatusClasses } from "../../utils/statusUtils";
import { formatearFecha } from "../../utils/dateUtils";
import { Phone, Dumbbell } from "lucide-react";

export default function StudentRow({
  alumno,
  student,
  onSelectAlumno,
  onPaymentClick,
}) {
  const data = alumno || student;

  const estado = calcularEstado(data?.fechaVencimiento);
  const clases = getStatusClasses(estado.status);
  const estaVencido = estado.status === "vencido";

  // EDITAR
  const handleEdit = (e) => {
    if (e) e.stopPropagation();

    console.log("✏️ EDITAR CLICKEADO");
    console.log("📦 Enviando:", { ...data, openTab: "editar" });

    onSelectAlumno?.({
      ...data,
      openTab: "editar",
    });
  };

  // PAGAR
  const handlePayment = (e) => {
    if (e) e.stopPropagation();

    console.log("💳 PAGAR CLICKEADO");
    console.log("📦 Enviando:", { ...data, openTab: "pago" });

    onPaymentClick?.({
      ...data,
      openTab: "pago",
    });
  };

  return (
    <tr
      onClick={handleEdit}
      className="hover:bg-gray-800/50 transition-colors cursor-pointer"
    >
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-white">
            {data?.apellido}, {data?.nombre}
          </p>
          <p className="text-sm text-gray-400">
            {data?.edad ? `${data.edad} años` : ""}
          </p>
        </div>
      </td>

      <td className="px-6 py-4">
        <span className="font-mono text-gray-300">{data?.dni}</span>
      </td>

      <td className="hidden sm:table-cell px-6 py-4">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Phone size={14} />
          {data?.telefono || "No registrado"}
        </div>
      </td>

      <td className="hidden lg:table-cell px-6 py-4">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <Dumbbell size={14} />
          {data?.actividad || "Sin asignar"}
        </div>
      </td>

      <td className="px-6 py-4">
        <span
          className={`
            inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
            ${clases.bg} ${clases.text}
          `}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${clases.dot}`} />
          {estado.label}
        </span>
      </td>

      <td className="px-6 py-4">
        <span className="text-sm text-gray-400">
          {formatearFecha(data?.fechaVencimiento)}
        </span>
      </td>

      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-4">
          {/* EDITAR */}
          <button
            onClick={(e) => handleEdit(e)}
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Editar
          </button>

          {/* PAGAR */}
          <button
            onClick={(e) => handlePayment(e)}
            className={`text-sm font-medium transition-colors ${
              estaVencido
                ? "text-red-400 hover:text-red-300"
                : "text-blue-400 hover:text-blue-300"
            }`}
          >
            {estaVencido ? "PAGAR" : "Pago"}
          </button>
        </div>
      </td>
    </tr>
  );
}
