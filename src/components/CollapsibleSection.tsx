'use client'

import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Props {
  title: string
  icon: React.ReactNode
  meta?: string
  defaultOpen?: boolean
  children: React.ReactNode
}

export function CollapsibleSection({ title, icon, meta, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 16, background: 'var(--paper)', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '20px 24px', background: 'none', border: 0, cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{ display: 'flex', color: 'var(--orange-deep)' }}>{icon}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--ink)' }}>
          {title}
        </span>
        {meta && (
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--fg-3)' }}>{meta}</span>
        )}
        <ChevronDown
          size={20}
          aria-hidden="true"
          style={{
            marginLeft: 'auto', color: 'var(--fg-2)',
            transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 160ms ease',
          }}
        />
      </button>

      {open && (
        <div id={panelId} style={{ padding: '0 24px 24px' }}>
          {children}
        </div>
      )}
    </div>
  )
}
