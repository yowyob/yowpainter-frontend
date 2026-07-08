import type { DemoFiche } from '@/lib/atelier/types'

export type RelatedFiche = {
  fiche: DemoFiche
  reason: string
  sharedTags: string[]
}

export function getRelatedFiches(current: DemoFiche, allFiches: DemoFiche[], limit = 4): RelatedFiche[] {
  const others = allFiches.filter((f) => f.slug !== current.slug)

  const scored = others.map((fiche) => {
    const sharedTags = fiche.tags.filter((tag) => current.tags.includes(tag))
    const sameCategory = fiche.category === current.category
    const score = sharedTags.length * 3 + (sameCategory ? 4 : 0)
    return { fiche, score, sharedTags, sameCategory }
  })

  let ranked = scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.fiche.title.localeCompare(b.fiche.title))

  if (ranked.length < limit) {
    const used = new Set(ranked.map((r) => r.fiche.slug))
    const fallback = others
      .filter((f) => !used.has(f.slug))
      .map((fiche) => ({ fiche, score: 0, sharedTags: [] as string[], sameCategory: false }))
    ranked = [...ranked, ...fallback]
  }

  return ranked.slice(0, limit).map(({ fiche, sharedTags, sameCategory }) => {
    let reason = 'À découvrir'
    if (sharedTags.length >= 2) {
      reason = `${sharedTags.length} sujets en commun`
    } else if (sharedTags.length === 1) {
      reason = sharedTags[0]
    } else if (sameCategory) {
      reason = `Même catégorie · ${fiche.category}`
    }
    return { fiche, reason, sharedTags }
  })
}
