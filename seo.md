# SEO — Guide de test

Ce document explique comment **vérifier** le SEO implémenté sur le frontend YowPainter (Next.js 16 App Router + next-intl, locales `fr`/`en`/`de`).

Production : <https://painter.yowyob.com>

---

## 0. Ce qui a été implémenté (rappel)

| Élément | Fichier | Route exposée |
|---|---|---|
| Helpers SEO (canonical, hreflang, OG, JSON-LD) | `src/lib/seo.ts` | — |
| Metadata globale localisée (title template, OG, robots) | `src/app/[locale]/layout.tsx` | toutes les pages |
| JSON-LD Organization + WebSite + SearchAction | `[locale]/layout.tsx` + `src/components/seo/JsonLd.tsx` | toutes les pages |
| JSON-LD Event / Person | fiche événement / page artiste | `/events/{id}`, `/{slug}` |
| robots.txt | `src/app/robots.ts` | `/robots.txt` |
| sitemap.xml (statique + dynamique, hreflang) | `src/app/sitemap.ts` | `/sitemap.xml` |
| Web manifest (PWA) | `src/app/manifest.ts` | `/manifest.webmanifest` |
| Synchro `<html lang>` client | `src/components/seo/HtmlLangSync.tsx` | — |
| i18n `Seo` (FR/EN/DE) | `messages/{fr,en,de}.json` | — |

> ⚠️ **Le SEO se teste sur un build de production, pas en `next dev`.** Les balises `generateMetadata`, `robots.ts`, `sitemap.ts`, `manifest.ts` ne se comportent correctement qu'après `next build` + `next start`.

---

## 1. Lancer un build de prod en local

```bash
cd yowpainter-frontend
npm run build          # doit finir sur "✓ Compiled successfully" (exit 0)
npx next start -p 3000 # serveur de production sur http://localhost:3000
```

Optionnel — forcer l'URL publique utilisée dans les balises (sinon fallback `https://painter.yowyob.com`) :

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000 npx next start -p 3000
```

> Sans cette variable, `canonical`, `og:url`, `sitemap` et `robots` afficheront `https://painter.yowyob.com` — c'est **normal et voulu** (valeurs de prod). Pour tester les URLs en local, exportez `NEXT_PUBLIC_APP_URL` **avant le build ET le start**.

---

## 2. Vérifier robots.txt, sitemap.xml, manifest

```bash
# robots : doit lister les Disallow, le Host et le Sitemap
curl -s http://localhost:3000/robots.txt

# sitemap : XML avec les <url> et les alternates hreflang (fr/en/de)
curl -s http://localhost:3000/sitemap.xml | head -40

# manifest : JSON (name, theme_color, icons)
curl -s http://localhost:3000/manifest.webmanifest
```

**Attendu — robots.txt :**
- `Allow: /`
- `Disallow:` sur `/api/`, `/*/artdashboard`, `/*/amadashboard`, `/*/admin`, `/*/cart`, `/*/checkout`, `/*/payment`, `/*/login`, `/*/register`, `/*/tickets`…
- `Host: https://painter.yowyob.com`
- `Sitemap: https://painter.yowyob.com/sitemap.xml`

**Attendu — sitemap.xml :** chaque `<url>` contient un `<loc>` + trois `<xhtml:link rel="alternate" hreflang="fr|en|de">`. Le sitemap inclut :
- les pages statiques (`/`, `/galerie`, `/artists`, `/events`, `/actualites`, `/atelier`, `/shop`) ;
- les **artistes** (`/{slug}`, `/{slug}/gallery`) et **événements** (`/events/{id}`) récupérés depuis l'API publique du backend.

> Si le backend est injoignable au moment du build, le sitemap se **dégrade proprement** (pages statiques seulement) — pas d'échec de build.

---

## 3. Vérifier les balises `<head>` d'une page

Les métadonnées sont **rendues côté serveur** : elles sont dans le HTML brut (inspectable sans exécuter le JS).

```bash
# Canonical + hreflang
curl -s http://localhost:3000/en/galerie | grep -oiE '<link rel="canonical"[^>]*>|hreflang="[^"]*" href="[^"]*"'

# Open Graph + Twitter
curl -s http://localhost:3000/en/galerie | tr '>' '\n' | grep -iE 'og:(title|description|url|locale|image)|twitter:card'

# Titre
curl -s http://localhost:3000/en/galerie | grep -oiE '<title>[^<]*</title>'
```

**Attendu (`/en/galerie`) :**
- `<link rel="canonical" href="https://painter.yowyob.com/en/galerie">`
- 4 `hreflang` : `fr`, `en`, `de`, `x-default`
- `og:locale = en_US` + `og:locale:alternate = fr_FR, de_DE`
- `og:url = https://painter.yowyob.com/en/galerie`
- `<title>Public Gallery | YowPainter</title>` (le suffixe `| YowPainter` n'apparaît **qu'une fois**)

**Titres attendus par page (contrôle du template) :**

| URL | Titre attendu |
|---|---|
| `/fr` | `YowPainter — Marketplace d'art moderne et contemporain` |
| `/en` | `YowPainter — Modern & contemporary art marketplace` |
| `/de` | `YowPainter — Marktplatz für moderne & zeitgenössische Kunst` |
| `/en/galerie` | `Public Gallery \| YowPainter` |
| `/fr/events` | `Expositions & Evenements \| YowPainter` |

> 🔴 **Piège à détecter :** un double suffixe (`… | YowPainter | YowPainter`) signale une régression du `title.template`. La page d'accueil utilise le `title.default` (pas de suffixe) ; les autres pages ajoutent le suffixe **une seule fois**.

---

## 4. Vérifier les données structurées (JSON-LD)

```bash
# Global : Organization + WebSite + SearchAction (présent sur toutes les pages)
curl -s http://localhost:3000/fr | grep -o '"@type":"[A-Za-z]*"'

# Événement : type Event (dates, lieu, geo, offre)
curl -s http://localhost:3000/fr/events/<ID_EVENEMENT> | grep -o '"@type":"[A-Za-z]*"'

# Artiste : type Person
curl -s http://localhost:3000/fr/<SLUG_ARTISTE> | grep -o '"@type":"[A-Za-z]*"'
```

**Attendu :**
- Toutes pages → `Organization`, `WebSite`, `SearchAction`
- Fiche événement → `Event` (+ `Place`/`GeoCoordinates` si l'événement a une localisation, `Offer` si payant)
- Page artiste → `Person`

**Validation officielle** (à faire une fois déployé, URL publique requise) :
- Google Rich Results Test : <https://search.google.com/test/rich-results>
- Schema.org Validator : <https://validator.schema.org/>

---

## 5. Vérifier les aperçus de partage (Open Graph / Twitter)

Une fois en prod (les validateurs ont besoin d'une URL publique) :

- **Facebook / WhatsApp / LinkedIn** : <https://www.opengraph.xyz/> ou le [Sharing Debugger Facebook](https://developers.facebook.com/tools/debug/)
- **Twitter/X** : coller l'URL dans un tweet (brouillon) et observer la carte.

Tester au moins : l'accueil, une fiche **artiste** (`/{slug}`), une fiche **événement** (`/events/{id}`) — ces deux dernières exposent une image OG dédiée (photo de profil / affiche).

> ℹ️ L'image OG par défaut est le logo. Pour des cartes plus riches, ajouter un visuel **1200×630** et pointer `DEFAULT_OG_IMAGE` (dans `src/lib/seo.ts`) dessus.

---

## 6. Vérifier le multilingue (hreflang / og:locale)

```bash
for loc in fr en de; do
  echo "== /$loc/galerie =="
  curl -s http://localhost:3000/$loc/galerie | tr '>' '\n' | grep -iE 'rel="canonical"|og:locale" content'
done
```

**Attendu :** chaque locale a son propre `canonical` (`/{loc}/galerie`), les mêmes 4 `hreflang`, et un `og:locale` distinct (`fr_FR`, `en_US`, `de_DE`).

> **Limite connue — `<html lang>` :** en SSR, `<html lang="fr">` (valeur du layout racine), corrigée côté client par `HtmlLangSync` pour la locale réelle. Googlebot exécute le JS, et les signaux de langue restent fiables via **hreflang + og:locale** (rendus au serveur). Pour un `lang` correct dès le SSR, il faudrait déplacer `<html>/<body>` dans `[locale]/layout.tsx`.

---

## 7. Audit automatisé (Lighthouse)

Dans **Chrome DevTools → onglet Lighthouse → catégorie “SEO”**, sur `http://localhost:3000/fr` (mode production) :

- Score SEO visé : **95–100**.
- Vérifie : `<title>`, `meta description`, balises indexables, `robots`, liens explorables, `hreflang` valides, viewport.

En ligne de commande :

```bash
npx lighthouse http://localhost:3000/fr --only-categories=seo --view
```

---

## 8. Checklist finale avant / après déploiement

**Avant déploiement**
- [ ] `npm run build` passe (exit 0).
- [ ] `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` répondent.
- [ ] `canonical` + 4 `hreflang` sur `/{loc}/galerie`.
- [ ] Pas de double `| YowPainter` dans les `<title>`.
- [ ] JSON-LD `Event` et `Person` présents sur les fiches.

**Après déploiement (prod)**
- [ ] `NEXT_PUBLIC_APP_URL=https://painter.yowyob.com` défini dans l'environnement de déploiement.
- [ ] `https://painter.yowyob.com/robots.txt` et `…/sitemap.xml` accessibles publiquement.
- [ ] Sitemap soumis dans **Google Search Console** (+ Bing Webmaster Tools).
- [ ] Rich Results Test OK sur une fiche événement et une fiche artiste.
- [ ] Aperçu de partage correct (OpenGraph.xyz) sur l'accueil + une fiche.

---

## 9. Dépannage

| Symptôme | Cause probable |
|---|---|
| Balises SEO absentes | Testé en `next dev` au lieu de `next build` + `next start` |
| URLs en `localhost` dans les balises | `NEXT_PUBLIC_APP_URL` non défini → fallback prod ; le définir pour tester en local |
| Double `\| YowPainter` dans le titre | Régression du `title.template` (layout racine ne doit pas re-wrapper le titre de la locale) |
| Sitemap sans artistes/événements | Backend injoignable au build → dégradation en pages statiques (relancer quand l'API répond) |
| hreflang absents | Vérifier `alternates.languages` renvoyé par `pageMetadata()` / `buildAlternates()` dans `src/lib/seo.ts` |
| `<html lang>` toujours `fr` en “View Source” | Comportement attendu : correction client-side (cf. §6) |
| Pages privées indexées | Vérifier les `Disallow` de `src/app/robots.ts` (+ `noindex` sur les pages sensibles) |
