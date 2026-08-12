'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

function getSessionId() {
  const key = 'to_sid'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(key, id)
  }
  return id
}

// First-party pageview ping for the admin analytics dashboard — no cookies,
// no third-party requests. sessionId lives in sessionStorage only.
export function AnalyticsTracker() {
  const pathname = usePathname()
  const lastPath = useRef<string | null>(null)

  useEffect(() => {
    if (lastPath.current === pathname) return
    lastPath.current = pathname

    const body = JSON.stringify({
      path: pathname,
      referrer: document.referrer || null,
      sessionId: getSessionId(),
    })

    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/track', new Blob([body], { type: 'application/json' }))
    } else {
      fetch('/api/analytics/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true })
    }
  }, [pathname])

  return null
}
