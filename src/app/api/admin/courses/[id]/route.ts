import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'
import { db } from '@/lib/db'
import { buildCourseData, hasAnyPrice } from '@/lib/courseInput'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin()
  if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json()
  const { slug, title, subject, year, description, weeks, schedule } = body

  if (!slug || !title || !subject || !year || weeks == null || !schedule) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const courseData = buildCourseData(body)
  if (!hasAnyPrice(courseData)) {
    return NextResponse.json({ error: 'Set a price for at least one option' }, { status: 400 })
  }

  // Slug must stay unique across other courses.
  const clash = await db.course.findFirst({ where: { slug, NOT: { id } } })
  if (clash) return NextResponse.json({ error: 'A course with that slug already exists' }, { status: 409 })

  await db.course.update({
    where: { id },
    data: {
      slug,
      title,
      subject,
      year,
      description: description || null,
      weeks: Number(weeks),
      schedule,
      ...courseData,
    },
  })

  return NextResponse.json({ id })
}
