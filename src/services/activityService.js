import {
  collection, addDoc, getDocs, query, where, updateDoc, doc, Timestamp
} from 'firebase/firestore'
import { db } from './firebase'

/**
 * Obtener todas las actividades activas
 */
export async function getActividades() {
  const q = query(
    collection(db, 'actividades'),
    where('activa', '==', true)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

/**
 * Crear una nueva actividad
 */
export async function crearActividad(data) {
  const actividad = {
    nombre: data.nombre.trim(),
    descripcion: data.descripcion?.trim() || '',
    precioMensual: Number(data.precioMensual),
    duracionDias: Number(data.duracionDias) || 30,
    activa: true,
    createdAt: Timestamp.fromDate(new Date()),
  }

  const docRef = await addDoc(collection(db, 'actividades'), actividad)
  return { id: docRef.id, ...actividad }
}

/**
 * Actualizar una actividad
 */
export async function actualizarActividad(actividadId, data) {
  const actividadRef = doc(db, 'actividades', actividadId)
  const updates = {
    nombre: data.nombre?.trim(),
    descripcion: data.descripcion?.trim(),
    precioMensual: data.precioMensual ? Number(data.precioMensual) : undefined,
    duracionDias: data.duracionDias ? Number(data.duracionDias) : undefined,
  }
  
  // Filtrar undefined
  Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key])
  
  await updateDoc(actividadRef, {
    ...updates,
    updatedAt: Timestamp.fromDate(new Date()),
  })
}

/**
 * Desactivar una actividad
 */
export async function desactivarActividad(actividadId) {
  const actividadRef = doc(db, 'actividades', actividadId)
  await updateDoc(actividadRef, {
    activa: false,
  })
}