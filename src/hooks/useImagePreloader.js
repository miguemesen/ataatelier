import { useEffect, useState } from 'react'

// Preloads a list of image URLs and reports true once all have
// finished loading (success or error — we don't want a broken image
// to block the invitation from ever appearing).
export function useImagePreloader(urls) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!urls || urls.length === 0) {
      setReady(true)
      return
    }

    let cancelled = false
    let loadedCount = 0

    function onDone() {
      loadedCount += 1
      if (loadedCount >= urls.length && !cancelled) {
        setReady(true)
      }
    }

    urls.forEach((src) => {
      const img = new Image()
      img.onload = onDone
      img.onerror = onDone
      img.src = src
    })

    // Safety fallback in case something hangs
    const fallback = setTimeout(() => {
      if (!cancelled) setReady(true)
    }, 6000)

    return () => {
      cancelled = true
      clearTimeout(fallback)
    }
  }, [urls])

  return ready
}
