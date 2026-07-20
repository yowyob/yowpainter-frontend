import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import {
  buildAlternates,
  localizedUrl,
  organizationLd,
  websiteLd,
  SITE_NAME,
  OG_LOCALE,
  DEFAULT_OG_IMAGE,
  LOCALES,
} from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import HtmlLangSync from "@/components/seo/HtmlLangSync";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  const t = await getTranslations({ locale: safeLocale, namespace: "Seo" });

  return {
    title: {
      default: t("defaultTitle"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    keywords: t("keywords"),
    applicationName: SITE_NAME,
    // Vérification de propriété Google Search Console (balise générée par Next).
    verification: {
      google: "YvTrsAM1wSOoaeYyC_S7IpPzi2HvZRkK6puseZ31-Q0",
    },
    alternates: buildAlternates(safeLocale, ""),
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: t("homeOgTitle"),
      description: t("homeOgDescription"),
      url: localizedUrl(safeLocale),
      locale: OG_LOCALE[safeLocale],
      alternateLocale: LOCALES.filter((l) => l !== safeLocale).map((l) => OG_LOCALE[l]),
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("homeOgTitle"),
      description: t("homeOgDescription"),
      images: [DEFAULT_OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HtmlLangSync locale={locale} />
      <JsonLd data={[organizationLd(), websiteLd(locale)]} />
      {children}
    </NextIntlClientProvider>
  );
}
