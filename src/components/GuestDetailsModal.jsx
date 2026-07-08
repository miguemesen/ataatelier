import { useEffect, useState } from 'react'

export default function GuestDetailsModal({ visible, onClose, maxGuests, onConfirm }) {
  const [guestCount, setGuestCount] = useState(maxGuests)
  const [guests, setGuests] = useState([])
  const [notes, setNotes] = useState('')
  const [submitAttempted, setSubmitAttempted] = useState(false)

  // Whenever the selected count changes, resize the guests array,
  // keeping any names already typed for the rows that still exist.
  useEffect(() => {
    setGuests((prev) => {
      const next = [...prev]
      while (next.length < guestCount) {
        next.push({ nombre: '', apellidos: '', edad: '' })
      }
      return next.slice(0, guestCount)
    })
  }, [guestCount])

  function updateGuest(index, field, value) {
    setGuests((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  function isGuestFieldInvalid(index, field) {
    return submitAttempted && !String(guests[index][field]).trim()
  }

  function fieldClass(baseClass, index, field) {
    return `${baseClass}${isGuestFieldInvalid(index, field) ? ' invalid' : ''}`
  }

  function handleSubmit(e) {
    e.preventDefault()

    const hasEmptyField = guests.some(
      (guest) =>
        !guest.nombre.trim() ||
        !guest.apellidos.trim() ||
        !String(guest.edad).trim()
    )

    if (hasEmptyField) {
      setSubmitAttempted(true)
      return
    }

    if (onConfirm) {
      onConfirm({ guestCount, guests, notes })
    }
  }

  const guestOptions = Array.from({ length: maxGuests }, (_, i) => i + 1)

  return (
    <div className={`rsvp-modal-overlay ${visible ? 'visible' : ''}`}>
      <div className="modal-card">
        <img src="/assets/florcita-arriba.png" alt="" className="rsvp-modal-flower rsvp-modal-flower-emocion-venga-top" />
        <img src="/assets/florcita-abajo.png" alt="" className="rsvp-modal-flower rsvp-modal-flower-emocion-venga-bottom" />

        <div className="modal-header">
          <h2>¡Qué emoción que vengás!</h2>
          <button type="button" className="rsvp-modal-close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="modal-body">
          <form className="guest-form" onSubmit={handleSubmit} noValidate>
            <label className="guest-form-label" htmlFor="guest-count-select">
              ¿Cuántas personas van a asistir?
            </label>
            <select
              id="guest-count-select"
              className="guest-form-select"
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
            >
              {guestOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>

            <label className="guest-form-label">¿Cómo se llaman?</label>

            {guests.map((guest, index) => (
              <div className="guest-form-row" key={index}>
                <input
                  type="text"
                  className={fieldClass('guest-form-input', index, 'nombre')}
                  placeholder="Nombre"
                  value={guest.nombre}
                  onChange={(e) => updateGuest(index, 'nombre', e.target.value)}
                />
                <input
                  type="text"
                  className={fieldClass('guest-form-input', index, 'apellidos')}
                  placeholder="Apellidos"
                  value={guest.apellidos}
                  onChange={(e) => updateGuest(index, 'apellidos', e.target.value)}
                />
                <input
                  type="number"
                  className={fieldClass('guest-form-input guest-form-input-edad', index, 'edad')}
                  placeholder="Edad"
                  value={guest.edad}
                  onChange={(e) => updateGuest(index, 'edad', e.target.value)}
                />
              </div>
            ))}

            <label className="guest-form-label">
              ¿Hay alguna alergia o restricción alimentaria que debamos tomar en cuenta?
            </label>
            <textarea
              className="guest-form-textarea"
              placeholder="Contanos..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <div className="modal-buttons">
              <button type="submit" className="btn">
                CONFIRMAR ASISTENCIA
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}