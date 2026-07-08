import type { Metadata } from 'next'
import { ArtistsService } from '@/lib/services/ArtistsService'
import ArtistSpaceContent from './ArtistSpaceContent'
import { configureServerApi } from '@/lib/serverApiInit'
import { getTranslations } from 'next-intl/server'

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
    }
  }

  const displayName = artist.artistName || `${artist.firstName ?? ''} ${artist.lastName ?? ''}`.trim()
  const bio = artist.bio || t('metadataFallbackBio', { name: displayName })
  const imageUrl = artist.profilePictureUrl || `${process.env.NEXT_PUBLIC_APP_URL || 'https://yowpainter.com'}/images/og-default.png`
  const pageUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://yowpainter.com'}/${slug}`

  return {
    title: `${displayName} | YowPainter`,
    description: bio.length > 160 ? bio.substring(0, 157) + '...' : bio,
    openGraph: {
      type: 'profile',
      title: t('metadataArtistTitle', { name: displayName }),
      description: bio.length > 160 ? bio.substring(0, 157) + '...' : bio,
      url: pageUrl,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: t('metadataProfileAlt', { name: displayName }),
        },
      ],
      siteName: 'YowPainter',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metadataArtistTitle', { name: displayName }),
      description: bio.length > 160 ? bio.substring(0, 157) + '...' : bio,
      images: [imageUrl],
    },
  }
}

/**
 * Page Component — Server Component.
 * Pre-fetches artist data on the server so the client component
 * can render immediately without an extra loading state.
 */
export default async function ArtistSlugPage({ params }: ArtistPageProps) {
  const { slug } = await params
  const artist = await getArtist(slug)

  return <ArtistSpaceContent slug={slug} initialArtist={artist} />
}
