/**
 * Validar datos de registro de alumno
 */
export function validarAlumno(data) {
  const errores = {}

  if (!data.nombre?.trim()) errores.nombre = 'El nombre es obligatorio'
  if (!data.apellido?.trim()) errores.apellido = 'El apellido es obligatorio'
  
  if (!data.dni?.trim()) {
    errores.dni = 'El DNI es obligatorio'
  } else if (!/^\d{7,8}$/.test(data.dni.trim())) {
    errores.dni = 'El DNI debe tener 7 u 8 dígitos'
  }

  if (!data.telefono?.trim()) {
    errores.telefono = 'El teléfono es obligatorio'
  } else if (!/^[\d\s+\-()]{8,}$/.test(data.telefono.trim())) {
    errores.telefono = 'El teléfono no es válido'
  }

  if (!data.actividad) {
    errores.actividad = 'Debes seleccionar una actividad'
  }

  if (!data.fechaNacimiento) {
    errores.fechaNacimiento = 'La fecha de nacimiento es obligatoria'
  } else {
    const hoy = new Date()
    const nacimiento = new Date(data.fechaNacimiento)
    if (nacimiento >= hoy) {
      errores.fechaNacimiento = 'La fecha de nacimiento debe ser anterior a hoy'
    }
  }

  return { errores, valido: Object.keys(errores).length === 0 }
}

/**
 * Validar datos de pago
 */
export function validarPago(data) {
  const errores = {}

  if (!data.monto || Number(data.monto) <= 0) {
    errores.monto = 'El monto debe ser mayor a 0'
  }

  return { errores, valido: Object.keys(errores).length === 0 }
}

/**
 * Validar datos de actividad
 */
export function validarActividad(data) {
  const errores = {}

  if (!data.nombre?.trim()) errores.nombre = 'El nombre es obligatorio'

  if (!data.precioMensual || Number(data.precioMensual) <= 0) {
    errores.precioMensual = 'El precio debe ser mayor a 0'
  }

  if (data.duracionDias && Number(data.duracionDias) <= 0) {
    errores.duracionDias = 'La duración debe ser mayor a 0 días'
  }

  return { errores, valido: Object.keys(errores).length === 0 }
}

/**
 * Sanitizar teléfono (remover espacios y caracteres especiales)
 */
export function sanitizarTelefono(telefono) {
  return telefono.replace(/\s/g, '').trim()
}

/**
 * Validar que un monto sea positivo
 */
export function validarMonto(monto) {
  const num = Number(monto)
  return !isNaN(num) && num > 0
}