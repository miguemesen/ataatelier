import { useEffect, useState } from 'react'

// Reads ?e=<slug> from the URL and fetches that event's config.json from
// /events/<slug>/config.json. Returns { status, config, error, slug, basePath }.
// status is one of: 'loading' | 'ready' | 'missing-slug' | 'not-found'
export function useEventConfig() {
  const [state, setState] = useState({
    status: 'loading',
    config: null,
    slug: null,
    basePath: null,
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const slug = params.get('e')

    if (!slug) {
      setState({ status: 'missing-slug', config: null, slug: null, basePath: null })
      return
    }

    const basePath = `/events/${slug}/`

    let cancelled = false

    fetch(basePath + 'config.json')
      .then((res) => {
        if (!res.ok) throw new Error('Config not found')
        return res.json()
      })
      .then((config) => {
        if (!cancelled) {
          setState({ status: 'ready', config, slug, basePath })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ status: 'not-found', config: null, slug, basePath })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return state
}
