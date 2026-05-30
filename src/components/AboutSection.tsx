import { Clock, BookOpen, Monitor, Users } from 'lucide-react'

const included = [
  { icon: <Clock size={18} />,    title: '1-hour weekly class',          body: 'Same time every Saturday, max. 10 students.' },
  { icon: <BookOpen size={18} />, title: 'Custom revision workbook',     body: 'Written and printed in-house for each course.' },
  { icon: <Monitor size={18} />,  title: 'Google Classroom resources',   body: 'Worked solutions and weekly extras between classes.' },
  { icon: <Users size={18} />,    title: 'Direct teacher access',        body: 'Email and WhatsApp questions between lessons.' },
]

export function AboutSection() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
      {/* Classroom placeholder */}
      <div style={{ position: 'relative', aspectRatio: '4/5', borderRadius: 20, overflow: 'hidden', background: 'var(--sage-tan-soft)' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, var(--sage-tan-soft) 0%, var(--sage-tan) 100%)' }} />
        <div style={{ position: 'absolute', left: '8%', top: '10%', width: '30%', padding: 16, background: 'var(--chalkboard)', borderRadius: 8, color: 'var(--chalk)', fontFamily: 'var(--font-body)', fontSize: 12, lineHeight: 1.3 }}>
          <div style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: 6, marginBottom: 6, fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.1em', color: 'var(--orange)' }}>HIGHER MATHS</div>
          ax² + bx + c = 0<br /><br />x = (−b ± √(b²−4ac)) / 2a
        </div>
        <div style={{ position: 'absolute', right: '10%', bottom: '12%', width: '44%', padding: 20, background: 'var(--paper)', borderRadius: 8, boxShadow: 'var(--shadow-md)', fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink)' }}>
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--orange-deep)', marginBottom: 6 }}>WORKBOOK · CH. 4</div>
          Solve for x:<br />
          2x² − 5x + 3 = 0<br />
          <span style={{ color: 'var(--fg-3)' }}>____________</span>
        </div>
        <div style={{ position: 'absolute', right: '4%', top: '8%', fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink)', fontWeight: 600, opacity: 0.7 }}>
          ↳ classroom placeholder
        </div>
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 14 }}>What&apos;s included</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 3.6vw, 38px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em', color: 'var(--ink)', margin: 0 }}>
          A real teacher.<br />A small class.<br />A plan for the year.
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.6, color: 'var(--fg-2)', marginTop: 20 }}>
          We keep groups small so every student gets called on, every week — and we write our own workbooks so the homework matches the lesson.
        </p>
        <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          {included.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(229,143,63,0.14)', color: 'var(--orange-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {it.icon}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{it.title}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--fg-2)', marginTop: 2, lineHeight: 1.45 }}>{it.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
