import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/seo";

/**
 * Web App Manifest — améliore le référencement mobile / installabilité (PWA).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Marketplace d'art moderne`,
    short_name: SITE_NAME,
    description:
      "Découvrez, exposez et achetez des œuvres d'art moderne et contemporain sur YowPainter.",
    start_url: "/",
    display: "standalone",
    background_color: "#F2EFE9",
    theme_color: "#C26D5C",
    icons: [
      { src: "/images/logo.png", sizes: "192x192", type: "image/png" },
      { src: "/images/logo.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
