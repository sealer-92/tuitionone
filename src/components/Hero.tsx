import { Button } from './Button'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  const ORANGE      = '#E58F3F'
  const ORANGE_SOFT = '#F0B97A'
  const ORANGE_DEEP = '#C97529'
  const LEAF        = '#5C8A4E'
  const LEAF_DEEP   = '#3F6A35'
  const SAGE        = '#C2A98A'
  const SAGE_SOFT   = '#DCC9B0'
  const PAPER       = '#F5EFE4'
  const INK         = '#1B2A24'
  const DARK        = '#1F362D'

  return (
    <section style={{
      backgroundImage: 'radial-gradient(at 18% 28%, rgba(255,255,255,0.05) 0, transparent 38%), radial-gradient(at 82% 72%, rgba(0,0,0,0.18) 0, transparent 50%), linear-gradient(180deg, var(--chalkboard) 0%, var(--chalkboard-deep) 100%)',
      color: 'var(--chalk)',
      padding: 'clamp(48px, 8vw, 96px) var(--container-pad)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 18 }}>
            Now enrolling · Spring 2026
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(40px, 6vw, 64px)', lineHeight: 1.02, letterSpacing: '-0.02em', color: 'var(--chalk)', margin: 0 }}>
            Small classes.<br />
            <span style={{ color: 'var(--orange)' }}>Real progress.</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.6, color: 'rgba(245,239,228,0.82)', marginTop: 22, maxWidth: 520 }}>
            Saturday grinds in <b style={{ color: 'white' }}>Maths</b> and <b style={{ color: 'white' }}>Chemistry</b> for 5th, 6th and Junior Cycle students — taught in small groups of <b style={{ color: 'white' }}>10 or fewer</b>, at our centre in Portlaoise.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
            <Button variant="primary" size="lg" href="/enrol" icon={<ArrowRight size={16} />}>
              Enrol your child
            </Button>
            <Button variant="secondary" size="lg" onDark href="/courses">
              See course list
            </Button>
          </div>
          <div style={{ display: 'flex', gap: 32, marginTop: 40, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'rgba(245,239,228,0.65)' }}>
            <div><div style={{ color: 'var(--orange-soft)', fontSize: 26, fontWeight: 800, marginBottom: 4 }}>10</div>students max per class</div>
            <div><div style={{ color: 'var(--orange-soft)', fontSize: 26, fontWeight: 800, marginBottom: 4 }}>14–20</div>weeks per course</div>
            <div><div style={{ color: 'var(--orange-soft)', fontSize: 26, fontWeight: 800, marginBottom: 4 }}>€450</div>from</div>
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%', maxWidth: 500, margin: '0 auto' }}>
          <svg viewBox="0 0 500 460" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible' }}>
            {/* Notebook */}
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

            {/* Ruler */}
            <g transform="rotate(-4 250 410)">
              <rect x="20" y="388" width="460" height="44" rx="3" fill={SAGE} />
              <rect x="20" y="388" width="460" height="6" fill={SAGE_SOFT} opacity="0.7" />
              {Array.from({ length: 23 }).map((_, i) => {
                const x = 40 + i * 20
                const tall = i % 2 === 0
                return <line key={i} x1={x} y1="388" x2={x} y2={tall ? 405 : 398} stroke={INK} strokeWidth="1.4" opacity="0.6" />
              })}
              {[0,2,4,6,8,10,12,14,16,18,20].map((n, i) => (
                <text key={n} x={40 + i * 40} y="424" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="700" fontSize="11" fill={INK} opacity="0.65">{n}</text>
              ))}
            </g>

            {/* Pencil */}
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

            {/* Calculator */}
            <g transform="rotate(5 240 235)">
              <rect x="110" y="124" width="208" height="244" rx="16" fill={DARK} opacity="0.25" />
              <rect x="104" y="116" width="208" height="244" rx="16" fill={ORANGE} />
              <text x="208" y="142" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="800" fontSize="10" letterSpacing="2" fill={PAPER} opacity="0.85">TUITION ONE</text>
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

            {/* Eraser */}
            <g transform="rotate(-12 110 360)">
              <rect x="60" y="338" width="92" height="44" rx="6" fill={ORANGE_SOFT} />
              <rect x="60" y="338" width="92" height="14" fill={ORANGE} />
              <text x="106" y="370" textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight="700" fontSize="9" letterSpacing="1.5" fill={INK} opacity="0.6">ERASE</text>
            </g>

            {/* Chemistry flask */}
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
