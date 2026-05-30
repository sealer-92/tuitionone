'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './Button'

const NAV = [
  { href: '/',        label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/about',   label: 'About' },
  { href: '/enrol',   label: 'Enrol' },
]

export function Header() {
  const pathname = usePathname()
  const dark = pathname === '/'

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: dark ? 'rgba(31, 54, 45, 0.88)' : 'rgba(251, 247, 239, 0.92)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(27,42,36,0.08)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '14px var(--container-pad)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>

        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, border: 0, textDecoration: 'none' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Image src="/tuition-one-logo.png" alt="Tuition One" width={36} height={36} style={{ objectFit: 'contain' }} />
          </div>
          <div style={{ fontFamily: 'var(--font-ui)', fontWeight: 800, fontSize: 15, letterSpacing: '0.06em', color: dark ? 'var(--chalk)' : 'var(--ink)', lineHeight: 1.05 }}>
            TUITION ONE
            <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--leaf)', letterSpacing: '0.22em', marginTop: 2 }}>GRINDS</div>
          </div>
        </Link>

        <nav style={{ display: 'flex', gap: 28 }}>
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 14,
              fontWeight: pathname === l.href ? 600 : 500,
              color: pathname === l.href ? 'var(--orange)' : dark ? 'var(--chalk)' : 'var(--ink)',
              border: 0,
              textDecoration: 'none',
            }}>
              {l.label}
            </Link>
          ))}
        </nav>

        <Button variant="primary" size="md" href="/enrol">Enrol now</Button>
      </div>
    </header>
  )
}
