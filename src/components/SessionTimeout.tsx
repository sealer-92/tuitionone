'use client'

import { useEffect, useRef } from 'react'
import { signOut } from 'next-auth/react'

const IDLE_LIMIT_MS = 60 * 60 * 1000 // 1 hour
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'] as const

// Signs the student out after an hour with no mouse/keyboard/touch activity.
export function SessionTimeout() {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    function reset() {
      clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        signOut({ redirectTo: '/auth/signin' })
      }, IDLE_LIMIT_MS)
    }

    ACTIVITY_EVENTS.forEach((e) => window.addEventListener(e, reset))
    reset()

    return () => {
      ACTIVITY_EVENTS.forEach((e) => window.removeEventListener(e, reset))
      clearTimeout(timer.current)
    }
  }, [])

  return null
}
