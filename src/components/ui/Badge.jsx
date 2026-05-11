export default function Badge({
  children,
  variant = "default",
  size = "md",
  icon = null,
  dot = false,
}) {
  const variantClass =
    {
      default: "bg-gray-700 text-gray-100",
      success: "bg-green-900/30 text-green-400",
      warning: "bg-yellow-900/30 text-yellow-400",
      error: "bg-red-900/30 text-red-400",
      info: "bg-blue-900/30 text-blue-400",
      primary: "bg-blue-600 text-white",
    }[variant] || variantClass.default;

  const sizeClass =
    {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
      lg: "px-4 py-2 text-base",
    }[size] || sizeClass.md;

  const dotColor =
    {
      success: "bg-green-500",
      warning: "bg-yellow-500",
      error: "bg-red-500",
      info: "bg-blue-500",
    }[variant] || "bg-gray-500";

  return (
    <span
      className={`
      inline-flex items-center gap-1.5
      rounded-full
      font-medium
      ${variantClass}
      ${sizeClass}
    `}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
