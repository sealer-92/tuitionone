import { Button } from './Button'
import { ArrowRight } from 'lucide-react'

const PAPER       = '#F5EFE4'
const ORANGE      = '#E58F3F'
const ORANGE_SOFT = '#F0B97A'
const ORANGE_DEEP = '#C97529'
const LEAF        = '#5C8A4E'
const LEAF_DEEP   = '#3F6A35'
const SAGE        = '#C2A98A'
const SAGE_SOFT   = '#DCC9B0'
const INK         = '#1B2A24'
const DARK        = '#1F362D'

const STATS = [
  { value: '10+', label: 'years teaching experience' },
  { value: '€150', label: 'from, per course' },
  { value: 'Anytime', label: 'learn at your own pace' },
]

export function Hero() {
  return (
    <section style={{
      backgroundImage: 'radial-gradient(at 20% 18%, rgba(255,255,255,0.06) 0, transparent 42%), radial-gradient(at 84% 82%, rgba(0,0,0,0.20) 0, transparent 55%), linear-gradient(180deg, var(--chalkboard) 0%, var(--chalkboard-deep) 100%)',
      color: 'var(--chalk)',
      padding: 'clamp(56px, 8vw, 104px) var(--container-pad)',
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(40px, 5vw, 72px)', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', color: 'var(--orange-soft)', marginBottom: 22 }}>
            Expert online exam preparation
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(44px, 6vw, 74px)', lineHeight: 1.0, letterSpacing: '-0.025em', color: 'var(--chalk)', margin: 0 }}>
            Learn the method.<br />
            <span style={{ fontStyle: 'italic', color: 'var(--orange-soft)' }}>Master the exam.</span>
          </h1>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(17px, 2vw, 19px)', lineHeight: 1.6, color: 'rgba(245,239,228,0.82)', marginTop: 24, maxWidth: 520 }}>
            Structured online courses for the <b style={{ color: 'white', fontWeight: 600 }}>Leaving Certificate</b> and <b style={{ color: 'white', fontWeight: 600 }}>Junior Cycle</b> — video lessons, topic-by-topic exam walkthroughs and course booklets that build confidence and maximise your results.
          </p>

          <div style={{ display: 'flex', gap: 12, marginTop: 34, flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" href="/enrol" icon={<ArrowRight size={16} />}>
              Start learning
            </Button>
            <Button variant="secondary" size="lg" onDark href="/courses">
              Browse courses
            </Button>
          </div>

          <div className="hero-stats" style={{ marginTop: 44 }}>
            {STATS.map((s, i) => (
              <div key={s.label} className="hero-stat hero-stat-left" style={{ borderLeft: i === 0 ? 'none' : '1px solid rgba(245,239,228,0.16)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(30px, 4vw, 40px)', lineHeight: 1, color: 'var(--orange-soft)', letterSpacing: '-0.02em' }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 13.5, color: 'rgba(245,239,228,0.7)', marginTop: 10 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Illustration */}
        <div style={{ position: 'relative', width: '100%', maxWidth: 520, margin: '0 auto' }}>
          <svg viewBox="0 0 500 460" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }} role="img" aria-label="Illustration of a calculator, notebook, ruler, pencil and chemistry flask">
            <g transform="rotate(-7 380 110)">
              <rect x="280" y="20" width="200" height="240" rx="6" fill={PAPER} />
              <rect x="280" y="20" width="200" height="22" fill={ORANGE} />
              {[0,1,2,3,4,5,6,7,8,9].map((i) => (
                <line key={i} x1="296" y1={64 + i * 20} x2="464" y2={64 + i * 20} stroke={LEAF} strokeWidth="1" opacity="0.45" />
              ))}
              <line x1="320" y1="42" x2="320" y2="260" stroke={ORANGE_DEEP} strokeWidth="1.5" opacity="0.55" />
              {[0,1,2,3,4,5].map((i) => (
                <circle key={i} cx={293} cy={36 + i * 38} r="3" fill={DARK} opacity="0.35" />
              ))}
            </g>

            <g transform="rotate(-4 250 410)">
              <rect x="20" y="388" width="460" height="44" rx="3" fill={SAGE} />
              <rect x="20" y="388" width="460" height="6" fill={SAGE_SOFT} opacity="0.7" />
              {Array.from({ length: 23 }).map((_, i) => {
                const x = 40 + i * 20
                const tall = i % 2 === 0
                return <line key={i} x1={x} y1="388" x2={x} y2={tall ? 405 : 398} stroke={INK} strokeWidth="1.4" opacity="0.6" />
              })}
              {[0,2,4,6,8,10,12,14,16,18,20].map((n, i) => (
                <text key={n} x={40 + i * 40} y="424" textAnchor="middle" fontFamily="var(--font-ui)" fontWeight="700" fontSize="11" fill={INK} opacity="0.65">{n}</text>
              ))}
            </g>

            <g transform="rotate(-22 250 230)">
              <rect x="44" y="216" width="32" height="34" rx="4" fill={ORANGE_SOFT} />
              <rect x="76" y="216" width="22" height="34" fill={LEAF} />
              <rect x="76" y="224" width="22" height="2" fill={LEAF_DEEP} />
              <rect x="76" y="240" width="22" height="2" fill={LEAF_DEEP} />
              <rect x="98" y="216" width="284" height="34" fill={ORANGE} />
              <rect x="98" y="218" width="284" height="6" fill={ORANGE_SOFT} opacity="0.6" />
              <polygon points="382,216 422,233 382,250" fill={SAGE_SOFT} />
              <polygon points="422,233 408,228 408,238" fill={INK} />
            </g>

            <g transform="rotate(5 240 235)">
              <rect x="110" y="124" width="208" height="244" rx="16" fill={DARK} opacity="0.25" />
              <rect x="104" y="116" width="208" height="244" rx="16" fill={ORANGE} />
              <text x="208" y="142" textAnchor="middle" fontFamily="var(--font-ui)" fontWeight="800" fontSize="10" letterSpacing="2" fill={PAPER} opacity="0.85">TUITION ONE</text>
              <rect x="124" y="150" width="168" height="54" rx="8" fill={DARK} />
              <rect x="124" y="150" width="168" height="14" rx="8" fill="#000" opacity="0.25" />
              <text x="282" y="190" textAnchor="end" fontFamily="ui-monospace, SF Mono, Menlo, monospace" fontWeight="600" fontSize="22" fill={LEAF} opacity="0.95">450.00</text>
              {Array.from({ length: 4 }).map((_, r) =>
                Array.from({ length: 4 }).map((_, c) => {
                  const x = 124 + c * 42
                  const y = 220 + r * 36
                  const isEquals = r === 3 && c === 3
                  const isRight  = c === 3
                  const fill = isEquals ? LEAF : isRight ? ORANGE_DEEP : PAPER
                  return <rect key={`${r}-${c}`} x={x} y={y} width="34" height="28" rx="6" fill={fill} />
                })
              )}
            </g>

            <g transform="rotate(-12 110 360)">
              <rect x="60" y="338" width="92" height="44" rx="6" fill={ORANGE_SOFT} />
              <rect x="60" y="338" width="92" height="14" fill={ORANGE} />
              <text x="106" y="370" textAnchor="middle" fontFamily="var(--font-ui)" fontWeight="700" fontSize="9" letterSpacing="1.5" fill={INK} opacity="0.6">ERASE</text>
            </g>

            <g transform="rotate(8 70 90)">
              <rect x="58" y="22" width="22" height="36" rx="3" fill={PAPER} stroke={INK} strokeWidth="2" />
              <rect x="54" y="14" width="30" height="12" rx="2" fill={ORANGE_DEEP} />
              <path d="M 50 58 L 88 58 L 108 130 Q 108 148 90 148 L 48 148 Q 30 148 30 130 Z" fill={PAPER} stroke={INK} strokeWidth="2" />
              <path d="M 38 110 L 100 110 L 104 130 Q 104 144 90 144 L 48 144 Q 34 144 34 130 Z" fill={LEAF} opacity="0.85" />
              <circle cx="58" cy="124" r="3" fill={PAPER} opacity="0.7" />
              <circle cx="74" cy="118" r="2" fill={PAPER} opacity="0.7" />
              <circle cx="86" cy="128" r="2.5" fill={PAPER} opacity="0.7" />
              <line x1="42" y1="92" x2="50" y2="92" stroke={INK} strokeWidth="1.2" opacity="0.5" />
              <line x1="42" y1="76" x2="48" y2="76" stroke={INK} strokeWidth="1.2" opacity="0.5" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  )
}
