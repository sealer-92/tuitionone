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
  FULL:             { label: 'Videos + digital booklet',                 description: 'Online access to all videos and digital booklets.' },
  FULL_PHYSICAL:    { label: 'Videos + digital booklet + printed booklet', description: 'Everything online, plus a printed booklet posted to you.' },
  DIGITAL_BOOKLET:  { label: 'Digital booklet only',                      description: 'Online access to the digital booklets — no videos.' },
  PHYSICAL_BOOKLET: { label: 'Printed booklet only',                      description: 'A printed booklet posted to you — no online access.' },
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

export function grantsNotes(option: PurchaseOption): boolean {
  return option === 'FULL' || option === 'FULL_PHYSICAL' || option === 'DIGITAL_BOOKLET'
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
