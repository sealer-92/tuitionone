import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { requireAdmin } from '@/lib/admin'
import { db } from '@/lib/db'
import { getUploadSignedUrl } from '@/lib/r2'

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50)

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { moduleId, type, fileName, contentType } = await req.json()
  if (!moduleId || !type || !fileName || !contentType) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const mod = await db.module.findUnique({ where: { id: moduleId }, include: { course: true } })
  if (!mod) return NextResponse.json({ error: 'Module not found' }, { status: 404 })

  const folder = type === 'VIDEO' ? 'videos' : 'notes'
  const modulePart = `module-${String(mod.order).padStart(2, '0')}-${slugify(mod.title)}`
  const safeName = String(fileName).replace(/[^a-zA-Z0-9._-]/g, '_')
  const r2Key = `courses/${mod.course.slug}/${modulePart}/${folder}/${randomUUID().slice(0, 8)}-${safeName}`

  const uploadUrl = await getUploadSignedUrl(r2Key, contentType)
  return NextResponse.json({ uploadUrl, r2Key })
}
