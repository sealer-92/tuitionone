import { CSSProperties, ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  eyebrow?: string
  eyebrowIcon?: ReactNode
  title?: string
  subtitle?: string
  dark?: boolean
  narrow?: boolean
  center?: boolean
  style?: CSSProperties
}

export function Section({ children, eyebrow, eyebrowIcon, title, subtitle, dark, narrow, center, style }: SectionProps) {
  const sectionStyle: CSSProperties = {
    background: dark ? 'var(--chalkboard)' : 'transparent',
    backgroundImage: dark
      ? 'radial-gradient(at 18% 28%, rgba(255,255,255,0.05) 0, transparent 38%), radial-gradient(at 82% 72%, rgba(0,0,0,0.14) 0, transparent 50%), linear-gradient(180deg, var(--chalkboard) 0%, var(--chalkboard-deep) 100%)'
      : 'none',
    color: dark ? 'var(--chalk)' : 'var(--ink)',
    padding: 'clamp(64px, 9vw, 120px) var(--container-pad)',
    ...style,
  }

  const headerAlign: CSSProperties = center
    ? { textAlign: 'center', marginLeft: 'auto', marginRight: 'auto', alignItems: 'center' }
    : {}

  return (
    <section style={sectionStyle}>
      <div style={{ maxWidth: narrow ? 900 : 1200, margin: '0 auto' }}>
        {(eyebrow || title || subtitle) && (
          <div style={{ marginBottom: center ? 64 : 56, display: 'flex', flexDirection: 'column', maxWidth: center ? 760 : 'none', ...headerAlign }}>
            {eyebrow && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600,
                letterSpacing: '0.02em', color: dark ? 'var(--orange-soft)' : 'var(--orange-deep)',
                marginBottom: 20,
              }}>
                {eyebrowIcon}
                {eyebrow}
              </div>
            )}
            {title && (
              <h2 style={{
                fontFamily: 'var(--font-display)', fontWeight: 600,
                fontSize: center ? 'clamp(34px, 5.2vw, 58px)' : 'clamp(30px, 4vw, 46px)',
                lineHeight: 1.05, letterSpacing: '-0.02em',
                color: dark ? 'var(--chalk)' : 'var(--ink)', margin: 0,
                maxWidth: center ? 'none' : 760,
              }}>
                {title}
              </h2>
            )}
            {subtitle && (
              <p style={{
                fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.6,
                color: dark ? 'rgba(245,239,228,0.78)' : 'var(--fg-2)',
                marginTop: 18, maxWidth: 620,
              }}>
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
