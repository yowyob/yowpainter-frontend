import type { Metadata } from 'next'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { configureServerApi } from '@/lib/serverApiInit'
import { ActuService } from '@/lib/services/ActuService'
import { pageMetadata } from '@/lib/seo'
import AllActuContent from './AllActuContent'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'AllActu' })

  return pageMetadata({
    locale,
    path: '/actualites',
    title: t('metadataTitle'),
    description: t('metadataDescription'),
  })
}

export default async function AllActuPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  configureServerApi()

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['all-public-actu'],
    queryFn: () => ActuService.getLatestPublicActu(),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AllActuContent />
    </HydrationBoundary>
  )
}
