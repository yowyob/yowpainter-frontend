'use client'

import { useQuery } from '@tanstack/react-query'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ArtworksService } from '@/lib/services/ArtworksService'
import type { ArtworkResponse } from '@/lib/models/ArtworkResponse'
import { SafeImage } from '@/components/ui/SafeImage'
import { Skeleton } from '@/components/ui/Skeleton'

function formatLabel(value?: string) {
  if (!value) return ''
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function getArtworkYear(artwork?: ArtworkResponse) {
  const date = artwork?.publishedAt || artwork?.createdAt
  if (!date) return new Date().getFullYear()
  return new Date(date).getFullYear()
}

export function LandingAcquisitions() {
  const t = useTranslations('Home')

  const { data: artworks, isLoading } = useQuery({
    queryKey: ['landing-latest-artworks'],
    queryFn: () => ArtworksService.getLatestArtworks(),
    staleTime: 5 * 60 * 1000,
  })

  const withImages = artworks?.filter((artwork) => artwork.imageUrls?.[0]) ?? []
  const [featured, vertical, panorama] = withImages

  return (
    <section className="w-full max-w-[1400px] mx-auto px-6 sm:px-12 mt-20 z-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-foreground/5 pb-10">
        <div className="relative group">
          <span className="w-24 h-[2px] bg-accent absolute -top-10 left-0 transition-all duration-700 group-hover:w-40" />
          <h2 className="font-serif text-6xl md:text-7xl font-light mb-6 text-foreground tracking-tighter">
            {t('newTitleStart')}{' '}
            <span className="italic font-normal">{t('newTitleAccent')}</span>
          </h2>
          <p className="text-foreground/40 font-light text-2xl max-w-md leading-tight">
            {t('newDescription')}
          </p>
        </div>
        <Link
          href="/galerie"
          className="group flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-accent hover:text-foreground transition-all mt-10 md:mt-0"
        >
          <span className="border-b border-accent/30 group-hover:border-foreground pb-2">
            {t('browseGallery')}
          </span>
          <span className="text-2xl transition-transform group-hover:translate-x-3">&rarr;</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-12 lg:gap-x-20">
          <Skeleton className="md:col-span-7 lg:col-span-8 aspect-[16/10]" />
          <Skeleton className="md:col-span-5 lg:col-span-4 aspect-[3/5] md:-translate-y-20" />
        </div>
      ) : withImages.length === 0 ? (
        <div className="text-center py-16 text-foreground/40 font-light italic border border-dashed border-foreground/10 rounded-3xl">
          {t('noArtworks')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 md:gap-x-12 lg:gap-x-20">
          <div className="md:col-span-7 lg:col-span-8 reveal">
            {featured && (
              <>
                <div className="relative w-full aspect-[16/10] art-frame bg-white p-4 mb-8 border border-foreground/5">
                  <div className="relative w-full h-full overflow-hidden">
                    <SafeImage
                      src={featured.imageUrls![0]}
                      alt={featured.title || t('largeArtworkAlt')}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700" />
                    <div className="absolute inset-0 flex flex-col justify-end p-10 opacity-0 hover:opacity-100 transition-all duration-700 translate-y-10 hover:translate-y-0">
                      <span className="text-white text-4xl font-serif mb-2 drop-shadow-lg">
                        {featured.title}
                      </span>
                      <span className="text-white/90 uppercase tracking-widest text-sm drop-shadow">
                        {formatLabel(featured.technique)}
                        {featured.dimensions ? ` · ${featured.dimensions}` : ''}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-3xl">01</span>
                  <div className="h-[1px] flex-1 bg-foreground/10" />
                  <span className="text-foreground/40 font-light italic">
                    {featured.artistName}
                  </span>
                </div>
              </>
            )}

            {panorama && (
              <div className="relative mt-20 -translate-x-6 md:-translate-x-12 w-full md:w-[110%] z-20">
                <svg
                  className="absolute -top-10 -left-10 w-40 h-20 text-accent/15 -z-10"
                  viewBox="0 0 200 100"
                >
                  <path
                    d="M10 50 L190 50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    strokeDasharray="10 5"
                  />
                </svg>
                <div className="relative w-full h-32 md:h-40 art-frame bg-white p-3 shadow-2xl overflow-hidden">
                  <div className="relative w-full h-full overflow-hidden">
                    <SafeImage
                      src={panorama.imageUrls![0]}
                      alt={panorama.title || t('panoramaAlt')}
                      fill
                      sizes="(max-width: 768px) 100vw, 900px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center p-8">
                      <span className="text-white text-sm uppercase tracking-[0.4em] font-medium">
                        {panorama.title}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-[10px] uppercase tracking-[0.5em] font-bold text-foreground/40 text-left">
                  {panorama.artistName} · {getArtworkYear(panorama)}
                </p>
              </div>
            )}
          </div>

          <div className="md:col-span-5 lg:col-span-4 md:-translate-y-20 reveal reveal-delay-2">
            {vertical && (
              <div className="mb-20">
                <div className="relative w-full aspect-[3/5] art-frame bg-white p-4 mb-6 shadow-xl">
                  <div className="relative w-full h-full overflow-hidden">
                    <SafeImage
                      src={vertical.imageUrls![0]}
                      alt={vertical.title || t('verticalAlt')}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 400px"
                      className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-xs uppercase tracking-widest text-accent mb-2">
                      {formatLabel(vertical.style)}
                    </span>
                    <h3 className="font-serif text-2xl font-medium">{vertical.title}</h3>
                  </div>
                  {vertical.artistName && (
                    <span className="text-sm font-light text-foreground/50 italic">
                      {vertical.artistName}
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="relative mt-12 flex justify-end pr-12">
              <div className="relative">
                <svg
                  className="w-32 h-32 text-accent/20 animate-spin-slow opacity-80"
                  viewBox="0 0 100 100"
                >
                  <path
                    d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z"
                    fill="currentColor"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] uppercase tracking-[0.4em] font-black text-foreground/40 rotate-12">
                    Y-P
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
