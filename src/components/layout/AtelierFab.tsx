'use client';

import { Link } from '@/i18n/navigation';
import { usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Palette } from 'lucide-react';

/**
 * Bouton flottant d'accès rapide à l'atelier.
 *
 * - Fixe pendant le scroll (fixed), toujours accessible.
 * - Pill avec libellé sur desktop, bouton circulaire sur mobile.
 * - Design cohérent avec l'app (accent, backdrop-blur, font-serif italique).
 * - Masqué lorsqu'on est déjà dans l'atelier.
 */
export default function AtelierFab() {
  const t = useTranslations('Atelier');
  const pathname = usePathname();

  if (pathname?.startsWith('/atelier')) return null;

  return (
    <Link
      href="/atelier"
      aria-label={t('fabAria')}
      className="group fixed right-4 sm:right-6 top-24 z-40 flex items-center gap-3 rounded-full border border-accent/30 bg-background/80 px-4 py-3 shadow-[0_18px_40px_-14px_rgba(var(--accent-rgb),0.55)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 hover:border-accent hover:shadow-[0_22px_50px_-12px_rgba(var(--accent-rgb),0.7)] active:scale-95"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white transition-transform duration-500 group-hover:rotate-12">
        <Palette size={18} strokeWidth={2} />
      </span>
      <span className="hidden pr-1 font-serif text-sm italic tracking-tight text-foreground sm:inline">
        {t('fabLabel')}
      </span>
    </Link>
  );
}
