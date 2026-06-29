import {
  collection, addDoc, Timestamp, query, where, getDocs, orderBy, limit
} from 'firebase/firestore'
import { db } from './firebase'

/**
 * Registrar asistencia de un alumno incluyendo su actividad
 */
export async function registrarAsistencia(alumno) {
  const ahora = new Date()
  const hoy = ahora.toISOString().split('T')[0]

  const asistencia = {
    alumnoId: alumno.id,
    dni: alumno.dni,
    nombreAlumno: `${alumno.nombre} ${alumno.apellido}`,
    actividad: alumno.actividad || 'Sin actividad',
    fechaHora: Timestamp.fromDate(ahora),
    fecha: hoy,
    createdAt: Timestamp.fromDate(ahora),
  }

  const docRef = await addDoc(collection(db, 'asistencias'), asistencia)
  return { id: docRef.id, ...asistencia }
}

/**
 * Obtener asistencias de un alumno específico
 */
export async function getAsistenciasPorAlumno(alumnoId, limite = 20) {
  const q = query(
    collection(db, 'asistencias'),
    where('alumnoId', '==', alumnoId),
    orderBy('fechaHora', 'desc'),
    limit(limite)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

/**
 * Obtener todas las asistencias del día de hoy
 */
export async function getAsistenciasHoy() {
  const hoy = new Date().toISOString().split('T')[0]
  const q = query(
    collection(db, 'asistencias'),
    where('fecha', '==', hoy),
    orderBy('fechaHora', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

/**
 * Obtener asistencias de una fecha específica
 */
export async function getAsistenciasPorFecha(fecha) {
  const fechaStr = fecha.toISOString().split('T')[0]
  const q = query(
    collection(db, 'asistencias'),
    where('fecha', '==', fechaStr),
    orderBy('fechaHora', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

/**
 * Obtener asistencias del mes actual
 */
export async function getAsistenciasMesActual() {
  const ahora = new Date()
  const primerDia = new Date(ahora.getFullYear(), ahora.getMonth(), 1)
    .toISOString().split('T')[0]
  const ultimoDia = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0)
    .toISOString().split('T')[0]

  const q = query(
    collection(db, 'asistencias'),
    where('fecha', '>=', primerDia),
    where('fecha', '<=', ultimoDia),
    orderBy('fecha', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

/**
 * Obtener asistencias de un rango de fechas (mes/año específico)
 */
export async function getAsistenciasPorRango(desde, hasta) {
  const desdeStr = desde.toISOString().split('T')[0]
  const hastaStr = hasta.toISOString().split('T')[0]

  const q = query(
    collection(db, 'asistencias'),
    where('fecha', '>=', desdeStr),
    where('fecha', '<=', hastaStr),
    orderBy('fecha', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

/**
 * Contar asistencias por alumno en un rango de fechas
 */
export async function contarAsistenciasAlumno(alumnoId, desde, hasta) {
  const desdeStr = desde.toISOString().split('T')[0]
  const hastaStr = hasta.toISOString().split('T')[0]

  const q = query(
    collection(db, 'asistencias'),
    where('alumnoId', '==', alumnoId),
    where('fecha', '>=', desdeStr),
    where('fecha', '<=', hastaStr)
  )
  const snapshot = await getDocs(q)
  return snapshot.size
}

/**
 * Obtener resumen de asistencias del mes
 */
export async function getResumenAsistenciasMes() {
  const asistencias = await getAsistenciasMesActual()
  
  const resumen = {
    total: asistencias.length,
    porActividad: {},
    porAlumno: {},
    dias: {},
  }

  asistencias.forEach(asistencia => {
    if (!resumen.porActividad[asistencia.actividad]) {
      resumen.porActividad[asistencia.actividad] = 0
    }
    resumen.porActividad[asistencia.actividad]++

    if (!resumen.porAlumno[asistencia.alumnoId]) {
      resumen.porAlumno[asistencia.alumnoId] = {
        nombre: asistencia.nombreAlumno,
        count: 0,
      }
    }
    resumen.porAlumno[asistencia.alumnoId].count++

    if (!resumen.dias[asistencia.fecha]) {
      resumen.dias[asistencia.fecha] = 0
    }
    resumen.dias[asistencia.fecha]++
  })

  return resumen
}

/**
 * 🔥 NUEVO: Obtener datos de asistencias para últimos 12 meses
 */
export async function getAsistenciasUltimos12Meses() {
  const ahora = new Date()
  const hace12Meses = new Date(ahora.getFullYear() - 1, ahora.getMonth(), 1)
  
  const q = query(
    collection(db, 'asistencias'),
    where('fecha', '>=', hace12Meses.toISOString().split('T')[0]),
    orderBy('fecha', 'desc')
  )
  
  const snapshot = await getDocs(q)
  const asistencias = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  
  // Agrupar por mes
  const porMes = {}
  
  asistencias.forEach(asistencia => {
    const fecha = new Date(asistencia.fecha)
    const mesAno = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`
    
    if (!porMes[mesAno]) {
      porMes[mesAno] = 0
    }
    porMes[mesAno]++
  })
  
  return porMes
}

/**
 * 🔥 NUEVO: Obtener asistencias por mes (mes específico)
 */
export async function getAsistenciasMes(mes, ano) {
  const primerDia = new Date(ano, mes - 1, 1).toISOString().split('T')[0]
  const ultimoDia = new Date(ano, mes, 0).toISOString().split('T')[0]

  const q = query(
    collection(db, 'asistencias'),
    where('fecha', '>=', primerDia),
    where('fecha', '<=', ultimoDia),
    orderBy('fecha', 'desc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}