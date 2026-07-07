export default function ActionButtons({ confirmarLink, ubicacionLink }) {
  return (
    <div className="buttons">
      <a className="btn" href={confirmarLink || '#'} target="_blank" rel="noopener noreferrer">
        CONFIRMAR ASISTENCIA
      </a>
      <a className="btn" href={ubicacionLink || '#'} target="_blank" rel="noopener noreferrer">
        VER UBICACIÓN
      </a>
    </div>
  )
}
