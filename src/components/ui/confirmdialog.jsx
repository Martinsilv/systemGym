import { AlertCircle } from "lucide-react";

export default function ConfirmDialog({
  isOpen = false,
  title = "¿Confirmar?",
  message = "¿Estás seguro de que deseas continuar?",
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  danger = false,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel?.()}
    >
      <div className="bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm border border-gray-800">
        {/* Content */}
        <div className="p-6 text-center">
          <div
            className={`inline-block p-3 rounded-xl mb-4 ${
              danger ? "bg-red-900/30" : "bg-blue-900/30"
            }`}
          >
            <AlertCircle
              className={danger ? "text-red-500" : "text-blue-500"}
              size={32}
            />
          </div>

          <h2 className="font-semibold text-lg text-white mb-2">{title}</h2>
          <p className="text-gray-400 text-sm">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-800">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors disabled:opacity-60"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-3 rounded-lg text-white font-medium transition-colors disabled:opacity-60 ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Procesando..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
