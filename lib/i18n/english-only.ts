/**
 * English-only routes — pages that are not translated and should only be served under /en/*.
 * Downloader pages (home, /download/*, /video|audio|thumbnail|transcript-downloader/*, /youtube-*) remain multilingual (9 locales).
 * Informational pages are English-only to avoid thin/mt duplicate content.
 */

export const ENGLISH_ONLY_ROUTES = [
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

export type EnglishOnlyRoute = (typeof ENGLISH_ONLY_ROUTES)[number];

// Check if a pathname (without locale prefix) is English-only.
// Handles /blog and /blog/{slug} as English-only.
export function isEnglishOnlyPath(pathname: string): boolean {
  const p = pathname.replace(/\/$/, "") || "/";
  if ((ENGLISH_ONLY_ROUTES as readonly string[]).includes(p)) return true;
  if (p.startsWith("/blog/")) return true;
  return false;
}

// For generateStaticParams in English-only pages — only emit en.
export function englishOnlyStaticParams() {
  return [{ locale: "en" as const }];
}
