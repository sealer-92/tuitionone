import { CourseFormat, CourseStatus } from '@prisma/client'

// Display + pricing shape for a course, sourced from the database.
// Satisfies CoursePricing in ./options so option helpers work directly.
export interface Course {
  id: string
  slug: string
  subject: string
  title: string
  year: string
  weeks: number
  schedule: string
  status: CourseStatus
  format: CourseFormat
  fullPriceCents: number | null
  fullPhysicalPriceCents: number | null
  digitalBookletPriceCents: number | null
  physicalBookletPriceCents: number | null
}
