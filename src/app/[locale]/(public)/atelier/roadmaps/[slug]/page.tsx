'use client'

import { useCallback, useState, use } from 'react'
import { Link } from '@/i18n/navigation'
import { useDemoStore } from '@/lib/atelier/context/DemoStoreContext'
import { countRoadmapFiches } from '@/lib/atelier/utils/roadmapUtils'

type SlideDirection = 'next' | 'prev'

interface RoadmapDetailPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export default function RoadmapDetailPage({ params }: RoadmapDetailPageProps) {
  const { slug } = use(params)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [slideDirection, setSlideDirection] = useState<SlideDirection>('next')
  const { getRoadmapBySlug, publishedFiches, isHydrated } = useDemoStore()
  
  const roadmap = getRoadmapBySlug(slug)
  const isPublished = roadmap?.status === 'published'

  const goToStep = useCallback((index: number) => {
    setCurrentStepIndex((prev) => {
      if (index === prev) return prev
      setSlideDirection(index > prev ? 'next' : 'prev')
      return index
    })
  }, [])

  if (!isHydrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse text-sm">Chargement de la roadmap...</p>
      </div>
    )
  }

  if (!roadmap || !isPublished) {
    return (
      <div className="space-y-8 py-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/atelier" className="hover:text-accent">Atelier</Link>
          <span>/</span>
          <Link href="/atelier/roadmaps" className="hover:text-accent">Roadmaps</Link>
          <span>/</span>
          <span className="text-foreground">Introuvable</span>
        </div>
        
        <div className="text-center py-16 space-y-4 bg-card border border-foreground/5 rounded-2xl">
          <h1 className="font-serif text-3xl font-bold">Parcours introuvable</h1>
          <p className="text-muted-foreground text-sm">Ce parcours d'apprentissage n'existe pas ou n'est pas encore publié.</p>
          <Link href="/atelier/roadmaps" className="inline-block px-5 py-2.5 bg-accent text-accent-foreground text-xs font-bold rounded-lg hover:bg-accent/90 transition-colors">
            Retour aux roadmaps
          </Link>
        </div>
      </div>
    )
  }

  const linkedCount = countRoadmapFiches(roadmap)
  const prevStep = currentStepIndex > 0 ? roadmap.steps[currentStepIndex - 1] : null
  const nextStep = currentStepIndex < roadmap.steps.length - 1 ? roadmap.steps[currentStepIndex + 1] : null
  const currentStep = roadmap.steps[currentStepIndex]
  const stepFiches = currentStep.ficheSlugs
    .map((ficheSlug) => publishedFiches.find((f) => f.slug === ficheSlug))
    .filter((f) => f !== undefined)

  return (
    <div className="space-y-10 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
        <Link href="/atelier" className="hover:text-accent">Atelier</Link>
        <span>/</span>
        <Link href="/atelier/roadmaps" className="hover:text-accent">Roadmaps</Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-[200px]">{roadmap.title}</span>
      </div>

      {/* Hero Header Section */}
      <div className="bg-card border border-foreground/5 p-6 md:p-8 rounded-3xl space-y-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-accent">{roadmap.audience}</span>
          <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight leading-tight">
            {roadmap.title}
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {roadmap.summary}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
            ⏱️ {roadmap.duration}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-foreground/5 text-muted-foreground border border-foreground/10">
            📊 {roadmap.level}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-foreground/5 text-muted-foreground border border-foreground/10">
            📚 {linkedCount} fiche{linkedCount > 1 ? 's' : ''} liée{linkedCount > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Steps and Carousel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step navigation panel */}
        <div className="lg:col-span-4 bg-card border border-foreground/5 p-6 rounded-2xl space-y-4">
          <h3 className="font-serif text-lg font-bold border-b border-foreground/5 pb-2">Plan du parcours</h3>
          
          <div className="space-y-2">
            {roadmap.steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => goToStep(idx)}
                className={`w-full text-left p-3 rounded-xl flex gap-3 transition-all ${
                  idx === currentStepIndex
                    ? 'bg-accent/10 border border-accent/20 text-accent'
                    : 'hover:bg-foreground/5 border border-transparent text-muted-foreground'
                }`}
              >
                <span className="font-mono text-xs font-bold">{String(idx + 1).padStart(2, '0')}</span>
                <span className="text-xs font-bold leading-normal truncate">{step.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Carousel / Step detail area */}
        <div className="lg:col-span-8 bg-card border border-foreground/5 p-6 md:p-8 rounded-3xl space-y-6">
          {/* Progress header */}
          <div className="flex items-center justify-between border-b border-foreground/5 pb-4">
            <div className="flex-1 max-w-[200px] h-1.5 rounded-full bg-foreground/5 overflow-hidden">
              <div 
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${((currentStepIndex + 1) / roadmap.steps.length) * 100}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-accent">
              Étape {currentStepIndex + 1} sur {roadmap.steps.length}
            </span>
          </div>

          {/* Active step display */}
          <div className="space-y-6 transition-all duration-300">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center font-serif text-lg font-bold text-accent">
                {currentStepIndex + 1}
              </div>
              <div className="space-y-1.5">
                <h2 className="font-serif text-xl font-bold">{currentStep.title}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{currentStep.description}</p>
              </div>
            </div>

            {/* Fiches linked to step */}
            <div className="space-y-4 pt-6 border-t border-foreground/5">
              <h4 className="text-xs uppercase tracking-wider font-bold text-accent">Fiches de connaissances liées</h4>
              
              {stepFiches.length > 0 ? (
                <div className="grid grid-cols-1 gap-3">
                  {stepFiches.map((fiche) => (
                    <Link 
                      key={fiche.slug} 
                      href={`/atelier/fiches/${fiche.slug}`} 
                      className="group p-4 rounded-xl bg-background border border-foreground/5 hover:border-accent/40 shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-accent/15 text-accent text-[9px] font-mono font-bold">
                            {fiche.category}
                          </span>
                          <h5 className="font-bold text-sm group-hover:text-accent transition-colors">
                            {fiche.title}
                          </h5>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{fiche.question}</p>
                      </div>

                      <span className="text-muted-foreground/40 group-hover:text-accent group-hover:translate-x-0.5 transition-all text-sm font-bold">
                        Lire la fiche &rarr;
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">Contenu à venir — les fiches correspondantes sont en cours de rédaction.</p>
              )}
            </div>
          </div>

          {/* Navigation footer */}
          <div className="flex items-center justify-between pt-6 border-t border-foreground/5 mt-8">
            <button
              onClick={() => goToStep(currentStepIndex - 1)}
              disabled={!prevStep}
              className="px-4 py-2 bg-foreground/5 hover:bg-foreground/10 disabled:opacity-30 disabled:pointer-events-none text-foreground font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              &larr; Précédent
            </button>

            <button
              onClick={() => goToStep(currentStepIndex + 1)}
              disabled={!nextStep}
              className="px-4 py-2 bg-accent hover:bg-accent/95 disabled:opacity-30 disabled:pointer-events-none text-accent-foreground font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Suivant &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
