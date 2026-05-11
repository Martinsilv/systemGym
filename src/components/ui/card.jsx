export default function Card({
  children,
  className = "",
  title,
  subtitle,
  header,
  footer,
}) {
  return (
    <div
      className={`
      bg-gray-900
      rounded-xl
      border border-gray-800
      shadow-sm
      overflow-hidden
      ${className}
    `}
    >
      {/* Header */}
      {(title || header) && (
        <div className="p-6 border-b border-gray-800">
          {header ? (
            header
          ) : (
            <>
              {title && (
                <h2 className="font-semibold text-lg text-white">{title}</h2>
              )}
              {subtitle && (
                <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>
              )}
            </>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="p-6 border-t border-gray-800 bg-gray-800/50">
          {footer}
        </div>
      )}
    </div>
  );
}
