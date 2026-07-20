'use client';

import { useEffect } from 'react';

/**
 * Synchronise l'attribut `lang` de <html> avec la locale active.
 *
 * Le <html> est rendu dans le layout racine (hors segment [locale]) avec un
 * `lang` par défaut ; ce petit effet le corrige côté client pour la locale
 * réelle. Googlebot exécutant le JS, le signal de langue reste fiable — et il
 * est complété par les balises hreflang et `og:locale` (rendues au serveur).
 */
export default function HtmlLangSync({ locale }: { locale: string }) {
  useEffect(() => {
    if (locale) document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
