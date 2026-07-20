'use client';

import { useTranslations } from 'next-intl';
import { Star, Quote } from 'lucide-react';

interface TestimonialItem {
  name: string;
  role: string;
  initials: string;
  rating: number;
  quote: string;
}

export function Testimonials() {
  const t = useTranslations('Testimonials');
  const items = t.raw('items') as TestimonialItem[];

  return (
    <section className="relative w-full mt-24 md:mt-32 px-6 sm:px-12 overflow-hidden">
      <div
        className="absolute left-[-6%] top-[20%] z-0 h-[35vw] max-h-[420px] w-[35vw] max-w-[420px] animate-blob bg-accent/8 blur-[100px]"
        style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', pointerEvents: 'none' }}
      />
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="mb-14 text-center">
          <p className="mb-6 flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-[0.5em] text-accent">
            <span className="h-[1px] w-10 bg-accent" />
            {t('eyebrow')}
            <span className="h-[1px] w-10 bg-accent" />
          </p>
          <h2 className="font-serif text-4xl font-light leading-[0.95] tracking-tighter text-foreground md:text-6xl">
            {t('title')}
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-light italic text-foreground/50 md:text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {items.map((item, i) => (
            <figure
              key={i}
              className="flex flex-col rounded-3xl border border-foreground/10 bg-background/60 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-accent/40"
            >
              <Quote size={28} className="mb-5 text-accent/40" aria-hidden />
              <blockquote className="mb-8 flex-1 font-light leading-relaxed text-foreground/75">
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

              <figcaption className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 font-serif text-sm font-bold italic text-accent ring-1 ring-accent/30">
                  {item.initials}
                </span>
                <span className="flex flex-col">
                  <span className="font-serif text-base italic text-foreground">{item.name}</span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground/45">{item.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
