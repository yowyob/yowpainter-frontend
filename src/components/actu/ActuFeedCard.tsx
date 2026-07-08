'use client'

import Image from 'next/image'
import { Play } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { ActuResponse } from '@/lib/models/ActuResponse'
import { LandingActuItem } from '@/lib/models/LandingActuItem'
import { cn } from '@/lib/utils'

interface ActuFeedCardProps {
  item: LandingActuItem
  formatDate: (date?: string) => string
  imageAlt: string
  interactive?: boolean
  width?: number
  className?: string
}

export function ActuFeedCard({
  item,
  formatDate,
  imageAlt,
  interactive = false,
  width,
  className,
}: ActuFeedCardProps) {
  const isVideo = item.mediaType === ActuResponse.mediaType.VIDEO || !!item.videoUrl
  const href = item.artistSlug ? `/${item.artistSlug}/actu` : undefined

  const card = (
    <article
      className={cn(
        'flex flex-col h-full border border-foreground/5 dark:border-[var(--card-surface-border)] bg-card-elevated dark:bg-card-surface backdrop-blur-sm shadow-sm overflow-hidden',
        interactive ? 'cursor-pointer hover:shadow-lg hover:border-accent/30 transition-all duration-300' : 'cursor-default select-none',
        className,
      )}
      style={width ? { width, flexShrink: 0 } : undefined}
    >
      <div className={cn('relative aspect-[4/3] bg-black/5 overflow-hidden', !interactive && 'pointer-events-none')}>
        {item.imageUrl ? (
          <>
            <Image
              src={item.imageUrl}
              alt={item.title || imageAlt}
              fill
              sizes={width ? `${width}px` : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'}
              className={cn('object-cover', interactive && 'transition-transform duration-500 group-hover:scale-105')}
              draggable={false}
            />
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                <Play className="w-7 h-7 text-white fill-white" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-foreground/5">
            <span className="text-foreground/20 font-serif text-2xl italic">—</span>
          </div>
        )}

        {(item.publishedAt || item.createdAt) && (
          <div className="absolute top-3 left-3 bg-accent/90 text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
            {formatDate(item.publishedAt || item.createdAt)}
          </div>
        )}
      </div>

      <div className={cn('flex flex-col flex-1 p-5 gap-2', !interactive && 'pointer-events-none')}>
        {item.artistName && (
          <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-accent truncate">
            {item.artistName}
          </span>
        )}
        {item.title && (
          <h3 className={cn('font-serif text-lg font-medium leading-snug line-clamp-2 dark:text-card-surface-fg', interactive && 'group-hover:text-accent transition-colors')}>
            {item.title}
          </h3>
        )}
        {item.comment && (
          <p className="text-sm text-foreground/55 dark:text-card-surface-muted font-light italic line-clamp-3 leading-relaxed mt-auto">
            &ldquo;{item.comment}&rdquo;
          </p>
        )}
      </div>
    </article>
  )

  if (interactive && href) {
    return (
      <Link href={href} className="group block h-full">
        {card}
      </Link>
    )
  }

  return card
}
