import { getTranslations } from 'next-intl/server'
import { Star, Quote } from 'lucide-react'

interface TestimonialItem {
  name: string
  role: string
  initials: string
  rating: number
  quote: string
}

export async function Testimonials() {
  const t = await getTranslations('Testimonials')
  const items = t.raw('items') as TestimonialItem[]

  return (
    <section className="relative w-full mt-16 sm:mt-24 md:mt-32 px-4 sm:px-6 md:px-12 overflow-x-hidden">
      <div
        className="absolute left-[-6%] top-[20%] z-0 h-[35vw] max-h-[420px] w-[35vw] max-w-[420px] animate-blob bg-accent/8 blur-[100px]"
        style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', pointerEvents: 'none' }}
      />
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="mb-10 sm:mb-14 text-center">
          <p className="mb-4 sm:mb-6 flex items-center justify-center gap-3 sm:gap-4 text-[10px] font-bold uppercase tracking-[0.5em] text-accent">
            <span className="h-[1px] w-8 sm:w-10 bg-accent" />
            {t('eyebrow')}
            <span className="h-[1px] w-8 sm:w-10 bg-accent" />
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light leading-[0.95] tracking-tighter text-foreground">
            {t('title')}
          </h2>
          <p className="mx-auto mt-4 sm:mt-5 max-w-xl font-light italic text-sm sm:text-base text-foreground/50 md:text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <figure
              key={i}
              className="flex flex-col rounded-2xl sm:rounded-3xl border border-foreground/10 bg-background/60 p-5 sm:p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-accent/40"
            >
              <Quote size={28} className="mb-4 sm:mb-5 text-accent/40" aria-hidden />
              <blockquote className="mb-6 sm:mb-8 flex-1 font-light leading-relaxed text-sm sm:text-base text-foreground/75">
                “{item.quote}”
              </blockquote>

              <div className="mb-4 flex items-center gap-1" aria-label={`${item.rating}/5`}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star
                    key={s}
                    size={16}
                    className={s < item.rating ? 'fill-accent text-accent' : 'text-foreground/20'}
                  />
                ))}
              </div>

              <figcaption className="flex items-center gap-3 sm:gap-4">
                <span className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-accent/15 font-serif text-sm font-bold italic text-accent ring-1 ring-accent/30">
                  {item.initials}
                </span>
                <span className="flex flex-col">
                  <span className="font-serif text-sm sm:text-base italic text-foreground">{item.name}</span>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/45">{item.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
