import { differenceInDays, isAfter, isBefore, startOfDay } from 'date-fns'

// Constante: cuántos días de "advertencia" antes de vencer
const DIAS_ADVERTENCIA = 5

/**
 * Convierte un Timestamp de Firestore a Date de JS
 * Firestore devuelve objetos con { seconds, nanoseconds }
 */
export function firestoreTimestampToDate(timestamp) {
  if (!timestamp) return null
  // Si ya es un Date, devolverlo
  if (timestamp instanceof Date) return timestamp
  // Si es Timestamp de Firestore
  if (timestamp.toDate) return timestamp.toDate()
  // Si es un objeto con seconds (cuando viene del caché)
  if (timestamp.seconds) return new Date(timestamp.seconds * 1000)
  return null
}

/**
 * Calcula el estado de membresía de un alumno
 * @param {Date|Timestamp} fechaVencimiento
 * @returns {{ status: string, label: string, diasRestantes: number }}
 */
export function calcularEstado(fechaVencimiento) {
  if (!fechaVencimiento) {
    return { status: 'sin-membresia', label: 'Sin membresía', diasRestantes: null }
  }

  const hoy = startOfDay(new Date())
  const vencimiento = startOfDay(firestoreTimestampToDate(fechaVencimiento))
  
  // differenceInDays: positivo si vencimiento es futuro, negativo si ya pasó
  const diasRestantes = differenceInDays(vencimiento, hoy)

  if (diasRestantes < 0) {
    return {
      status: 'vencido',
      label: `Vencida hace ${Math.abs(diasRestantes)} día${Math.abs(diasRestantes) !== 1 ? 's' : ''}`,
      diasRestantes,
    }
  }

  if (diasRestantes <= DIAS_ADVERTENCIA) {
    return {
      status: 'por-vencer',
      label: diasRestantes === 0 
        ? 'Vence hoy' 
        : `Vence en ${diasRestantes} día${diasRestantes !== 1 ? 's' : ''}`,
      diasRestantes,
    }
  }

  return {
    status: 'activo',
    label: 'Al día',
    diasRestantes,
  }
}

/**
 * Retorna las clases de Tailwind según el estado
 */
export function getStatusClasses(status) {
  const map = {
    'activo':       { bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-200',  dot: 'bg-green-500'  },
    'por-vencer':   { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', dot: 'bg-yellow-500' },
    'vencido':      { bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-200',    dot: 'bg-red-500'    },
    'sin-membresia':{ bg: 'bg-gray-100',   text: 'text-gray-600',   border: 'border-gray-200',   dot: 'bg-gray-400'   },
  }
  return map[status] || map['sin-membresia']
}

/**
 * Retorna los colores para el toast según el estado
 */
export function getToastConfig(status) {
  const map = {
    'activo':     { icon: '✅', title: '¡Estás al día!',          color: '#16a34a', bg: '#f0fdf4' },
    'por-vencer': { icon: '⚠️', title: 'Membresía por vencer',    color: '#d97706', bg: '#fefce8' },
    'vencido':    { icon: '❌', title: 'Membresía vencida',        color: '#dc2626', bg: '#fef2f2' },
  }
  return map[status]
}