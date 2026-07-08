'use client'

import { useEffect, use } from 'react'
import { Link } from '@/i18n/navigation'
import { useDemoStore } from '@/lib/atelier/context/DemoStoreContext'
import { getRelatedFiches } from '@/lib/atelier/utils/ficheUtils'
import { findRoadmapsForFiche } from '@/lib/atelier/utils/roadmapUtils'

interface FicheDetailPageProps {
  params: Promise<{ locale: string; slug: string }>
}

export default function FicheDetailPage({ params }: FicheDetailPageProps) {
  const { slug } = use(params)
  const { getFicheBySlug, isHydrated, publishedFiches, publishedRoadmaps } = useDemoStore()
  
  const fiche = getFicheBySlug(slug)
  const isPublished = fiche?.status === 'published'
  
  const referencingRoadmaps = isPublished ? findRoadmapsForFiche(slug, publishedRoadmaps) : []
  const relatedFiches = isPublished && fiche
    ? getRelatedFiches(fiche, publishedFiches, 4)
    : []

  // Draw hero swatch canvas
  useEffect(() => {
    if (!fiche?.swatch) return

    const canvas = document.querySelector<HTMLCanvasElement>('.hero-swatch-canvas')
    if (!canvas) return

    const context = canvas.getContext('2d')
    const colorSpec = canvas.dataset.swatch
    if (!context || !colorSpec) return

    const colors = colorSpec.split(',').map((item) => item.trim()).filter(Boolean)
    if (colors.length === 0) return

    const width = 220
    const height = 280
    canvas.width = width
    canvas.height = height

    const stripeWidth = width / colors.length
    colors.forEach((color, index) => {
      context.fillStyle = color
      context.fillRect(index * stripeWidth, 0, stripeWidth + 1, height)
    })

    // Noise/texture effect
    for (let index = 0; index < 2200; index += 1) {
      const x = Math.random() * width
      const y = Math.random() * height
      context.fillStyle = `rgba(0,0,0,${Math.random() * 0.15})`
      context.fillRect(x, y, 1, 1)
    }
  }, [slug, fiche?.swatch])

  if (!isHydrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse text-sm">Chargement de la fiche...</p>
      </div>
    )
  }

  if (!fiche || !isPublished) {
    return (
      <div className="space-y-8 py-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/atelier" className="hover:text-accent">Atelier</Link>
          <span>/</span>
          <Link href="/atelier/fiches" className="hover:text-accent">Fiches</Link>
          <span>/</span>
          <span className="text-foreground">Introuvable</span>
        </div>
        
        <div className="text-center py-16 space-y-4 bg-card border border-foreground/5 rounded-2xl">
          <h1 className="font-serif text-3xl font-bold">Fiche introuvable</h1>
          <p className="text-muted-foreground text-sm">Cette fiche de connaissance n'existe pas ou n'est pas encore publiée.</p>
          <Link href="/atelier/fiches" className="inline-block px-5 py-2.5 bg-accent text-accent-foreground text-xs font-bold rounded-lg hover:bg-accent/90 transition-colors">
            Retour aux fiches
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
        <Link href="/atelier" className="hover:text-accent">Atelier</Link>
        <span>/</span>
        <Link href="/atelier/fiches" className="hover:text-accent">Fiches</Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-[200px]">{fiche.title}</span>
      </div>

      {/* Hero Header Section */}
      <div className="flex flex-col md:flex-row gap-8 items-start bg-card border border-foreground/5 p-6 md:p-8 rounded-3xl">
        {/* Swatch Left */}
        <div className="w-full md:w-56 flex-shrink-0 flex justify-center">
          {fiche.swatch ? (
            <div className="relative w-full aspect-[4/5] max-w-[220px] rounded-2xl overflow-hidden border border-foreground/10 shadow-md">
              <canvas data-swatch={fiche.swatch.join(',')} className="hero-swatch-canvas w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full aspect-[4/5] max-w-[220px] rounded-2xl bg-gradient-to-br from-accent/10 to-amber-500/10 flex flex-col items-center justify-center border border-foreground/5 shadow-sm text-center p-4">
              <span className="text-4xl mb-2">🎨</span>
              <span className="text-xs uppercase font-bold tracking-wider text-accent">{fiche.category}</span>
            </div>
          )}
        </div>

        {/* Info Right */}
        <div className="flex-1 space-y-4 w-full">
          <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">
            Unité de connaissance &middot; Atelier Savoirs
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight leading-tight">
            {fiche.title}
          </h1>
          <p className="text-base text-accent font-medium leading-relaxed">
            ❓ {fiche.question}
          </p>
          
          {fiche.pigmentCode && (
            <div className="inline-block px-2.5 py-1 rounded bg-foreground/5 text-muted-foreground text-xs font-mono border border-foreground/10">
              Code Pigment: {fiche.pigmentCode}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
              📊 {fiche.level}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-foreground/5 text-muted-foreground border border-foreground/10">
              ⏱️ {fiche.duration}
            </span>
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-foreground/5 mt-4">
            <button 
              type="button" 
              onClick={() => window.print()}
              className="px-4 py-2 bg-foreground/5 hover:bg-foreground/10 text-foreground font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              🖨️ Imprimer cette fiche
            </button>
          </div>
        </div>
      </div>

      {/* Main content sections & Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Summary and Fiche content sections */}
        <div className="lg:col-span-8 space-y-8 bg-card border border-foreground/5 p-6 md:p-8 rounded-3xl">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Question & Synthèse</span>
            <h2 className="font-serif text-2xl font-bold">{fiche.question}</h2>
            <p className="text-base text-muted-foreground leading-relaxed italic border-l-2 border-accent pl-4 py-1">
              {fiche.summary}
            </p>
          </div>

          {fiche.sections.map((section) => (
            <div key={section.title} className="space-y-4 pt-6 border-t border-foreground/5">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-accent">{section.label}</span>
              <h2 className="font-serif text-xl font-bold">{section.title}</h2>
              <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                {section.paragraphs.map((paragraph, pIdx) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Metadata / Tags / Roadmaps sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Metadata */}
          <div className="bg-card border border-foreground/5 p-6 rounded-2xl space-y-4">
            <h3 className="font-serif text-base font-bold border-b border-foreground/5 pb-2">Informations</h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-foreground/5">
                <span className="text-muted-foreground">Catégorie</span>
                <span className="font-semibold text-foreground">{fiche.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-foreground/5">
                <span className="text-muted-foreground">Médium</span>
                <span className="font-semibold text-foreground">{fiche.tool}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-foreground/5">
                <span className="text-muted-foreground">Niveau</span>
                <span className="font-semibold text-foreground">{fiche.level}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground">Durée</span>
                <span className="font-semibold text-foreground">{fiche.duration}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-card border border-foreground/5 p-6 rounded-2xl space-y-4">
            <h3 className="font-serif text-base font-bold border-b border-foreground/5 pb-2">Mots-clés</h3>
            <div className="flex flex-wrap gap-1.5">
              {fiche.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded bg-foreground/5 hover:bg-foreground/10 text-muted-foreground text-xs transition-colors cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Roadmaps Stack */}
          {referencingRoadmaps.length > 0 && (
            <div className="bg-card border border-foreground/5 p-6 rounded-2xl space-y-4">
              <h3 className="font-serif text-base font-bold border-b border-foreground/5 pb-2">Présente dans les parcours</h3>
              <div className="space-y-3">
                {referencingRoadmaps.map(({ roadmap, stepIndex, step }) => (
                  <Link
                    key={roadmap.slug}
                    href={`/atelier/roadmaps/${roadmap.slug}`}
                    className="block group p-3.5 rounded-xl bg-background border border-foreground/5 hover:border-accent/40 shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-accent mb-1">
                      <span>🗺️</span>
                      <span className="truncate max-w-[150px]">{roadmap.title}</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground leading-normal">
                      Étape {stepIndex + 1} &middot; {step.title}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Fiches Section */}
      {relatedFiches.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-foreground/5">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Continuer à explorer</span>
              <h2 className="font-serif text-2xl md:text-3xl font-medium">Fiches similaires</h2>
            </div>
            
            <Link href={`/atelier/fiches?cat=${encodeURIComponent(fiche.category)}`} className="text-sm font-semibold text-accent hover:underline">
              Tout voir &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedFiches.map(({ fiche: item, reason, sharedTags }) => (
              <Link 
                key={item.slug} 
                href={`/atelier/fiches/${item.slug}`} 
                className="group bg-card border border-foreground/5 hover:border-accent/30 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
              >
                {/* Visual Segment */}
                {item.swatch ? (
                  <div className="h-16 flex border-b border-foreground/5">
                    {item.swatch.map((color) => (
                      <div key={color} className="flex-1 h-full" style={{ background: color }} />
                    ))}
                  </div>
                ) : (
                  <div className="h-16 w-full bg-gradient-to-r from-accent/10 to-amber-500/5 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-accent border-b border-foreground/5">
                    {item.category}
                  </div>
                )}

                <div className="p-4 flex-1 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[9px] uppercase font-bold tracking-wider text-muted-foreground/60">
                    <span>{item.category}</span>
                    <span className="text-accent">{reason}</span>
                  </div>
                  <h3 className="font-serif text-sm font-bold group-hover:text-accent transition-colors leading-tight line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {item.question}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mt-auto pt-2 border-t border-foreground/5">
                    {(sharedTags.length > 0 ? sharedTags : item.tags).slice(0, 2).map((tag) => (
                      <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] bg-foreground/5 text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
