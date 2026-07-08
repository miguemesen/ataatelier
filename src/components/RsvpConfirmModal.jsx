export default function RsvpConfirmModal({ visible, onClose, confirmarLink, declineLink, deadlineText }) {
  return (
    <div className={`rsvp-modal-overlay ${visible ? 'visible' : ''}`}>
      <div className="rsvp-modal-card">
        <img src="/assets/florcita-arriba.png" alt="" className="rsvp-modal-flower rsvp-modal-flower-top" />
        <img src="/assets/florcita-abajo.png" alt="" className="rsvp-modal-flower rsvp-modal-flower-bottom" />

        <div className="rsvp-modal-header">
          <h2>¿Nos acompañarás?</h2>
          <button type="button" className="rsvp-modal-close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="rsvp-modal-body">
          <p>
            Por favor, confirmá tu asistencia
            <br />
            <span className="font-semibold">antes del {deadlineText}.</span>
          </p>

          <div className="rsvp-modal-buttons">
            <a className="btn" href={confirmarLink || '#'} target="_blank" rel="noopener noreferrer">
              SÍ, ASISTIRÉ
            </a>
            <a className="btn" href={declineLink || '#'} target="_blank" rel="noopener noreferrer">
              NO PODRÉ ASISTIR
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}