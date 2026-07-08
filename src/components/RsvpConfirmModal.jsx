export default function RsvpConfirmModal({ visible, onClose, onConfirmYes, onConfirmNo, deadlineText }) {
  return (
    <div className={`rsvp-modal-overlay ${visible ? 'visible' : ''}`}>
      <div className="modal-card">
        <img src="/assets/florcita-arriba.png" alt="" className="rsvp-modal-flower rsvp-modal-flower-nos-acompana-top" />
        <img src="/assets/florcita-abajo.png" alt="" className="rsvp-modal-flower rsvp-modal-flower-nos-acompana-bottom" />

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
            <button type="button" className="btn" onClick={onConfirmNo}>
              NO PODRÉ ASISTIR
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}