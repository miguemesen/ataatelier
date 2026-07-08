export default function ActionButtons({ ubicacionLink, onConfirmarClick }) {
  return (
    <div className="buttons">
      <button type="button" className="btn" onClick={onConfirmarClick}>
        CONFIRMAR ASISTENCIA
      </button>
      <a className="btn" href={ubicacionLink || '#'} target="_blank" rel="noopener noreferrer">
        VER UBICACIÓN
      </a>
    </div>
  )
}