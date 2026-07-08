'use client'

import { Link } from '@/i18n/navigation'

const oeuvres = [
  { id: 1, title: 'Composition en bleu', artist: 'Marie Durand', technique: 'Huile sur toile', year: '2024', img: '/assets/img/AdobeStock_343421667.jpeg' },
  { id: 2, title: 'Paysage automnal', artist: 'Marc Renaud', technique: 'Aquarelle', year: '2023', img: '/assets/img/AdobeStock_374970185.jpeg' },
  { id: 3, title: 'Abstraction minérale', artist: 'Sophie Dumas', technique: 'Acrylique', year: '2025', img: '/assets/img/joseph-morris-Tac8FvqAnEw-unsplash.jpg' },
  { id: 4, title: 'Nature morte aux pigments', artist: 'Pierre Lavigne', technique: 'Huile sur panneau', year: '2024', img: '/assets/img/mick-haupt-8tN0Uq0GjCs-unsplash.jpg' },
  { id: 5, title: 'Fresque urbaine', artist: 'Jean-Marc Olivier', technique: 'Fresque', year: '2023', img: '/assets/img/steptodown.com255980.jpg' },
  { id: 6, title: 'Étude botanique', artist: 'Marie-Hélène Vu', technique: 'Aquarelle', year: '2025', img: '/assets/img/steptodown.com559072.jpg' },
  { id: 7, title: 'Portrait en glacis', artist: 'Nathalie Perrin', technique: 'Huile', year: '2024', img: '/assets/img/steptodown.com917188.jpg' },
  { id: 8, title: 'Gravure atmosphérique', artist: 'Thomas Collet', technique: 'Linogravure', year: '2025', img: '/assets/img/steptodown.com999905.jpg' },
  { id: 9, title: 'Pastel provençal', artist: 'Élise Pontier', technique: 'Pastel sec', year: '2023', img: '/assets/img/378583.png' },
]

export default function OeuvresPage() {
  return (
    <div className="space-y-12 py-8">
      {/* Breadcrumb & Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
          <Link href="/atelier" className="hover:text-accent">Atelier</Link>
          <span>/</span>
          <span className="text-foreground">Œuvres</span>
        </div>
        
        <div className="space-y-2 border-b border-foreground/5 pb-6">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-accent">Galerie Exposition</span>
          <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">Exposition d'œuvres</h1>
          <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
            Découvrez les créations virtuelles des peintres de notre communauté — une vitrine de savoir-faire technique et de sensibilité artistique.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {oeuvres.map((oeuvre) => (
          <article 
            key={oeuvre.id} 
            className="group bg-card border border-foreground/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500"
          >
            {/* Image Container with Hover zoom */}
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <img 
                src={oeuvre.img} 
                alt={oeuvre.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="px-4 py-2 bg-white text-black font-serif text-xs rounded-full shadow">
                  Aperçu de l'œuvre
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="p-5 space-y-2">
              <h3 className="font-serif text-lg font-bold truncate group-hover:text-accent transition-colors">
                {oeuvre.title}
              </h3>
              <p className="text-xs text-accent font-medium">👤 {oeuvre.artist}</p>
              <p className="text-[11px] text-muted-foreground">
                {oeuvre.technique} &middot; {oeuvre.year}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Footer Note */}
      <div className="text-center p-6 bg-accent/5 rounded-2xl border border-accent/10 max-w-xl mx-auto mt-8">
        <p className="text-xs text-muted-foreground">
          Ces œuvres sont présentées à titre d'exposition virtuelle. Pour contribuer et proposer vos créations, veuillez vous connecter ou créer un compte.
        </p>
      </div>
    </div>
  )
}
