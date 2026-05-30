'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/',        label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/about',   label: 'About' },
  { href: '/enrol',   label: 'Enrol' },
]

export function HeaderNav() {
  const pathname = usePathname()
  return (
    <nav style={{ display: 'flex', gap: 28 }}>
      {NAV.map((l) => (
        <Link key={l.href} href={l.href} style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 14,
          fontWeight: pathname === l.href ? 600 : 500,
          color: pathname === l.href ? 'var(--orange)' : 'var(--ink)',
          textDecoration: 'none',
        }}>
          {l.label}
        </Link>
      ))}
    </nav>
  )
}
