'use client'

import { useState } from 'react'

const TESTIMONIALS = [
  {
    name: "Jack's mum",
    initials: 'J',
    avatarBg: '#E58F3F',
    quote: "I would highly recommend Paul for maths grinds. Jack said it all made sense with Paul — he explained everything and gave him notes from each session which he found very helpful. Jack found the Leaving Cert maths paper much easier after grinds and did very well. It has made a big difference to his overall LC points. Much appreciated.",
  },
  {
    name: 'Ava',
    initials: 'A',
    avatarBg: '#2C4B3F',
    quote: "Hi Paul thank you so much for all your help. I'm delighted with my results. I wouldn't have been able to do it without you.",
  },
  {
    name: "Charlie's dad",
    initials: 'C',
    avatarBg: '#5C8A4E',
    quote: "Hi Paul — he got an H4 in his maths, he is delighted as he failed the mocks. Thanks so much.",
  },
  {
    name: "Morgan's mum",
    initials: 'M',
    avatarBg: '#486C8A',
    quote: "Hi Paul, thank you for all the help you have given Morgan the last few weeks. It's been a great help to him. If you can, keep him on the list for September. Take care, and have a lovely summer. Thanks, Geraldine.",
  },
  {
    name: "Kayla's mum",
    initials: 'K',
    avatarBg: '#C97529',
    quote: "Hi Paul, look at this for a result — poor Kayla is bawling with joy, she's shaking, she can't believe it. Thank you so much for taking her in for grinds. I'm absolutely over the moon.",
  },
]

function Avatar({ initials, bg }: { initials: string; bg: string }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontFamily: 'var(--font-ui)',
        fontWeight: 700,
        fontSize: 16,
        color: '#fff',
        userSelect: 'none',
      }}
    >
      {initials}
    </div>
  )
}

function ArrowButton({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === 'left' ? 'Previous testimonials' : 'Next testimonials'}
      className="testimonial-arrow-btn"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        {direction === 'left'
          ? <path d="M10 3L5 8L10 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          : <path d="M6 3L11 8L6 13" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        }
      </svg>
    </button>
  )
}

export function Testimonial() {
  const [start, setStart] = useState(0)
  const total = TESTIMONIALS.length

  const prev = () => setStart(i => (i - 1 + total) % total)
  const next = () => setStart(i => (i + 1) % total)

  const visible = [0, 1, 2].map(offset => TESTIMONIALS[(start + offset) % total])

  return (
    <div>
      <div className="testimonial-grid">
        {visible.map((t, idx) => (
          <div
            key={`${start}-${idx}`}
            className={[
              'testimonial-card',
              idx === 1 ? 'testimonial-card-2' : '',
              idx === 2 ? 'testimonial-card-3' : '',
            ].join(' ').trim()}
            style={{
              background: 'var(--paper)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: '28px 28px 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 16,
              lineHeight: 1.6,
              color: 'var(--ink)',
              margin: 0,
              flex: 1,
            }}>
              &ldquo;{t.quote}&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Avatar initials={t.initials} bg={t.avatarBg} />
              <div style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 700,
                fontSize: 14,
                color: 'var(--ink)',
              }}>
                {t.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        marginTop: 36,
      }}>
        <ArrowButton direction="left" onClick={prev} />
        <span style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 13,
          color: 'var(--fg-3)',
          minWidth: 40,
          textAlign: 'center',
        }}>
          {start + 1} / {total}
        </span>
        <ArrowButton direction="right" onClick={next} />
      </div>
    </div>
  )
}
