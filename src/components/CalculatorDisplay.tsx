'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

// 43770 on a calculator: each digit stands in for the letter it resembles
// upside down — 4→H, 3→E, 7→L, 7→L, 0→O. The digits type in, swap to letters
// in place, flash three times, then start over. One cycle is 30 × 60ms = 1.8s.
const DIGITS  = '43770'
const LETTERS = 'HELLO'

const FRAME_MS = 60
const CYCLE    = 30

const TYPE_END  = 10 // 5 digits, 2 frames each
const HOLD_END  = 13
const MORPH_END = 18 // one letter per frame
const FLASH_END = 27 // 3 × (on, on, off)

function frameState(frame: number): { text: string; opacity: number } {
  if (frame < TYPE_END)  return { text: DIGITS.slice(0, Math.floor(frame / 2) + 1), opacity: 0.95 }
  if (frame < HOLD_END)  return { text: DIGITS, opacity: 0.95 }
  if (frame < MORPH_END) {
    const n = frame - HOLD_END + 1
    return { text: LETTERS.slice(0, n) + DIGITS.slice(n), opacity: 0.95 }
  }
  if (frame < FLASH_END) return { text: LETTERS, opacity: (frame - MORPH_END) % 3 === 2 ? 0.12 : 0.95 }
  return { text: '', opacity: 0.95 }
}

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

// The global prefers-reduced-motion rule in globals.css only neutralises CSS
// animation, so the timer below has to opt out itself. Server snapshot is
// false, which keeps the first client render identical to the server's.
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCED_MOTION)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  )
}

export function CalculatorDisplay({ fill }: { fill: string }) {
  const [frame, setFrame] = useState(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setFrame((f) => (f + 1) % CYCLE), FRAME_MS)
    return () => clearInterval(id)
  }, [reduced])

  const { text, opacity } = reduced ? { text: LETTERS, opacity: 0.95 } : frameState(frame)

  return (
    <text
      x="282" y="190" textAnchor="end"
      fontFamily="ui-monospace, SF Mono, Menlo, monospace"
      fontWeight="600" fontSize="22"
      fill={fill} opacity={opacity}
      aria-hidden="true"
    >
      {text}
    </text>
  )
}
