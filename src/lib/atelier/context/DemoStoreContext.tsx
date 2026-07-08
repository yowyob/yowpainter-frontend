'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createInitialDemoData, mergeStoredDemoData } from '../data/demoSeed'
import {
  DEMO_PASSWORD,
  createDefaultSession,
  findDemoUser,
  homePathForRole,
  isAdminEmail,
  toSession,
  type DemoSession,
  type ProfileData,
  type UserRole,
} from '../data/mockUsers'
import { uniqueSlug } from '../slugify'
import {
  clearDemoData,
  deleteRegisteredUser,
  findRegisteredUser,
  loadDemoData,
  loadRegisteredUsers,
  loadSession,
  saveDemoData,
  saveSession,
  clearSession,
  seedFictionalPainters,
  suspendRegisteredUser,
  unsuspendRegisteredUser,
  upsertRegisteredUser,
} from '../demoStorage'
import {
  buildRoadmapSteps,
  buildSections,
  parseTags,
  type ContentStatus,
  type DemoData,
  type DemoFiche,
  type DemoRoadmap,
  type FicheFormInput,
  type RoadmapFormInput,
  type SaveContentResult,
  type VisitorQuestion,
} from '../types'

type LoginResult = { ok: true; redirectTo: string } | { ok: false; error: string }

type RegisterResult = { ok: true; redirectTo: string } | { ok: false; error: string }

type UpdateProfileResult = { ok: true } | { ok: false; error: string }

type DemoStoreContextValue = {
  session: DemoSession | null
  isHydrated: boolean
  fiches: DemoFiche[]
  roadmaps: DemoRoadmap[]
  questions: VisitorQuestion[]
  publishedFiches: DemoFiche[]
  publishedRoadmaps: DemoRoadmap[]
  login: (email: string, password: string) => LoginResult
  logout: () => void
  register: (name: string, email: string, password: string) => RegisterResult
  resetDemoData: () => void
  updateProfile: (data: Partial<ProfileData>) => UpdateProfileResult
  getFicheBySlug: (slug: string) => DemoFiche | undefined
  getRoadmapBySlug: (slug: string) => DemoRoadmap | undefined
  getMyFiches: (userId: string) => DemoFiche[]
  getMyRoadmaps: (userId: string) => DemoRoadmap[]
  getModerationQueue: () => DemoFiche[]
  getRoadmapModerationQueue: () => DemoRoadmap[]
  deleteFiche: (slug: string) => boolean
  deleteRoadmap: (slug: string) => boolean
  getAllRegisteredUsers: () => DemoSession[]
  deleteUser: (userId: string) => boolean
  suspendUser: (userId: string) => boolean
  unsuspendUser: (userId: string) => boolean
  saveFicheDraft: (input: FicheFormInput, existingSlug?: string, questionId?: string) => SaveContentResult
  submitFicheForReview: (input: FicheFormInput, existingSlug?: string, questionId?: string) => SaveContentResult
  approveFiche: (slug: string) => SaveContentResult
  rejectFiche: (slug: string) => SaveContentResult
  saveRoadmapDraft: (input: RoadmapFormInput, existingSlug?: string, questionId?: string) => SaveContentResult
  submitRoadmapForReview: (input: RoadmapFormInput, existingSlug?: string, questionId?: string) => SaveContentResult
  approveRoadmap: (slug: string) => SaveContentResult
  rejectRoadmap: (slug: string) => SaveContentResult
  askQuestion: (text: string, authorName?: string) => void
  linkQuestionToFiche: (questionId: string, ficheSlug: string) => void
}

const DemoStoreContext = createContext<DemoStoreContextValue | null>(null)

function buildDemoFiche(
  input: FicheFormInput,
  authorId: string,
  status: ContentStatus,
  existing?: DemoFiche,
  slug?: string,
): DemoFiche {
  const timestamp = new Date().toISOString()

  return {
    slug: slug ?? existing?.slug ?? '',
    title: input.title.trim(),
    question: input.question.trim(),
    category: input.category,
    tool: input.tool.trim(),
    level: input.level,
    duration: input.duration.trim() || '10 min',
    summary: input.summary.trim(),
    tags: parseTags(input.tags),
    sections: buildSections(input),
    authorId,
    status,
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
    pigmentCode: existing?.pigmentCode,
    swatch: existing?.swatch,
  }
}

function buildDemoRoadmap(
  input: RoadmapFormInput,
  authorId: string,
  status: ContentStatus,
  existing?: DemoRoadmap,
  slug?: string,
): DemoRoadmap {
  const timestamp = new Date().toISOString()

  return {
    slug: slug ?? existing?.slug ?? '',
    title: input.title.trim(),
    audience: input.audience.trim(),
    duration: input.duration.trim() || '4 semaines',
    level: input.level.trim(),
    summary: input.summary.trim(),
    steps: buildRoadmapSteps(input.steps),
    authorId,
    status,
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
  }
}

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<DemoSession | null>(null)
  const [data, setData] = useState<DemoData>({ fiches: [], roadmaps: [], questions: [] })
  const [isHydrated, setIsHydrated] = useState(false)

  const persistData = useCallback((next: DemoData) => {
    setData(next)
    saveDemoData(next)
  }, [])

  useEffect(() => {
    seedFictionalPainters()
    setSession(loadSession())
    setData(mergeStoredDemoData(loadDemoData()))
    setIsHydrated(true)
  }, [])

  const upsertFiche = useCallback(
    (input: FicheFormInput, status: ContentStatus, existingSlug?: string, questionId?: string): SaveContentResult => {
      if (!session) {
        return { ok: false, error: 'Vous devez être connecté pour enregistrer une fiche.' }
      }

      if (!input.title.trim() || !input.question.trim()) {
        return { ok: false, error: 'Le titre et la question sont obligatoires.' }
      }

      const existing = existingSlug ? data.fiches.find((f) => f.slug === existingSlug) : undefined

      if (existing && existing.authorId !== session.userId) {
        return { ok: false, error: 'Vous ne pouvez modifier que vos propres fiches.' }
      }

      const slug = existing?.slug ?? uniqueSlug(input.title, data.fiches.map((f) => f.slug))
      const nextFiche = buildDemoFiche(input, session.userId, status, existing, slug)

      const fiches = existing
        ? data.fiches.map((f) => (f.slug === existing.slug ? nextFiche : f))
        : [...data.fiches, nextFiche]

      let nextQuestions = data.questions || []
      if (questionId) {
        nextQuestions = nextQuestions.map((q) =>
          q.id === questionId ? { ...q, status: 'answered', ficheSlug: slug } : q
        )
      }

      persistData({ ...data, fiches, questions: nextQuestions })
      return { ok: true, slug, status }
    },
    [data, persistData, session],
  )

  const upsertRoadmap = useCallback(
    (input: RoadmapFormInput, status: ContentStatus, existingSlug?: string, questionId?: string): SaveContentResult => {
      if (!session) {
        return { ok: false, error: 'Vous devez être connecté pour enregistrer une roadmap.' }
      }

      if (!input.title.trim()) {
        return { ok: false, error: 'Le titre est obligatoire.' }
      }

      if (input.steps.length === 0) {
        return { ok: false, error: 'Ajoutez au moins une étape.' }
      }

      const existing = existingSlug ? data.roadmaps.find((r) => r.slug === existingSlug) : undefined

      if (existing && existing.authorId !== session.userId) {
        return { ok: false, error: 'Vous ne pouvez modifier que vos propres roadmaps.' }
      }

      const slug = existing?.slug ?? uniqueSlug(input.title, data.roadmaps.map((r) => r.slug))
      const nextRoadmap = buildDemoRoadmap(input, session.userId, status, existing, slug)

      const roadmaps = existing
        ? data.roadmaps.map((r) => (r.slug === existing.slug ? nextRoadmap : r))
        : [...data.roadmaps, nextRoadmap]

      let nextQuestions = data.questions || []
      if (questionId) {
        nextQuestions = nextQuestions.map((q) =>
          q.id === questionId ? { ...q, status: 'answered', roadmapSlug: slug } : q
        )
      }

      persistData({ ...data, roadmaps, questions: nextQuestions })
      return { ok: true, slug, status }
    },
    [data, persistData, session],
  )

  const login = useCallback((email: string, password: string): LoginResult => {
    const adminUser = findDemoUser(email)
    if (adminUser) {
      if (password !== DEMO_PASSWORD && password !== adminUser.password) {
        return { ok: false, error: 'Mot de passe incorrect. Utilisez « demo » pour la simulation.' }
      }
      const nextSession = toSession(adminUser)
      saveSession(nextSession)
      setSession(nextSession)
      return { ok: true, redirectTo: '/admin' }
    }

    const registeredUser = findRegisteredUser(email)
    if (!registeredUser) {
      return { ok: false, error: 'Aucun compte trouvé pour cet email. Créez un compte d\'abord.' }
    }

    if (password !== DEMO_PASSWORD && password !== registeredUser.password) {
      return { ok: false, error: 'Mot de passe incorrect. Utilisez « demo » pour la simulation.' }
    }

    const nextSession = toSession(registeredUser)
    saveSession(nextSession)
    setSession(nextSession)
    return { ok: true, redirectTo: '/dashboard/peintre' }
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setSession(null)
  }, [])

  const register = useCallback((name: string, email: string, password: string): RegisterResult => {
    const normalizedEmail = email.trim().toLowerCase()

    if (isAdminEmail(normalizedEmail)) {
      return { ok: false, error: 'Cet email est réservé à l\'administrateur.' }
    }

    if (!name.trim()) {
      return { ok: false, error: 'Le nom est obligatoire.' }
    }

    if (!normalizedEmail || !normalizedEmail.includes('@')) {
      return { ok: false, error: 'Email invalide.' }
    }

    if (!password || password.length < 3) {
      return { ok: false, error: 'Mot de passe trop court (minimum 3 caractères).' }
    }

    if (findRegisteredUser(normalizedEmail)) {
      return { ok: false, error: 'Un compte existe déjà avec cet email.' }
    }

    const id = 'peintre-' + Date.now()
    const newUser = {
      id,
      email: normalizedEmail,
      password,
      name: name.trim(),
      handle: name.trim().toLowerCase().replace(/\s+/g, '.'),
      role: 'peintre' as const,
      bio: '',
      city: '',
      expertise: '',
      specialties: ['🎨 Peinture'],
    }

    upsertRegisteredUser(newUser)
    const nextSession = toSession(newUser)
    saveSession(nextSession)
    setSession(nextSession)
    return { ok: true, redirectTo: '/dashboard/peintre' }
  }, [])

  const resetDemoData = useCallback(() => {
    clearDemoData()
    persistData(createInitialDemoData())
  }, [persistData])

  const updateProfile = useCallback(
    (updates: Partial<ProfileData>): UpdateProfileResult => {
      if (!session) {
        return { ok: false, error: 'Vous devez être connecté.' }
      }
      if (updates.name !== undefined && !updates.name.trim()) {
        return { ok: false, error: 'Le nom ne peut pas être vide.' }
      }
      if (updates.handle !== undefined && !updates.handle.trim()) {
        return { ok: false, error: 'Le nom d\'utilisateur ne peut pas être vide.' }
      }
      const nextSession: DemoSession = { ...session, ...updates }
      saveSession(nextSession)
      setSession(nextSession)

      if (session.role === 'peintre') {
        const registeredUser = findRegisteredUser(session.email)
        if (registeredUser) {
          upsertRegisteredUser({
            ...registeredUser,
            name: nextSession.name,
            handle: nextSession.handle,
            email: nextSession.email,
            bio: nextSession.bio,
            city: nextSession.city,
            expertise: nextSession.expertise,
            specialties: [...nextSession.specialties],
          })
        }
      }
      return { ok: true }
    },
    [session],
  )

  const getFicheBySlug = useCallback(
    (slug: string) => data.fiches.find((f) => f.slug === slug),
    [data.fiches],
  )

  const getRoadmapBySlug = useCallback(
    (slug: string) => data.roadmaps.find((r) => r.slug === slug),
    [data.roadmaps],
  )

  const getMyFiches = useCallback(
    (userId: string) => data.fiches.filter((f) => f.authorId === userId),
    [data.fiches],
  )

  const getMyRoadmaps = useCallback(
    (userId: string) => data.roadmaps.filter((r) => r.authorId === userId),
    [data.roadmaps],
  )

  const getModerationQueue = useCallback(
    () => data.fiches.filter((f) => f.status === 'review'),
    [data.fiches],
  )

  const getRoadmapModerationQueue = useCallback(
    () => data.roadmaps.filter((r) => r.status === 'review'),
    [data.roadmaps],
  )

  const saveFicheDraft = useCallback(
    (input: FicheFormInput, existingSlug?: string, questionId?: string) => upsertFiche(input, 'draft', existingSlug, questionId),
    [upsertFiche],
  )

  const submitFicheForReview = useCallback(
    (input: FicheFormInput, existingSlug?: string, questionId?: string) => upsertFiche(input, 'review', existingSlug, questionId),
    [upsertFiche],
  )

  const approveFiche = useCallback(
    (slug: string): SaveContentResult => {
      const fiche = data.fiches.find((f) => f.slug === slug)
      if (!fiche) return { ok: false, error: 'Fiche introuvable.' }
      if (fiche.status !== 'review') return { ok: false, error: 'Cette fiche n’est pas en révision.' }

      const nextFiche: DemoFiche = { ...fiche, status: 'published', updatedAt: new Date().toISOString() }
      persistData({ ...data, fiches: data.fiches.map((f) => (f.slug === slug ? nextFiche : f)) })
      return { ok: true, slug, status: 'published' }
    },
    [data, persistData],
  )

  const rejectFiche = useCallback(
    (slug: string): SaveContentResult => {
      const fiche = data.fiches.find((f) => f.slug === slug)
      if (!fiche) return { ok: false, error: 'Fiche introuvable.' }
      if (fiche.status !== 'review') return { ok: false, error: 'Cette fiche n’est pas en révision.' }

      const nextFiche: DemoFiche = { ...fiche, status: 'rejected', updatedAt: new Date().toISOString() }
      persistData({ ...data, fiches: data.fiches.map((f) => (f.slug === slug ? nextFiche : f)) })
      return { ok: true, slug, status: 'rejected' }
    },
    [data, persistData],
  )

  const saveRoadmapDraft = useCallback(
    (input: RoadmapFormInput, existingSlug?: string, questionId?: string) => upsertRoadmap(input, 'draft', existingSlug, questionId),
    [upsertRoadmap],
  )

  const submitRoadmapForReview = useCallback(
    (input: RoadmapFormInput, existingSlug?: string, questionId?: string) => upsertRoadmap(input, 'review', existingSlug, questionId),
    [upsertRoadmap],
  )

  const approveRoadmap = useCallback(
    (slug: string): SaveContentResult => {
      const roadmap = data.roadmaps.find((r) => r.slug === slug)
      if (!roadmap) return { ok: false, error: 'Roadmap introuvable.' }
      if (roadmap.status !== 'review') return { ok: false, error: 'Cette roadmap n’est pas en révision.' }

      const nextRoadmap: DemoRoadmap = { ...roadmap, status: 'published', updatedAt: new Date().toISOString() }
      persistData({ ...data, roadmaps: data.roadmaps.map((r) => (r.slug === slug ? nextRoadmap : r)) })
      return { ok: true, slug, status: 'published' }
    },
    [data, persistData],
  )

  const rejectRoadmap = useCallback(
    (slug: string): SaveContentResult => {
      const roadmap = data.roadmaps.find((r) => r.slug === slug)
      if (!roadmap) return { ok: false, error: 'Roadmap introuvable.' }
      if (roadmap.status !== 'review') return { ok: false, error: 'Cette roadmap n’est pas en révision.' }

      const nextRoadmap: DemoRoadmap = { ...roadmap, status: 'rejected', updatedAt: new Date().toISOString() }
      persistData({ ...data, roadmaps: data.roadmaps.map((r) => (r.slug === slug ? nextRoadmap : r)) })
      return { ok: true, slug, status: 'rejected' }
    },
    [data, persistData],
  )

  const deleteFiche = useCallback(
    (slug: string): boolean => {
      if (!data.fiches.find((f) => f.slug === slug)) return false
      persistData({ ...data, fiches: data.fiches.filter((f) => f.slug !== slug) })
      return true
    },
    [data, persistData],
  )

  const deleteRoadmap = useCallback(
    (slug: string): boolean => {
      if (!data.roadmaps.find((r) => r.slug === slug)) return false
      persistData({ ...data, roadmaps: data.roadmaps.filter((r) => r.slug !== slug) })
      return true
    },
    [data, persistData],
  )

  const getAllRegisteredUsers = useCallback((): DemoSession[] => {
    const users = loadRegisteredUsers()
    return users.map((user) => toSession(user))
  }, [])

  const deleteUser = useCallback((userId: string): boolean => {
    return deleteRegisteredUser(userId)
  }, [])

  const suspendUser = useCallback((userId: string): boolean => {
    return suspendRegisteredUser(userId)
  }, [])

  const unsuspendUser = useCallback((userId: string): boolean => {
    return unsuspendRegisteredUser(userId)
  }, [])

  const askQuestion = useCallback(
    (text: string, authorName?: string) => {
      const newQuestion: VisitorQuestion = {
        id: 'question-' + Date.now(),
        text: text.trim(),
        authorName: authorName?.trim() || 'Visiteur Anonyme',
        status: 'pending',
        createdAt: new Date().toISOString(),
      }
      const questions = [...(data.questions || []), newQuestion]
      persistData({ ...data, questions })
    },
    [data, persistData],
  )

  const linkQuestionToFiche = useCallback(
    (questionId: string, ficheSlug: string) => {
      const nextQuestions = (data.questions || []).map((q) =>
        q.id === questionId ? { ...q, status: 'answered' as const, ficheSlug } : q
      )
      persistData({ ...data, questions: nextQuestions })
    },
    [data, persistData],
  )

  const publishedFiches = useMemo(
    () => data.fiches.filter((f) => f.status === 'published'),
    [data.fiches],
  )

  const publishedRoadmaps = useMemo(
    () => data.roadmaps.filter((r) => r.status === 'published'),
    [data.roadmaps],
  )

  const value = useMemo(
    () => ({
      session,
      isHydrated,
      fiches: data.fiches,
      roadmaps: data.roadmaps,
      questions: data.questions || [],
      publishedFiches,
      publishedRoadmaps,
      login,
      logout,
      register,
      resetDemoData,
      updateProfile,
      getFicheBySlug,
      getRoadmapBySlug,
      getMyFiches,
      getMyRoadmaps,
      getModerationQueue,
      getRoadmapModerationQueue,
      deleteFiche,
      deleteRoadmap,
      getAllRegisteredUsers,
      deleteUser,
      suspendUser,
      unsuspendUser,
      saveFicheDraft,
      submitFicheForReview,
      approveFiche,
      rejectFiche,
      saveRoadmapDraft,
      submitRoadmapForReview,
      approveRoadmap,
      rejectRoadmap,
      askQuestion,
      linkQuestionToFiche,
    }),
    [
      session,
      isHydrated,
      data.fiches,
      data.roadmaps,
      data.questions,
      publishedFiches,
      publishedRoadmaps,
      login,
      logout,
      register,
      resetDemoData,
      updateProfile,
      getFicheBySlug,
      getRoadmapBySlug,
      getMyFiches,
      getMyRoadmaps,
      getModerationQueue,
      getRoadmapModerationQueue,
      deleteFiche,
      deleteRoadmap,
      getAllRegisteredUsers,
      deleteUser,
      suspendUser,
      unsuspendUser,
      saveFicheDraft,
      submitFicheForReview,
      approveFiche,
      rejectFiche,
      saveRoadmapDraft,
      submitRoadmapForReview,
      approveRoadmap,
      rejectRoadmap,
      askQuestion,
      linkQuestionToFiche,
    ],
  )

  return <DemoStoreContext.Provider value={value}>{children}</DemoStoreContext.Provider>
}

export function useDemoStore() {
  const context = useContext(DemoStoreContext)
  if (!context) {
    throw new Error('useDemoStore must be used within DemoStoreProvider')
  }
  return context
}

export type { UserRole, DemoSession, DemoFiche, DemoRoadmap, FicheFormInput, RoadmapFormInput, ContentStatus }
