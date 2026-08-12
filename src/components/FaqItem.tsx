'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function FaqItem({ question, children }: { question: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
          padding: '20px 2px', background: 'transparent', border: 0, cursor: 'pointer', textAlign: 'left',
          fontFamily: 'var(--font-ui)', fontSize: 16, fontWeight: 600, color: 'var(--ink)',
        }}
      >
        {question}
        <ChevronDown
          size={18}
          style={{ flexShrink: 0, color: 'var(--orange-deep)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 150ms ease' }}
        />
      </button>
      {open && (
        <div style={{ padding: '0 2px 20px', fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.65, color: 'var(--fg-2)' }}>
          {children}
        </div>
      )}
    </div>
  )
}
