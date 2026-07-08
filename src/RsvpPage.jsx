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

export default function RsvpPage() {
  const { status, config, basePath } = useEventConfig()
  const invitees = useInviteeCount()
  const [choiceMade, setChoiceMade] = useState(false)
  const [musicPlaying, setMusicPlaying] = useState(true)
  const [showRsvpModal, setShowRsvpModal] = useState(false)

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

      <div
        className={`main-content ${showMainContent ? 'visible' : ''} ${showRsvpModal ? 'blurred' : ''}`}
        style={bgUrl ? { backgroundImage: `url('${bgUrl}')` } : undefined}
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
          confirmarLink={config.confirmarLink}
          declineLink={config.declineLink}
          deadlineText={config.rsvpDeadline}
        />
      )}
    </>
  )
}