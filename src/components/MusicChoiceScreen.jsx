export default function MusicChoiceScreen({ visible, backgroundUrl, onChoose }) {
  return (
    <div
      className={`music-choice-screen ${visible ? '' : 'hidden'}`}
      style={backgroundUrl ? { backgroundImage: `url('${backgroundUrl}')` } : undefined}
    >
      <div className="music-card">
        <div className="music-card-header">
          <img src="/assets/gary.png" alt="" className="music-card-gary" />
          <h2>¡Ahoy!</h2>
          <img src="/assets/coral.png" alt="" className="music-card-coral music-card-coral-back" />
          <img src="/assets/coral.png" alt="" className="music-card-coral music-card-coral-front" />
        </div>

        <div className="music-card-body">
          <p>¿Querés vivir la experiencia con música?</p>
          <div className="choice-buttons">
            <button type="button" className="btn" onClick={() => onChoose(true)}>
              CONTINUAR CON MÚSICA
            </button>
            <button type="button" className="btn" onClick={() => onChoose(false)}>
              CONTINUAR SIN MÚSICA
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}