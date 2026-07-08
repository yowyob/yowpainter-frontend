'use client'

import { useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useDemoStore } from '@/lib/atelier/context/DemoStoreContext'

export default function RoadmapsPage() {
  const { publishedRoadmaps, isHydrated } = useDemoStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return publishedRoadmaps

    return publishedRoadmaps.filter((r) => {
      let match = false
      match ||= r.title.toLowerCase().includes(q)
      match ||= r.summary.toLowerCase().includes(q)
      match ||= r.steps.some(
        (s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q),
      )
      return match
    })
  }, [publishedRoadmaps, searchQuery])

  if (!isHydrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse text-sm">Chargement de l'Atelier...</p>
      </div>
    )
  }

  return (
    <div className="space-y-12 py-8">
      {/* Breadcrumb & Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/atelier" className="hover:text-accent">Atelier</Link>
          <span>/</span>
          <span className="text-foreground">Roadmaps</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-foreground/5 pb-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Programmes structurés</span>
            <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">Parcours d'apprentissage</h1>
            <p className="text-muted-foreground text-sm max-w-xl">
              Des trajectoires guidées, étape par étape, référençant des fiches de connaissances à consulter dans l'ordre.
            </p>
          </div>
          
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Rechercher une roadmap..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 border border-foreground/10 rounded-xl bg-card text-foreground placeholder:text-muted-foreground/60 text-sm outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Intro / CTA Left */}
        <div className="lg:col-span-4 bg-gradient-to-br from-amber-500/5 via-accent/5 to-transparent border border-foreground/5 p-6 rounded-3xl space-y-6">
          <h3 className="font-serif text-xl font-bold">Qu'est-ce qu'une roadmap ?</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Chaque roadmap ordonne le savoir en étapes progressives. Idéal pour approfondir une technique sans se perdre dans le désordre des connaissances.
          </p>
          <div className="pt-2">
            <Link 
              href="/artdashboard" 
              className="block w-full text-center py-2.5 bg-accent hover:bg-accent/95 text-accent-foreground font-bold text-xs rounded-xl shadow transition-colors"
            >
              Créer une roadmap
            </Link>
          </div>
        </div>

        {/* Catalog Right */}
        <div className="lg:col-span-8 space-y-6">
          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-card border border-foreground/5 rounded-2xl">
              <p className="text-muted-foreground text-sm italic">
                {searchQuery.trim()
                  ? 'Aucune roadmap ne correspond à votre recherche.'
                  : 'Aucune roadmap publiée pour le moment.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((roadmap, index) => (
                <Link 
                  key={roadmap.slug} 
                  href={`/atelier/roadmaps/${roadmap.slug}`} 
                  className="group flex flex-col justify-between bg-card border border-foreground/5 hover:border-accent/30 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all gap-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-accent">
                        #{String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">
                        {roadmap.steps.length} étapes
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold group-hover:text-accent transition-colors leading-tight">
                      {roadmap.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {roadmap.summary}
                    </p>
                  </div>

                  {/* Progress Indicator */}
                  <div className="space-y-1.5 pt-3 border-t border-foreground/5">
                    <div className="w-full h-1.5 rounded-full bg-foreground/5 overflow-hidden">
                      <div 
                        className="h-full bg-accent transition-all duration-500" 
                        style={{ width: `${Math.min(100, roadmap.steps.length * 20)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold pt-1">
                    <span>⏱️ {roadmap.duration}</span>
                    <span>📊 {roadmap.level}</span>
                  </div>
                </Link>
              ))}

              {/* Creator Card */}
              <Link 
                href="/artdashboard" 
                className="flex flex-col items-center justify-center border-2 border-dashed border-foreground/10 hover:border-accent/50 rounded-2xl p-6 text-center group transition-colors min-h-[180px]"
              >
                <span className="text-3xl text-muted-foreground group-hover:text-accent transition-colors mb-2">+</span>
                <span className="text-xs font-bold text-muted-foreground group-hover:text-accent transition-colors">
                  Proposer un parcours
                </span>
                <span className="text-[10px] text-muted-foreground/60 mt-1 max-w-[180px]">
                  Rédigez et publiez votre propre parcours d'apprentissage.
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
