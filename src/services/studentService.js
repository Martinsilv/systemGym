import {
  collection, addDoc, getDocs, getDoc, doc,
  updateDoc, query, where, Timestamp, orderBy
} from 'firebase/firestore'
import { db } from './firebase'
import { calcularEdad } from '../utils/dateUtils'

/**
 * Buscar alumno por DNI — usado en el check-in
 */
export async function buscarAlumnoPorDNI(dni) {
  const q = query(
    collection(db, 'alumnos'),
    where('dni', '==', dni.trim())
  )
  const snapshot = await getDocs(q)
  
  if (snapshot.empty) return null
  
  const doc = snapshot.docs[0]
  return { id: doc.id, ...doc.data() }
}
export async function actualizarAlumno(alumnoId, data) {
  const alumnoRef = doc(db, 'alumnos', alumnoId)

  await updateDoc(alumnoRef, {
    ...data,
    updatedAt: Timestamp.fromDate(new Date())
  })
}

/**
 * Registrar nuevo alumno con teléfono y actividad
 */
export async function registrarAlumno(data) {
  // Verificar que el DNI no esté registrado
  const existe = await buscarAlumnoPorDNI(data.dni)
  if (existe) {
    throw new Error('Ya existe un alumno con ese DNI')
  }

  const edad = calcularEdad(data.fechaNacimiento)
  const ahora = Timestamp.fromDate(new Date())

  const alumno = {
    nombre: data.nombre.trim(),
    apellido: data.apellido.trim(),
    dni: data.dni.trim(),
    telefono: data.telefono?.trim() || '',
    fechaNacimiento: Timestamp.fromDate(new Date(data.fechaNacimiento)),
    edad,
    actividad: data.actividad || 'Sin actividad',  // Nueva
    observacionesSalud: data.observacionesSalud?.trim() || '',
    fechaVencimiento: null, // Se establece con el primer pago
    activo: true,
    createdAt: ahora,
    updatedAt: ahora,
  }

  const docRef = await addDoc(collection(db, 'alumnos'), alumno)
  return { id: docRef.id, ...alumno }
}

/**
 * Obtener todos los alumnos activos
 */
export async function getAllAlumnos() {
  const q = query(
    collection(db, 'alumnos'),
    where('activo', '==', true),
    orderBy('apellido', 'asc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

/**
 * Obtener un alumno por ID
 */
export async function getAlumnoById(alumnoId) {
  const docRef = doc(db, 'alumnos', alumnoId)
  const docSnap = await getDoc(docRef)
  
  if (!docSnap.exists()) return null
  return { id: docSnap.id, ...docSnap.data() }
}

/**
 * Actualizar fecha de vencimiento (llamado desde el servicio de pagos)
 */
export async function actualizarVencimiento(alumnoId, nuevaFecha) {
  const alumnoRef = doc(db, 'alumnos', alumnoId)
  await updateDoc(alumnoRef, {
    fechaVencimiento: Timestamp.fromDate(nuevaFecha),
    updatedAt: Timestamp.fromDate(new Date()),
  })
}

/**
 * Actualizar actividad del alumno
 */
export async function actualizarActividad(alumnoId, actividad) {
  const alumnoRef = doc(db, 'alumnos', alumnoId)
  await updateDoc(alumnoRef, {
    actividad,
    updatedAt: Timestamp.fromDate(new Date()),
  })
}

/**
 * Dar de baja a un alumno (soft delete)
 */
export async function darDeBajaAlumno(alumnoId) {
  const alumnoRef = doc(db, 'alumnos', alumnoId)
  await updateDoc(alumnoRef, {
    activo: false,
    updatedAt: Timestamp.fromDate(new Date()),
  })
}