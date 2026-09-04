'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const VIDEO_SRC =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4'

const SCRUB_SENSITIVITY = 0.8

const TYPED_TEXT =
  'Glad you stopped by. Pick your subject, learn at your own pace. What are we studying today?'

const CONTACT_EMAIL = 'tuitiononegrinds@gmail.com'

const PILLS = [
  { label: 'Browse the courses',      href: '/courses' },
  { label: 'Start learning',          href: '/enrol'   },
  { label: 'See how it works',        href: '/about'   },
  { label: 'Questions? Read the FAQs', href: '/faq'    },
]

const MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function subscribeToMotionPreference(onChange: () => void) {
  const mq = window.matchMedia(MOTION_QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia(MOTION_QUERY).matches,
    () => false,
  )
}

// Reveals `text` one character at a time after `startDelay`, so the line reads
// as if it's being typed rather than appearing all at once.
function useTypewriter(text: string, speed = 38, startDelay = 600) {
  const [count, setCount] = useState(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return

    let interval: ReturnType<typeof setInterval>
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            clearInterval(interval)
            return c
          }
          return c + 1
        })
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [text, speed, startDelay, reduced])

  const shown = reduced ? text.length : count
  return { displayed: text.slice(0, shown), done: shown >= text.length }
}

export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const targetTime = useRef(0)
  const seeking = useRef(false)
  const prevX = useRef<number | null>(null)

  const { displayed, done } = useTypewriter(TYPED_TEXT)
  const [pillsIn, setPillsIn] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setPillsIn(true), 400)
    return () => clearTimeout(t)
  }, [])

  // Horizontal mouse movement scrubs the clip. Without a mouse there's nothing
  // to scrub with, so the video just loops instead of freezing on frame one.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (!window.matchMedia('(pointer: fine)').matches) {
      video.loop = true
      video.play().catch(() => {})
      return
    }

    const seek = () => {
      seeking.current = true
      video.currentTime = targetTime.current
    }

    const onLoadedMetadata = () => { seek() }

    const onSeeked = () => {
      seeking.current = false
      if (Math.abs(video.currentTime - targetTime.current) > 0.01) seek()
    }

    const onMouseMove = (e: MouseEvent) => {
      if (prevX.current === null) {
        prevX.current = e.clientX
        return
      }
      const delta = e.clientX - prevX.current
      prevX.current = e.clientX

      const duration = video.duration
      if (!duration || Number.isNaN(duration)) return

      const offset = (delta / window.innerWidth) * SCRUB_SENSITIVITY * duration
      targetTime.current = Math.min(Math.max(targetTime.current + offset, 0), duration)

      if (!seeking.current) seek()
    }

    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('seeked', onSeeked)
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    if (video.readyState >= 1) onLoadedMetadata()

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('seeked', onSeeked)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard is unavailable on insecure origins — the address is on screen anyway.
    }
  }

  const pillBase: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--radius-pill)',
    fontFamily: 'var(--font-ui)',
    fontSize: 'clamp(13px, 1.6vw, 15px)',
    fontWeight: 500,
    lineHeight: 1.4,
    padding: '0.5em 1.15em',
    margin: '0 0.2em 0.4em 0',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    transition: 'background 200ms var(--ease), color 200ms var(--ease)',
  }

  return (
    <section className="hero-shell">
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: '70% center',
          zIndex: 0,
        }}
      />

      {/* Chalkboard wash: keeps the footage on-brand and the copy readable
          whichever frame the scrub lands on. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          backgroundImage:
            'radial-gradient(at 12% 78%, rgba(229,143,63,0.22) 0, transparent 55%), linear-gradient(100deg, var(--chalkboard-deep) 0%, rgba(31,54,45,0.80) 42%, rgba(44,75,63,0.40) 100%)',
        }}
      />

      <div className="hero-copy">
        <div
          aria-hidden="true"
          style={{
            pointerEvents: 'none',
            userSelect: 'none',
            marginBottom: 'clamp(20px, 3vw, 24px)',
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: 1.3,
            fontWeight: 400,
            color: 'var(--chalk)',
            filter: 'blur(4px)',
          }}
        >
          Hey there — welcome to Tuition One,<br />
          exam prep from a teacher who marks the papers.
        </div>

        <p
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--chalk)',
            marginBottom: 'clamp(20px, 3vw, 24px)',
            fontSize: 'clamp(18px, 4vw, 26px)',
            lineHeight: 1.35,
            fontWeight: 400,
            minHeight: 54,
          }}
        >
          <span className="hero-typed" aria-hidden="true">{displayed}</span>
          <span className="sr-only">{TYPED_TEXT}</span>
          {!done && (
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                width: 2,
                height: '1.1em',
                background: 'var(--orange-soft)',
                verticalAlign: 'middle',
                marginLeft: 2,
                animation: 'blink 1s step-end infinite',
              }}
            />
          )}
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            opacity: pillsIn ? 1 : 0,
            transform: pillsIn ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          {PILLS.map((pill) => (
            <Link key={pill.href} href={pill.href} className="hero-pill" style={pillBase}>
              {pill.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={copyEmail}
            className="hero-pill-outline"
            style={{ ...pillBase, gap: 'clamp(8px, 1.5vw, 12px)', border: 0 }}
          >
            <span>
              Reach us:{' '}
              <span style={{ textDecoration: 'underline', textUnderlineOffset: 1 }}>{CONTACT_EMAIL}</span>
            </span>
            <span style={{ display: 'inline-flex', width: 12, height: 12, flexShrink: 0 }}>
              {copied ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M1.5 6.5 L4.5 9.5 L10.5 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <rect x="0.6" y="0.6" width="7.3" height="7.3" rx="1.3" stroke="currentColor" strokeWidth="1.1" />
                  <rect x="4.1" y="4.1" width="7.3" height="7.3" rx="1.3" stroke="currentColor" strokeWidth="1.1" />
                </svg>
              )}
            </span>
            <span className="sr-only" aria-live="polite">
              {copied ? 'Email address copied' : ''}
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}
