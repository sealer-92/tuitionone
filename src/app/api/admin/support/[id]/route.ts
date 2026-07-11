import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { db } from '@/lib/db'
import { TicketStatus } from '@prisma/client'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const { status } = await req.json()
  if (status !== 'OPEN' && status !== 'RESOLVED') {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  await db.supportTicket.update({ where: { id }, data: { status: status as TicketStatus } })
  return NextResponse.json({ id, status })
}
