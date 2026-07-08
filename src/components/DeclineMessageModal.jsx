import { useState } from 'react'

export default function DeclineMessageModal({ visible, onClose, onSubmit }) {
  const [nombre, setNombre] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [mensaje, setMensaje] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (onSubmit) {
      onSubmit({ nombre, apellidos, mensaje })
    }
  }

  return (
    <div className={`rsvp-modal-overlay ${visible ? 'visible' : ''}`}>
      <div className="modal-card">
        <img src="/assets/florcita-arriba.png" alt="" className="rsvp-modal-flower rsvp-modal-flower-gracias-avisarnos-top" />
        <img src="/assets/florcita-abajo.png" alt="" className="rsvp-modal-flower rsvp-modal-flower-gracias-avisarnos-bottom" />

        <div className="modal-header">
          <h2>¡Gracias por avisarnos!</h2>
          <button type="button" className="rsvp-modal-close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="modal-body">
          <form className="guest-form" onSubmit={handleSubmit}>
            <label className="guest-form-label">¿Quién nos escribe?</label>
            <div className="guest-form-row">
              <input
                type="text"
                className="guest-form-input"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <input
                type="text"
                className="guest-form-input"
                placeholder="Apellidos"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
              />
            </div>

            <label className="guest-form-label">Dejale un mensajito a Aura:</label>
            <textarea
              className="guest-form-textarea"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
            />

            <div className="modal-buttons">
              <button type="submit" className="btn">
                ENVIAR MENSAJE
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}