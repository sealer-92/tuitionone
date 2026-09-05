import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { canAccessBooklet } from '@/lib/access'
import { getContentSignedUrl } from '@/lib/r2'
import { db } from '@/lib/db'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { id } = await params
  const ip      = req.headers.get('x-forwarded-for') ?? 'unknown'
  const allowed = await canAccessBooklet(session.user.id, id, ip)

  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const booklet = await db.booklet.findUnique({ where: { id } })
  if (!booklet) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const url = await getContentSignedUrl(booklet.r2Key, 'notes')

  return NextResponse.json({ url }, { headers: { 'Cache-Control': 'no-store' } })
}
