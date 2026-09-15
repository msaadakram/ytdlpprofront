import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.downforge.me";

const LOCALES = ["en", "es", "fr", "de", "pt", "ja", "ar", "ru", "zh"];

// Locale-prefixed auth + private variants (e.g. /es/sign-in, /de/dashboard)
// — the top-level entries alone don't cover them for crawlers.
const localeAuthPaths = LOCALES.flatMap((l) => [
  `/${l}/dashboard`,
  `/${l}/sign-in`,
  `/${l}/sign-up`,
  `/${l}/verify-email`,
  `/${l}/forgot-password`,
]);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/admin",
          "/dashboard",
          "/sign-in",
          "/sign-up",
          "/verify-email",
          "/forgot-password",
          ...localeAuthPaths,
          "/_next/",
          "/private/",
        ],
      },
      // Explicit allow for crawlers that respect sitemap
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/admin",
          "/dashboard",
          "/sign-in",
          "/sign-up",
          "/verify-email",
          "/forgot-password",
          ...localeAuthPaths,
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
