'use client'

import { useEffect, useRef, useState } from 'react'
import { Link } from '@/i18n/navigation'
import { useDemoStore } from '@/lib/atelier/context/DemoStoreContext'
import BarreRecherche from '@/components/atelier/BarreRecherche'

function FicheSwatch({ id, colors }: { id: string; colors: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const width = 300
    const height = 96
    canvas.width = width
    canvas.height = height

    const segmentWidth = width / colors.length
    colors.forEach((color, index) => {
      context.fillStyle = color
      context.fillRect(index * segmentWidth, 0, segmentWidth + 1, height)
    })

    // Noise/texture effect
    for (let index = 0; index < 800; index += 1) {
      const x = Math.random() * width
      const y = Math.random() * height
      context.fillStyle = `rgba(0,0,0,${Math.random() * 0.15})`
      context.fillRect(x, y, 1, 1)
    }
  }, [colors])

  return <canvas ref={canvasRef} id={id} width={300} height={96} className="w-full h-24 object-cover rounded-t-xl" />
}

export default function AtelierPage() {
  const { publishedFiches, publishedRoadmaps, questions, askQuestion, isHydrated } = useDemoStore()
  const [questionText, setQuestionText] = useState('')
  const [visitorName, setVisitorName] = useState('')
  const [formMessage, setFormMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const featuredRoadmap = publishedRoadmaps[0]
  const recentFiches = publishedFiches.slice(0, 3)
  const exampleFiche = publishedFiches.find((f) => f.slug === 'glacis') ?? publishedFiches[0]

  function handleQuestionSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!questionText.trim()) return

    try {
      askQuestion(questionText, visitorName)
      setQuestionText('')
      setVisitorName('')
      setFormMessage({ type: 'success', text: 'Votre question a été enregistrée avec succès ! Les peintres pourront y répondre.' })
      setTimeout(() => setFormMessage(null), 5000)
    } catch {
      setFormMessage({ type: 'error', text: 'Une erreur est survenue lors de l’enregistrement.' })
    }
  }

  if (!isHydrated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground animate-pulse text-sm">Chargement de l'Atelier...</p>
      </div>
    )
  }

  return (
    <div className="space-y-16 py-8">
      {/* Sub Header & Search Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-foreground/5">
        <div className="space-y-1">
          <h2 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">Atelier de Création</h2>
          <p className="text-muted-foreground text-sm">Découvrez nos fiches techniques, roadmaps guidées et interagissez avec les artistes.</p>
        </div>
        
        <div className="w-full md:w-96">
          <BarreRecherche
            fiches={publishedFiches}
            roadmaps={publishedRoadmaps}
            placeholder="Rechercher une technique, un médium..."
          />
        </div>
      </div>

      {/* Hero / Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-700/5 to-transparent border border-amber-500/10 p-8 md:p-12 lg:p-16 flex flex-col md:flex-row gap-10 items-center justify-between">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span>✨</span> Espace Savoir & Techniques
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light leading-tight">
            L'art plastique, <br />
            <span className="italic text-accent">maîtrisé.</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-lg leading-relaxed">
            Des fiches de connaissances autonomes et des parcours d'apprentissage structurés pour progresser à votre propre rythme.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/atelier/fiches" className="px-6 py-3 bg-accent hover:bg-accent/95 text-accent-foreground font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg">
              Explorer les fiches
            </Link>
            <Link href="/atelier/roadmaps" className="px-6 py-3 bg-background hover:bg-foreground/5 text-foreground border border-foreground/10 font-bold text-sm rounded-xl transition-all">
              Voir les roadmaps
            </Link>
          </div>
        </div>

        {/* Stats and Canvas Link */}
        <div className="bg-popover/40 backdrop-blur-md border border-foreground/5 p-6 rounded-2xl w-full md:w-80 space-y-6">
          <h3 className="font-serif text-lg font-medium">Quelques chiffres</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{publishedFiches.length}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Fiches</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{publishedRoadmaps.length}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Roadmaps</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">12</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Thèmes</div>
            </div>
          </div>
          <div className="pt-4 border-t border-foreground/5 text-center">
            <div className="text-xs text-muted-foreground mb-3">Envie d'esquisser une idée ?</div>
            <button 
              onClick={() => {
                // Dispatch event to open floating canvas
                window.dispatchEvent(new CustomEvent('open-paint-canvas'))
              }}
              className="w-full py-2 bg-foreground text-background dark:bg-background dark:text-foreground dark:hover:bg-foreground/5 hover:bg-foreground/90 transition-all rounded-lg font-bold text-xs"
            >
              🎨 Ouvrir la toile à dessin
            </button>
          </div>
        </div>
      </div>

      {/* Disciplines Section */}
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Thématiques</span>
            <h2 className="font-serif text-2xl md:text-3xl font-medium">Toutes les disciplines</h2>
          </div>
          <Link href="/atelier/categories" className="text-sm font-semibold text-accent hover:underline">
            Voir tout &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <Link href="/atelier/fiches" className="group p-6 rounded-2xl bg-card border border-foreground/5 hover:border-accent/40 shadow-sm transition-all duration-300 flex flex-col gap-4">
            <span className="text-3xl">🎨</span>
            <div>
              <h3 className="font-bold text-base group-hover:text-accent transition-colors">Peinture</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">Huile, acrylique, aquarelle, pigments et médiums.</p>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 mt-auto">84 fiches</span>
          </Link>
          <Link href="/atelier/categories" className="group p-6 rounded-2xl bg-card border border-foreground/5 hover:border-accent/40 shadow-sm transition-all duration-300 flex flex-col gap-4">
            <span className="text-3xl">✏️</span>
            <div>
              <h3 className="font-bold text-base group-hover:text-accent transition-colors">Dessin</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">Du croquis rapide à la perspective avancée.</p>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 mt-auto">52 fiches</span>
          </Link>
          <Link href="/atelier/roadmaps" className="group p-6 rounded-2xl bg-card border border-foreground/5 hover:border-accent/40 shadow-sm transition-all duration-300 flex flex-col gap-4">
            <span className="text-3xl">🗿</span>
            <div>
              <h3 className="font-bold text-base group-hover:text-accent transition-colors">Sculpture</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">Argile, plâtre, bronze, moulages et textures.</p>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 mt-auto">31 fiches</span>
          </Link>
          <Link href="/atelier/fiches" className="group p-6 rounded-2xl bg-card border border-foreground/5 hover:border-accent/40 shadow-sm transition-all duration-300 flex flex-col gap-4">
            <span className="text-3xl">🖨️</span>
            <div>
              <h3 className="font-bold text-base group-hover:text-accent transition-colors">Gravure</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">Taille-douce, linogravure, lithographie.</p>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 mt-auto">28 fiches</span>
          </Link>
          <Link href="/atelier/categories" className="group p-6 rounded-2xl bg-card border border-foreground/5 hover:border-accent/40 shadow-sm transition-all duration-300 flex flex-col gap-4">
            <span className="text-3xl">🖌️</span>
            <div>
              <h3 className="font-bold text-base group-hover:text-accent transition-colors">Mixed Media</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">Collage, techniques mixtes et art numérique.</p>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60 mt-auto">45 fiches</span>
          </Link>
        </div>
      </div>

      {/* Featured Roadmap Section */}
      {featuredRoadmap && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch bg-popover/20 border border-foreground/5 rounded-3xl p-8 md:p-10">
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Progresser étape par étape</span>
              <h2 className="font-serif text-3xl font-medium">Roadmap à la Une</h2>
              <p className="text-muted-foreground text-sm max-w-lg leading-relaxed">
                Suivez nos parcours ordonnés de fiches indépendantes pour acquérir une compétence complète de A à Z.
              </p>
            </div>

            <div className="space-y-4 my-6">
              {featuredRoadmap.steps.slice(0, 3).map((step, index) => (
                <div key={step.title} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-serif text-xs font-bold text-accent">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{step.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href={`/atelier/roadmaps/${featuredRoadmap.slug}`} className="inline-flex items-center gap-1.5 font-bold text-sm text-accent hover:underline">
              Parcourir le parcours complet &rarr;
            </Link>
          </div>

          <div className="lg:col-span-5 flex items-center justify-center bg-background/40 rounded-2xl border border-foreground/5 p-6 min-h-[300px]">
            {exampleFiche && (
              <Link href={`/atelier/fiches/${exampleFiche.slug}`} className="w-full bg-card hover:border-accent/30 hover:shadow-md transition-all border border-foreground/5 rounded-xl p-5 space-y-4">
                <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">Aperçu d'une fiche</div>
                <h3 className="font-serif text-xl font-bold">{exampleFiche.title}</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-foreground/5">
                    <span className="text-muted-foreground">Question</span>
                    <span className="font-medium text-accent text-right max-w-[200px] truncate">{exampleFiche.question}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-foreground/5">
                    <span className="text-muted-foreground">Catégorie</span>
                    <span className="font-medium">{exampleFiche.category}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-foreground/5">
                    <span className="text-muted-foreground">Niveau</span>
                    <span className="font-medium">{exampleFiche.level}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-foreground/5">
                    <span className="text-muted-foreground">Durée</span>
                    <span className="font-medium">{exampleFiche.duration}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Roadmap</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{featuredRoadmap.title}</span>
                  </div>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Recent Fiches Section */}
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Ressources</span>
            <h2 className="font-serif text-2xl md:text-3xl font-medium">Fiches techniques récentes</h2>
          </div>
          <Link href="/atelier/fiches" className="text-sm font-semibold text-accent hover:underline">
            Voir tout &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentFiches.map((fiche) => (
            <Link key={fiche.slug} href={`/atelier/fiches/${fiche.slug}`} className="group bg-card border border-foreground/5 hover:border-accent/30 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
              {fiche.swatch ? (
                <FicheSwatch id={`swatch-${fiche.slug}`} colors={fiche.swatch} />
              ) : (
                <div className="h-24 w-full bg-gradient-to-r from-accent/10 to-amber-500/10 flex items-center justify-center text-xs font-bold uppercase tracking-wider text-accent border-b border-foreground/5">
                  {fiche.category}
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col gap-3">
                <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">{fiche.category} · {fiche.tool}</div>
                <h3 className="font-serif text-lg font-bold group-hover:text-accent transition-colors">{fiche.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">❓ {fiche.question}</p>
                <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-foreground/5">
                  {fiche.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded text-[10px] bg-foreground/5 text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Visitor Questions Section */}
      <div className="space-y-8">
        <div className="space-y-1">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Échanges</span>
          <h2 className="font-serif text-2xl md:text-3xl font-medium">Questions des visiteurs</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Questions list */}
          <div className="lg:col-span-7 bg-card border border-foreground/5 p-6 rounded-2xl space-y-4">
            <h3 className="font-serif text-xl font-bold border-b border-foreground/5 pb-3">Interrogations récentes</h3>
            {questions.length === 0 ? (
              <p className="text-muted-foreground text-sm italic">Aucune question n'a encore été posée. Soyez le premier !</p>
            ) : (
              <div className="space-y-6 max-h-[420px] overflow-y-auto pr-2">
                {questions.map((q) => {
                  const dateStr = new Date(q.createdAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                  return (
                    <div key={q.id} className="border-b border-foreground/5 pb-4 last:border-0 last:pb-0 space-y-2">
                      <div className="flex justify-between items-center text-xs text-muted-foreground font-mono">
                        <span>👤 {q.authorName || 'Anonyme'}</span>
                        <span>{dateStr}</span>
                      </div>
                      <p className="text-sm font-medium leading-relaxed">{q.text}</p>
                      
                      {q.status === 'answered' ? (
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">● Répondu</span>
                          {q.ficheSlug ? (
                            <Link href={`/atelier/fiches/${q.ficheSlug}`} className="text-xs font-bold text-accent hover:underline">
                              Voir la réponse &rarr;
                            </Link>
                          ) : q.roadmapSlug ? (
                            <Link href={`/atelier/roadmaps/${q.roadmapSlug}`} className="text-xs font-bold text-accent hover:underline">
                              Voir la réponse &rarr;
                            </Link>
                          ) : null}
                        </div>
                      ) : (
                        <span className="inline-block px-2 py-0.5 text-[9px] font-bold rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">○ En attente d'un peintre</span>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Ask question form */}
          <div className="lg:col-span-5 bg-card border border-foreground/5 p-6 rounded-2xl space-y-4">
            <div className="border-b border-foreground/5 pb-3">
              <h3 className="font-serif text-xl font-bold">Poser une question</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Un peintre partenaire rédigera une fiche de connaissance dédiée pour y répondre.
              </p>
            </div>
            
            <form onSubmit={handleQuestionSubmit} className="space-y-4">
              <label className="flex flex-col gap-1 text-xs font-bold">
                <span>Votre question *</span>
                <textarea
                  required
                  rows={4}
                  placeholder="Ex: Quelle est la différence de séchage entre l'huile de lin et l'huile d'œillette ?"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  className="w-full px-3 py-2 border border-foreground/10 rounded-lg bg-background placeholder:text-muted-foreground/60 text-sm outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all resize-none"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs font-bold">
                <span>Votre nom ou pseudonyme (optionnel)</span>
                <input
                  type="text"
                  placeholder="Ex: Léonard"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full px-3 py-2 border border-foreground/10 rounded-lg bg-background placeholder:text-muted-foreground/60 text-sm outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all"
                />
              </label>

              <button 
                type="submit" 
                className="w-full py-2.5 bg-accent hover:bg-accent/95 text-accent-foreground font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Soumettre ma question
              </button>

              {formMessage && (
                <div
                  className={`p-3 text-xs rounded-lg border text-center ${
                    formMessage.type === 'success'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                  }`}
                >
                  {formMessage.text}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
