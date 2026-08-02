import { describe, it, expect } from 'vitest'
import {
  optionsForCourse,
  priceForOption,
  grantsVideo,
  grantsNotes,
  needsShipping,
  isValidEircode,
  normalizeEircode,
  isValidEmail,
  isValidIrishMobile,
  normalizePhone,
  CoursePricing,
} from '@/lib/options'

const videoCourse: CoursePricing = {
  format: 'VIDEO_AND_BOOKLET',
  fullPriceCents: 15000,
  fullPhysicalPriceCents: 20000,
  digitalBookletPriceCents: 3000,
  physicalBookletPriceCents: 5000,
}

const bookletCourse: CoursePricing = {
  format: 'BOOKLET_ONLY',
  fullPriceCents: null,
  fullPhysicalPriceCents: null,
  digitalBookletPriceCents: 3000,
  physicalBookletPriceCents: 5000,
}

describe('optionsForCourse', () => {
  it('offers all four options for a fully priced video course', () => {
    expect(optionsForCourse(videoCourse).map((o) => o.option)).toEqual([
      'FULL', 'FULL_PHYSICAL', 'DIGITAL_BOOKLET', 'PHYSICAL_BOOKLET',
    ])
  })

  it('never offers video options for a booklet-only course, even if priced', () => {
    const mispriced = { ...bookletCourse, fullPriceCents: 9999 }
    expect(optionsForCourse(mispriced).map((o) => o.option)).toEqual([
      'DIGITAL_BOOKLET', 'PHYSICAL_BOOKLET',
    ])
  })

  it('omits options whose price is missing or zero', () => {
    const partial = { ...videoCourse, fullPhysicalPriceCents: null, physicalBookletPriceCents: 0 }
    expect(optionsForCourse(partial).map((o) => o.option)).toEqual(['FULL', 'DIGITAL_BOOKLET'])
  })

  it('returns no options when nothing is priced', () => {
    expect(optionsForCourse({ ...bookletCourse, digitalBookletPriceCents: null, physicalBookletPriceCents: null })).toEqual([])
  })
})

describe('priceForOption', () => {
  it('returns the price for a valid option', () => {
    expect(priceForOption(videoCourse, 'FULL')).toBe(15000)
    expect(priceForOption(videoCourse, 'PHYSICAL_BOOKLET')).toBe(5000)
  })

  it('returns null for an option the course does not offer', () => {
    expect(priceForOption(bookletCourse, 'FULL')).toBeNull()
    expect(priceForOption({ ...videoCourse, fullPriceCents: null }, 'FULL')).toBeNull()
  })
})

describe('access grants', () => {
  it('grants video only for FULL and FULL_PHYSICAL', () => {
    expect(grantsVideo('FULL')).toBe(true)
    expect(grantsVideo('FULL_PHYSICAL')).toBe(true)
    expect(grantsVideo('DIGITAL_BOOKLET')).toBe(false)
    expect(grantsVideo('PHYSICAL_BOOKLET')).toBe(false)
  })

  it('grants notes for everything except PHYSICAL_BOOKLET', () => {
    expect(grantsNotes('FULL')).toBe(true)
    expect(grantsNotes('FULL_PHYSICAL')).toBe(true)
    expect(grantsNotes('DIGITAL_BOOKLET')).toBe(true)
    expect(grantsNotes('PHYSICAL_BOOKLET')).toBe(false)
  })

  it('requires shipping only for physical options', () => {
    expect(needsShipping('FULL_PHYSICAL')).toBe(true)
    expect(needsShipping('PHYSICAL_BOOKLET')).toBe(true)
    expect(needsShipping('FULL')).toBe(false)
    expect(needsShipping('DIGITAL_BOOKLET')).toBe(false)
  })
})

describe('eircode validation', () => {
  it('accepts valid eircodes with or without a space', () => {
    expect(isValidEircode('R93 A1B2')).toBe(true)
    expect(isValidEircode('r93a1b2')).toBe(true)
  })

  it('rejects wrong lengths and empty input', () => {
    expect(isValidEircode('R93')).toBe(false)
    expect(isValidEircode('R93 A1B22')).toBe(false)
    expect(isValidEircode('')).toBe(false)
  })

  it('normalizes by stripping whitespace and upper-casing', () => {
    expect(normalizeEircode(' r93 a1b2 ')).toBe('R93A1B2')
  })
})

describe('email validation', () => {
  it('accepts well-formed emails', () => {
    expect(isValidEmail('aoife@example.com')).toBe(true)
    expect(isValidEmail('a.b+c@example.co.uk')).toBe(true)
  })

  it('rejects malformed emails', () => {
    expect(isValidEmail('not-an-email')).toBe(false)
    expect(isValidEmail('missing@domain')).toBe(false)
    expect(isValidEmail('@nouser.com')).toBe(false)
    expect(isValidEmail('')).toBe(false)
  })
})

describe('Irish mobile validation', () => {
  it('accepts valid 10-digit numbers starting with 08, with or without spacing', () => {
    expect(isValidIrishMobile('0871234567')).toBe(true)
    expect(isValidIrishMobile('087 123 4567')).toBe(true)
    expect(isValidIrishMobile('086-123-4567')).toBe(true)
    expect(isValidIrishMobile('0851234567')).toBe(true)
  })

  it('rejects wrong lengths, wrong prefixes and empty input', () => {
    expect(isValidIrishMobile('087123456')).toBe(false)
    expect(isValidIrishMobile('08712345678')).toBe(false)
    expect(isValidIrishMobile('0912345678')).toBe(false)
    expect(isValidIrishMobile('')).toBe(false)
  })

  it('normalizes by stripping spaces and dashes', () => {
    expect(normalizePhone(' 087-123 4567 ')).toBe('0871234567')
  })
})
