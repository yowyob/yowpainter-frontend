import type { MetadataRoute } from "next";
import { SITE_URL, LOCALES, DEFAULT_LOCALE } from "@/lib/seo";
import { API_BASE_URL } from "@/lib/apiConfig";

// Rafraîchi toutes les 6 h (contenu dynamique : artistes, événements).
export const revalidate = 21600;

/** Entrée de sitemap avec alternates hreflang pour toutes les locales. */
function localizedEntry(
  path: string,
  opts: { changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"]; priority?: number; lastModified?: string | Date } = {}
): MetadataRoute.Sitemap[number] {
  const clean = path && !path.startsWith("/") ? `/${path}` : path;
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `${SITE_URL}/${l}${clean}`;
  return {
    url: `${SITE_URL}/${DEFAULT_LOCALE}${clean}`,
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency ?? "weekly",
    priority: opts.priority ?? 0.6,
    alternates: { languages },
  };
}

async function safeJson<T>(url: string): Promise<T | null> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(url, { signal: ctrl.signal, next: { revalidate } });
    clearTimeout(timer);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Pages statiques publiques.
  const staticEntries: MetadataRoute.Sitemap = [
    localizedEntry("", { changeFrequency: "daily", priority: 1 }),
    localizedEntry("/galerie", { changeFrequency: "daily", priority: 0.9 }),
    localizedEntry("/artists", { changeFrequency: "daily", priority: 0.8 }),
    localizedEntry("/events", { changeFrequency: "daily", priority: 0.8 }),
    localizedEntry("/actualites", { changeFrequency: "weekly", priority: 0.7 }),
    localizedEntry("/atelier", { changeFrequency: "weekly", priority: 0.7 }),
    localizedEntry("/shop", { changeFrequency: "daily", priority: 0.8 }),
  ];

  // Contenu dynamique (dégradation gracieuse si le backend est injoignable).
  const [artists, events] = await Promise.all([
    safeJson<Array<{ slug?: string }>>(`${API_BASE_URL}/api/public/artists/search?q=`),
    safeJson<Array<{ id?: string }>>(`${API_BASE_URL}/api/public/events`),
  ]);

  const artistEntries: MetadataRoute.Sitemap = (artists ?? [])
    .filter((a) => a.slug)
    .flatMap((a) => [
      localizedEntry(`/${a.slug}`, { changeFrequency: "weekly", priority: 0.7 }),
      localizedEntry(`/${a.slug}/gallery`, { changeFrequency: "weekly", priority: 0.6 }),
    ]);

  const eventEntries: MetadataRoute.Sitemap = (events ?? [])
    .filter((e) => e.id)
    .map((e) => localizedEntry(`/events/${e.id}`, { changeFrequency: "weekly", priority: 0.6 }));

  return [...staticEntries, ...artistEntries, ...eventEntries];
}
