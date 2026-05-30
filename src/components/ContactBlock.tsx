'use client'

import { Mail, AtSign, MessageCircle } from 'lucide-react'
import { useState } from 'react'

const items = [
  { icon: <Mail size={20} />,        label: 'Email',     value: 'tuitiononegrinds@gmail.com', href: 'mailto:tuitiononegrinds@gmail.com' },
  { icon: <AtSign size={20} />,      label: 'Instagram', value: '@tuition_one',                href: 'https://instagram.com/tuition_one' },
  { icon: <MessageCircle size={20}/>, label: 'WhatsApp', value: '087 069 2287',                href: 'https://wa.me/353870692287' },
]

function ContactTile({ item, dark }: { item: typeof items[0]; dark?: boolean }) {
  const [hover, setHover] = useState(false)

  const card: React.CSSProperties = dark
    ? { background: 'var(--chalkboard-deep)', border: hover ? '1px solid var(--orange)' : '1px solid rgba(255,255,255,0.10)', color: 'var(--chalk)' }
    : { background: 'white',                  border: hover ? '1px solid var(--orange)' : '1px solid var(--border)',           color: 'var(--ink)' }

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        textDecoration: 'none',
        ...card,
        borderRadius: 14,
        padding: '22px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'transform 120ms ease, border-color 120ms ease',
      }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, background: dark ? 'rgba(229,143,63,0.18)' : 'rgba(229,143,63,0.14)', color: dark ? 'var(--orange-soft)' : 'var(--orange-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {item.icon}
      </div>
      <div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: dark ? 'rgba(245,239,228,0.55)' : 'var(--fg-3)' }}>{item.label}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: dark ? 'var(--chalk)' : 'var(--ink)', marginTop: 2 }}>{item.value}</div>
      </div>
    </a>
  )
}

export function ContactBlock({ dark }: { dark?: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      {items.map((it) => <ContactTile key={it.label} item={it} dark={dark} />)}
    </div>
  )
}
