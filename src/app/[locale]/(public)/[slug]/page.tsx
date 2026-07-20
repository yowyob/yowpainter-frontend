import type { Metadata } from 'next'
import { ArtistsService } from '@/lib/services/ArtistsService'
import ArtistSpaceContent from './ArtistSpaceContent'
import { configureServerApi } from '@/lib/serverApiInit'
import { getTranslations } from 'next-intl/server'
import { pageMetadata, personLd, localizedUrl } from '@/lib/seo'
import JsonLd from '@/components/seo/JsonLd'

configureServerApi()

interface ArtistPageProps {
  params: Promise<{ locale: string; slug: string }>
}

/**
 * Fetch artist data on the server side.
 * Silently returns null if the artist is not found.
 */
async function getArtist(slug: string) {
  try {
    return await ArtistsService.getArtistBySlug(slug)
  } catch {
    return null
  }
}

/**
 * generateMetadata — runs on the server, generates full OpenGraph tags.
 * This is what WhatsApp, Twitter, LinkedIn, etc. use for previews.
 */
export async function generateMetadata({ params }: ArtistPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'ArtistSpace' })
  const artist = await getArtist(slug)

  if (!artist) {
    return {
      title: t('metadataNotFoundTitle'),
      description: t('metadataNotFoundDescription'),
      robots: { index: false, follow: true },
    }
  }

  const displayName = artist.artistName || `${artist.firstName ?? ''} ${artist.lastName ?? ''}`.trim()
  const bio = artist.bio || t('metadataFallbackBio', { name: displayName })
  const description = bio.length > 160 ? bio.substring(0, 157) + '...' : bio

  return pageMetadata({
    locale,
    path: `/${slug}`,
    title: displayName,
    description,
    type: 'profile',
    images: artist.profilePictureUrl ? [artist.profilePictureUrl] : undefined,
  })
}

/**
 * Page Component — Server Component.
 * Pre-fetches artist data on the server so the client component
 * can render immediately without an extra loading state.
 */
export default async function ArtistSlugPage({ params }: ArtistPageProps) {
  const { locale, slug } = await params
  const artist = await getArtist(slug)

  const displayName = artist
    ? artist.artistName || `${artist.firstName ?? ''} ${artist.lastName ?? ''}`.trim()
    : ''

  return (
    <>
      {artist && (
        <JsonLd
          data={personLd({
            name: displayName,
            description: artist.bio || undefined,
            image: artist.profilePictureUrl || undefined,
            url: localizedUrl(locale, `/${slug}`),
          })}
        />
      )}
      <ArtistSpaceContent slug={slug} initialArtist={artist} />
    </>
  )
}
