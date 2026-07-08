export default function ConfirmedModal({ visible }) {
  return (
    <div className={`rsvp-modal-overlay ${visible ? 'visible' : ''}`}>
      <div className="modal-card">
        <div className="modal-header" style={{padding: '31px 20px'}}>
          <img src="/assets/florcita-azul.png" alt="" className="confirmed-flower" />
        </div>

        <div className="modal-body confirmed-body">
          <img
            src="/assets/spongebob-confirmado.png"
            alt=""
            className="confirmed-character"
          />

          <div className="confirmed-text">
            <p className="confirmed-label">ASISTENCIA CONFIRMADA</p>
            <p className="confirmed-headline">¡Nos vemos en Fondo de Bikini!</p>
          </div>
        </div>
      </div>
    </div>
  )
}