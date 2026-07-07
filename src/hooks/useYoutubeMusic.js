import { useEffect, useRef, useState } from 'react'

// Loads the YouTube IFrame API once, creates a hidden 1x1 player for the
// given videoId (muted + autoplaying so it's primed and ready), and exposes
// simple play/pause/mute controls driven by explicit user taps (so audio
// unmuting always happens inside a real click handler, which browsers allow).
export function useYoutubeMusic(videoId) {
  const playerRef = useRef(null)
  const [playerReady, setPlayerReady] = useState(false)

  useEffect(() => {
    if (!videoId) return

    let cancelled = false

    function createPlayer() {
      if (cancelled) return
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '1',
        width: '1',
        videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: videoId,
          playsinline: 1,
          disablekb: 1,
          modestbranding: 1,
        },
        events: {
          onReady: (e) => {
            e.target.mute()
            e.target.playVideo()
            setPlayerReady(true)
          },
        },
      })
    }

    if (window.YT && window.YT.Player) {
      createPlayer()
    } else {
      const existingScript = document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
      if (!existingScript) {
        const script = document.createElement('script')
        script.src = 'https://www.youtube.com/iframe_api'
        document.body.appendChild(script)
      }
      const previousCallback = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback()
        createPlayer()
      }
    }

    return () => {
      cancelled = true
    }
  }, [videoId])

  function playUnmuted() {
    if (playerRef.current) {
      playerRef.current.unMute()
      playerRef.current.playVideo()
    }
  }

  function pause() {
    if (playerRef.current) {
      playerRef.current.pauseVideo()
    }
  }

  return { playerReady, playUnmuted, pause }
}
