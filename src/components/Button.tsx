'use client'

import Link from 'next/link'
import { useState } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  variant?: Variant
  size?: Size
  children: React.ReactNode
  icon?: React.ReactNode
  onDark?: boolean
  onClick?: () => void
  href?: string
  type?: 'button' | 'submit' | 'reset'
  style?: React.CSSProperties
  disabled?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  onDark,
  onClick,
  href,
  type,
  style,
  disabled,
}: ButtonProps) {
  const [hover, setHover] = useState(false)
  const [press, setPress] = useState(false)

  const base: React.CSSProperties = {
    fontFamily: 'var(--font-ui)',
    fontWeight: 600,
    fontSize: size === 'lg' ? 16 : size === 'sm' ? 13 : 14,
    padding: size === 'lg' ? '14px 26px' : size === 'sm' ? '8px 14px' : '12px 22px',
    borderRadius: 12,
    border: '0',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 120ms cubic-bezier(0.2, 0.7, 0.2, 1)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    lineHeight: 1,
    letterSpacing: '0.01em',
    textDecoration: 'none',
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    ...style,
  }

  const variantStyles: Record<Variant, React.CSSProperties> = {
    primary:   { background: 'var(--orange)', color: 'white' },
    secondary: onDark
      ? { background: 'transparent', color: 'var(--chalk)', border: '1.5px solid rgba(255,255,255,0.3)' }
      : { background: 'transparent', color: 'var(--ink)',   border: '1.5px solid var(--sage-tan)' },
    ghost:  { background: 'transparent', color: onDark ? 'var(--chalk)' : 'var(--ink)', paddingLeft: 14, paddingRight: 14 },
    danger: { background: 'var(--danger)', color: 'white' },
  }

  let s: React.CSSProperties = { ...base, ...variantStyles[variant] }

  if (variant === 'primary' && hover && !press) s = { ...s, background: 'var(--orange-soft)' }
  if (variant === 'primary' && press)           s = { ...s, background: 'var(--orange-deep)', transform: 'scale(0.98)' }
  if (variant === 'secondary' && hover)         s = { ...s, borderColor: 'var(--orange)', color: onDark ? 'var(--orange-soft)' : 'var(--orange-deep)' }

  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => { setHover(false); setPress(false) },
    onMouseDown:  () => setPress(true),
    onMouseUp:    () => setPress(false),
  }

  if (href) {
    return (
      <Link href={href} style={s} {...handlers}>
        {icon && icon}
        {children}
      </Link>
    )
  }

  return (
    <button type={type || 'button'} onClick={onClick} style={s} {...handlers}>
      {icon && icon}
      {children}
    </button>
  )
}
