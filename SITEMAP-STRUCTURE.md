# Sitemap Architecture — DownForge (downforge.me)

> Generated via `app/sitemap.ts` + `app/robots.ts` (Next.js MetadataRoute) — build-validated 2026-08-22, 847 URLs, 0 errors.

## 1. Domain & Env

- **Canonical host:** `https://www.downforge.me` (fallback when `NEXT_PUBLIC_SITE_URL` unset) — `app/sitemap.ts:5` trimmed, `app/robots.ts:3`, `next.config.ts:12` headers, `vercel.json:env`
- **Framework:** Next.js 15.5.20, `next-intl` routing `lib/i18n/routing.ts:11` `localePrefix: "always"` (aligned with canonicals `https://www.downforge.me/${locale}/...` in `app/[locale]/layout.tsx:39` + 15 `page.tsx` generates)
- **Locales:** 9 — `["en","es","fr","de","pt","ja","ar","ru","zh"]` `lib/i18n/routing.ts:3`, default `en`

## 2. URL Inventory (847 total)

| Segment | Pattern | Per locale | ×9 locales | Example | Source |
|---------|----------|-----------|------------|---------|--------|
| Static singleton | `/${locale}` `/${locale}/{page}` | 13 | 117 | `https://www.downforge.me/en/about` | `app/[locale]/page.tsx`, `about`, `features`, `pricing`, `contact`, `changelog`, `privacy`, `terms`, `blog`, `api-status`, `api-disclaimer`, `youtube-download`, `youtube-video-downloader` |
| Platform: download | `/${locale}/download/{slug}` | 15 | 135 | `https://www.downforge.me/en/download/youtube` | `app/[locale]/download/[platform]/page.tsx:17` × `lib/platform-config.ts:135` slugs: `facebook,instagram,tiktok,twitter,vimeo,dailymotion,twitch,reddit,pinterest,linkedin,snapchat,soundcloud,kick,youtube,niconico` |
| Platform: video | `/${locale}/video-downloader/{slug}` | 15 | 135 | `https://www.downforge.me/ja/video-downloader/tiktok` | `app/[locale]/video-downloader/[platform]/page.tsx:15` |
| Platform: audio | `/${locale}/audio-downloader/{slug}` | 15 | 135 | `https://www.downforge.me/ru/audio-downloader/soundcloud` | `app/[locale]/audio-downloader/[platform]/page.tsx:15` |
| Platform: thumbnail | `/${locale}/thumbnail-downloader/{slug}` | 15 | 135 | `https://www.downforge.me/en/thumbnail-downloader/pinterest` | `app/[locale]/thumbnail-downloader/[platform]/page.tsx` |
| Platform: transcript | `/${locale}/transcript-downloader/{slug}` | 15 | 135 | `https://www.downforge.me/zh/transcript-downloader/youtube` | `app/[locale]/transcript-downloader/[platform]/page.tsx` |
| Blog posts | `/${locale}/blog/{slug}` | 6 | 54 | `https://www.downforge.me/en/blog/how-to-download-youtube-4k` | `app/[locale]/blog/[slug]/page.tsx:7` slugs + dates in `app/sitemap.ts:36` |
| Top-level (no locale) | `/api-docs` | — | 1 | `https://www.downforge.me/api-docs` | `app/api-docs/page.tsx` (no locale variant) |

**Excluded (noindex, not in sitemap):** `dashboard`, `sign-in`, `sign-up` (`app/[locale]/*`), `admin/*`, `api/*` — enforced via `app/robots.ts:13` Disallow + sitemap omission.

> Previous duplicate `app/api-disclaimer` top-level (`/api-disclaimer`) removed from `topLevelRoutes` — localized variants (`/en/api-disclaimer` … `/zh/api-disclaimer`) already cover intent; avoids 10-way duplicate.

**Count math:** 13 + 75 + 6 = 94 per locale ×9 = 846 localized + 1 top-level = **847** (validated: `grep -c <loc>` = 847, unique = 847, `wc` 944KB < 50MB/50k limit).

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
  <xhtml:link rel="alternate" hreflang="en" href="https://www.downforge.me/en/about" />
  ...
  <xhtml:link rel="alternate" hreflang="x-default" href="https://www.downforge.me/en/about" />
  ```
- Generation: `app/sitemap.ts:53` `buildLanguageAlternates(path)` maps `routing.locales` → absolute URLs + `x-default = /en` + default fallback.
- Matches per-page `alternates.languages` in `generateMetadata` (e.g. `app/[locale]/about/page.tsx:15`, `app/[locale]/video-downloader/[platform]/page.tsx:48`). Sitemap hreflang count validated: 846 URLs ×10 = 8460 alternates.

## 5. Lastmod Strategy (avoids “all identical” flag)

- `now = new Date()` (build time) for static routes (`/about`, etc.)
- `-1h` staggered for platform routes (`platformLastMod`) — distinguishes content type
- Blog posts use **real publish dates** from `app/[locale]/blog/page.tsx:24`:
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
   curl -I https://www.downforge.me/about         # 307 → /en/about (localePrefix always)
   ```
3. Search Console: https://search.google.com/search-console
   - Property: `sc-domain:downforge.me` (DNS TXT) or `https://www.downforge.me/` (HTML tag in `app/[locale]/layout.tsx:66`)
   - Sitemaps → Submit `sitemap.xml` → `https://www.downforge.me/sitemap.xml`
   - Expect `Success / Discovered 847` after 2–3 days (GSC lag)
   - Inspect sample URLs: `en/download/youtube`, `ja/audio-downloader/soundcloud`
4. Bing Webmaster + IndexNow (optional): submit same sitemap at https://www.bing.com/webmasters + POST `https://www.bing.com/indexnow?url=https://www.downforge.me/sitemap.xml&key=...`

## 8. Maintenance

- Adding a locale: append to `lib/i18n/routing.ts:3` + translate `messages/{locale}.json` — sitemap auto-picks up via `routing.locales`.
- Adding a platform: add to `lib/platform-config.ts:135` — sitemap auto-expands (5×N).
- Adding a blog post: add entry to `app/sitemap.ts:36` `blogPosts` + `app/[locale]/blog/[slug]/page.tsx:7` static params.
- If CMS/DB migration, make `app/sitemap.ts` `async` and fetch slugs instead of hardcode.
- At >50k URLs, split into `sitemap-index.xml` per type (static/platforms/blog) — not needed now.
- Verify quarterly: `xmllint --noout .next/server/app/sitemap.xml.body` + `grep -c <loc>` + check GSC Sitemaps errors.

## 9. Validation (2026-08-22)

- Build: `○ /sitemap.xml 138 B` `○ /robots.txt 138 B` (Next build)
- XML: `ET.fromstring` valid, 847 loc, 0 duplicates, 0 dup lastmod-all, 0 http, 0 noindex, 0 priority/changefreq
- Live (port 3001): sitemap 200, robots 200, `x-default` 846, headers cache-control correct, redirect `/about`→`/en/about` 307.
