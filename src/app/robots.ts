import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * robots.txt — autorise l'indexation du contenu public, bloque les espaces
 * privés (dashboards, admin, tunnel d'achat, auth) et référence le sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/*/artdashboard",
          "/*/amadashboard",
          "/*/admindashboard",
          "/*/admin",
          "/*/cart",
          "/*/shop/cart",
          "/*/checkout",
          "/*/shop/checkout",
          "/*/shop/confirmation",
          "/*/payment",
          "/*/login",
          "/*/register",
          "/*/tickets",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
