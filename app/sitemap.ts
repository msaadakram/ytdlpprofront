import type { MetadataRoute } from "next";
import { routing } from "@/lib/i18n/routing";
import { platformSlugs } from "@/lib/platform-config";

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.downforge.me").replace(/\/$/, "");

// Static routes under [locale] — maps to app/[locale]/*
// Excludes noindex routes: dashboard, sign-in, sign-up, admin
// Split: multilingual (home + downloader) vs English-only (informational)
const localizedStaticRoutes = [
  "", // home -> /{locale}
  "/youtube-download",
  "/youtube-video-downloader",
] as const;

const englishOnlyStaticRoutes = [
  "/about",
  "/features",
  "/pricing",
  "/contact",
  "/changelog",
  "/privacy",
  "/terms",
  "/blog",
  "/api-status",
  "/api-disclaimer",
] as const;

// Dynamic platform routes — 5 templates × 15 platforms
const platformRoutePrefixes = [
  "/download",
  "/video-downloader",
  "/audio-downloader",
  "/thumbnail-downloader",
  "/transcript-downloader",
] as const;

// Blog posts — must stay in sync with app/[locale]/blog/[slug]/page.tsx generateStaticParams
// Uses real publish dates to avoid "all identical lastmod" flag (seo-sitemap low severity)
const blogPosts: Array<{ slug: string; lastmod: string }> = [
  { slug: "how-to-download-youtube-4k", lastmod: "2025-08-10" },
  { slug: "tiktok-without-watermark", lastmod: "2025-08-02" },
  { slug: "flac-vs-mp3", lastmod: "2025-07-22" },
  { slug: "batch-playlists", lastmod: "2025-07-12" },
  { slug: "privacy-first", lastmod: "2025-06-28" },
  { slug: "transcripts-ai", lastmod: "2025-06-18" },
];

// Top-level non-localized pages (outside [locale] folder)
// NOTE: /api-disclaimer exists in both app/api-disclaimer and app/[locale]/api-disclaimer.
// To avoid duplicate-content (10 URLs for same intent), sitemap only includes the
// localized variants (already in staticRoutes). Only /api-docs is truly top-level alone.
const topLevelRoutes = [
  "/api-docs",
] as const;

function buildLanguageAlternates(path: string): Record<string, string> {
  // path should start with "/" or be "" for home
  // Includes 9 locales + x-default (points to defaultLocale en) per Google hreflang spec
  const alternates: Record<string, string> = Object.fromEntries(
    routing.locales.map((locale) => [locale, `${BASE_URL}/${locale}${path}`])
  );
  // x-default signals default fallback for unmatched languages — must be absolute
  alternates["x-default"] = `${BASE_URL}/${routing.defaultLocale}${path}`;
  return alternates;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Stagger lastmod slightly per content type to avoid identical-all flag
  const platformLastMod = new Date(now);
  platformLastMod.setHours(now.getHours() - 1);

  const entries: MetadataRoute.Sitemap = [];

  // 1a. Localized static pages — 9 locales with hreflang
  for (const locale of routing.locales) {
    for (const route of localizedStaticRoutes) {
      const url = `${BASE_URL}/${locale}${route}`;
      entries.push({
        url,
        lastModified: now,
        alternates: {
          languages: buildLanguageAlternates(route),
        },
      });
    }

    // Platform dynamic — 5 × 15 = 75 per locale (multilingual: home + downloaders)
    for (const prefix of platformRoutePrefixes) {
      for (const slug of platformSlugs) {
        const path = `${prefix}/${slug}`;
        const url = `${BASE_URL}/${locale}${path}`;
        entries.push({
          url,
          lastModified: platformLastMod,
          alternates: {
            languages: buildLanguageAlternates(path),
          },
        });
      }
    }
  }

  // 1b. English-only static pages — only /en/*, no hreflang (or single en)
  // These pages are not translated; only English canonical exists to avoid thin duplicates.
  for (const route of englishOnlyStaticRoutes) {
    const url = `${BASE_URL}/en${route}`;
    entries.push({
      url,
      lastModified: now,
      // No alternates — English only. Could add x-default -> en if needed.
    });
  }

  // 1c. Blog posts — English-only (blog content is English-only)
  for (const { slug, lastmod } of blogPosts) {
    const path = `/blog/${slug}`;
    const url = `${BASE_URL}/en${path}`;
    entries.push({
      url,
      lastModified: new Date(lastmod),
    });
  }

  // 2. Top-level non-localized routes (no hreflang, single canonical)
  for (const route of topLevelRoutes) {
    entries.push({
      url: `${BASE_URL}${route}`,
      lastModified: now,
    });
  }

  return entries;
}
