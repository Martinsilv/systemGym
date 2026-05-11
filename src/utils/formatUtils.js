import { CURRENCY } from '../constants'

/**
 * Formatea un número como moneda
 * @param {number} amount
 * @returns {string} Ej: "$15.000"
 */
export function formatearMoneda(amount) {
  if (!amount && amount !== 0) return '—'
  return `${CURRENCY.SYMBOL}${Number(amount).toLocaleString(CURRENCY.LOCALE)}`
}

/**
 * Parsea una string de moneda a número
 * @param {string} str Ej: "$15.000"
 * @returns {number}
 */
export function parsearMoneda(str) {
  return parseInt(str.replace(/\D/g, ''), 10)
}

/**
 * Formatea un número con separadores de miles
 * @param {number} num
 * @returns {string}
 */
export function formatearNumero(num) {
  if (!num && num !== 0) return '—'
  return Number(num).toLocaleString(CURRENCY.LOCALE)
}

/**
 * Trunca un texto a una longitud máxima
 * @param {string} text
 * @param {number} maxLength
 * @param {string} suffix
 * @returns {string}
 */
export function truncarTexto(text, maxLength = 50, suffix = '...') {
  if (!text) return '—'
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + suffix
}

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} text
 * @returns {string}
 */
export function capitalizarPalabras(text) {
  if (!text) return '—'
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Formatea porcentaje
 * @param {number} value
 * @param {number} decimals
 * @returns {string} Ej: "95.5%"
 */
export function formatearPorcentaje(value, decimals = 1) {
  if (!value && value !== 0) return '—'
  return `${(value).toFixed(decimals)}%`
}

/**
 * Calcula el porcentaje de un valor respecto a un total
 * @param {number} value
 * @param {number} total
 * @param {number} decimals
 * @returns {number}
 */
export function calcularPorcentaje(value, total, decimals = 0) {
  if (!total) return 0
  return parseFloat(((value / total) * 100).toFixed(decimals))
}

/**
 * Formatea bytes como unidades legibles
 * @param {number} bytes
 * @returns {string} Ej: "1.5 MB"
 */
export function formatearBytes(bytes) {
  if (!bytes) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Formatea un teléfono en el formato local
 * @param {string} phone
 * @returns {string}
 */
export function formatearTelefono(phone) {
  if (!phone) return '—'
  // Remover caracteres no numéricos
  const cleaned = phone.replace(/\D/g, '')
  
  // Si es formato argentino (11 dígitos)
  if (cleaned.length === 11) {
    return `+54 ${cleaned.slice(1, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`
  }
  
  // Si es formato corto (10 dígitos)
  if (cleaned.length === 10) {
    return `+54 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`
  }
  
  return phone
}

/**
 * Formatea un DNI con guion
 * @param {string} dni
 * @returns {string} Ej: "38.123.456"
 */
export function formatearDNI(dni) {
  if (!dni) return '—'
  const cleaned = dni.replace(/\D/g, '')
  
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}.${cleaned.slice(5)}`
  }
  
  if (cleaned.length === 7) {
    return `${cleaned.slice(0, 1)}.${cleaned.slice(1, 4)}.${cleaned.slice(4)}`
  }
  
  return dni
}

/**
 * Genera un color aleatorio para avatares
 * @param {string} seed - String para generar color consistente
 * @returns {string} Color en formato hex
 */
export function generarColorAleatorio(seed) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const hue = hash % 360
  return `hsl(${hue}, 70%, 60%)`
}

/**
 * Obtiene las iniciales de un nombre
 * @param {string} nombre
 * @param {string} apellido
 * @returns {string}
 */
export function obtenerIniciales(nombre, apellido = '') {
  const n = (nombre || '').charAt(0).toUpperCase()
  const a = (apellido || '').charAt(0).toUpperCase()
  return (n + a).slice(0, 2)
}

/**
 * Formatea duración en horas y minutos
 * @param {number} minutos
 * @returns {string} Ej: "1h 30m"
 */
export function formatearDuracion(minutos) {
  const horas = Math.floor(minutos / 60)
  const mins = minutos % 60
  
  if (horas === 0) return `${mins}m`
  if (mins === 0) return `${horas}h`
  return `${horas}h ${mins}m`
}