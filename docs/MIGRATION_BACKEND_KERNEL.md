# Mise à jour du frontend YowPainter — backend consommateur kernel (en ligne)

Ce guide décrit les changements à faire dans **yowfrontend** pour fonctionner avec le nouveau `yowpainter-backend`, qui délègue auth, commerce, fichiers et notifications au **kernel RT-Comops en ligne**.

> **Règle d’or** : le frontend n’appelle **jamais** le kernel directement. Il parle uniquement à `yowpainter-backend`. Les variables `KSM_KERNEL_*` sont configurées **uniquement sur le backend** (Render, etc.).

---

## 1. Architecture cible

```
┌─────────────┐     JWT utilisateur      ┌──────────────────┐     X-Api-Key (serveur)     ┌─────────────┐
│  yowfrontend │ ──────────────────────► │ yowpainter-backend │ ───────────────────────► │ kernel en   │
│  (Next.js)   │     Bearer + org        │  (Render / local)  │     jamais exposé au FE   │   ligne     │
└─────────────┘                         └──────────────────┘                         └─────────────┘
```

| Avant (legacy) | Après (kernel-consumer) |
|----------------|-------------------------|
| JWT HS256 local | JWT **RS256** émis par le kernel (opaque pour le frontend) |
| Header `X-Tenant-ID` = slug artiste | Header **`X-Organization-Id`** = UUID organisation kernel |
| Multi-schéma par tenant | Schéma unique ; slug artiste = URL publique uniquement |
| Upload images → Cloudinary | **Obligatoire kernel** : `POST /api/artworks/images/upload` et `POST /api/me/profile-picture` |

---

## 2. Variables d’environnement — frontend uniquement

Fichier : **`.env.local`** à la racine de `yowfrontend`.

```bash
# Backend YowPainter (PAS le kernel)
NEXT_PUBLIC_API_URL=https://yowpainter-backend.onrender.com

# App & SEO (inchangé)
NEXT_PUBLIC_APP_URL=https://yp-frontend.vercel.app
NEXT_PUBLIC_BASE_DOMAIN=yowpainter.com

# Cloudinary — plus requis pour photos de profil (kernel via backend)
# Peut rester temporairement si d'autres assets l'utilisent encore
```

### Points importants

| Variable | Valeur correcte | Erreur fréquente |
|----------|-----------------|------------------|
| `NEXT_PUBLIC_API_URL` | Racine du backend **sans** `/api` | `https://.../api` ❌ |
| Kernel URL | **Ne pas** la mettre dans le frontend | `KSM_KERNEL_BASE_URL` = backend seulement |

Les services générés appellent déjà des chemins du type `/api/auth/login`, `/api/shop/...`.

**Fallback actuel** dans `src/lib/apiInit.ts` : `https://yowpainter-backend.onrender.com` — aligner `.env.local` sur ton déploiement réel.

---

## 3. Ce qui ne change pas (ou presque)

- URLs des pages publiques par slug artiste (`/[locale]/[slug]/...`) — SEO inchangé.
- Login : `POST /api/auth/login`
- Register : `POST /api/auth/register` (rôles `ROLE_ARTIST` / `ROLE_BUYER`)
- Refresh : `POST /api/auth/refresh`
- Catalogue shop public : `GET /api/shop/v1/public/products`, `GET /api/shop/v1/public/{slug}/products`
- Checkout public : `POST /api/shop/v1/public/{slug}/orders`
- Dashboards artiste / acheteur : mêmes routes UI (`/artdashboard`, `/amadashboard`)

Le frontend **ne valide pas** la signature JWT (HS256 vs RS256) : le token reste un bearer opaque. Le refresh automatique dans `apiInit.ts` continue de fonctionner via le champ `exp`.

---

## 4. Changements obligatoires

### 4.1 Régénérer le client OpenAPI

Le backend expose de nouveaux champs dans `AuthResponse` :

```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "role": "ROLE_ARTIST",
  "kernelUserId": "uuid",
  "organizationId": "uuid",
  "organizations": [
    {
      "organizationId": "uuid",
      "organizationCode": "mon-slug",
      "displayName": "Mon atelier",
      "services": ["COMMERCE"]
    }
  ]
}
```

**Action :**

1. Récupérer le OpenAPI du backend déployé : `{NEXT_PUBLIC_API_URL}/v3/api-docs`
2. Régénérer `src/lib/models/` et `src/lib/services/` (openapi-typescript-codegen)
3. Vérifier que `AuthResponse.ts` contient `kernelUserId`, `organizationId`, `organizations`

Fichiers impactés (générés) :

- `src/lib/models/AuthResponse.ts`
- `src/lib/services/AuthenticationService.ts`
- éventuellement nouveaux endpoints upload image œuvre

---

### 4.2 Remplacer le contexte tenant par l’organisation

**Fichier pivot :** `src/lib/apiInit.ts`

**Aujourd’hui :**

```typescript
OpenAPI.HEADERS = async () => {
  const tenantSlug = localStorage.getItem('currentTenantSlug');
  if (tenantSlug) return { 'X-Tenant-ID': tenantSlug };
  return {};
};
```

**Cible :**

```typescript
OpenAPI.HEADERS = async () => {
  const storage = localStorage.getItem('yowpainter-auth');
  if (!storage) return {};
  const parsed = JSON.parse(storage);
  const orgId = parsed.state?.user?.organizationId;
  if (orgId) return { 'X-Organization-Id': orgId };
  return {};
};
```

Le backend lit `X-Organization-Id` pour le commerce kernel (produits, commandes, fichiers, notifications).

**Supprimer / déprécier :**

- `localStorage.currentTenantSlug` (utilisé dans `authStore.ts`, `events.ts`, pages `[slug]/events`)

Le **slug** reste utile pour les routes publiques et le profil artiste, mais plus comme header API d’isolation multi-schéma.

---

### 4.3 Mettre à jour `authStore.ts`

Fichier : `src/store/authStore.ts`

| Action | Détail |
|--------|--------|
| Après `login` / `register` | Persister `organizationId`, `organizations`, `kernelUserId` depuis `AuthResponse` |
| Artiste | Si `organizationId` présent → l’utiliser pour les headers (remplace `currentTenantSlug`) |
| Multi-org (futur) | Si `organizations.length > 1`, permettre de choisir l’org active |
| `refreshProfile()` | Continuer à charger `slug`, `bio`, `profilePictureUrl` via `ArtistsService` / `BuyerProfileService` |
| `logout()` | Appeler `POST /api/auth/logout` avec le `refreshToken` (invalidation kernel) puis vider le store |

**Routing dashboard** (inchangé) :

- `ROLE_ARTIST` → `/artdashboard`
- `ROLE_BUYER` / autres → `/amadashboard`
- `ROLE_ADMIN` → prévoir `/admindashboard` si UI admin ajoutée

---

### 4.4 Commerce authentifié (artiste)

Endpoints qui nécessitent **JWT + `X-Organization-Id`** :

| Endpoint | Page / composant |
|----------|------------------|
| `POST /api/shop/products` | `CreateArticleModal.tsx` |
| `GET /api/shop/inventory` | `artdashboard`, `artist/shop/listings` |
| `GET /api/shop/orders/my-sales` | `artist/shop/orders` |
| `POST /api/artworks/images/upload` | (nouveau) remplace Cloudinary si activé |

Vérifier que l’artiste a bien `organizationId` après inscription (créée côté backend lors du `register` artiste).

---

### 4.5 Upload d’images œuvres (optionnel mais recommandé)

**Aujourd’hui :** Cloudinary direct → URLs dans `ArtworkCreateRequest.imageUrls`.

**Backend kernel :** `POST /api/artworks/images/upload` (multipart, auth artiste requis).

Migration suggérée :

1. Ajouter le endpoint au OpenAPI et régénérer le client
2. Dans `CreateArtworkModal.tsx` : envoyer le fichier au backend au lieu de Cloudinary
3. Utiliser l’`imageUrl` retournée (`{KERNEL_BASE}/api/files/{id}`) dans la création d’œuvre

Tant que cette étape n’est pas faite, Cloudinary reste utilisable si le backend accepte encore des URLs externes dans `imageUrls`.

---

### 4.6 Admin (optionnel)

Le client généré expose déjà :

- `POST /api/admin/auth/login`
- `POST /api/admin/auth/register`

Aucune page UI ne les utilise aujourd’hui. Si tu ajoutes un back-office admin :

1. Créer `/[locale]/admin/login` et `/admin/register`
2. Utiliser `AdminAuthenticationService`
3. Stocker le JWT comme pour les autres rôles (`ROLE_ADMIN` dans la réponse)
4. Protéger les routes avec `role === 'ROLE_ADMIN'`

Le backend proxy l’inscription admin vers le kernel (sign-up + rôle `TENANT_ADMIN`) — **sans modifier le kernel**.

---

## 5. Fichiers à modifier — checklist

### Priorité 1 (bloquant)

- [ ] `.env.local` → `NEXT_PUBLIC_API_URL` vers backend en ligne
- [ ] Régénérer `src/lib/models/*` et `src/lib/services/*` depuis OpenAPI
- [ ] `src/lib/apiInit.ts` → `X-Organization-Id` au lieu de `X-Tenant-ID`
- [ ] `src/store/authStore.ts` → persister `organizationId`, retirer `currentTenantSlug`

### Priorité 2 (fonctionnel complet)

- [ ] `src/lib/api/events.ts` → contexte org si headers requis
- [ ] `src/app/[locale]/(public)/[slug]/events/[id]/page.tsx` → idem
- [ ] Logout → appeler `AuthenticationService.logout(refreshToken)`
- [ ] `CreateArtworkModal.tsx` → upload kernel (optionnel)

### Priorité 3 (nettoyage)

- [ ] Supprimer ou corriger `src/lib/api/client.ts` (axios legacy, baseURL avec `/api` en trop, non utilisé)
- [ ] Aligner tous les fallbacks `OpenAPI.BASE` sur une seule source (`apiInit.ts`)

---

## 6. Tests manuels après migration

### Auth

1. Inscription artiste → réponse contient `accessToken`, `organizationId`, `organizations`
2. Login artiste → dashboard `/artdashboard` accessible
3. Inscription acheteur → `/amadashboard`
4. Refresh automatique (attendre expiration ou forcer) → nouvel `accessToken`
5. Logout → token invalide côté kernel

### Commerce

1. Artiste crée un produit → `POST /api/shop/products` OK (header `X-Organization-Id` présent dans Network tab)
2. Catalogue public → produits visibles sur `/shop` et `/[slug]`
3. Acheteur passe commande → checkout OK
4. Paiement CamPay → statut commande mis à jour

### Régression

1. Galerie publique par slug
2. Événements publics
3. Chat WebSocket (`/ws`) avec nouveau JWT — vérifier connexion STOMP

---

## 7. Débogage rapide

| Symptôme | Cause probable | Vérification |
|----------|----------------|--------------|
| 401 sur toutes les routes protégées | Mauvais `NEXT_PUBLIC_API_URL` ou token absent | Network → header `Authorization: Bearer ...` |
| 401 après login réussi | JWT RS256 : backend mal configuré (`KSM_KERNEL_JWK_SET_URI`) | Problème backend, pas frontend |
| 403 / erreur commerce artiste | `X-Organization-Id` manquant | Network → header org UUID |
| CORS | Backend `SecurityConfig` origins | Origine Vercel dans la liste CORS backend |
| Produits vides après inscription | `organizationId` non créé côté kernel | Réinscrire l’artiste ou vérifier logs backend |
| Double `/api/api/...` | `NEXT_PUBLIC_API_URL` finit par `/api` | Corriger l’URL de base |

---

## 8. Répartition des responsabilités

| Qui configure quoi | Où |
|--------------------|-----|
| **Frontend** | `NEXT_PUBLIC_API_URL`, Cloudinary, domaines |
| **Backend YowPainter** | `KSM_KERNEL_BASE_URL`, `KSM_KERNEL_API_KEY`, `KSM_KERNEL_TENANT_ID`, etc. |
| **Kernel (en ligne)** | Déjà déployé — aucune modification requise |

Le frontend n’a **qu’une seule** URL backend à connaître. Toute la complexité kernel reste côté serveur.

---

## 9. Ordre de travail recommandé

1. Déployer / vérifier le backend avec kernel en ligne + variables `KSM_KERNEL_*`
2. Mettre à jour `.env.local` du frontend
3. Régénérer le client OpenAPI
4. Modifier `apiInit.ts` + `authStore.ts`
5. Tester login artiste + création produit
6. (Optionnel) Migrer upload images et UI admin
7. Déployer le frontend sur Vercel avec les nouvelles variables

---

## Références backend

- Intégration kernel (côté serveur) : `yowpainter-backend/docs/KERNEL_INTEGRATION.md`
- OpenAPI backend : `{NEXT_PUBLIC_API_URL}/swagger-ui.html`
