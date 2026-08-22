import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.downforge.me";

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
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
