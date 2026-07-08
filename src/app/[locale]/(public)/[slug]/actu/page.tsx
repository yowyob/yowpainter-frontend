import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ArtistsService } from '@/lib/services/ArtistsService'
import { configureServerApi } from '@/lib/serverApiInit'
import ActuContent from './ActuContent'

configureServerApi()

interface ActuPageProps {
  params: Promise<{ locale: string; slug: string }>
}

async function getArtist(slug: string) {
  try {
    return await ArtistsService.getArtistBySlug(slug)
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: ActuPageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'Actu' })
  const artist = await getArtist(slug)

  if (!artist) {
    return {
      title: t('metadataNotFoundTitle'),
      description: t('metadataNotFoundDescription'),
    }
  }

  const displayName = artist.artistName || `${artist.firstName ?? ''} ${artist.lastName ?? ''}`.trim()

  return {
    title: t('metadataTitle', { artistName: displayName }),
    description: t('metadataDescription', { artistName: displayName }),
    openGraph: {
      title: t('metadataTitle', { artistName: displayName }),
      description: t('metadataDescription', { artistName: displayName }),
      images: artist.profilePictureUrl ? [{ url: artist.profilePictureUrl }] : [],
    },
  }
}

export default async function ActuPage({ params }: ActuPageProps) {
  const { slug } = await params
  const artist = await getArtist(slug)

  if (!artist) {
    notFound()
  }

  return <ActuContent slug={slug} artist={artist} />
}
