'use client'

import { Link } from '@/i18n/navigation'
import { Palette, Pencil, Gem, Printer, Paintbrush } from 'lucide-react'

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  peinture: <Palette className="w-8 h-8" />,
  dessin: <Pencil className="w-8 h-8" />,
  sculpture: <Gem className="w-8 h-8" />,
  gravure: <Printer className="w-8 h-8" />,
  'mixed-media': <Paintbrush className="w-8 h-8" />
}

const categoriesList = [
  { slug: 'peinture', name: 'Peinture', desc: 'Huile, acrylique, aquarelle, tempera — maîtrisez chaque médium avec des guides complets et des fiches pigments.', count: 84, color: 'bg-amber-700/20 text-amber-700 dark:text-amber-300 border-amber-700/20' },
  { slug: 'dessin', name: 'Dessin', desc: 'Du croquis à la perspective avancée — fusain, graphite, sanguine et techniques mixtes sur papier.', count: 52, color: 'bg-emerald-700/20 text-emerald-700 dark:text-emerald-300 border-emerald-700/20' },
  { slug: 'sculpture', name: 'Sculpture', desc: 'Argile, bronze, résine, pierre et matières — modelage, taille directe et moulage.', count: 31, color: 'bg-rose-700/20 text-rose-700 dark:text-rose-300 border-rose-700/20' },
  { slug: 'gravure', name: 'Gravure', desc: 'Taille-douce, lithographie, sérigraphie, linogravure — techniques d\'impression artistique.', count: 28, color: 'bg-blue-700/20 text-blue-700 dark:text-blue-300 border-blue-700/20' },
  { slug: 'mixed-media', name: 'Mixed Media', desc: 'Collage, assemblage, art numérique, installations — quand les disciplines se rencontrent.', count: 45, color: 'bg-purple-700/20 text-purple-700 dark:text-purple-300 border-purple-700/20' },
]

export default function CategoriesPage() {
  return (
    <div className="space-y-12 py-8">
      {/* Breadcrumb & Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/atelier" className="hover:text-accent">Atelier</Link>
          <span>/</span>
          <span className="text-foreground">Catégories</span>
        </div>
        
        <div className="space-y-2 border-b border-foreground/5 pb-6">
          <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">Catégories de savoirs</h1>
          <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
            Chaque catégorie regroupe des fiches de connaissance par domaine. Chaque fiche appartient à une catégorie qui la contextualise — explorez-les pour découvrir tous les savoirs.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categoriesList.map((cat) => (
          <Link 
            key={cat.slug} 
            href={`/atelier/fiches?categorie=${cat.slug}`} 
            className="group flex items-start gap-5 p-6 rounded-2xl bg-card border border-foreground/5 hover:border-accent/40 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className={`flex-shrink-0 w-16 h-16 rounded-xl border flex items-center justify-center ${cat.color}`}>
              {CATEGORY_ICONS[cat.slug]}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg group-hover:text-accent transition-colors">{cat.name}</h3>
                <span className="text-muted-foreground/40 group-hover:text-accent group-hover:translate-x-1 transition-all text-xl">&rarr;</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{cat.desc}</p>
              <div className="text-[10px] uppercase font-bold tracking-wider text-accent pt-2">
                {cat.count} fiches de connaissance
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
