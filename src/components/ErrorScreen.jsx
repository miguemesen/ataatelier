export default function ErrorScreen({ visible }) {
  if (!visible) return null
  return (
    <div className="error-screen visible">
      <p>No pudimos encontrar esta invitación. Verifica el enlace e intenta de nuevo.</p>
    </div>
  )
}
