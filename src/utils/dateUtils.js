import { addDays, format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { Timestamp } from 'firebase/firestore'

/**
 * Calcula la nueva fecha de vencimiento al registrar un pago
 * Lógica:
 * - Si está al día o por vencer → extender desde la fecha de vencimiento actual
 * - Si está vencido → extender desde hoy
 * - Duración configurable por actividad (default 30 días)
 */
export function calcularNuevaFechaVencimiento(fechaVencimientoActual, duracionDias = 30) {
  const hoy = new Date()
  
  // Si no tiene membresía o ya venció, extender desde hoy
  if (!fechaVencimientoActual) {
    return addDays(hoy, duracionDias)
  }

  const vencimiento = fechaVencimientoActual instanceof Date
    ? fechaVencimientoActual
    : new Date(fechaVencimientoActual.seconds * 1000)

  // Si ya venció (fecha de vencimiento es anterior a hoy)
  if (vencimiento < hoy) {
    return addDays(hoy, duracionDias)
  }

  // Si está vigente, extender desde la fecha de vencimiento
  return addDays(vencimiento, duracionDias)
}

/**
 * Convierte Date a Timestamp de Firestore
 */
export function dateToTimestamp(date) {
  return Timestamp.fromDate(date)
}

/**
 * Formatea una fecha para mostrar al usuario
 * Ejemplo: "15 de enero de 2024"
 */
export function formatearFecha(fecha) {
  if (!fecha) return '—'
  const date = fecha instanceof Date ? fecha : new Date(fecha.seconds * 1000)
  return format(date, "d 'de' MMMM 'de' yyyy", { locale: es })
}

/**
 * Formatea fecha corta
 * Ejemplo: "15/01/2024"
 */
export function formatearFechaCorta(fecha) {
  if (!fecha) return '—'
  const date = fecha instanceof Date ? fecha : new Date(fecha.seconds * 1000)
  return format(date, "dd/MM/yyyy", { locale: es })
}

/**
 * Formatea fecha y hora para asistencias
 * Ejemplo: "15/01/2024 - 09:35"
 */
export function formatearFechaHora(fecha) {
  if (!fecha) return '—'
  const date = fecha instanceof Date ? fecha : new Date(fecha.seconds * 1000)
  return format(date, "dd/MM/yyyy - HH:mm", { locale: es })
}

/**
 * Formatea solo la hora
 * Ejemplo: "09:35"
 */
export function formatearHora(fecha) {
  if (!fecha) return '—'
  const date = fecha instanceof Date ? fecha : new Date(fecha.seconds * 1000)
  return format(date, "HH:mm", { locale: es })
}

/**
 * Calcular edad a partir de fecha de nacimiento
 */
export function calcularEdad(fechaNacimiento) {
  const hoy = new Date()
  const nacimiento = new Date(fechaNacimiento)
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }
  return edad
}

/**
 * Obtener nombre del mes en español
 */
export function getNombreMes(fecha = new Date()) {
  return format(fecha, 'MMMM yyyy', { locale: es })
}

/**
 * Obtener rango de fechas del mes actual
 */
export function getRangoMesActual() {
  const hoy = new Date()
  const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
  const ultimoDia = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)
  return { primerDia, ultimoDia }
}