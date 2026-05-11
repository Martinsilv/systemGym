export default function Modal({
  isOpen = false,
  onClose,
  title,
  children,
  size = "md",
  closeButton = true,
}) {
  if (!isOpen) return null;

  const sizeClass =
    {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
    }[size] || "max-w-md";

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`bg-gray-900 rounded-2xl shadow-2xl w-full ${sizeClass} border border-gray-800 max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800 sticky top-0 bg-gray-900">
          {title && (
            <h2 className="font-semibold text-lg text-white">{title}</h2>
          )}
          {closeButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 text-2xl transition-colors ml-auto"
            >
              ×
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
