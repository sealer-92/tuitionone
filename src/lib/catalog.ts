import { db } from './db'
import type { Course } from './courses'

const COURSE_SELECT = {
  id: true, slug: true, subject: true, title: true, year: true, weeks: true, schedule: true,
  status: true, format: true, fullPriceCents: true, fullPhysicalPriceCents: true,
  digitalBookletPriceCents: true, physicalBookletPriceCents: true,
} as const

// Purchasable courses — used by the enrol flow, which must never offer a
// course that isn't actually on sale.
export async function getActiveCourses(): Promise<Course[]> {
  return db.course.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'asc' },
    select: COURSE_SELECT,
  })
}

// Active + coming-soon courses for the public browse pages, so visitors can
// see the full curriculum roadmap. Ordered active-first (enum declaration
// order), then by creation date.
export async function getCatalogCourses(): Promise<Course[]> {
  return db.course.findMany({
    where: { status: { in: ['ACTIVE', 'COMING_SOON'] } },
    orderBy: [{ status: 'asc' }, { createdAt: 'asc' }],
    select: COURSE_SELECT,
  })
}
