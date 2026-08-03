'use client'

import { useEffect, useState } from 'react'

function greetingForHour(hour: number): string {
  if (hour < 5)  return 'Good night'
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

// Starts with a neutral greeting (matches the server-rendered markup) and
// swaps in a time-of-day greeting once mounted, using the visitor's clock.
export function DashboardGreeting({ name }: { name: string | null }) {
  const [greeting, setGreeting] = useState('Hello')

  useEffect(() => {
    // Deliberately deferred to a client-only effect: the visitor's local hour
    // isn't known during SSR, so computing it inline would mismatch on hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGreeting(greetingForHour(new Date().getHours()))
  }, [])

  return <>{greeting}{name ? `, ${name}` : ''}!</>
}
