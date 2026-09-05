import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { db } from '@/lib/db'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id: courseId } = await params
  const { title, r2Key } = await req.json()
  if (!title || !r2Key) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const course = await db.course.findUnique({ where: { id: courseId } })
  if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })

  const count = await db.booklet.count({ where: { courseId } })
  const booklet = await db.booklet.create({
    data: { courseId, order: count + 1, title, r2Key },
  })

  return NextResponse.json({ id: booklet.id })
}
