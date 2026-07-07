import { useState } from 'react'

// Starter scaffold for a guest RSVP form. Replace/extend the fields below
// as needed (dietary restrictions, plus-ones, meal choice, etc.) — this is
// intentionally minimal so it's easy to build on rather than prescriptive.
export default function RsvpForm({ onSubmit }) {
  const [name, setName] = useState('')
  const [guestCount, setGuestCount] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (onSubmit) {
      onSubmit({ name, guestCount })
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rsvp-form-confirmation">
        <p>¡Gracias, {name}! Confirmamos {guestCount} {guestCount === 1 ? 'invitado' : 'invitados'}.</p>
      </div>
    )
  }

  return (
    <form className="rsvp-form" onSubmit={handleSubmit}>
      <label className="rsvp-form-field">
        <span>Nombre</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>

      <label className="rsvp-form-field">
        <span>Número de invitados</span>
        <input
          type="number"
          min="1"
          value={guestCount}
          onChange={(e) => setGuestCount(Number(e.target.value))}
          required
        />
      </label>

      <button type="submit" className="btn">
        CONFIRMAR
      </button>
    </form>
  )
}
