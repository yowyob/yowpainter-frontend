import Image from 'next/image'
import type { Work } from './types'

export default function FrameCard({ work, onClick }: { work: Work; onClick: () => void }) {
  const mainImage = work.imageUrls?.[0]
  const hasVideos = work.videoUrls && work.videoUrls.length > 0
  const mainVideo = work.videoUrls?.[0]

  return (
    <div className="cursor-pointer group" onClick={onClick}>
      <div className="wood-outer relative overflow-hidden rounded-sm p-2.5 transition-all duration-500 hover:shadow-2xl">
        <div className="wood-inner rounded-px p-0.5">
          <div className="relative aspect-square overflow-hidden bg-ink">
            {mainImage ? (
              <Image 
                src={mainImage} 
                alt={work.title} 
                fill 
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 hover:scale-[1.03]" 
              />
            ) : mainVideo ? (
              <div className="relative w-full h-full bg-black">
                <video 
                  src={mainVideo} 
                  className="object-cover w-full h-full opacity-90 transition-transform duration-700 hover:scale-[1.03]" 
                  preload="metadata" 
                  muted 
                  playsInline 
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm shadow-md">
                    <svg className="w-3.5 h-3.5 text-white ml-0.5 fill-current" viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="absolute inset-0 flex items-center justify-center font-display text-xs text-white/80 text-center p-2"
                style={{ background: work.bg }}
              >
                {work.title}
              </div>
            )}
            {/* stats overlay */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2.5 px-2 pb-1.5 pt-5"
                 style={{ background: 'linear-gradient(to top,rgba(20,16,12,.75),transparent)' }}>
              <span className="flex items-center gap-1 text-[11px] text-white/90">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {work.likes}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-white/90">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                {work.comments}
              </span>
            </div>
            {/* video badge */}
            {hasVideos && (
              <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 text-white/80 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider backdrop-blur-sm">
                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                <span>Vidéo</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
