'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ArtistResponse } from '@/lib/models/ArtistResponse'
import { ActuService } from '@/lib/services/ActuService'
import { ActuCarousel } from '@/components/artist/ActuCarousel'
import { Skeleton } from '@/components/ui/Skeleton'

interface ActuContentProps {
  slug: string
  artist: ArtistResponse
}

export default function ActuContent({ slug, artist }: ActuContentProps) {
  const t = useTranslations('Actu')
  const displayName = artist.artistName || `${artist.firstName ?? ''} ${artist.lastName ?? ''}`.trim()

  const { data: actuItems, isLoading, isError } = useQuery({
    queryKey: ['artist-public-actu', slug],
    queryFn: () => ActuService.getActuByArtistSlug(slug),
    enabled: !!slug,
    retry: 1,
  })

  return (
    <div className="w-full pt-32 pb-24 px-6 sm:px-12 max-w-[1400px] mx-auto min-h-screen canvas-texture canvas-grain relative">

      {/* Décorations */}
      <div className="absolute inset-0 z-[-5] pointer-events-none overflow-hidden">
        <svg className="absolute top-[10%] right-[-5%] w-[25vw] h-[25vw] text-accent/10 opacity-60" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="8,12" />
        </svg>
        <div className="absolute bottom-[20%] left-[-3%] w-24 h-24 rounded-full border border-accent/20 opacity-40" />
      </div>

      {/* Fil d'Ariane & Titre */}
      <div className="flex flex-col gap-6 mb-16 reveal relative z-10">
        <nav className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/30 flex-wrap">
          <Link href="/" className="hover:text-accent transition-colors">YowPainter</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link href={`/${slug}`} className="hover:text-accent transition-colors">{displayName}</Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-accent">{t('breadcrumb')}</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="relative">
            <h1 className="font-serif text-5xl md:text-7xl font-light tracking-tighter text-foreground">
              {t('titleMain')} <span className="italic font-normal text-accent">{t('titleAccent')}</span>
            </h1>
            <div className="absolute -bottom-2 left-0 w-32 h-[1px] bg-accent" />
          </div>
          <p className="text-foreground/40 max-w-sm font-light italic text-lg leading-tight">
            {t('intro', { name: displayName })}
          </p>
        </div>
      </div>

      {/* Contenu carousel */}
      <div className="relative z-10">
        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="w-full aspect-[21/9]" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : isError ? (
          <div className="text-center py-24 border border-dashed border-foreground/10 rounded-3xl">
            <p className="text-foreground/50 font-light italic mb-6">{t('errorDescription')}</p>
            <Link
              href={`/${slug}`}
              className="text-accent underline uppercase tracking-widest text-xs font-bold"
            >
              {t('backToArtist')}
            </Link>
          </div>
        ) : actuItems && actuItems.length > 0 ? (
          <ActuCarousel items={actuItems} />
        ) : (
          <div className="text-center py-24 text-foreground/40 font-light italic border border-dashed border-foreground/10 rounded-3xl">
            <p className="mb-6">{t('empty')}</p>
            <Link
              href={`/${slug}`}
              className="text-accent underline uppercase tracking-widest text-xs font-bold"
            >
              {t('backToArtist')}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
