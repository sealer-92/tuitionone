import { ReactNode } from 'react'
import { LEGAL } from '@/lib/legal'

export interface LegalSection {
  id: string
  heading: string
  body: ReactNode
}

interface LegalPageProps {
  title: string
  intro: string
  sections: LegalSection[]
}

export function LegalPage({ title, intro, sections }: LegalPageProps) {
  return (
    <section style={{ background: 'var(--cream)', padding: 'clamp(48px, 7vw, 88px) var(--container-pad) clamp(64px, 9vw, 112px)' }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 600,
          fontSize: 'clamp(34px, 5.5vw, 56px)', lineHeight: 1.05, letterSpacing: '-0.02em',
          color: 'var(--ink)', margin: 0,
        }}>
          {title}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.6, color: 'var(--fg-2)', margin: '18px 0 0' }}>
          {intro}
        </p>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)', margin: '14px 0 0' }}>
          Last updated {LEGAL.lastUpdated}
        </p>

        <nav
          aria-label="On this page"
          style={{ background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px', margin: '36px 0 40px' }}
        >
          <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--orange-deep)', marginBottom: 12 }}>
            On this page
          </div>
          <ul className="legal-toc">
            {sections.map((s, i) => (
              <li key={s.id}><a href={`#${s.id}`}>{i + 1}. {s.heading}</a></li>
            ))}
          </ul>
        </nav>

        <div className="legal-prose">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id}>
              <h2>{i + 1}. {s.heading}</h2>
              {s.body}
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}

// Shared closing block: how to reach a human. Stripe's review looks for these
// details to be visible, so every legal page ends with them.
export function LegalContact() {
  return (
    <>
      <p>
        <strong>{LEGAL.tradingName}</strong><br />
        Email: <a href={`mailto:${LEGAL.email}`}>{LEGAL.email}</a><br />
        Instagram: <a href={LEGAL.instagramUrl}>{LEGAL.instagram}</a>
        {LEGAL.postalAddress && <><br />Post: {LEGAL.postalAddress}</>}
      </p>
      <p>We aim to reply to every message within {LEGAL.responseDays} working days.</p>
    </>
  )
}
