export default function MusicChoiceScreen({ visible, backgroundUrl, onChoose }) {
  return (
    <div
      className={`music-choice-screen ${visible ? '' : 'hidden'}`}
      style={backgroundUrl ? { backgroundImage: `url('${backgroundUrl}')` } : undefined}
    >
      <h2>¿Deseas continuar con música?</h2>
      <div className="choice-buttons">
        <button type="button" className="btn" onClick={() => onChoose(true)}>
          CONTINUAR CON MÚSICA
        </button>
        <button type="button" className="btn" onClick={() => onChoose(false)}>
          CONTINUAR SIN MÚSICA
        </button>
      </div>
    </div>
  )
}
