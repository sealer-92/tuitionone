// Deterministic placeholder photo for a module that has no admin-uploaded
// thumbnail. Picsum's seed param always returns the same image for the same
// seed, so each module gets a stable (but distinct) photo instead of a flash
// of a new random image on every visit.
export function moduleFallbackPhotoUrl(seed: string, width = 640, height = 275): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`
}
