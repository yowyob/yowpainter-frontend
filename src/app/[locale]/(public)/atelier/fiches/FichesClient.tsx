'use client'

import { useEffect, useMemo, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'
import { useDemoStore } from '@/lib/atelier/context/DemoStoreContext'

const LEVEL_ORDER: Record<string, number> = {
  'Débutant': 1,
  'Intermédiaire': 2,
  'Avancé': 3,
}

export default function FichesClient() {
  const searchParams = useSearchParams()
  const { publishedFiches, isHydrated } = useDemoStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<string>('alpha')

  // Set category filter from URL search params if present
  useEffect(() => {
    const catParam = searchParams.get('cat') || searchParams.get('categorie')
    if (catParam) {
      // Find matching category in database (case insensitive match)
      const matched = publishedFiches.find(
        (f) => f.category.toLowerCase() === catParam.toLowerCase()
      )
      if (matched) {
        setSelectedCategories(new Set([matched.category]))
      }
    }
  }, [searchParams, publishedFiches])

  const allCategories = useMemo(() => {
    return [...new Set(publishedFiches.map((f) => f.category))].sort()
  }, [publishedFiches])

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    let result = publishedFiches.filter((f) => {
      const matchesCategory = selectedCategories.size === 0 || selectedCategories.has(f.category)
      if (!matchesCategory) return false

      if (!query) return true

      return (
        f.title.toLowerCase().includes(query) ||
        f.question.toLowerCase().includes(query) ||
        f.category.toLowerCase().includes(query) ||
        f.tool.toLowerCase().includes(query) ||
        f.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        (f.summary && f.summary.toLowerCase().includes(query))
      )
    })

    switch (sortBy) {
      case 'alpha':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'level':
        result = [...result].sort((a, b) => (LEVEL_ORDER[a.level] ?? 99) - (LEVEL_ORDER[b.level] ?? 99))
        break
      case 'duration':
        result = [...result].sort((a, b) => {
          const da = parseInt(a.duration, 10) || 0
          const db = parseInt(b.duration, 10) || 0
          return da - db
        })
        break
      default:
        break
    }

    return result
  }, [publishedFiches, searchQuery, selectedCategories, sortBy])

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) {
        next.delete(cat)
      } else {
        next.add(cat)
      }
      return next
    })
  }

  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategories(new Set())
    setSortBy('alpha')
  }

  // Draw swatches on canvas
  useEffect(() => {
    const canvases = document.querySelectorAll<HTMLCanvasElement>('canvas[data-swatch]')
    canvases.forEach((canvas) => {
      const context = canvas.getContext('2d')
      const colorSpec = canvas.dataset.swatch
      if (!context || !colorSpec) return
      
      const colors = colorSpec.split(',').map((item) => item.trim()).filter(Boolean)
      if (colors.length === 0) return

      const width = 300
      const height = 96
      canvas.width = width
      canvas.height = height

      const segmentWidth = width / colors.length
      colors.forEach((color, index) => {
        context.fillStyle = color
        context.fillRect(index * segmentWidth, 0, segmentWidth + 1, height)
      })

      // Add noise overlay for rich texture
      for (let i = 0; i < 850; i += 1) {
        const x = Math.random() * width
        const y = Math.random() * height
        context.fillStyle = `rgba(0,0,0,${Math.random() * 0.13})`
        context.fillRect(x, y, 1, 1)
      }
    })
  }, [filtered])

  if (!isHydrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse text-sm">Chargement de l'Atelier...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10 py-8">
      {/* Breadcrumb & Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/atelier" className="hover:text-accent">Atelier</Link>
          <span>/</span>
          <span className="text-foreground">Fiches</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-foreground/5 pb-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Ressources &middot; {publishedFiches.length} fiches</span>
            <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">Fiches de connaissance</h1>
            <p className="text-muted-foreground text-sm max-w-xl">
              Chaque fiche répond à une question technique précise sur la couleur, les liants, les enduits ou les supports.
            </p>
          </div>
          
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Rechercher une fiche..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 border border-foreground/10 rounded-xl bg-card text-foreground placeholder:text-muted-foreground/60 text-sm outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-3 bg-card border border-foreground/5 rounded-2xl p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold">Catégories</h3>
            <div className="space-y-3">
              {allCategories.map((category) => (
                <label key={category} className="flex items-center justify-between text-xs text-foreground cursor-pointer group hover:text-accent transition-colors">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.has(category)}
                      onChange={() => toggleCategory(category)}
                      className="rounded border-foreground/10 text-accent focus:ring-accent/40"
                    />
                    <span>{category}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-foreground/5 text-muted-foreground/80 font-mono text-[9px] group-hover:bg-accent/15 group-hover:text-accent">
                    {publishedFiches.filter((f) => f.category === category).length}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button 
            type="button" 
            onClick={resetFilters}
            className="w-full py-2 bg-foreground/5 hover:bg-foreground/10 text-foreground font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </aside>

        {/* Results Content Area */}
        <div className="lg:col-span-9 space-y-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-foreground/5 pb-4">
            <div>
              {filtered.length === publishedFiches.length ? (
                <span>Affichage de <strong>{filtered.length}</strong> fiches</span>
              ) : (
                <span>Affichage de <strong>{filtered.length}</strong> sur <strong>{publishedFiches.length}</strong> fiches</span>
              )}
            </div>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-card border border-foreground/10 rounded-lg px-2 py-1 outline-none text-foreground cursor-pointer focus:border-accent"
            >
              <option value="alpha">Trier : Alphabétique</option>
              <option value="level">Trier : Niveau</option>
              <option value="duration">Trier : Durée</option>
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <p className="text-muted-foreground text-sm">Aucune fiche ne correspond à votre recherche.</p>
              <button 
                type="button" 
                onClick={resetFilters} 
                className="px-4 py-2 bg-accent text-accent-foreground font-bold text-xs rounded-lg cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((fiche) => (
                <Link 
                  key={fiche.slug} 
                  href={`/atelier/fiches/${fiche.slug}`} 
                  className="group flex flex-col bg-card border border-foreground/5 hover:border-accent/30 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  {/* Swatch Canvas Render */}
                  {fiche.swatch ? (
                    <div className="relative h-24 overflow-hidden bg-muted border-b border-foreground/5">
                      <canvas data-swatch={fiche.swatch.join(',')} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-24 w-full bg-gradient-to-r from-accent/10 to-amber-500/10 flex items-center justify-center text-xs font-bold uppercase tracking-wider text-accent border-b border-foreground/5">
                      {fiche.category}
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">
                      <span>{fiche.category} &middot; {fiche.tool}</span>
                      <span className="px-2 py-0.5 rounded bg-accent/10 text-accent font-semibold">Fiche</span>
                    </div>
                    <h3 className="font-serif text-lg font-bold group-hover:text-accent transition-colors leading-tight">
                      {fiche.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      ❓ {fiche.question}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mt-auto pt-3 border-t border-foreground/5">
                      {fiche.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-foreground/5 text-muted-foreground">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Footer metadata */}
                  <div className="px-5 py-3 bg-foreground/[0.02] border-t border-foreground/5 flex items-center justify-between text-[10px] text-muted-foreground font-mono">
                    <span>⏱️ {fiche.duration}</span>
                    <span>📊 {fiche.level}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
