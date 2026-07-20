'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown } from 'lucide-react';

interface FaqItem { q: string; a: string; }

export function FaqSection() {
  const t = useTranslations('Faq');
  const items = t.raw('items') as FaqItem[];
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative w-full mt-24 md:mt-32 px-6 sm:px-12">
      <div className="mx-auto max-w-[900px]">
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

        <div className="flex flex-col gap-3">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`overflow-hidden rounded-2xl border transition-all duration-500 ${
                  isOpen ? 'border-accent/40 bg-background/70' : 'border-foreground/10 bg-background/40'
                } backdrop-blur-sm`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-serif text-lg italic text-foreground md:text-xl">{item.q}</span>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-accent transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 font-light leading-relaxed text-foreground/65">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
