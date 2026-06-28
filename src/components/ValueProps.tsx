import { Users, BookOpen, MapPin } from 'lucide-react'

const items = [
  { icon: <Users size={22} />, title: 'Max. 10 per class',    body: 'Every student gets called on, every week. No back-row passengers.' },
  { icon: <BookOpen size={22} />, title: 'Custom workbooks', body: 'Each course comes with a written-from-scratch revision book for the year.' },
  { icon: <MapPin size={22} />, title: 'Portlaoise centre',  body: 'Vision 85, Clonminam Business Park — easy parking, on the N7.' },
]

export function ValueProps() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32 }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(229,143,63,0.14)', color: 'var(--orange-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {it.icon}
          </div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{it.title}</h3>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, lineHeight: 1.55, color: 'var(--fg-2)', margin: 0 }}>{it.body}</p>
        </div>
      ))}
    </div>
  )
}
