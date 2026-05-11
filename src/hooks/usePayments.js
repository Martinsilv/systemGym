import { useState, useEffect } from 'react'
import { collection, query, where,orderBy, onSnapshot, limit } from 'firebase/firestore'
import { db } from '../services/firebase'

/**
 * Hook para obtener pagos en tiempo real
 */
export function usePayments(limite = 100) {
  const [pagos, setPagos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)

    const q = query(
      collection(db, 'pagos'),
      orderBy('fechaPago', 'desc'),
      limit(limite)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setPagos(data)
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
  }, [limite])

  return { pagos, loading, error }
}

/**
 * Hook para obtener pagos de un alumno específico en tiempo real
 */
export function usePagosPorAlumno(alumnoId) {
  const [pagos, setPagos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!alumnoId) {
      setLoading(false)
      return
    }

    setLoading(true)

    const q = query(
      collection(db, 'pagos'),
      where('alumnoId', '==', alumnoId),
      orderBy('fechaPago', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setPagos(data)
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
  }, [alumnoId])

  return { pagos, loading, error }
}