'use client'

import { useId, useState } from 'react'
import { ArrowDown } from 'lucide-react'

export function FaqItem({ question, isLast, children }: { question: string; isLast?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div style={{ borderBottom: isLast ? 'none' : '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20,
          padding: '22px 26px', background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left',
          fontFamily: 'var(--font-ui)', fontSize: 15.5, fontWeight: 700, color: 'var(--ink)',
        }}
      >
        {question}
        <span style={{
          flexShrink: 0, width: 30, height: 30, borderRadius: '50%',
          background: 'var(--chalkboard)', color: 'var(--chalk)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease',
        }}>
          <ArrowDown size={14} />
        </span>
      </button>
      {open && (
        <div id={panelId} style={{ padding: '0 26px 22px', fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.65, color: 'var(--fg-2)' }}>
          {children}
        </div>
      )}
    </div>
  )
}
