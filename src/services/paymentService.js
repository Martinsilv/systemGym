import {
  collection, addDoc, query, where,
  getDocs, orderBy, Timestamp, limit
} from 'firebase/firestore'
import { db } from './firebase'
import { calcularNuevaFechaVencimiento, dateToTimestamp } from '../utils/dateUtils'
import { actualizarVencimiento } from './studentService'
import { firestoreTimestampToDate } from '../utils/statusUtils'
 
/**
 * Registrar un pago con monto variable según actividad
 * @param {Object} alumno - Documento del alumno
 * @param {number} monto - Monto a cobrar (puede variar del precio original)
 * @param {string} actividad - Nombre de la actividad
 * @param {number} duracionDias - Cuántos días se extiende (default 30)
 * @param {string} observaciones - Notas sobre el pago
 */
export async function registrarPago(
  alumno,
  monto,
  actividad = alumno.actividad || 'Sin actividad',
  duracionDias = 30,
  observaciones = ''
) {
  const ahora = new Date()
  
  // Convertir el timestamp actual de vencimiento a Date
  const vencimientoActual = alumno.fechaVencimiento 
    ? firestoreTimestampToDate(alumno.fechaVencimiento)
    : null
 
  // Calcular la nueva fecha de vencimiento
  const nuevaFechaVencimiento = calcularNuevaFechaVencimiento(
    vencimientoActual,
    duracionDias
  )
 
  const pago = {
    alumnoId: alumno.id,
    dni: alumno.dni,
    nombreAlumno: `${alumno.nombre} ${alumno.apellido}`,
    actividad,
    monto: Number(monto),
    fechaPago: Timestamp.fromDate(ahora),
    fechaVencimientoAnterior: vencimientoActual 
      ? Timestamp.fromDate(vencimientoActual) 
      : null,
    fechaVencimientoNueva: Timestamp.fromDate(nuevaFechaVencimiento),
    observaciones: observaciones.trim(),
    createdAt: Timestamp.fromDate(ahora),
  }
 
  // Guardar el pago
  const docRef = await addDoc(collection(db, 'pagos'), pago)
  
  // Actualizar la fecha de vencimiento del alumno
  await actualizarVencimiento(alumno.id, nuevaFechaVencimiento)
 
  return { id: docRef.id, ...pago, nuevaFechaVencimiento }
}
 
/**
 * Obtener historial de pagos de un alumno
 */
export async function getPagosPorAlumno(alumnoId, limite = 20) {
  const q = query(
    collection(db, 'pagos'),
    where('alumnoId', '==', alumnoId),
    orderBy('fechaPago', 'desc'),
    limit(limite)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
 
/**
 * Obtener todos los pagos (para vista de administrador)
 */
export async function getTodosPagos(limite = 100) {
  const q = query(
    collection(db, 'pagos'),
    orderBy('fechaPago', 'desc'),
    limit(limite)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
 
/**
 * Obtener pagos del mes actual
 */
export async function getPagosMesActual() {
  const ahora = new Date()
  const primerDia = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
  const ultimoDia = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0)
 
  const q = query(
    collection(db, 'pagos'),
    where('fechaPago', '>=', Timestamp.fromDate(primerDia)),
    where('fechaPago', '<=', Timestamp.fromDate(ultimoDia)),
    orderBy('fechaPago', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
 
export async function getResumenIngresos() {
  try {
    const q = query(
      collection(db, 'pagos'),
      orderBy('fechaPago', 'desc')
    )

    const snapshot = await getDocs(q)

    const pagos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    const ahora = new Date()
    const mesActual = ahora.getMonth()
    const anioActual = ahora.getFullYear()
let totalTodos = 0;

pagos.forEach(pago => {
  totalTodos += pago.monto || 0;
});
    let totalMes = 0
    let totalHoy = 0

    const porActividad = {}

    pagos.forEach(pago => {
      const fecha = pago.fechaPago.toDate()

      // 🔥 TOTAL MES
      if (
        fecha.getMonth() === mesActual &&
        fecha.getFullYear() === anioActual
      ) {
        totalMes += pago.monto || 0
      }

      // 🔥 TOTAL HOY
      if (fecha.toDateString() === ahora.toDateString()) {
        totalHoy += pago.monto || 0
      }

      // 🔥 AGRUPAR POR ACTIVIDAD
      const actividad = pago.actividad || "Sin actividad"

      if (!porActividad[actividad]) {
        porActividad[actividad] = 0
      }

      porActividad[actividad] += pago.monto || 0
    })

    return {
      totalMes,
      totalHoy,
      cantidadPagos: pagos.length,
      totalTodos,
      porActividad, // 🔥 IMPORTANTE
      pagos
    }

  } catch (error) {
    console.error("Error en getResumenIngresos:", error)
    throw error
  }
}