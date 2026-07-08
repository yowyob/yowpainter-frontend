'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { ActuResponse } from '@/lib/models/ActuResponse'
import { LandingActuItem } from '@/lib/models/LandingActuItem'
import { cn } from '@/lib/utils'
import { Link } from '@/i18n/navigation'
import { useLocale, useTranslations } from 'next-intl'

interface ActuCarouselProps {
  items: Array<ActuResponse | LandingActuItem>
  autoPlay?: boolean
  showArtist?: boolean
}

export function ActuCarousel({ items, autoPlay = false, showArtist = false }: ActuCarouselProps) {
  const locale = useLocale()
  const t = useTranslations('Actu')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const touchStartX = useRef(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const current = items[currentIndex]
  const isVideo = current.mediaType === ActuResponse.mediaType.VIDEO || !!current.videoUrl
  const artistSlug = showArtist ? (current as LandingActuItem).artistSlug : undefined
  const artistName = showArtist ? (current as LandingActuItem).artistName : undefined

  const goTo = useCallback((index: number) => {
    if (index >= 0 && index < items.length) {
      setCurrentIndex(index)
      setIsPlaying(false)
    }
  }, [items.length])

  const go = useCallback((dir: number) => {
    if (autoPlay) {
      setCurrentIndex((prev) => {
        const next = prev + dir
        if (next < 0) return items.length - 1
        if (next >= items.length) return 0
        return next
      })
      setIsPlaying(false)
      return
    }
    goTo(currentIndex + dir)
  }, [autoPlay, currentIndex, goTo, items.length])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [go])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }, [currentIndex])

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return

    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1 >= items.length ? 0 : prev + 1))
      setIsPlaying(false)
    }, 6000)

    return () => window.clearInterval(interval)
  }, [autoPlay, items.length])

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      go(diff > 0 ? 1 : -1)
    }
  }

  if (items.length === 0) return null

  return (
    <div className="w-full reveal">
      {/* Carousel principal */}
      <div
        className="relative overflow-hidden border border-foreground/5 shadow-2xl bg-foreground/[0.02]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Zone média */}
        <div className="relative aspect-[16/10] md:aspect-[21/9] bg-black/5">
          {isVideo && current.videoUrl ? (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                src={current.videoUrl}
                poster={current.imageUrl}
                controls={isPlaying}
                className="w-full h-full object-cover"
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              {!isPlaying && (
                <button
                  onClick={() => {
                    setIsPlaying(true)
                    videoRef.current?.play()
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 group transition-colors hover:bg-black/40"
                  aria-label={t('playVideo')}
                >
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white fill-white ml-1" />
                  </div>
                </button>
              )}
            </div>
          ) : current.imageUrl ? (
            <Image
              src={current.imageUrl}
              alt={current.title || t('imageAlt')}
              fill
              sizes="(max-width: 768px) 100vw, 80vw"
              className="object-cover transition-transform duration-[2s]"
              priority={currentIndex === 0}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-foreground/5">
              <span className="text-foreground/20 font-serif text-6xl italic">{t('noMedia')}</span>
            </div>
          )}

          {/* Overlay dégradé bas */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

          {/* Compteur */}
          <div className="absolute top-6 right-6 bg-black/40 backdrop-blur-xl text-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] border border-white/10">
            {currentIndex + 1} / {items.length}
          </div>

          {/* Date */}
          {(current.publishedAt || current.createdAt) && (
            <div className="absolute top-6 left-6 bg-accent text-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] shadow-xl">
              {formatDate(current.publishedAt || current.createdAt)}
            </div>
          )}
        </div>

        {/* Commentaire */}
        <div className="p-8 md:p-12 bg-card-elevated dark:bg-card-surface backdrop-blur-sm border-t border-foreground/5 dark:border-[var(--card-surface-border)]">
          {artistName && artistSlug && (
            <Link
              href={`/${artistSlug}/actu`}
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-accent hover:text-foreground transition-colors mb-4"
            >
              {artistName}
            </Link>
          )}
          {current.title && (
            <h3 className="font-serif text-2xl md:text-3xl font-light mb-4 tracking-tight">
              {current.title}
            </h3>
          )}
          {current.comment && (
            <blockquote className="relative">
              <div className="absolute -left-4 top-0 w-[2px] h-full bg-accent" />
              <p className="text-lg md:text-xl text-foreground/80 font-light leading-relaxed italic pl-6">
                &ldquo;{current.comment}&rdquo;
              </p>
            </blockquote>
          )}
        </div>

        {/* Flèches navigation */}
        {items.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              disabled={!autoPlay && currentIndex === 0}
              className={cn(
                'absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center',
                'bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-white/30',
                'text-white hover:bg-accent hover:border-accent transition-all duration-300',
                'disabled:opacity-30 disabled:pointer-events-none'
              )}
              aria-label={t('previous')}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => go(1)}
              disabled={!autoPlay && currentIndex === items.length - 1}
              className={cn(
                'absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center',
                'bg-white/20 dark:bg-black/40 backdrop-blur-xl border border-white/30',
                'text-white hover:bg-accent hover:border-accent transition-all duration-300',
                'disabled:opacity-30 disabled:pointer-events-none'
              )}
              aria-label={t('next')}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Indicateurs (dots) */}
      {items.length > 1 && (
        <div className="flex justify-center gap-3 mt-8">
          {items.map((item, i) => (
            <button
              key={item.id ?? i}
              onClick={() => goTo(i)}
              className={cn(
                'transition-all duration-300 rounded-full',
                i === currentIndex
                  ? 'w-8 h-2 bg-accent'
                  : 'w-2 h-2 bg-foreground/20 hover:bg-foreground/40'
              )}
              aria-label={t('goToSlide', { index: i + 1 })}
            />
          ))}
        </div>
      )}

      {/* Miniatures */}
      {items.length > 1 && (
        <div className="mt-10 flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {items.map((item, i) => {
            const thumbIsVideo = item.mediaType === ActuResponse.mediaType.VIDEO || !!item.videoUrl
            return (
              <button
                key={item.id ?? i}
                onClick={() => goTo(i)}
                className={cn(
                  'relative shrink-0 w-24 h-16 md:w-32 md:h-20 overflow-hidden snap-start border-2 transition-all duration-300',
                  i === currentIndex
                    ? 'border-accent scale-105 shadow-lg'
                    : 'border-transparent opacity-60 hover:opacity-100'
                )}
              >
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.title || ''}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-foreground/10 flex items-center justify-center">
                    {thumbIsVideo && <Play className="w-4 h-4 text-foreground/40" />}
                  </div>
                )}
                {thumbIsVideo && item.imageUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
