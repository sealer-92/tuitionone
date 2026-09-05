import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { db } from '@/lib/db'
import { deleteContentObject } from '@/lib/r2'

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const booklet = await db.booklet.findUnique({ where: { id } })
  if (!booklet) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await deleteContentObject(booklet.r2Key)
  await db.booklet.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
