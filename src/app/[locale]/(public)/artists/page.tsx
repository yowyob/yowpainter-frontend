import type { Metadata } from 'next'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { configureServerApi } from '@/lib/serverApiInit'
import { ArtistsService } from '@/lib/services/ArtistsService'
import { pageMetadata } from '@/lib/seo'
import ArtistsClient from './ArtistsClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Artists' })

  return pageMetadata({
    locale,
    path: '/artists',
    title: `${t('titleStart')} ${t('titleAccent')}`,
    description: t('description'),
  })
}

export default async function ArtistsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  configureServerApi()

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['artists-directory', ''],
    queryFn: () => ArtistsService.searchArtists(''),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArtistsClient />
    </HydrationBoundary>
  )
}
