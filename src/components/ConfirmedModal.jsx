export default function ConfirmedModal({ visible, variant = 'confirm' }) {
  const isDecline = variant === 'decline'

  return (
    <div className={`rsvp-modal-overlay ${visible ? 'visible' : ''}`}>
      <div className="modal-card">
        <div className="modal-header" style={{padding: '31px 20px'}}>
          <img src="/assets/florcita-azul.png" alt="" className="confirmed-flower" />
          <img
            src="/assets/spongebob-confirmado.png"
            alt=""
            className="confirmed-character"
          />
        </div>

        <div className="modal-body confirmed-body">
          <div style={{width: '120px', height:'150px'}}/>
          <div className="confirmed-text">
            {isDecline ? (
              <>
                <p className="confirmed-label">MENSAJE ENVIADO</p>
                <p className="confirmed-headline">¡Gracias por avisarnos!</p>
              </>
            ) : (
              <>
                <p className="confirmed-label">ASISTENCIA CONFIRMADA</p>
                <p className="confirmed-headline">¡Nos vemos en Fondo de Bikini!</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}