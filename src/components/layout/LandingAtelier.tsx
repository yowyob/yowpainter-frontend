import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'

export async function LandingAtelier() {
  const t = await getTranslations('LandingAtelier')

  return (
    <section className="relative w-full mt-16 sm:mt-24 md:mt-32 z-20 overflow-x-hidden pb-12 sm:pb-16 md:pb-24">
      <div
        className="absolute top-[15%] left-[-8%] w-[45vw] h-[45vw] max-w-[480px] bg-accent/8 blur-[90px] z-0 pointer-events-none animate-blob"
        style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }}
      />
      <div
        className="absolute bottom-[10%] right-[-5%] w-[35vw] h-[35vw] max-w-[400px] bg-amber-500/10 blur-[100px] z-0 pointer-events-none animate-blob-delayed"
        style={{ borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}
      />

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 xl:gap-24 items-center">
          <div className="flex flex-col order-2 lg:order-1">
            <p className="text-accent uppercase tracking-[0.5em] text-[10px] font-bold mb-4 sm:mb-6 flex items-center gap-4">
              <span className="w-8 sm:w-10 h-[1px] bg-accent" />
              {t('eyebrow')}
            </p>

            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[0.95] tracking-tighter text-foreground mb-4 sm:mb-6">
              {t('titleMain')}{' '}
              <span className="italic font-normal text-accent">{t('titleAccent')}</span>
            </h2>

            <p className="text-foreground/50 font-light italic text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-lg leading-relaxed">
              {t('subtitle')}
            </p>

            <p className="text-sm sm:text-base md:text-lg text-foreground/65 font-light leading-relaxed mb-6 sm:mb-8 pl-4 sm:pl-6 border-l-2 border-accent/40 max-w-lg">
              {t('description')}
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-10">
              {[t('feature1'), t('feature2'), t('feature3')].map((item) => (
                <span
                  key={item}
                  className="font-serif italic text-xs sm:text-sm text-foreground/55 px-3 sm:px-4 py-1.5 sm:py-2 border border-foreground/10 bg-background/60 backdrop-blur-sm rounded-sm"
                >
                  {item}
                </span>
              ))}
            </div>

            <Link
              href="/atelier"
              className="group inline-flex items-center gap-4 sm:gap-6 border-b border-foreground pb-3 hover:border-accent hover:text-accent transition-all duration-500 w-fit"
            >
              <span className="font-serif text-lg sm:text-xl md:text-2xl tracking-tight">{t('cta')}</span>
              <div className="w-10 h-[1px] bg-foreground group-hover:bg-accent group-hover:w-16 transition-all duration-500" />
            </Link>
          </div>

          <div className="relative order-1 lg:order-2 flex items-center justify-center min-h-[300px] sm:min-h-[380px] md:min-h-[440px] lg:min-h-[520px]">
            <div
              className="absolute inset-[8%] lg:inset-[5%] pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse 70% 65% at 55% 45%, rgba(194, 109, 92, 0.12) 0%, rgba(26, 21, 18, 0.35) 45%, transparent 72%)',
              }}
            />

            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] max-w-[280px] aspect-[3/4] opacity-[0.07] dark:opacity-[0.12] pointer-events-none hidden sm:block">
              <Image
                src="/images/fondlanding-removebg-preview.png"
                alt=""
                fill
                sizes="280px"
                className="object-contain object-center"
                aria-hidden
              />
            </div>

            <div className="relative z-10 w-[220px] sm:w-[280px] md:w-[320px] lg:w-[360px] aspect-[3/4] -translate-x-4 sm:-translate-x-8 lg:-translate-x-4">
              <Image
                src="/images/main.png"
                alt={t('handAlt')}
                fill
                sizes="(max-width: 768px) 220px, 360px"
                className="object-contain object-bottom drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
                priority={false}
              />
            </div>

            <div className="absolute bottom-0 right-0 sm:right-[5%] z-20 w-[240px] sm:w-[300px] md:w-[360px] lg:w-[400px] aspect-[4/3] pointer-events-none">
              <Image
                src="/images/pinceau.png"
                alt={t('brushesAlt')}
                fill
                sizes="(max-width: 768px) 240px, 400px"
                className="object-contain object-bottom drop-shadow-[0_24px_48px_rgba(0,0,0,0.25)]"
              />
            </div>

            <p className="absolute bottom-[18%] right-[2%] font-serif italic text-accent/35 text-sm md:text-base rotate-[-8deg] select-none pointer-events-none hidden md:block">
              {t('sideLabel')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
