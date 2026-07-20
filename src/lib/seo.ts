import type { Metadata } from 'next';

/** URL publique du site (prod). Surchargée par NEXT_PUBLIC_APP_URL au déploiement. */
export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://painter.yowyob.com').replace(/\/$/, '');
export const SITE_NAME = 'YowPainter';

export const LOCALES = ['fr', 'en', 'de'] as const;
export type AppLocale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: AppLocale = 'fr';

/** Locale Open Graph normalisée (fr_FR, en_US, de_DE). */
export const OG_LOCALE: Record<string, string> = { fr: 'fr_FR', en: 'en_US', de: 'de_DE' };

/** Image Open Graph par défaut (remplaçable par page). */
export const DEFAULT_OG_IMAGE = '/images/logo.png';

function normalizePath(path: string): string {
  if (!path) return '';
  return path.startsWith('/') ? path : `/${path}`;
}

/** URL absolue d'un chemin localisé. */
export function localizedUrl(locale: string, path = ''): string {
  return `${SITE_URL}/${locale}${normalizePath(path)}`;
}

/**
 * Construit le bloc `alternates` (canonical + hreflang) pour une page.
 * Le chemin est SANS préfixe de locale (ex: "/galerie", "" pour l'accueil).
 */
export function buildAlternates(locale: string, path = ''): Metadata['alternates'] {
  const clean = normalizePath(path);
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${SITE_URL}/${l}${clean}`;
  languages['x-default'] = `${SITE_URL}/${DEFAULT_LOCALE}${clean}`;
  return { canonical: `${SITE_URL}/${locale}${clean}`, languages };
}

interface PageMetaInput {
  locale: string;
  /** Chemin sans préfixe de locale (ex: "/galerie"). */
  path?: string;
  title: string;
  description: string;
  /** URLs d'images OG (absolues ou relatives à SITE_URL). */
  images?: string[];
  type?: 'website' | 'article' | 'profile';
  noindex?: boolean;
  keywords?: string[];
}

/**
 * Fabrique un objet Metadata complet et cohérent (canonical, hreflang,
 * Open Graph, Twitter Card) pour une page publique.
 */
export function pageMetadata({
  locale,
  path = '',
  title,
  description,
  images,
  type = 'website',
  noindex = false,
  keywords,
}: PageMetaInput): Metadata {
  const url = localizedUrl(locale, path);
  const ogImages = (images && images.length ? images : [DEFAULT_OG_IMAGE]).map((src) => ({
    url: src,
    width: 1200,
    height: 630,
    alt: title,
  }));

  return {
    title,
    description,
    keywords,
    alternates: buildAlternates(locale, path),
    openGraph: {
      type,
      url,
      siteName: SITE_NAME,
      title,
      description,
      locale: OG_LOCALE[locale] ?? OG_LOCALE[DEFAULT_LOCALE],
      alternateLocale: LOCALES.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ogImages.map((i) => i.url),
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  };
}

/* ─────────────────────────  JSON-LD (données structurées)  ───────────────────────── */

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    description: 'Marketplace d’art moderne et contemporain : œuvres, artistes, événements.',
    sameAs: [] as string[],
  };
}

export function websiteLd(locale: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: localizedUrl(locale),
    inLanguage: locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${locale}/galerie?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function eventLd(input: {
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  locationName?: string;
  latitude?: number | null;
  longitude?: number | null;
  image?: string;
  url: string;
  price?: number | null;
  currency?: string;
  organizer?: string;
}) {
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: input.name,
    description: input.description,
    startDate: input.startDate,
    endDate: input.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    url: input.url,
    image: input.image ? [input.image] : undefined,
  };
  if (input.locationName) {
    ld.location = {
      '@type': 'Place',
      name: input.locationName,
      geo:
        input.latitude != null && input.longitude != null
          ? { '@type': 'GeoCoordinates', latitude: input.latitude, longitude: input.longitude }
          : undefined,
    };
  }
  if (input.organizer) {
    ld.organizer = { '@type': 'Organization', name: input.organizer };
  }
  if (input.price != null) {
    ld.offers = {
      '@type': 'Offer',
      price: input.price,
      priceCurrency: input.currency || 'XAF',
      availability: 'https://schema.org/InStock',
      url: input.url,
    };
  }
  return ld;
}

export function personLd(input: { name: string; description?: string; image?: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: input.name,
    description: input.description,
    image: input.image,
    url: input.url,
  };
}

export function productLd(input: {
  name: string;
  description?: string;
  image?: string;
  url: string;
  price?: number | null;
  currency?: string;
  brand?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description,
    image: input.image ? [input.image] : undefined,
    url: input.url,
    brand: input.brand ? { '@type': 'Brand', name: input.brand } : undefined,
    offers:
      input.price != null
        ? {
            '@type': 'Offer',
            price: input.price,
            priceCurrency: input.currency || 'XAF',
            availability: 'https://schema.org/InStock',
            url: input.url,
          }
        : undefined,
  };
}
