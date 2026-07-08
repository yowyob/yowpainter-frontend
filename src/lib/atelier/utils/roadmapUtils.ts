import type { DemoRoadmap } from '@/lib/atelier/types'

export function findRoadmapsForFiche(ficheSlug: string, roadmaps: DemoRoadmap[]) {
  return roadmaps
    .filter((roadmap) => roadmap.status === 'published')
    .map((roadmap) => {
      const stepIndex = roadmap.steps.findIndex((step) => step.ficheSlugs.includes(ficheSlug))
      if (stepIndex === -1) return null
      return { roadmap, stepIndex, step: roadmap.steps[stepIndex] }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}

export function countRoadmapFiches(roadmap: DemoRoadmap) {
  return new Set(roadmap.steps.flatMap((step) => step.ficheSlugs)).size
}
