'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TicketStatus } from '@prisma/client'

export function TicketStatusButton({ id, status }: { id: string; status: TicketStatus }) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const next = status === 'OPEN' ? 'RESOLVED' : 'OPEN'

  async function toggle() {
    setBusy(true)
    try {
      await fetch(`/api/admin/support/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      })
      router.refresh()
    } finally { setBusy(false) }
  }

  return (
    <button onClick={toggle} disabled={busy} style={{
      fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 8,
      border: '1px solid var(--border-strong)', background: 'white', color: 'var(--ink)', cursor: busy ? 'wait' : 'pointer',
    }}>
      {busy ? '…' : status === 'OPEN' ? 'Mark resolved' : 'Reopen'}
    </button>
  )
}
