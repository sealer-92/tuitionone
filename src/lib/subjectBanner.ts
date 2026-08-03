// Decorative gradient banner per subject — used as a fallback when a module
// has no uploaded thumbnail, so cards never need to wait on an image request.
export const SUBJECT_BANNERS: Record<string, string> = {
  Maths:     'linear-gradient(135deg, #2C4B3F 0%, #3A5E50 55%, #5C8A4E 100%)',
  Chemistry: 'linear-gradient(135deg, #274B63 0%, #486C8A 60%, #7FA3BF 100%)',
  Biology:   'linear-gradient(135deg, #3F6A35 0%, #5C8A4E 60%, #93B884 100%)',
  Science:   'linear-gradient(135deg, #8A4B22 0%, #C97529 60%, #E58F3F 100%)',
}
export const SUBJECT_BANNER_FALLBACK = 'linear-gradient(135deg, #1F362D 0%, #2C4B3F 60%, #C2A98A 100%)'

// Soft geometric texture layered over the gradient.
export const SUBJECT_BANNER_PATTERN =
  'repeating-linear-gradient(115deg, rgba(255,255,255,0.055) 0 2px, transparent 2px 26px), radial-gradient(ellipse at 80% 10%, rgba(255,255,255,0.14), transparent 55%)'
