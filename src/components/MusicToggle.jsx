export default function MusicToggle({ visible, playing, onToggle }) {
  return (
    <div className={`music-toggle ${visible ? 'visible' : ''}`} onClick={onToggle}>
      {playing ? '🔊' : '🔇'}
    </div>
  )
}
