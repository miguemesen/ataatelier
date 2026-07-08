export default function RsvpConfirmModal({ visible, onClose, onConfirmYes, declineLink, deadlineText }) {
  return (
    <div className={`rsvp-modal-overlay ${visible ? 'visible' : ''}`}>
      <div className="modal-card">
        <img src="/assets/florcita-arriba.png" alt="" className="rsvp-modal-flower rsvp-modal-flower-top" />
        <img src="/assets/florcita-abajo.png" alt="" className="rsvp-modal-flower rsvp-modal-flower-bottom" />

        <div className="modal-header">
          <h2>¿Nos acompañarás?</h2>
          <button type="button" className="rsvp-modal-close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="modal-body">
          <p>
            Por favor, confirmá tu asistencia
            <br />
            <span className="font-semibold">antes del {deadlineText}.</span>
          </p>

          <div className="modal-buttons">
            <button type="button" className="btn" onClick={onConfirmYes}>
              SÍ, ASISTIRÉ
            </button>
            <a className="btn" href={declineLink || '#'} target="_blank" rel="noopener noreferrer">
              NO PODRÉ ASISTIR
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}