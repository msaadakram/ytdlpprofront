# Sitemap Architecture — DownForge (downforge.me)

> Generated via `app/sitemap.ts` + `app/robots.ts` (Next.js MetadataRoute) — re-validated 2026-08-29 after the English-only page migration, **719 URLs, 0 errors**.

## 1. Domain & Env

- **Canonical host:** `https://www.downforge.me` (fallback when `NEXT_PUBLIC_SITE_URL` unset) — `app/sitemap.ts:5` trimmed, `app/robots.ts:3`, `next.config.ts:12` headers, `vercel.json:env`
- **Framework:** Next.js 15, `next-intl` routing `lib/i18n/routing.ts:11` `localePrefix: "always"` (aligned with canonicals in `app/[locale]/layout.tsx` + per-page `generateMetadata`)
- **Locales:** 9 — `["en","es","fr","de","pt","ja","ar","ru","zh"]` `lib/i18n/routing.ts:3`, default `en`
- **English-only helper:** `lib/i18n/english-only.ts` (`ENGLISH_ONLY_ROUTES`, `isEnglishOnlyPath`) — single source of truth for which routes are NOT localized; `middleware.ts:10` matcher excludes them from i18n handling.

## 2. URL Inventory (719 total)

### 2a. Localized (9 locales, hreflang cluster) — 702 URLs

| Segment | Pattern | Per locale | ×9 locales | Example | Source |
|---------|----------|-----------|------------|---------|--------|
| Home | `/${locale}` | 1 | 9 | `https://www.downforge.me/ja` | `app/[locale]/page.tsx` |
| YouTube all-in-one | `/${locale}/youtube-download` | 1 | 9 | `https://www.downforge.me/de/youtube-download` | `app/[locale]/youtube-download/page.tsx` |
| YouTube video | `/${locale}/youtube-video-downloader` | 1 | 9 | `https://www.downforge.me/pt/youtube-video-downloader` | `app/[locale]/youtube-video-downloader/page.tsx` |
| Platform: download | `/${locale}/download/{slug}` | 15 | 135 | `https://www.downforge.me/en/download/youtube` | `app/[locale]/download/[platform]/page.tsx` × `lib/platform-config.ts:135` slugs: `facebook,instagram,tiktok,twitter,vimeo,dailymotion,twitch,reddit,pinterest,linkedin,snapchat,soundcloud,kick,youtube,niconico` |
| Platform: video | `/${locale}/video-downloader/{slug}` | 15 | 135 | `https://www.downforge.me/ja/video-downloader/tiktok` | `app/[locale]/video-downloader/[platform]/page.tsx` |
| Platform: audio | `/${locale}/audio-downloader/{slug}` | 15 | 135 | `https://www.downforge.me/ru/audio-downloader/soundcloud` | `app/[locale]/audio-downloader/[platform]/page.tsx` |
| Platform: thumbnail | `/${locale}/thumbnail-downloader/{slug}` | 15 | 135 | `https://www.downforge.me/en/thumbnail-downloader/pinterest` | `app/[locale]/thumbnail-downloader/[platform]/page.tsx` |
| Platform: transcript | `/${locale}/transcript-downloader/{slug}` | 15 | 135 | `https://www.downforge.me/zh/transcript-downloader/youtube` | `app/[locale]/transcript-downloader/[platform]/page.tsx` |

### 2b. English-only (top-level, no locale prefix, no hreflang) — 17 URLs

| Segment | Pattern | Count | Example | Source |
|---------|----------|-------|---------|--------|
| Info pages | `/{page}` | 10 | `https://www.downforge.me/about` | `app/{about,features,pricing,contact,changelog,privacy,terms,api-status,api-disclaimer,blog}/page.tsx` |
| Blog posts | `/blog/{slug}` | 6 | `https://www.downforge.me/blog/how-to-download-youtube-4k` | `app/blog/[slug]/page.tsx` + `app/sitemap.ts:40` (dates) |
| API docs | `/api-docs` | 1 | `https://www.downforge.me/api-docs` | `app/api-docs/page.tsx` |

**Count math:** localized 3 + 75 = 78 per locale ×9 = 702; English-only 10 + 6 + 1 = 17 → **719** (validated: `<loc>` count = 719, all unique).

## 2c. Change log vs previous build (2026-08-22, 847 URLs)

**Removed from sitemap (128 URLs):**
- `/{locale}/about`, `/{locale}/features`, `/{locale}/pricing`, `/{locale}/contact`, `/{locale}/changelog`, `/{locale}/privacy`, `/{locale}/terms`, `/{locale}/blog`, `/{locale}/api-status`, `/{locale}/api-disclaimer` (10 × 9 = 90) — pages migrated to top-level English-only (`d67364f`); locale variants now carry `rel=canonical` → top-level. Killing the 10-way thin-duplicate clusters.
- `/{locale}/blog/{slug}` (6 × 9 = 54) — blog posts are English-only top-level; `app/[locale]/blog/[slug]` 307-redirects to `/blog/{slug}`.
- Top-level `/api-disclaimer` duplicate had already been removed earlier.

**Added (0 net new sitemap URLs):**
- `app/[locale]/api-docs/page.tsx` exists to catch locale-prefixed footer/nav links (`/es/api-docs` …) but canonicalizes to `/api-docs` and 307-redirects there — intentionally NOT in the sitemap (single canonical).
- Top-level `/api-docs` remains the only docs URL in the sitemap.

**Excluded (noindex, not in sitemap):** `dashboard`, `sign-in`, `sign-up` (`app/[locale]/*` + top-level), `admin/*`, `api/*` — enforced via `app/robots.ts` Disallow + sitemap omission.

## 3. Technical Implementation

```
app/sitemap.ts      → MetadataRoute.Sitemap  → /sitemap.xml (static, HIT cache)
app/robots.ts       → MetadataRoute.Robots   → /robots.txt
lib/i18n/routing.ts → routing.locales + defaultLocale
lib/platform-config.ts → platformSlugs (15)
```

- **No dependency** (`next-sitemap` not needed at <1k URLs). Native `app/sitemap.ts` integrates with `next build` and `generateStaticParams`.
- **BASE_URL** reads `process.env.NEXT_PUBLIC_SITE_URL` with trailing-slash trim — ensures Vercel preview vs prod correctness.
- **Headers:** `next.config.ts:10` + `vercel.json:13` add `Cache-Control: public, max-age=3600 (sitemap) / 86400 (robots)` + `Content-Type`. Middleware matcher `middleware.ts:7` excludes `.*\..*` so sitemap/robots bypass i18n rewrite.

## 4. Hreflang Strategy (i18n SEO)

- Every localized URL emits 10 alternates: 9 locales + `x-default` (per Google spec):
  ```xml
  <xhtml:link rel="alternate" hreflang="en" href="https://www.downforge.me/en/download/youtube" />
  ...
  <xhtml:link rel="alternate" hreflang="x-default" href="https://www.downforge.me/en/download/youtube" />
  ```
- Generation: `app/sitemap.ts:57` `buildLanguageAlternates(path)` maps `routing.locales` → absolute URLs + `x-default = /en` + default fallback.
- **English-only pages carry NO hreflang** (single canonical only) — emitted alternates only for the 702 localized URLs: 702 ×10 = 7020 alternates.
- Matches per-page `alternates.languages` in `generateMetadata` (e.g. `app/[locale]/video-downloader/[platform]/page.tsx`, top-level `app/about/page.tsx:15`). Locale-prefixed duplicates of English-only pages (`app/[locale]/about`, etc.) consolidate via `rel=canonical` → top-level URL.

## 5. Lastmod Strategy (avoids “all identical” flag)

- `now = new Date()` (build time) for static routes (localized home/YouTube pages + English-only top-level pages + `/api-docs`)
- `-1h` staggered for platform routes (`platformLastMod`) — distinguishes content type
- Blog posts use **real publish dates** from `app/blog/page.tsx:22`:
  ```
  2025-08-10 how-to-download-youtube-4k
  2025-08-02 tiktok-without-watermark
  2025-07-22 flac-vs-mp3
  2025-07-12 batch-playlists
  2025-06-28 privacy-first
  2025-06-18 transcripts-ai
  ```
- Result: 8 distinct `<lastmod>` values (validated), no `priority`/`changefreq` (ignored per seo-sitemap skill).

## 6. Robots

```
User-Agent: *
Allow: /
Disallow: /api/ /admin/ /admin /dashboard /sign-in /sign-up /_next/ /private/
User-Agent: Googlebot
Allow: /
Disallow: /api/ /admin/ /admin /dashboard /sign-in /sign-up
Host: https://www.downforge.me
Sitemap: https://www.downforge.me/sitemap.xml
```

## 7. Deployment & GSC

1. `npm run build` — verifies `/sitemap.xml` + `/robots.txt` static.
2. Push to Vercel (main). Live check:
   ```bash
   curl -I https://www.downforge.me/sitemap.xml   # 200 application/xml, Cache-Control 3600
   curl https://www.downforge.me/robots.txt       # contains Sitemap host
   curl -I https://www.downforge.me/es/api-docs   # 307 → /api-docs (English-only consolidation)
   curl -I https://www.downforge.me/en/blog/how-to-download-youtube-4k  # 307 → /blog/how-to-download-youtube-4k
   ```
3. Search Console: https://search.google.com/search-console
   - Property: `sc-domain:downforge.me` (DNS TXT) or `https://www.downforge.me/` (HTML tag in `app/[locale]/layout.tsx:66`)
   - Sitemaps → Submit `sitemap.xml` → `https://www.downforge.me/sitemap.xml`
   - Expect `Success / Discovered 719` after 2–3 days (GSC lag); removed `/en/about`-style URLs will drop out as crawlers re-read the sitemap + canonicals
   - Inspect sample URLs: `en/download/youtube`, `ja/audio-downloader/soundcloud`, `about`, `blog/how-to-download-youtube-4k`
4. Bing Webmaster + IndexNow (optional): submit same sitemap at https://www.bing.com/webmasters + POST `https://www.bing.com/indexnow?url=https://www.downforge.me/sitemap.xml&key=...`

## 8. Maintenance

- Adding a locale: append to `lib/i18n/routing.ts:3` + translate `messages/{locale}.json` — sitemap auto-picks up via `routing.locales`.
- Adding a platform: add to `lib/platform-config.ts:135` — sitemap auto-expands (5×N).
- Adding a blog post: add entry to `app/sitemap.ts:36` `blogPosts` + `app/[locale]/blog/[slug]/page.tsx:7` static params.
- If CMS/DB migration, make `app/sitemap.ts` `async` and fetch slugs instead of hardcode.
- At >50k URLs, split into `sitemap-index.xml` per type (static/platforms/blog) — not needed now.
- Verify quarterly: `xmllint --noout .next/server/app/sitemap.xml.body` + `grep -c <loc>` + check GSC Sitemaps errors.

## 9. Validation (2026-08-29)

- Build: `✓ Compiled successfully`, `✓ Generating static pages (864/864)`, `○ /sitemap.xml` + `○ /robots.txt` static
- XML (`.next/server/app/sitemap.xml.body`): valid XML, **719 loc**, 719 unique (0 duplicates), 7020 hreflang alternates (702 localized ×10), 8 distinct `<lastmod>`, 0 http://, 0 noindex URLs, 0 priority/changefreq
- Spot checks IN: `/en`, `/about`, `/api-docs`, `/blog/how-to-download-youtube-4k`, `/ja/video-downloader/tiktok`, `/en/download/youtube` + all 9 locales × 7 localized prefixes
- Spot checks correctly ABSENT: `/en/about`, `/es/blog`, `/ja/api-status`, `/en/blog/how-to-download-youtube-4k` (migrated English-only duplicates)
- Live (`next start`): `/sitemap.xml` 200 `application/xml` + `Cache-Control: public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400`; `/robots.txt` 200 with Sitemap+Host; `/about` 200; `/ja/video-downloader/tiktok` 200; `/es/api-docs` 307 → `/api-docs`; `/en/blog/how-to-download-youtube-4k` 307 → `/blog/how-to-download-youtube-4k`
- Canonical: `/es/about` emits `<link rel="canonical" href="https://www.downforge.me/about"/>` (duplicate consolidation verified)
