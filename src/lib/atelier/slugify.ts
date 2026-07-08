export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function uniqueSlug(base: string, existing: string[]) {
  let slug = slugify(base)
  if (!slug) slug = `fiche-${Date.now()}`
  if (!existing.includes(slug)) return slug

  let index = 2
  while (existing.includes(`${slug}-${index}`)) {
    index += 1
  }
  return `${slug}-${index}`
}
