import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { moduleId, type, title, r2Key, durationSeconds } = await req.json()
  if (!moduleId || !type || !title || !r2Key) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  if (type !== 'VIDEO' && type !== 'NOTES') {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }

  const mod = await db.module.findUnique({ where: { id: moduleId } })
  if (!mod) return NextResponse.json({ error: 'Module not found' }, { status: 404 })

  const item = await db.contentItem.create({
    data: {
      moduleId,
      type,
      title,
      r2Key,
      durationSeconds: durationSeconds ? Number(durationSeconds) : null,
    },
  })

  return NextResponse.json({ id: item.id })
}
