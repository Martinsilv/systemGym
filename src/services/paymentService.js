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
 */
export async function registrarPago(
  alumno,
  monto,
  actividad = alumno.actividad || 'Sin actividad',
  duracionDias = 30,
  observaciones = ''
) {
  const ahora = new Date()
  
  const vencimientoActual = alumno.fechaVencimiento 
    ? firestoreTimestampToDate(alumno.fechaVencimiento)
    : null
 
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
 
  const docRef = await addDoc(collection(db, 'pagos'), pago)
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
    let totalTodos = 0

    pagos.forEach(pago => {
      totalTodos += pago.monto || 0
    })

    let totalMes = 0
    let totalHoy = 0
    const porActividad = {}

    pagos.forEach(pago => {
      const fecha = pago.fechaPago.toDate()

      if (
        fecha.getMonth() === mesActual &&
        fecha.getFullYear() === anioActual
      ) {
        totalMes += pago.monto || 0
      }

      if (fecha.toDateString() === ahora.toDateString()) {
        totalHoy += pago.monto || 0
      }

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
      porActividad,
      pagos
    }

  } catch (error) {
    console.error("Error en getResumenIngresos:", error)
    throw error
  }
}

/**
 * 🔥 NUEVO: Obtener ingresos para últimos 12 meses
 */
export async function getIngresosUltimos12Meses() {
  try {
    const q = query(
      collection(db, 'pagos'),
      orderBy('fechaPago', 'desc')
    )

    const snapshot = await getDocs(q)
    const pagos = snapshot.docs.map(doc => ({ ...doc.data() }))

    const porMes = {}

    pagos.forEach(pago => {
      const fecha = pago.fechaPago.toDate()
      const mesAno = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`

      if (!porMes[mesAno]) {
        porMes[mesAno] = 0
      }
      porMes[mesAno] += pago.monto || 0
    })

    return porMes
  } catch (error) {
    console.error("Error en getIngresosUltimos12Meses:", error)
    throw error
  }
}

/**
 * 🔥 NUEVO: Obtener ingresos por mes específico
 */
export async function getIngresosMes(mes, ano) {
  try {
    const primerDia = new Date(ano, mes - 1, 1)
    const ultimoDia = new Date(ano, mes, 0)

    const q = query(
      collection(db, 'pagos'),
      where('fechaPago', '>=', Timestamp.fromDate(primerDia)),
      where('fechaPago', '<=', Timestamp.fromDate(ultimoDia)),
      orderBy('fechaPago', 'desc')
    )

    const snapshot = await getDocs(q)
    const pagos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

    const total = pagos.reduce((sum, pago) => sum + (pago.monto || 0), 0)
    const cantidad = pagos.length

    return {
      total,
      cantidad,
      pagos,
      porActividad: pagos.reduce((acc, pago) => {
        const actividad = pago.actividad || 'Sin actividad'
        acc[actividad] = (acc[actividad] || 0) + (pago.monto || 0)
        return acc
      }, {})
    }
  } catch (error) {
    console.error("Error en getIngresosMes:", error)
    throw error
  }
}

/**
 * 🔥 NUEVO: Comparar ingresos entre dos meses
 */
export async function compararIngresosEntreMeses(mes1, ano1, mes2, ano2) {
  const resumen1 = await getIngresosMes(mes1, ano1)
  const resumen2 = await getIngresosMes(mes2, ano2)

  const diferencia = resumen2.total - resumen1.total
  const porcentaje = resumen1.total !== 0 ? ((diferencia / resumen1.total) * 100).toFixed(2) : 0

  return {
    mes1: { mes: mes1, ano: ano1, ...resumen1 },
    mes2: { mes: mes2, ano: ano2, ...resumen2 },
    diferencia,
    porcentaje,
    mejorada: diferencia > 0
  }
}