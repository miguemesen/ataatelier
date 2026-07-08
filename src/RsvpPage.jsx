import { useEffect, useState } from 'react'
import { useEventConfig } from './hooks/useEventConfig'
import { useImagePreloader } from './hooks/useImagePreloader'
import { useYoutubeMusic } from './hooks/useYoutubeMusic'
import { useInviteeCount } from './hooks/useInviteeCount'
import MusicChoiceScreen from './components/MusicChoiceScreen'
import LoadingScreen from './components/LoadingScreen'
import ErrorScreen from './components/ErrorScreen'
import InvitationCard from './components/InvitationCard'
import ActionButtons from './components/ActionButtons'
import MusicToggle from './components/MusicToggle'
import RsvpConfirmModal from './components/RsvpConfirmModal'
import GuestDetailsModal from './components/GuestDetailsModal'
import DeclineMessageModal from './components/DeclineMessageModal'
import ConfirmedModal from './components/ConfirmedModal'

export default function RsvpPage() {
  const { status, config, basePath } = useEventConfig()
  const invitees = useInviteeCount()
  const [choiceMade, setChoiceMade] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(true)
  const [showRsvpModal, setShowRsvpModal] = useState(false)
  const [showGuestDetailsModal, setShowGuestDetailsModal] = useState(false)
  const [showDeclineModal, setShowDeclineModal] = useState(false)
  const [showConfirmedModal, setShowConfirmedModal] = useState(false)

  const hasMusic = Boolean(config?.musicVideoId)
  const { playerReady, playUnmuted, pause } = useYoutubeMusic(config?.musicVideoId)

  const bgUrl = config ? basePath + config.background : null
  const invitationUrl = config ? basePath + config.invitationImage : null
  const assetsReady = useImagePreloader(config ? [bgUrl, invitationUrl] : [])

  useEffect(() => {
    if (config?.pageTitle) {
      document.title = config.pageTitle
    }
  }, [config])

  // If there's no music for this event, skip the choice screen entirely.
  useEffect(() => {
    if (status === 'ready' && !hasMusic) {
      setChoiceMade(true)
    }
  }, [status, hasMusic])

  function handleMusicChoice(wantsMusic) {
    setMusicPlaying(wantsMusic)
    if (wantsMusic) {
      playUnmuted()
    } else {
      pause()
    }
    setChoiceMade(true)
  }

  function toggleMusic() {
    const next = !musicPlaying
    setMusicPlaying(next)
    if (next) {
      playUnmuted()
    } else {
      pause()
    }
  }

  if (status === 'missing-slug' || status === 'not-found') {
    return <ErrorScreen visible />
  }

  const showMusicChoiceScreen = status === 'ready' && hasMusic && !choiceMade
  const showLoadingScreen = status === 'loading' || (choiceMade && !assetsReady)
  const showMainContent = choiceMade && assetsReady

  return (
    <>
      <MusicChoiceScreen
        visible={showMusicChoiceScreen}
        backgroundUrl={bgUrl}
        onChoose={handleMusicChoice}
      />

      <LoadingScreen visible={showLoadingScreen} />

      {/* Hidden YouTube player used as the audio source */}
      <div id="youtube-player-container">
        <div id="youtube-player"></div>
      </div>

      <MusicToggle
        visible={showMainContent && hasMusic && playerReady}
        playing={musicPlaying}
        onToggle={toggleMusic}
      />

      {/* Fixed background layer: sized to the viewport itself (not the
          content box), so it always fully covers the page regardless of
          whether the invitation content is taller or shorter than the
          screen. Content scrolls on top of this. */}
      {bgUrl && (
        <div
          className="page-background"
          style={{ backgroundImage: `url('${bgUrl}')` }}
        />
      )}

      <div
        className={`main-content ${showMainContent ? 'visible' : ''} ${(showRsvpModal || showGuestDetailsModal || showDeclineModal || showConfirmedModal) ? 'blurred' : ''}`}
      >
        {config && (
          <>
            <InvitationCard imageUrl={invitationUrl} invitees={invitees} />
            <ActionButtons
              ubicacionLink={config.ubicacionLink}
              onConfirmarClick={() => setShowRsvpModal(true)}
            />
          </>
        )}
      </div>

      {config && (
        <RsvpConfirmModal
          visible={showRsvpModal}
          onClose={() => setShowRsvpModal(false)}
          onConfirmYes={() => {
            setShowRsvpModal(false)
            setShowGuestDetailsModal(true)
          }}
          onConfirmNo={() => {
            setShowRsvpModal(false)
            setShowDeclineModal(true)
          }}
          deadlineText={config.rsvpDeadline}
        />
      )}

      {config && (
        <GuestDetailsModal
          visible={showGuestDetailsModal}
          onClose={() => setShowGuestDetailsModal(false)}
          maxGuests={invitees}
          onConfirm={(data) => {
            // Submission behavior (where this data goes) is defined later.
            console.log('RSVP guest details submitted:', data)
            setShowGuestDetailsModal(false)
            setShowConfirmedModal(true)
          }}
        />
      )}

      {config && (
        <DeclineMessageModal
          visible={showDeclineModal}
          onClose={() => setShowDeclineModal(false)}
          onSubmit={(data) => {
            // Submission behavior (where this data goes) is defined later.
            console.log('Decline message submitted:', data)
          }}
        />
      )}

      <ConfirmedModal visible={showConfirmedModal} />
    </>
  )
}