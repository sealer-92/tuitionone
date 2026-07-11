import { CourseFormat } from '@prisma/client'

// Display + pricing shape for an active course, sourced from the database.
// Satisfies CoursePricing in ./options so option helpers work directly.
export interface Course {
  id: string
  slug: string
  subject: string
  title: string
  year: string
  weeks: number
  schedule: string
  format: CourseFormat
  fullPriceCents: number | null
  fullPhysicalPriceCents: number | null
  digitalBookletPriceCents: number | null
  physicalBookletPriceCents: number | null
}
