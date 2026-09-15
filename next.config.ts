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
        // Keep CSP out (risky inline-script breakage); HSTS + Permissions-Policy are safe.
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
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
