import { describe, it, expect } from 'vitest'
import { buildCourseData, hasAnyPrice } from '@/lib/courseInput'

// The admin form's Status dropdown offers all four CourseStatus values, so
// every one of them has to survive the round trip to the database.
describe('buildCourseData — status', () => {
  it('keeps COMING_SOON', () => {
    expect(buildCourseData({ status: 'COMING_SOON' }).status).toBe('COMING_SOON')
  })

  it('keeps ACTIVE, ARCHIVED and DRAFT', () => {
    expect(buildCourseData({ status: 'ACTIVE' }).status).toBe('ACTIVE')
    expect(buildCourseData({ status: 'ARCHIVED' }).status).toBe('ARCHIVED')
    expect(buildCourseData({ status: 'DRAFT' }).status).toBe('DRAFT')
  })

  it('falls back to DRAFT for a missing or unrecognised status', () => {
    expect(buildCourseData({}).status).toBe('DRAFT')
    expect(buildCourseData({ status: 'PUBLISHED' }).status).toBe('DRAFT')
    expect(buildCourseData({ status: 'coming_soon' }).status).toBe('DRAFT')
  })
})

describe('buildCourseData — format and prices', () => {
  it('drops the video prices on a booklet-only course', () => {
    const d = buildCourseData({
      format: 'BOOKLET_ONLY',
      fullPriceEuros: 150,
      fullPhysicalPriceEuros: 200,
      digitalBookletPriceEuros: 5,
      physicalBookletPriceEuros: '',
    })
    expect(d.fullPriceCents).toBeNull()
    expect(d.fullPhysicalPriceCents).toBeNull()
    expect(d.digitalBookletPriceCents).toBe(500)
    expect(d.physicalBookletPriceCents).toBeNull()
  })

  it('converts euros to cents and treats a blank or zero price as unset', () => {
    const d = buildCourseData({ fullPriceEuros: 150, fullPhysicalPriceEuros: 0, digitalBookletPriceEuros: '' })
    expect(d.fullPriceCents).toBe(15000)
    expect(d.fullPhysicalPriceCents).toBeNull()
    expect(d.digitalBookletPriceCents).toBeNull()
  })

  it('hasAnyPrice is false only when every option is unset', () => {
    expect(hasAnyPrice(buildCourseData({ format: 'BOOKLET_ONLY', digitalBookletPriceEuros: 5 }))).toBe(true)
    expect(hasAnyPrice(buildCourseData({ format: 'BOOKLET_ONLY' }))).toBe(false)
  })
})
