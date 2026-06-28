'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const NAV = [
  { href: '/',        label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/about',   label: 'About' },
  { href: '/enrol',   label: 'Enrol' },
]

export function HeaderNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const linkStyle = (href: string): React.CSSProperties => ({
    fontFamily: 'var(--font-ui)',
    fontSize: 14,
    fontWeight: pathname === href ? 600 : 500,
    color: pathname === href ? 'var(--orange)' : 'var(--ink)',
    textDecoration: 'none',
  })

  return (
    <>
      {/* Desktop: inline links */}
      <nav className="desktop-only" style={{ display: 'flex', gap: 28 }}>
        {NAV.map((l) => (
          <Link key={l.href} href={l.href} style={linkStyle(l.href)}>{l.label}</Link>
        ))}
      </nav>

      {/* Mobile: hamburger + dropdown */}
      <div className="mobile-only" style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={open}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, background: 'transparent', border: 0, color: 'var(--ink)', cursor: 'pointer' }}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        {open && (
          <div style={{
            position: 'absolute', right: 0, top: 'calc(100% + 10px)',
            background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: 14,
            boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column',
            minWidth: 180, padding: 8, zIndex: 60,
          }}>
            {NAV.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{ ...linkStyle(l.href), padding: '12px 14px', borderRadius: 8 }}>
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
