import {
  collection, addDoc, Timestamp, query, where, getDocs, orderBy, limit
} from 'firebase/firestore'
import { db } from './firebase'

/**
 * Registrar asistencia de un alumno incluyendo su actividad
 */
export async function registrarAsistencia(alumno) {
  const ahora = new Date()
  const hoy = ahora.toISOString().split('T')[0] // "2024-01-15"

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
    // Por actividad
    if (!resumen.porActividad[asistencia.actividad]) {
      resumen.porActividad[asistencia.actividad] = 0
    }
    resumen.porActividad[asistencia.actividad]++

    // Por alumno
    if (!resumen.porAlumno[asistencia.alumnoId]) {
      resumen.porAlumno[asistencia.alumnoId] = {
        nombre: asistencia.nombreAlumno,
        count: 0,
      }
    }
    resumen.porAlumno[asistencia.alumnoId].count++

    // Por día
    if (!resumen.dias[asistencia.fecha]) {
      resumen.dias[asistencia.fecha] = 0
    }
    resumen.dias[asistencia.fecha]++
  })

  return resumen
}