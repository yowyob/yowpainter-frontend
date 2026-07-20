import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SITE_URL, SITE_NAME } from "@/lib/seo";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { NavigationProgress } from "@/components/layout/NavigationProgress";
import { Suspense } from "react";
import { Toaster } from "sonner";
import ChatWidget from "@/components/chat/ChatWidget";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Base pour résoudre toutes les URLs relatives (canonical, OG, sitemap).
  metadataBase: new URL(SITE_URL),
  // Fallback minimal ; titre/description localisés fournis par [locale]/generateMetadata.
  // Pas de `title.template` ici : il envelopperait le titre de la locale (doublon).
  title: SITE_NAME,
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className={`${inter.variable} ${playfair.variable} font-sans canvas-grain antialiased bg-background text-foreground overflow-x-hidden`}>
        <ThemeProvider>
          <QueryProvider>
            <Suspense fallback={null}>
              <NavigationProgress />
            </Suspense>
            {children}
            <ChatWidget />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  border: '1px solid color-mix(in srgb, var(--foreground) 10%, transparent)',
                  borderRadius: '12px',
                  fontFamily: 'var(--font-inter)',
                  fontSize: '13px',
                },
              }}
              richColors
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
