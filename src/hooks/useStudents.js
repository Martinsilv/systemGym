import { useState, useEffect, useCallback } from 'react'
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore'
import { db } from '../services/firebase'
 
/**
 * Hook para obtener alumnos en tiempo real de Firestore
 * Se actualiza automáticamente cuando hay cambios en la BD
 */
export function useStudents() {
  const [alumnos, setAlumnos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    
    // Query en tiempo real: solo alumnos activos
    const q = query(
      collection(db, 'alumnos'),
      where('activo', '==', true)
    )

    // onSnapshot se ejecuta cada vez que hay cambios
    const unsubscribe = onSnapshot(q, (snapshot) => {
      try {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        // Ordenar por apellido
        data.sort((a, b) => a.apellido.localeCompare(b.apellido))
        setAlumnos(data)
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

    // Limpiar el listener cuando se desmonta el componente
    return () => unsubscribe()
  }, [])

  // Filtrado en el cliente
  const alumnosFiltrados = alumnos.filter(alumno => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      alumno.nombre.toLowerCase().includes(q) ||
      alumno.apellido.toLowerCase().includes(q) ||
      alumno.dni.includes(q)
    )
  })

  return { 
    alumnos: alumnosFiltrados, 
    todosLosAlumnos: alumnos,
    loading, 
    error, 
    search, 
    setSearch,
  }
}