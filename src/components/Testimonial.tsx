'use client'

import { useState } from 'react'
import { Star, ArrowLeft, ArrowRight } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: "Jack's mum",
    initials: 'J',
    avatarBg: '#C97529',
    quote: "I would highly recommend Paul for maths grinds. Jack said it all made sense with Paul — he explained everything and gave him notes from each session. Jack found the Leaving Cert paper much easier after grinds and did very well. It has made a big difference to his overall LC points.",
  },
  {
    name: 'Ava',
    initials: 'A',
    avatarBg: '#2C4B3F',
    quote: "Thank you so much for all your help. I'm delighted with my results. I wouldn't have been able to do it without you.",
  },
  {
    name: "Charlie's dad",
    initials: 'C',
    avatarBg: '#5C8A4E',
    quote: "Charlie got an H4 in his maths — he is delighted, as he failed the mocks. Thanks so much for everything you did with him.",
  },
  {
    name: "Morgan's mum",
    initials: 'M',
    avatarBg: '#486C8A',
    quote: "Thank you for all the help you have given Morgan the last few weeks. It's been a great help to him. Please keep him on the list for September. Take care, and have a lovely summer.",
  },
  {
    name: "Kayla's mum",
    initials: 'K',
    avatarBg: '#B5483C',
    quote: "Look at this for a result — Kayla is bawling with joy, she's shaking, she can't believe it. Thank you so much for taking her in for grinds. I'm absolutely over the moon.",
  },
]

// Fixed card tints by visible position (echoes the inspiration's coloured trio)
const CARD_TINTS = ['#E4ECDE', '#F7E8CF', '#ECE2D2']

function Avatar({ initials, bg }: { initials: string; bg: string }) {
  return (
    <div aria-hidden="true" style={{
      width: 46, height: 46, borderRadius: '50%', background: bg,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: 17, color: '#fff', userSelect: 'none',
    }}>
      {initials}
    </div>
  )
}

function Stars() {
  return (
    <div style={{ display: 'flex', gap: 3 }} aria-label="Five out of five stars">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={16} fill="var(--orange)" color="var(--orange)" strokeWidth={0} />
      ))}
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
      {direction === 'left' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
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
      <div className="testimonial-row">
        <div className="testimonial-arrow-slot">
          <ArrowButton direction="left" onClick={prev} />
        </div>

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
                background: CARD_TINTS[idx],
                borderRadius: 'var(--radius-lg)',
                padding: '30px 30px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
              }}
            >
              <Stars />
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.62,
                color: 'var(--ink)', margin: 0, flex: 1,
              }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13, paddingTop: 4 }}>
                <Avatar initials={t.initials} bg={t.avatarBg} />
                <div style={{
                  fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17,
                  color: 'var(--ink)', letterSpacing: '-0.01em',
                }}>
                  {t.name}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="testimonial-arrow-slot">
          <ArrowButton direction="right" onClick={next} />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 32 }}>
        <div className="testimonial-arrow-mobile">
          <ArrowButton direction="left" onClick={prev} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStart(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              style={{
                width: i === start ? 22 : 8, height: 8, borderRadius: 999,
                border: 0, cursor: 'pointer', padding: 0,
                background: i === start ? 'var(--orange)' : 'var(--border-strong)',
                transition: 'width 200ms var(--ease), background 200ms var(--ease)',
              }}
            />
          ))}
        </div>
        <div className="testimonial-arrow-mobile">
          <ArrowButton direction="right" onClick={next} />
        </div>
      </div>
    </div>
  )
}
