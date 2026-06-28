import { CourseFormat, CourseStatus, Prisma } from '@prisma/client'

function eurosToCents(v: unknown): number | null {
  if (v === '' || v == null) return null
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) : null
}

export interface CourseInputBody {
  slug?: string
  title?: string
  subject?: string
  year?: string
  description?: string
  schedule?: string
  weeks?: number
  status?: string
  format?: string
  fullPriceEuros?: number | ''
  fullPhysicalPriceEuros?: number | ''
  digitalBookletPriceEuros?: number | ''
  physicalBookletPriceEuros?: number | ''
}

// Builds the persisted course fields (status, format, cents prices) from a raw request body.
// Full-access prices are dropped for booklet-only courses.
export function buildCourseData(body: CourseInputBody) {
  const format: CourseFormat = body.format === 'BOOKLET_ONLY' ? 'BOOKLET_ONLY' : 'VIDEO_AND_BOOKLET'
  const status: CourseStatus =
    body.status === 'ACTIVE' ? 'ACTIVE' : body.status === 'ARCHIVED' ? 'ARCHIVED' : 'DRAFT'
  const isVideo = format === 'VIDEO_AND_BOOKLET'

  return {
    format,
    status,
    fullPriceCents:            isVideo ? eurosToCents(body.fullPriceEuros) : null,
    fullPhysicalPriceCents:    isVideo ? eurosToCents(body.fullPhysicalPriceEuros) : null,
    digitalBookletPriceCents:  eurosToCents(body.digitalBookletPriceEuros),
    physicalBookletPriceCents: eurosToCents(body.physicalBookletPriceEuros),
  }
}

// True when at least one purchasable option has a price set.
export function hasAnyPrice(data: Prisma.CourseUncheckedCreateInput | ReturnType<typeof buildCourseData>): boolean {
  return [data.fullPriceCents, data.fullPhysicalPriceCents, data.digitalBookletPriceCents, data.physicalBookletPriceCents]
    .some((c) => c != null)
}
