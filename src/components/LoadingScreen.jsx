export default function LoadingScreen({ visible }) {
  return (
    <div className={`loading-screen ${visible ? 'visible' : ''}`}>
      <div className="loading-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )
}
