'use client'

import { useState } from 'react'

const TESTIMONIALS = [
  {
    name: 'Aoife M.',
    initials: 'AM',
    avatarBg: '#E58F3F',
    quote: "Our daughter went from a worried C in Higher Maths to a comfortable B+ in just one term. The class is small, the workbook is brilliant, and she actually looks forward to Saturdays now.",
    label: '6th Year · Higher Maths',
  },
  {
    name: 'Ciarán D.',
    initials: 'CD',
    avatarBg: '#2C4B3F',
    quote: "The one-to-one attention in such a small group made all the difference. My son finally understood topics that had confused him for two years — his confidence is completely transformed.",
    label: '6th Year · Higher Maths',
  },
  {
    name: 'Siobhán K.',
    initials: 'SK',
    avatarBg: '#5C8A4E',
    quote: "We tried two other grinds services before finding TuitionOne. The structured workbooks and the Saturday routine kept her on track all year. I can't recommend them highly enough.",
    label: '5th Year · Higher Maths',
  },
  {
    name: "Rían O'B.",
    initials: 'RO',
    avatarBg: '#486C8A',
    quote: "My teacher at school covers the material too fast. Here I could ask questions and get real answers. Best decision we made for the Leaving Cert — wish I had found it sooner.",
    label: '6th Year · Higher Maths',
  },
  {
    name: 'Niamh F.',
    initials: 'NF',
    avatarBg: '#C97529',
    quote: "I went from dreading the exam to actually enjoying problem-solving. The small class means you can't hide — in the best way. I feel genuinely prepared now.",
    label: '5th Year · Higher Maths',
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
        fontSize: 14,
        color: '#fff',
        letterSpacing: '0.04em',
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
              <div>
                <div style={{
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 700,
                  fontSize: 14,
                  color: 'var(--ink)',
                }}>
                  {t.name}
                </div>
                <div style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: 13,
                  color: 'var(--fg-2)',
                  marginTop: 2,
                }}>
                  {t.label}
                </div>
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
