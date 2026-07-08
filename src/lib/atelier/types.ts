export type FicheSection = {
  label: string
  title: string
  paragraphs: string[]
}

export type Fiche = {
  slug: string
  title: string
  question: string
  category: string
  tool: string
  duration: string
  level: string
  summary: string
  tags: string[]
  sections: FicheSection[]
  pigmentCode?: string
  swatch?: string[]
}

export type RoadmapStep = {
  title: string
  description: string
  ficheSlugs: string[]
}

export type Roadmap = {
  slug: string
  title: string
  audience: string
  duration: string
  level: string
  summary: string
  steps: RoadmapStep[]
}

export type ThemeVariant = {
  slug: string
  name: string
  description: string
  background: string
  accent: string
}

export type ContentStatus = 'draft' | 'review' | 'published' | 'rejected'

export type DemoFiche = Fiche & {
  authorId: string
  status: ContentStatus
  createdAt: string
  updatedAt: string
}

export type DemoRoadmap = Roadmap & {
  authorId: string
  status: ContentStatus
  createdAt: string
  updatedAt: string
}

export type FicheFormInput = {
  question: string
  title: string
  category: string
  tool: string
  level: string
  duration: string
  summary: string
  sectionTitle: string
  sectionBody: string
  tags: string
}

export type RoadmapStepInput = {
  title: string
  description: string
  ficheSlugs: string[]
}

export type RoadmapFormInput = {
  title: string
  audience: string
  duration: string
  level: string
  summary: string
  steps: RoadmapStepInput[]
}

export type VisitorQuestion = {
  id: string
  text: string
  authorName?: string
  status: 'pending' | 'answered'
  ficheSlug?: string
  roadmapSlug?: string
  createdAt: string
}

export type DemoData = {
  fiches: DemoFiche[]
  roadmaps: DemoRoadmap[]
  questions: VisitorQuestion[]
}

export type SaveContentResult =
  | { ok: true; slug: string; status: ContentStatus }
  | { ok: false; error: string }

export function statusMeta(status: ContentStatus) {
  switch (status) {
    case 'published':
      return { label: '● Publié', className: 'badge-published' }
    case 'review':
      return { label: '◐ En révision', className: 'badge-review' }
    case 'rejected':
      return { label: '✕ Rejetée', className: 'badge-draft' }
    default:
      return { label: '○ Brouillon', className: 'badge-draft' }
  }
}

export function buildSections(input: FicheFormInput): FicheSection[] {
  if (input.sectionTitle.trim() && input.sectionBody.trim()) {
    return [
      {
        label: 'Contenu',
        title: input.sectionTitle.trim(),
        paragraphs: input.sectionBody.trim().split('\n').filter(Boolean),
      },
    ]
  }

  if (input.summary.trim()) {
    return [
      {
        label: 'Contenu',
        title: 'Détails',
        paragraphs: [input.summary.trim()],
      },
    ]
  }

  return []
}

export function parseTags(raw: string) {
  return raw
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export function ficheToForm(fiche: DemoFiche): FicheFormInput {
  const firstSection = fiche.sections[0]
  return {
    question: fiche.question,
    title: fiche.title,
    category: fiche.category,
    tool: fiche.tool,
    level: fiche.level,
    duration: fiche.duration,
    summary: fiche.summary,
    sectionTitle: firstSection?.title ?? '',
    sectionBody: firstSection?.paragraphs.join('\n') ?? '',
    tags: fiche.tags.join(', '),
  }
}

export const emptyFicheForm = (): FicheFormInput => ({
  question: '',
  title: '',
  category: 'Technique',
  tool: '',
  level: 'Débutant',
  duration: '10 min',
  summary: '',
  sectionTitle: '',
  sectionBody: '',
  tags: '',
})

export function roadmapToForm(roadmap: DemoRoadmap): RoadmapFormInput {
  return {
    title: roadmap.title,
    audience: roadmap.audience,
    duration: roadmap.duration,
    level: roadmap.level,
    summary: roadmap.summary,
    steps: roadmap.steps.map((step) => ({
      title: step.title,
      description: step.description,
      ficheSlugs: [...step.ficheSlugs],
    })),
  }
}

export const emptyRoadmapForm = (): RoadmapFormInput => ({
  title: '',
  audience: 'Débutant curieux',
  duration: '4 semaines',
  level: 'Progressif',
  summary: '',
  steps: [
    { title: 'Première étape', description: '', ficheSlugs: [] },
    { title: 'Deuxième étape', description: '', ficheSlugs: [] },
  ],
})

export function buildRoadmapSteps(steps: RoadmapStepInput[]): RoadmapStep[] {
  return steps.map((step) => ({
    title: step.title.trim(),
    description: step.description.trim(),
    ficheSlugs: [...step.ficheSlugs],
  }))
}
