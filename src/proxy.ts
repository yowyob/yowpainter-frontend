import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { routing } from './i18n/routing'

const handleI18nRouting = createMiddleware(routing)

function isSupportedLocale(segment: string | undefined) {
  return routing.locales.some((locale) => locale === segment)
}

function shouldUseSubdomainRouting(hostname: string) {
  if (!hostname) return false

  // Hôtes Vercel / previews : pas de multi-tenant par sous-domaine
  if (hostname.endsWith('.vercel.app')) return false

  const configuredBase = process.env.NEXT_PUBLIC_BASE_DOMAIN
  if (!configuredBase || configuredBase.includes('localhost')) return false

  return hostname === configuredBase || hostname.endsWith(`.${configuredBase}`)
}

/**
 * Next.js 16 Proxy — routage i18n + sous-domaines artistes (prod uniquement).
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''

  if (!shouldUseSubdomainRouting(hostname)) {
    return handleI18nRouting(request)
  }

  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN!

  if (hostname === baseDomain) {
    return handleI18nRouting(request)
  }

  const slug = hostname.replace(`.${baseDomain}`, '')

  if (slug === 'www' || slug === 'admin') {
    return handleI18nRouting(request)
  }

  const segments = url.pathname.split('/').filter(Boolean)
  const locale = segments[0]

  if (!isSupportedLocale(locale)) {
    return handleI18nRouting(request)
  }

  const searchParams = url.searchParams.toString()
  const pathWithoutLocale = segments.slice(1).join('/')
  const path = pathWithoutLocale.length > 0 ? `/${pathWithoutLocale}` : ''

  if (segments[1] === slug) {
    return NextResponse.next()
  }

  return NextResponse.rewrite(
    new URL(
      `/${locale}/${slug}${path}${searchParams.length > 0 ? `?${searchParams}` : ''}`,
      request.url,
    ),
  )
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
}
