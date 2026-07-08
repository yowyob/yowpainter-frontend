import { fiches as seedFiches, roadmaps as seedRoadmaps } from './siteContent'
import type { DemoData, DemoFiche, DemoRoadmap, VisitorQuestion } from '../types'

const now = '2025-06-07T10:00:00.000Z'

const seededFiches: DemoFiche[] = seedFiches.map((fiche, index) => ({
  ...fiche,
  authorId: 'marie',
  status: index === 0 ? 'review' : 'published',
  createdAt: '2025-05-01T09:00:00.000Z',
  updatedAt: now,
}))

const extraDraft: DemoFiche = {
  slug: 'essai-pigment-local',
  title: 'Essai pigment local',
  question: 'Comment tester un pigment inconnu ?',
  category: 'Technique',
  tool: 'Atelier',
  duration: '8 min',
  level: 'Débutant',
  summary: 'Brouillon personnel pour structurer un protocole de test rapide en atelier.',
  tags: ['brouillon', 'test'],
  sections: [
    {
      label: 'Contenu',
      title: 'Protocole',
      paragraphs: ['Noter la transparence, la granulation et le comportement au séchage.'],
    },
  ],
  authorId: 'marie',
  status: 'draft',
  createdAt: '2025-06-05T14:00:00.000Z',
  updatedAt: now,
}

const seededRoadmaps: DemoRoadmap[] = seedRoadmaps.map((roadmap, index) => ({
  ...roadmap,
  authorId: 'marie',
  status: index === 1 ? 'review' : 'published',
  createdAt: '2025-05-01T09:00:00.000Z',
  updatedAt: now,
}))

const extraRoadmapDraft: DemoRoadmap = {
  slug: 'aquarelle-debutant-brouillon',
  title: 'Aquarelle débutant',
  audience: 'Débutant',
  duration: '6 semaines',
  level: 'Progressif',
  summary: 'Parcours en cours de rédaction pour découvrir l’aquarelle pas à pas.',
  steps: [
    {
      title: 'Le matériel essentiel',
      description: 'Papier, pinceaux et premières couleurs.',
      ficheSlugs: [],
    },
    {
      title: 'Contrôler l’eau',
      description: 'Lavis, réserve et séchage.',
      ficheSlugs: [],
    },
  ],
  authorId: 'marie',
  status: 'draft',
  createdAt: '2025-06-04T11:00:00.000Z',
  updatedAt: now,
}

const seededQuestions: VisitorQuestion[] = [
  {
    id: 'question-1',
    text: "Comment réussir à faire un glacis bien régulier à la peinture à l'huile ?",
    authorName: 'Léonard',
    status: 'answered',
    ficheSlug: 'glacis',
    createdAt: '2025-06-01T14:20:00.000Z',
  },
  {
    id: 'question-2',
    text: 'Quel blanc choisir pour une sous-couche très couvrante ?',
    authorName: 'Alice M.',
    status: 'pending',
    createdAt: '2025-06-06T12:00:00.000Z',
  },
  {
    id: 'question-3',
    text: "Est-ce qu'on peut mélanger de la gouache et de l'acrylique sur une même toile ?",
    authorName: 'Julien',
    status: 'pending',
    createdAt: '2025-06-07T08:30:00.000Z',
  },
]

export function createInitialDemoData(): DemoData {
  return {
    fiches: [...seededFiches, extraDraft],
    roadmaps: [...seededRoadmaps, extraRoadmapDraft],
    questions: seededQuestions,
  }
}

export function mergeStoredDemoData(stored: Partial<DemoData> | null): DemoData {
  const initial = createInitialDemoData()
  if (!stored) return initial

  return {
    fiches: stored.fiches ?? initial.fiches,
    roadmaps: stored.roadmaps ?? initial.roadmaps,
    questions: stored.questions ?? initial.questions,
  }
}
