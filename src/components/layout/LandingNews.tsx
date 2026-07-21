'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ActuService } from '@/lib/services/ActuService'
import { LandingNewsSlider } from '@/components/layout/LandingNewsSlider'
import { Skeleton } from '@/components/ui/Skeleton'

export function LandingNews() {
  const t = useTranslations('LandingNews')

  const { data: actuItems, isLoading, isError } = useQuery({
    queryKey: ['landing-news'],
    queryFn: () => ActuService.getLatestPublicActu(12),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })

  if (!isLoading && (isError || !actuItems?.length)) {
    return null
  }

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 mt-16 sm:mt-24 z-10 relative">
      <div className="flex flex-col gap-4 sm:gap-6 mb-10 sm:mb-16">
        <nav className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-foreground/30 flex-wrap">
          <Link href="/" className="hover:text-accent transition-colors">
            YowPainter
          </Link>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <Link href="/actualites" className="hover:text-accent transition-colors">
            {t('breadcrumb')}
          </Link>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 border-b border-foreground/5 pb-8 sm:pb-10">
          <div className="relative">
            <span className="w-16 sm:w-24 h-[2px] bg-accent absolute -top-6 sm:-top-10 left-0" />
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter text-foreground">
              {t('titleMain')}{' '}
              <span className="italic font-normal text-accent">{t('titleAccent')}</span>
            </h2>
            <div className="absolute -bottom-2 left-0 w-20 sm:w-32 h-[1px] bg-accent" />
          </div>
          <div className="flex flex-col items-start md:items-end gap-3 sm:gap-4">
            <p className="text-foreground/40 max-w-md font-light italic text-base sm:text-lg leading-tight md:text-right">
              {t('description')}
            </p>
            <Link
              href="/actualites"
              className="text-xs uppercase tracking-[0.3em] font-bold text-accent border border-accent/30 px-5 sm:px-6 py-2.5 hover:bg-accent hover:text-white transition-all"
            >
              {t('cta')}
            </Link>
          </div>
        </div>
      </div>

      <div className="relative z-10 min-h-[280px]">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full" />
            ))}
          </div>
        ) : (
          actuItems && <LandingNewsSlider items={actuItems} />
        )}
      </div>
    </section>
  )
}
