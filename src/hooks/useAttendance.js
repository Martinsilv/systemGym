import { useState, useEffect } from 'react'
import { collection, query, where, orderBy, onSnapshot, limit } from 'firebase/firestore'
import { db } from '../services/firebase'

/**
 * Hook para obtener asistencias del día en tiempo real
 */
export function useAsistenciasHoy() {
  const [asistencias, setAsistencias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    const hoy = new Date().toISOString().split('T')[0]

    const q = query(
      collection(db, 'asistencias'),
      where('fecha', '==', hoy),
      orderBy('fechaHora', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setAsistencias(data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }, (err) => {
      setError(err.message)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { asistencias, loading, error }
}

/**
 * Hook para obtener asistencias de un alumno específico
 */
export function useAsistenciasPorAlumno(alumnoId, limite = 20) {
  const [asistencias, setAsistencias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!alumnoId) {
      setLoading(false)
      return
    }

    setLoading(true)

    const q = query(
      collection(db, 'asistencias'),
      where('alumnoId', '==', alumnoId),
      orderBy('fechaHora', 'desc'),
      limit(limite)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setAsistencias(data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }, (err) => {
      setError(err.message)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [alumnoId, limite])

  return { asistencias, loading, error }
}

/**
 * Hook para obtener asistencias del mes actual
 */
export function useAsistenciasMes() {
  const [asistencias, setAsistencias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
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

    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setAsistencias(data)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }, (err) => {
      setError(err.message)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { asistencias, loading, error }
}