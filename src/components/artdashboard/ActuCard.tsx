import Image from 'next/image'
import { Edit2, Trash2, Play } from 'lucide-react'
import { ActuResponse } from '@/lib/models/ActuResponse'
import { useTranslations } from 'next-intl'

type Props = {
  actu: ActuResponse
  date: string
  onEdit?: () => void
  onDelete?: () => void
}

export default function ActuCard({ actu, date, onEdit, onDelete }: Props) {
  const t = useTranslations('Dashboard')
  const isVideo = actu.mediaType === ActuResponse.mediaType.VIDEO || !!actu.videoUrl

  return (
    <div className="group">
      <div className="rounded-xl overflow-visible relative shadow-sm bg-card-surface transition-transform duration-300 hover:-translate-y-1">
        <div className="w-full rounded-t-xl overflow-hidden relative" style={{ aspectRatio: '16/9' }}>
          {actu.imageUrl ? (
            <>
              <Image
                src={actu.imageUrl}
                alt={actu.title || t('actuCardFallback')}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
              {isVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div
              className="w-full h-full flex items-center justify-center font-display text-xs text-white/20"
              style={{ background: 'linear-gradient(135deg,#2e2a27,#1E1C1A)' }}
            >
              {isVideo ? t('video') : t('noImage')}
            </div>
          )}
        </div>

        <div className="px-3.5 pb-3 pt-2.5 relative">
          <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-cream" />
          <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-cream" />
          <div className="border-t border-dashed border-white/[0.12] mb-2" />

          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[13px] text-card-surface-fg font-medium leading-snug mb-0.5 truncate">
                {actu.title || t('actuUntitled')}
              </div>
              <div className="text-[11px] text-card-surface-muted">{date}</div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button
                onClick={onEdit}
                className="p-1.5 rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                title={t('edit')}
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 rounded-full bg-white/5 text-rose-500/60 hover:bg-rose-500/20 hover:text-rose-500 transition-colors"
                title={t('delete')}
              >
                <Trash2 size={12} />
              </button>
            </div>
          </div>

          {actu.comment && (
            <p className="text-[11px] text-white/40 mt-2 line-clamp-2 italic leading-relaxed">
              &ldquo;{actu.comment}&rdquo;
            </p>
          )}

          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-accent font-medium uppercase tracking-wider">
              {isVideo ? t('video') : t('image')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
