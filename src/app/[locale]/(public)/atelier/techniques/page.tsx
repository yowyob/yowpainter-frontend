'use client'

import { Link } from '@/i18n/navigation'
import { useDemoStore } from '@/lib/atelier/context/DemoStoreContext'

export default function TechniquesPage() {
  const { publishedFiches, isHydrated } = useDemoStore()

  const techniquesList = [
    { name: 'Glacis', slug: 'glacis', desc: 'Couche de peinture transparente posée sur une couche sèche pour modifier la teinte sans masquer les valeurs sous-jacentes.', icon: '🎨', level: 'Intermédiaire' },
    { name: 'Imprimature', slug: 'imprimature', desc: 'Teinte de fond qui établit une valeur moyenne et guide les ombres et les lumières dès l\'ébauche.', icon: '🖌️', level: 'Intermédiaire' },
    { name: 'Impasto', slug: null as string | null, desc: 'Application de peinture en couches épaisses, créant relief et texture visibles — typique de la peinture à l\'huile.', icon: '🗿', level: 'Avancé' },
    { name: 'Frottis', slug: null as string | null, desc: 'Couche très mince de peinture opaque frottée sur la toile pour créer une transition douce entre deux tons.', icon: '✏️', level: 'Intermédiaire' },
    { name: 'Sfumato', slug: null as string | null, desc: 'Technique de flou artistique sans contours nets, popularisée par Léonard de Vinci — transition vaporeuse.', icon: '🌫️', level: 'Avancé' },
    { name: 'Grisaille', slug: null as string | null, desc: 'Peinture monochrome en nuances de gris servant de sous-couche pour établir les valeurs avant les glacis colorés.', icon: '⬜', level: 'Intermédiaire' },
    { name: 'Vernis à retoucher', slug: null as string | null, desc: 'Vernis temporaire appliqué sur une couche sèche pour raviver les couleurs et permettre la reprise du travail.', icon: '✨', level: 'Débutant' },
    { name: 'Préparation du support', slug: 'gesso-acrylique', desc: 'Apprêtage avec gesso acrylique pour uniformiser l\'absorption, sécuriser le fond et améliorer l\'accroche.', icon: '📐', level: 'Débutant' },
  ]

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
          <span className="text-foreground">Techniques</span>
        </div>
        
        <div className="space-y-2 border-b border-foreground/5 pb-6">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Savoir-faire</span>
          <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">Techniques picturales</h1>
          <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
            Les techniques sont des savoir-faire spécifiques décrits dans nos fiches. Chaque fiche peut traiter d'une ou plusieurs techniques — apprenez-les, maîtrisez-les et combinez-les.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {techniquesList.map((technique) => {
          const fiche = technique.slug ? publishedFiches.find((f) => f.slug === technique.slug) : null
          return (
            <div 
              key={technique.name} 
              className="flex flex-col bg-card border border-foreground/5 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-xl text-accent border border-accent/20">
                {technique.icon}
              </div>
              
              <div className="flex-1 space-y-2">
                <h3 className="font-bold text-lg">{technique.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{technique.desc}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-foreground/5 mt-auto">
                <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-foreground/5 text-muted-foreground uppercase tracking-wider">
                  {technique.level}
                </span>
                
                {fiche ? (
                  <Link href={`/atelier/fiches/${fiche.slug}`} className="text-xs font-bold text-accent hover:underline">
                    Voir la fiche &rarr;
                  </Link>
                ) : (
                  <span className="text-xs text-muted-foreground/60 italic font-medium">Fiche à venir</span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
