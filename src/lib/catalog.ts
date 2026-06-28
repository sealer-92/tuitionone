import { db } from './db'
import type { Course } from './courses'

const COURSE_SELECT = {
  id: true, slug: true, subject: true, title: true, year: true, weeks: true, schedule: true,
  format: true, fullPriceCents: true, fullPhysicalPriceCents: true,
  digitalBookletPriceCents: true, physicalBookletPriceCents: true,
} as const

// Active courses for the public catalogue and enrol flow.
export async function getActiveCourses(): Promise<Course[]> {
  return db.course.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'asc' },
    select: COURSE_SELECT,
  })
}
