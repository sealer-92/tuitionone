import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { requireAdmin } from '@/lib/admin'
import { getUploadSignedUrl } from '@/lib/r2'

export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { moduleId, type, fileName, contentType } = await req.json()
  if (!moduleId || !type || !fileName || !contentType) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const folder = type === 'VIDEO' ? 'videos' : 'notes'
  const safeName = String(fileName).replace(/[^a-zA-Z0-9._-]/g, '_')
  const r2Key = `modules/${moduleId}/${folder}/${randomUUID()}-${safeName}`

  const uploadUrl = await getUploadSignedUrl(r2Key, contentType)
  return NextResponse.json({ uploadUrl, r2Key })
}
