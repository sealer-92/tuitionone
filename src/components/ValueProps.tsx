import { Award, ClipboardCheck, Target } from 'lucide-react'

const items = [
  { icon: <Award size={22} />, title: '10+ years in the classroom', body: 'Over a decade helping hundreds of students build confidence and hit their goals in the Leaving Cert and Junior Cycle.' },
  { icon: <ClipboardCheck size={22} />, title: 'Exam insight from the inside', body: 'An SEC exam supervisor and corrector who knows how papers are designed, how marking schemes work, and what earns top marks.' },
  { icon: <Target size={22} />, title: 'Built to win marks', body: 'Every video and booklet targets the topics that matter, the mistakes students make, and the techniques that earn marks.' },
]

export function ValueProps() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
      {items.map((it, i) => (
        <div key={i} style={{
          display: 'flex', flexDirection: 'column', gap: 16,
          background: 'var(--paper)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '32px 30px',
        }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(229,143,63,0.14)', color: 'var(--orange-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {it.icon}
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 600, color: 'var(--ink)', margin: 0, letterSpacing: '-0.01em' }}>{it.title}</h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.6, color: 'var(--fg-2)', margin: 0 }}>{it.body}</p>
        </div>
      ))}
    </div>
  )
}
