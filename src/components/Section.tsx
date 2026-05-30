import { CSSProperties, ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  eyebrow?: string
  title?: string
  subtitle?: string
  dark?: boolean
  narrow?: boolean
  style?: CSSProperties
}

export function Section({ children, eyebrow, title, subtitle, dark, narrow, style }: SectionProps) {
  const sectionStyle: CSSProperties = {
    background: dark ? 'var(--chalkboard)' : 'transparent',
    backgroundImage: dark
      ? 'radial-gradient(at 18% 28%, rgba(255,255,255,0.05) 0, transparent 38%), radial-gradient(at 82% 72%, rgba(0,0,0,0.14) 0, transparent 50%), linear-gradient(180deg, var(--chalkboard) 0%, var(--chalkboard-deep) 100%)'
      : 'none',
    color: dark ? 'var(--chalk)' : 'var(--ink)',
    padding: 'clamp(56px, 8vw, 96px) var(--container-pad)',
    ...style,
  }

  return (
    <section style={sectionStyle}>
      <div style={{ maxWidth: narrow ? 880 : 1200, margin: '0 auto' }}>
        {(eyebrow || title || subtitle) && (
          <div style={{ marginBottom: 48 }}>
            {eyebrow && (
              <div style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 14 }}>
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.1, letterSpacing: '-0.02em', color: dark ? 'var(--chalk)' : 'var(--ink)', margin: 0, maxWidth: 720 }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.6, color: dark ? 'rgba(245,239,228,0.78)' : 'var(--fg-2)', marginTop: 16, maxWidth: 680 }}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
