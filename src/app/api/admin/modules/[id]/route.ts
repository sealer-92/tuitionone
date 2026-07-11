import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { db } from '@/lib/db'
import { deleteContentObject } from '@/lib/r2'

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const mod = await db.module.findUnique({ where: { id }, include: { contentItems: true } })
  if (!mod) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Remove each content item's R2 object before the cascade delete drops the rows.
  await Promise.all(
    mod.contentItems.map((c) => deleteContentObject(c.r2Key).catch(() => undefined)),
  )
  await db.module.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
