import { Button } from './Button'
import { ArrowRight } from 'lucide-react'

export function CtaBand() {
  return (
    <section style={{
      background: 'var(--chalkboard-deep)',
      padding: 'clamp(56px, 8vw, 96px) var(--container-pad)',
    }}>
      <div style={{
        maxWidth: 1000, margin: '0 auto',
        border: '1px solid rgba(245,239,228,0.14)',
        borderRadius: 'var(--radius-xl)',
        padding: 'clamp(44px, 7vw, 88px) clamp(24px, 5vw, 64px)',
        textAlign: 'center',
        backgroundImage: 'radial-gradient(at 50% 0%, rgba(240,185,122,0.10) 0, transparent 60%)',
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontWeight: 500,
          fontSize: 'clamp(32px, 5vw, 56px)', lineHeight: 1.05, letterSpacing: '-0.025em',
          color: 'var(--chalk)', margin: '0 auto', maxWidth: 720,
        }}>
          Master the exam, <span style={{ fontStyle: 'italic', color: 'var(--orange-soft)' }}>one topic</span> at a time
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.6,
          color: 'rgba(245,239,228,0.78)', margin: '20px auto 0', maxWidth: 540,
        }}>
          Full course access from €150, with a digital or printed booklet. Start today and learn at your own pace.
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 36, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary" size="lg" href="/enrol" icon={<ArrowRight size={16} />}>
            Start learning
          </Button>
          <Button variant="secondary" size="lg" onDark href="/courses">
            Browse courses
          </Button>
        </div>
      </div>
    </section>
  )
}
