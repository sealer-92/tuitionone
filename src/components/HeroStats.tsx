const STATS = [
  { value: '10+',      label: 'years teaching experience' },
  { value: '€150',     label: 'from, per course' },
  { value: 'Anytime',  label: 'learn at your own pace' },
]

// Sits directly beneath the hero as its plinth — carries the credibility
// numbers that used to live inside the hero copy.
export function HeroStats() {
  return (
    <section className="stats-strip">
      <div className="stats-strip-inner">
        {STATS.map((s) => (
          <div key={s.label} className="stats-strip-item">
            <div className="stats-strip-value">{s.value}</div>
            <div className="stats-strip-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
