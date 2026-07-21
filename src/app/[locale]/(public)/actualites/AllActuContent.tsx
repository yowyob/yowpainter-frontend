'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { ActuService } from '@/lib/services/ActuService'
import { ActuFeedCard } from '@/components/actu/ActuFeedCard'
import { Skeleton } from '@/components/ui/Skeleton'

export default function AllActuContent() {
  const locale = useLocale()
  const t = useTranslations('AllActu')
  const tActu = useTranslations('Actu')

  const { data: actuItems, isLoading, isError } = useQuery({
    queryKey: ['all-public-actu'],
    queryFn: () => ActuService.getLatestPublicActu(),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="w-full pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 md:px-12 max-w-[1400px] mx-auto min-h-screen canvas-texture canvas-grain relative">
      <div className="absolute inset-0 z-[-5] pointer-events-none overflow-hidden">
        <svg className="absolute top-[10%] right-[-5%] w-[25vw] h-[25vw] text-accent/10 opacity-60" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="8,12" />
        </svg>
      </div>

      <div className="flex flex-col gap-4 sm:gap-6 mb-10 sm:mb-16 relative z-10">
        <nav className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/30 flex-wrap">
          <Link href="/" className="hover:text-accent transition-colors">
            YowPainter
          </Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-accent">{t('breadcrumb')}</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 border-b border-foreground/5 pb-8 sm:pb-10">
          <div className="relative">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl font-light tracking-tighter text-foreground">
              {t('titleMain')}{' '}
              <span className="italic font-normal text-accent">{t('titleAccent')}</span>
            </h1>
            <div className="absolute -bottom-2 left-0 w-20 sm:w-32 h-[1px] bg-accent" />
          </div>
          <p className="text-foreground/40 max-w-md font-light italic text-base sm:text-lg leading-tight">
            {t('description')}
          </p>
        </div>
      </div>

      <div className="relative z-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16 sm:py-24 border border-dashed border-foreground/10 rounded-3xl">
            <p className="text-foreground/50 font-light italic">{tActu('errorDescription')}</p>
          </div>
        ) : actuItems && actuItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
            {actuItems.map((item, i) => (
              <ActuFeedCard
                key={item.id ?? i}
                item={item}
                formatDate={formatDate}
                imageAlt={tActu('imageAlt')}
                interactive
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-foreground/40 font-light italic border border-dashed border-foreground/10 rounded-3xl">
            {tActu('empty')}
          </div>
        )}
      </div>
    </div>
  )
}
