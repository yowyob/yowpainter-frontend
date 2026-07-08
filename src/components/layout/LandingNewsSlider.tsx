'use client'

import { useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { LandingActuItem } from '@/lib/models/LandingActuItem'
import { ActuFeedCard } from '@/components/actu/ActuFeedCard'
import { cn } from '@/lib/utils'

interface LandingNewsSliderProps {
  items: LandingActuItem[]
}

function useVisibleCount() {
  const [count, setCount] = useState(3)

  useLayoutEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setCount(1)
      else if (window.innerWidth < 1024) setCount(2)
      else setCount(3)
    }

    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return count
}

export function LandingNewsSlider({ items }: LandingNewsSliderProps) {
  const locale = useLocale()
  const t = useTranslations('Actu')
  const visibleCount = useVisibleCount()
  const containerRef = useRef<HTMLDivElement>(null)
  const [cardWidthPx, setCardWidthPx] = useState(320)
  const [isPaused, setIsPaused] = useState(false)

  const gapPx = 20

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => {
      const width = el.getBoundingClientRect().width
      if (width > 0) {
        setCardWidthPx((width - (visibleCount - 1) * gapPx) / visibleCount)
      }
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [visibleCount])

  const canSlide = items.length > 1
  const loopItems = useMemo(() => (canSlide ? [...items, ...items] : items), [canSlide, items])
  const marqueeDuration = `${Math.max(items.length * 6, 12)}s`

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'short',
    })
  }

  if (items.length === 0) return null

  return (
    <div
      ref={containerRef}
      className="w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => {
        window.setTimeout(() => setIsPaused(false), 2500)
      }}
    >
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 md:w-20 z-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 md:w-20 z-10 bg-gradient-to-l from-background to-transparent" />

        <div className="overflow-hidden">
          <div
            className={cn('flex gap-5', canSlide && 'landing-news-track', isPaused && 'is-paused')}
            style={
              canSlide
                ? ({ '--marquee-duration': marqueeDuration } as CSSProperties)
                : undefined
            }
          >
            {loopItems.map((item, i) => (
              <ActuFeedCard
                key={`${item.id ?? 'actu'}-${i}`}
                item={item}
                formatDate={formatDate}
                imageAlt={t('imageAlt')}
                width={cardWidthPx}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
