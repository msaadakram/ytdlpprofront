import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts", "motion"],
  },
  async redirects() {
    return [
      // English-only informational pages exist only at the top level.
      // Locale-prefixed variants were removed — send any legacy/stray URLs
      // (bookmarks, old sitemap entries, internal links) to the canonical page.
      // permanent:true (308) — these moves are permanent; keeps method+body.
      {
        source: "/:locale(en|es|fr|de|pt|ja|ar|ru|zh)/:path(about|features|pricing|contact|changelog|privacy|terms|blog|api-status|api-disclaimer|api-docs|dashboard|sign-in|sign-up|verify-email|forgot-password)",
        destination: "/:path",
        permanent: true,
      },
      {
        source: "/:locale(en|es|fr|de|pt|ja|ar|ru|zh)/blog/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://accounts.google.com https://al5sm.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https: wss:",
              "frame-src https://accounts.google.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
      {
        // Admin + dashboard + auth: never index, never cache at edge.
        source: "/(admin|dashboard|sign-in|sign-up|verify-email|forgot-password)(/:path*)?",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          { key: "Content-Type", value: "application/xml" },
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          { key: "Content-Type", value: "text/plain" },
          { key: "Cache-Control", value: "public, max-age=86400, s-maxage=86400" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
