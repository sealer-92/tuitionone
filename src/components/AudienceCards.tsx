'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

const CARDS = [
  {
    tag: 'Video lessons',
    title: 'Watch every step',
    body: 'Topic-by-topic walkthroughs of past exam questions — the method and the strategy, not just the final answer.',
    href: '/courses',
    art: 'exam',
  },
  {
    tag: 'Self-paced',
    title: 'Pause, rewind, revisit',
    body: 'Every topic is broken into clear, short lessons you can replay as many times as you need until it clicks.',
    href: '/courses',
    art: 'foundation',
  },
  {
    tag: 'Anywhere',
    title: 'Study on your terms',
    body: 'Access your course videos anytime, on any device, and learn at a pace that suits you.',
    href: '/courses',
    art: 'start',
  },
]

const ORANGE_SOFT = '#F0B97A'
const PAPER = '#F5EFE4'
const LEAF = '#5C8A4E'

function CardArt({ kind }: { kind: string }) {
  const common = { opacity: 0.9 }
  if (kind === 'foundation') {
    return (
      <svg viewBox="0 0 120 90" width="110" height="82" aria-hidden="true" style={common}>
        <rect x="20" y="52" width="80" height="14" rx="3" fill={PAPER} opacity="0.9" />
        <rect x="30" y="38" width="60" height="14" rx="3" fill={ORANGE_SOFT} />
        <rect x="42" y="24" width="36" height="14" rx="3" fill={PAPER} opacity="0.9" />
        <circle cx="60" cy="16" r="6" fill={LEAF} />
      </svg>
    )
  }
  if (kind === 'exam') {
    return (
      <svg viewBox="0 0 120 90" width="110" height="82" aria-hidden="true" style={common}>
        <rect x="30" y="14" width="60" height="62" rx="6" fill={PAPER} opacity="0.92" />
        <rect x="40" y="26" width="40" height="4" rx="2" fill={LEAF} />
        <rect x="40" y="36" width="40" height="4" rx="2" fill="#3F6A35" opacity="0.5" />
        <rect x="40" y="46" width="28" height="4" rx="2" fill="#3F6A35" opacity="0.5" />
        <path d="M58 60 l6 6 l12 -14" stroke={ORANGE_SOFT} strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 120 90" width="110" height="82" aria-hidden="true" style={common}>
      <path d="M20 70 L60 20 L100 70 Z" fill="none" stroke={PAPER} strokeWidth="4" strokeLinejoin="round" opacity="0.9" />
      <circle cx="60" cy="70" r="7" fill={ORANGE_SOFT} />
      <path d="M60 20 L60 63" stroke={LEAF} strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

function Card({ card, hover, dimmed, onEnter, onLeave }: {
  card: typeof CARDS[0]
  hover: boolean
  dimmed: boolean
  onEnter: () => void
  onLeave: () => void
}) {
  return (
    <Link
      href={card.href}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      style={{
        display: 'flex', flexDirection: 'column',
        background: hover
          ? 'linear-gradient(165deg, var(--chalkboard-light) 0%, var(--chalkboard) 100%)'
          : 'linear-gradient(165deg, var(--chalkboard) 0%, var(--chalkboard-deep) 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px 30px 28px',
        minHeight: 320,
        textDecoration: 'none',
        border: hover ? '1px solid rgba(240,185,122,0.55)' : '1px solid rgba(245,239,228,0.08)',
        boxShadow: hover ? '0 28px 56px -18px rgba(0,0,0,0.5)' : '0 8px 24px -14px rgba(28,42,36,0.35)',
        transform: hover ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        opacity: dimmed ? 0.55 : 1,
        transition: 'transform 220ms var(--ease), border-color 220ms var(--ease), box-shadow 220ms var(--ease), opacity 220ms var(--ease), background 220ms var(--ease)',
      }}
    >
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--orange-soft)' }}>
        {card.tag}
      </div>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 27, color: 'var(--chalk)', margin: '14px 0 0', letterSpacing: '-0.01em' }}>
        {card.title}
      </h3>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 15.5, lineHeight: 1.6, color: 'rgba(245,239,228,0.72)', margin: '12px 0 0' }}>
        {card.body}
      </p>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: 24 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 600, color: 'var(--chalk)' }}>
          See courses
          <ArrowRight size={16} style={{ transform: hover ? 'translateX(3px)' : 'none', transition: 'transform 200ms var(--ease)' }} />
        </span>
        <CardArt kind={card.art} />
      </div>
    </Link>
  )
}

export function AudienceCards() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
      {CARDS.map((c, i) => (
        <Card
          key={c.tag}
          card={c}
          hover={hoveredIdx === i}
          dimmed={hoveredIdx !== null && hoveredIdx !== i}
          onEnter={() => setHoveredIdx(i)}
          onLeave={() => setHoveredIdx(null)}
        />
      ))}
    </div>
  )
}
