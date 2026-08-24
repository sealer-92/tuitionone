import { CourseFormat, PurchaseOption } from '@prisma/client'

// The pricing-relevant shape of a course; satisfied by a Prisma Course.
export interface CoursePricing {
  format: CourseFormat
  fullPriceCents: number | null
  fullPhysicalPriceCents: number | null
  digitalBookletPriceCents: number | null
  physicalBookletPriceCents: number | null
}

export interface OptionInfo {
  option: PurchaseOption
  label: string
  description: string
  priceCents: number
}

const OPTION_META: Record<PurchaseOption, { label: string; description: string }> = {
  FULL:             { label: 'Online course',                description: 'Online access to all video lessons.' },
  FULL_PHYSICAL:    { label: 'Online course + printed booklet', description: 'All video lessons, plus a printed booklet posted to you.' },
  DIGITAL_BOOKLET:  { label: 'Digital booklet only',          description: 'Online access to the digital booklet — no videos.' },
  PHYSICAL_BOOKLET: { label: 'Printed booklet only',          description: 'A printed booklet posted to you — no online access.' },
}

// Returns the purchasable options for a course, in display order, with prices.
// An option is offered only when its price has been set by the admin.
export function optionsForCourse(course: CoursePricing): OptionInfo[] {
  const priceByOption: Record<PurchaseOption, number | null> = {
    FULL:             course.format === 'VIDEO_AND_BOOKLET' ? course.fullPriceCents : null,
    FULL_PHYSICAL:    course.format === 'VIDEO_AND_BOOKLET' ? course.fullPhysicalPriceCents : null,
    DIGITAL_BOOKLET:  course.digitalBookletPriceCents,
    PHYSICAL_BOOKLET: course.physicalBookletPriceCents,
  }
  const order: PurchaseOption[] = ['FULL', 'FULL_PHYSICAL', 'DIGITAL_BOOKLET', 'PHYSICAL_BOOKLET']
  return order
    .filter((o) => priceByOption[o] != null && (priceByOption[o] as number) > 0)
    .map((o) => ({ option: o, ...OPTION_META[o], priceCents: priceByOption[o] as number }))
}

// Authoritative server-side price lookup. Returns null if the option isn't valid for the course.
export function priceForOption(course: CoursePricing, option: PurchaseOption): number | null {
  return optionsForCourse(course).find((o) => o.option === option)?.priceCents ?? null
}

export function grantsVideo(option: PurchaseOption): boolean {
  return option === 'FULL' || option === 'FULL_PHYSICAL'
}

// Digital booklets aren't offered yet — only a standalone DIGITAL_BOOKLET
// purchase grants online notes access for now.
export function grantsNotes(option: PurchaseOption): boolean {
  return option === 'DIGITAL_BOOKLET'
}

export function needsShipping(option: PurchaseOption): boolean {
  return option === 'FULL_PHYSICAL' || option === 'PHYSICAL_BOOKLET'
}

export const IRISH_COUNTIES = [
  'Carlow', 'Cavan', 'Clare', 'Cork', 'Donegal', 'Dublin', 'Galway', 'Kerry',
  'Kildare', 'Kilkenny', 'Laois', 'Leitrim', 'Limerick', 'Longford', 'Louth',
  'Mayo', 'Meath', 'Monaghan', 'Offaly', 'Roscommon', 'Sligo', 'Tipperary',
  'Waterford', 'Westmeath', 'Wexford', 'Wicklow',
] as const

export function normalizeEircode(raw: string): string {
  return raw.replace(/\s+/g, '').toUpperCase()
}

// Eircodes are 7 alphanumeric characters (a space between routing key and identifier is optional).
export function isValidEircode(raw: string): boolean {
  return /^[A-Z0-9]{7}$/.test(normalizeEircode(raw))
}

export function isValidEmail(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)
}

export function normalizePhone(raw: string): string {
  return raw.replace(/[\s-]/g, '')
}

// Irish mobile numbers: 08 followed by 8 more digits (e.g. 085, 086, 087, 089), 10 digits total.
export function isValidIrishMobile(raw: string): boolean {
  return /^08\d{8}$/.test(normalizePhone(raw))
}
