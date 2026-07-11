import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { canAccessItem } from '@/lib/access'
import { getContentSignedUrl } from '@/lib/r2'
import { db } from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { itemId } = await params
  const ip      = req.headers.get('x-forwarded-for') ?? 'unknown'
  const allowed = await canAccessItem(session.user.id, itemId, ip)

  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const item = await db.contentItem.findUnique({ where: { id: itemId } })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const url = await getContentSignedUrl(item.r2Key, item.type === 'VIDEO' ? 'video' : 'notes')

  return NextResponse.json({ url }, { headers: { 'Cache-Control': 'no-store' } })
}
