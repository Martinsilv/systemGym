// Colores de estados
export const STATUS_COLORS = {
  activo: {
    bg: 'bg-green-900/30',
    text: 'text-green-400',
    border: 'border-green-800/50',
    dot: 'bg-green-500',
  },
  'por-vencer': {
    bg: 'bg-yellow-900/30',
    text: 'text-yellow-400',
    border: 'border-yellow-800/50',
    dot: 'bg-yellow-500',
  },
  vencido: {
    bg: 'bg-red-900/30',
    text: 'text-red-400',
    border: 'border-red-800/50',
    dot: 'bg-red-500',
  },
  'sin-membresia': {
    bg: 'bg-gray-800/30',
    text: 'text-gray-400',
    border: 'border-gray-800/50',
    dot: 'bg-gray-500',
  },
}

// Mensajes de validación
export const VALIDATION_MESSAGES = {
  REQUIRED: 'Este campo es obligatorio',
  INVALID_EMAIL: 'El email no es válido',
  INVALID_PHONE: 'El teléfono no es válido',
  INVALID_DNI: 'El DNI debe tener 7 u 8 dígitos',
  INVALID_DATE: 'La fecha no es válida',
  INVALID_AMOUNT: 'El monto debe ser mayor a 0',
  PASSWORDS_DONT_MATCH: 'Las contraseñas no coinciden',
}

// Duración por defecto de membresías
export const DEFAULT_MEMBERSHIP_DURATION = 30 // días

// Días de advertencia para membresías por vencer
export const DAYS_WARNING = 5

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
}

// Límites de campos
export const FIELD_LIMITS = {
  NAME_MIN: 2,
  NAME_MAX: 50,
  PHONE_MIN: 8,
  PHONE_MAX: 20,
  DNI_MIN: 7,
  DNI_MAX: 8,
  PASSWORD_MIN: 6,
  PASSWORD_MAX: 128,
}

// Expresiones regulares
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\d\s+\-()]{8,}$/,
  DNI: /^\d{7,8}$/,
  PHONE_CLEAN: /[^\d]/g,
}

// Toast configuración
export const TOAST_CONFIG = {
  DURATION: 3000,
  POSITION: 'top-center',
}

// Formatos
export const FORMATS = {
  DATE: 'dd/MM/yyyy',
  DATE_LONG: "d 'de' MMMM 'de' yyyy",
  TIME: 'HH:mm',
  DATETIME: 'dd/MM/yyyy - HH:mm',
}

// Moneda
export const CURRENCY = {
  SYMBOL: '$',
  LOCALE: 'es-AR',
}

// Rutas privadas (si agregas autenticación después)
export const PROTECTED_ROUTES = [
  '/dashboard',
  '/alumnos',
  '/pagos',
  '/asistencias',
  '/actividades',
]

// Rutas públicas
export const PUBLIC_ROUTES = [
  '/checkin',
  '/login',
]