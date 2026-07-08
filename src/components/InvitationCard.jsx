export default function InvitationCard({ imageUrl, invitees }) {
  const spotsLabel = invitees === 1 ? 'espacio' : 'espacios'
  const plural = invitees === 1 ? 'Le' : 'Les'

  return (
    <div className="invitation-card">
      <img src={imageUrl} alt="Invitación" />
      <div className="invitation-spots-overlay">
        <span className="invitation-spots-line-1">{plural} hemos reservado</span>
        <span className="invitation-spots-line-2">{invitees} {spotsLabel}.</span>
      </div>
    </div>
  )
}