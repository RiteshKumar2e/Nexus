import { useEffect } from 'react'

export function useDocumentTitle(title) {
  useEffect(() => {
    const previous = document.title
    document.title = title ? `${title} — NEXUS` : 'NEXUS — Adaptive Intelligence for Disaster Response'
    return () => {
      document.title = previous
    }
  }, [title])
}
