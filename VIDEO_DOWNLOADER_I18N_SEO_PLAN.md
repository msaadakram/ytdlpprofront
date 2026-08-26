# Video-Downloader i18n SEO Plan — 15 Platforms × 9 Locales = 135 URLs (Full-Page Localization)

> **Goal:** Every word on every `/ {locale}/video-downloader/{platform}` page changes with locale, including title, meta, OG, keywords, hero, features, FAQ, body, footer, and BlogContent. **Scope:** 135 URLs = 15 platforms × 9 locales. Deep audit shows ~40–52% strings still English in non-EN locales, plus hardcoded English in components and English-only long-form content. This plan makes it 100% localized with locale-native SEO.
>
> **Stack:** Next.js 15.3 `app/[locale]/video-downloader/[platform]/page.tsx:15`, `next-intl` `lib/i18n/routing.ts:3` `localePrefix:always`, `lib/platform-config.ts:27` 15 slugs, `lib/i18n/request.ts:11` fallback merge, `components/video-downloader/*`, `messages/*.json` (9 files).

---

## 1. URL Matrix — 135 Pages (validated in `app/sitemap.ts:26`)

**Locales (9):** `en, es, fr, de, pt, ja, ar, ru, zh` — `lib/i18n/routing.ts:3`, `defaultLocale=en`, `localePrefix:always`.

**Platforms (15):** `lib/platform-config.ts:135` `platformSlugs`

| # | Slug | Name | Brand | DefaultType | Example URL (`video-downloader`) |
|---|------|------|-------|-------------|----------------------------------|
| 1 | `facebook` | Facebook | #1877F2 | video | `/{locale}/video-downloader/facebook` |
| 2 | `instagram` | Instagram | #E1306C | video | `/{locale}/video-downloader/instagram` |
| 3 | `tiktok` | TikTok | #010101 | video | `/{locale}/video-downloader/tiktok` |
| 4 | `twitter` | Twitter / X | #14171A | video | `/{locale}/video-downloader/twitter` |
| 5 | `vimeo` | Vimeo | #1AB7EA | video | `/{locale}/video-downloader/vimeo` |
| 6 | `dailymotion` | Dailymotion | #0066DC | video | `/{locale}/video-downloader/dailymotion` |
| 7 | `twitch` | Twitch | #9146FF | video | `/{locale}/video-downloader/twitch` |
| 8 | `reddit` | Reddit | #FF4500 | video | `/{locale}/video-downloader/reddit` |
| 9 | `pinterest` | Pinterest | #E60023 | video | `/{locale}/video-downloader/pinterest` |
| 10 | `linkedin` | LinkedIn | #0A66C2 | video | `/{locale}/video-downloader/linkedin` |
| 11 | `snapchat` | Snapchat | #FFB300 | video | `/{locale}/video-downloader/snapchat` |
| 12 | `soundcloud` | SoundCloud | #FF5500 | audio* | `/{locale}/video-downloader/soundcloud` |
| 13 | `kick` | Kick | #53FC18 | video | `/{locale}/video-downloader/kick` |
| 14 | `youtube` | YouTube | #FF0000 | video | `/{locale}/video-downloader/youtube` |
| 15 | `niconico` | Niconico | #FF69B3 | video | `/{locale}/video-downloader/niconico` |

*SoundCloud defaultType audio but video-downloader still renders VideoOnlyHero (video variant).

**Full expansion:** 15 × 9 = **135** `video-downloader` URLs. Total platform pages (all 5 prefixes ×15×9) = 675; sitemap already declares 135 for this prefix + 135 each for audio/thumbnail/transcript/download = 675 + static + blog = 847 (`SITEMAP-STRUCTURE.md:21`).

**Sitemap existing coverage:** `app/sitemap.ts:32` `platformRoutePrefixes` includes `"/video-downloader"`; `sitemap.ts:86` loops `routing.locales × platformRoutePrefixes × platformSlugs` with `buildLanguageAlternates(path):53` (9 + `x-default`). No sitemap change needed — verify `grep -c video-downloader .next/server/app/sitemap.xml.body == 135`.

---

## 2. Current-State Audit — Quantitative (run 2026-08-26)

### 2.1 Files inspected

- `app/[locale]/video-downloader/[platform]/page.tsx:24` `generateMetadata` (uses `t.has("metaTitleVideo")` fallback)
- `app/[locale]/video-downloader/[platform]/page.tsx:72` `VideoDownloaderPage` (Nav, VideoOnlyHero, VideoFeatures, VideoFaq, BlogContent, RelatedLinks, Footer + JSON-LD)
- `components/video-downloader/VideoOnlyHero.tsx:13` (client, `usePlatformTranslations`, `useTranslations("VideoOnly"/"PlatformShared")`)
- `components/video-downloader/VideoFeatures.tsx:17` (hardcoded `stats[6]` English)
- `components/video-downloader/VideoFaq.tsx:9` (uses `config.faqs` + `t("VideoOnly")`)
- `lib/usePlatformTranslations.ts:35` (merges `Platform.{platform}` keys, fallback to `metaTitle`)
- `lib/content/builders.ts:75` `buildContent` (English-only long-form)
- `lib/content/registry.ts:12` `getContent(platform,"video")` (English-only)
- `messages/en.json` (15 platforms ×28 keys = complete), `messages/{es,fr,de,pt,ja,ar,ru,zh}.json`
- `lib/i18n/request.ts:11` `mergeWithFallback` (masks missing keys with EN — hides gaps in UI but hurts SEO)
- `lib/i18n/routing.ts:3` locales
- `app/[locale]/layout.tsx:122` `dir = locale==="ar"?"rtl":"ltr"` (correct)

### 2.2 Gap summary

| Area | Severity | Finding | Evidence |
|------|----------|---------|----------|
| **Page-level i18n incomplete** | **CRITICAL** | 40.1–52.4% strings identical to EN in non-EN locales (computed `is_english` check). Total strings per locale in `Platform` = 1198; identical: `es 480 (40.1%), fr 480, de 563 (47%), pt 500, ja 628 (52.4%), ar 575, ru 493, zh 492`. | `python -c is_english` audit |
| **PlatformPage namespace untranslated** | **CRITICAL** | `PlatformPage.toolFeaturesBadge/Heading/Subheading/Stats`, `tipsBadge/Heading/Subheading`, `faqBadge/Heading/Subheading`, `howItWorksBadge/Heading/Subheading/Step1-3` — 19 keys remain English in **all 8 non-EN locales**. These render middle sections (Why, Tips, FAQ header, HowItWorks) as English on `es/ja/ar/...` pages. | `messages/de.json:271` `toolFeaturesHeading: "The Best {name} Download Tool"` still EN; same in `es/ja/zh` |
| **VideoOnly namespace partial** | **HIGH** | Missing `featuresTitle`, `faqTitle` in 8 locales (2 keys absent). `headingSuffix` still EN in `de` (`"in HD & 4K"`), `faqKicker` still EN in `fr/de` (`"FAQ"`). `featuresKicker/Heading/Subheading` mostly translated but `VideoFeatures` component ignores them (see below). | `grep VideoOnly` audit |
| **VideoFeatures hardcoded** | **HIGH** | `components/video-downloader/VideoFeatures.tsx:8` `const stats = [{label:"Video Quality", desc:"Download videos..."}]` — 6 cards hardcoded EN, not in `messages/*.json`. Even if `VideoOnly` translated, this section stays English on all locales. `t("featuresKicker/Heading/Subheading")` is translated, but `stat.label/desc/value` is not. | `VideoFeatures.tsx:8` |
| **Meta video-specific missing** | **HIGH** | `metaTitleVideo`/`metaDescriptionVideo` exist only for `youtube` in all non-EN locales; 14 other platforms missing (fallback to generic `metaTitle` = video-generic but not video-specific SEO). Also `keywords` for `ja` still English (`"facebook video downloader"` in `ja.json`), for `es/fr` partially English `keywordsAudio`. | `messages/ja.json:facebook keywords` identical to EN; `es:facebook metaTitleVideo missing` |
| **Keywords not localized** | **HIGH** | Native search terms differ per language (e.g., JA users search `フェイスブック動画保存` not `facebook video downloader`). Current `ja/zh/ar/ru` keywords are English literal, losing local SERP intent. `soundcloud/linkedin` etc same. | `ja.json` keywords identical 100% for 14/15 platforms |
| **featuresAudio/faqsAudio partial** | **MEDIUM** | `facebook featuresAudio[0].title = "High-Quality MP3 & FLAC"` still EN in `ja/de/es` (only `q` translated in `ja`, `a` still EN). Same for `tiktok/instagram/twitter` etc. For video-downloader pages this is less visible (video uses `features/faqs` which are translated), but shared components and fallback logic `usePlatformTranslations.ts:59` mix them. | `ja facebook featuresAudio[0]` EN; `ja faqsAudio[0].a` EN |
| **BlogContent English-only** | **MEDIUM** | `lib/content/builders.ts:75` builds English paragraphs/tables only; `getContent(platform,"video")` returns English `PageContent`; `BlogContent` component renders English long-form SEO guide (~1800 words) regardless of locale. No locale-aware builder. `buildUniversalContent` exists but also EN. | `builders.ts:1` imports `enMessages` only |
| **Fallback masks gaps** | **LOW** | `lib/i18n/request.ts:11` `mergeWithFallback` fills missing keys with EN — UI never shows missing-key error, so gaps stay undetected until SEO audit. Need CI to fail on fallback. | `request.ts:45` |
| **OG locale not mapped** | **LOW** | `page.tsx:45` `openGraph.locale = locale` sends `ja` not `ja_JP`, `zh` not `zh_CN`, `pt` not `pt_BR`. FB/Twitter scrapers expect `ja_JP`. | `layout.tsx:67` same |
| **Title/description length not locale-aware** | **LOW** | CJK titles should be shorter (JA/ZH ~28–35 chars vs EN 58–68 due to byte width). Current EN-centric 58–68 rule produces truncation in JA. | — |

**Conclusion:** Infrastructure (routing, sitemap, hreflang, RTL, static params) is correct and already generates 135 URLs. Content translation is the blocker: ~45% English remains in `PlatformPage`, hardcoded `VideoFeatures`, English-only `BlogContent`, and non-localized SEO keywords/meta.

---

## 3. Requirement: “Every Word Changes” — Scope Definition

For `/ {locale}/video-downloader/{platform}` the following DOM text must be locale-specific (no English fallback):

| Zone | Source keys/files | Count per page | Notes |
|------|-------------------|----------------|-------|
| **`<head>` SEO** | `Platform.{platform}.metaTitleVideo` → `metaTitle`, `metaDescriptionVideo` → `metaDescription`, `keywords` (localized) + `openGraph` + `twitter` + `canonical` + `alternates.languages` + `robots` | 6 | Title 58–68 latin / 28–38 CJK, description 145–160 / 90–120 CJK, keywords 8–12 locale-native |
| **JSON-LD** | `BreadcrumbList` (Home translated `PlatformPage.breadcrumbHome`), `WebApplication` (name/description localized), `FAQPage` (localized Q/A), `Article` optional (localized headline/description/wordCount, inLanguage) | 4 objects | `inLanguage: locale`, `name: metaTitleVideo` |
| **Nav/Footer** | `Nav.*`, `Footer.*` | ~35 strings | Already fully translated (verified `messages/es.json:Nav` etc); keep |
| **VideoOnlyHero** | `Platform.{platform}.badge`, `heading`, `headingAccent`, `subheading`, `placeholder` + `VideoOnly.badge`, `headingSuffix`, `subheading`, `disclaimer`, `trustFree/NoSignup/Quality/Private`, `PlatformShared.chooseVideoQuality` etc | ~12 | `components/video-downloader/VideoOnlyHero.tsx:99` `config.name + t("badge")`, `config.heading` |
| **VideoFeatures** | `VideoOnly.featuresKicker/Heading/Subheading` + 6 stat cards (label/value/desc) | 18 strings | Currently hardcoded — must move to `messages` |
| **VideoFaq** | `VideoOnly.faqKicker/Heading/Subheading` + `Platform.{platform}.faqs[5]` Q/A | 13 | `VideoFaq.tsx:30` |
| **BlogContent** | `getContent(platform,"video")` sections: `introduction`, `whatIsPlatform`, `stepByStepGuide`, `formatGuide`, `qualityGuide`, `deviceGuide`, `useCases`, `safety`, `whyDownForge`, `proTips`, `troubleshooting`, `conclusion` — each heading/subheading/paragraphs/table/steps/tips | ~2500 words | English-only → needs i18n builder |
| **RelatedLinks** | `relatedLinksFor("video-downloader", platform)` labels (platform names + slugs) | ~6 links | Labels are platform names (proper nouns) but section heading `RelatedLinks` needs i18n if present |
| **System UI** | `PlatformShared.*` (fetching, processing, errors, fileSize, copy, etc.) + `Formats.*` + `Errors.*` | ~45 | Mostly translated (see 2.2) |
| **Layout chrome** | `<html lang dir>`, `Organization`/`WebSite` JSON-LD `inLanguage`, font rendering (CJK, Arabic) | — | `app/[locale]/layout.tsx:130` `dir=rtl` for `ar` already |

**Total:** ~110 UI strings + ~2500 word guide + 6 meta strings per page ×135 pages ≈ 14,850 UI strings + 337k words guide across locales. `Nav/Footer` shared across pages (not per-page duplicate).

**Acceptance criterion:** `npm run build && python scripts/check-i18n-coverage.py --locale all --prefix video-downloader` reports 0 fallback hits (see Phase 5).

---

## 4. SEO Spec Per Locale (Video-Downloader — Video-Only Intent)

Differentiated from `/download/*` all-tools pages: `video-downloader` is **video-intent only** (MP4/WebM/MKV, 4K/1080p), so titles/descriptions/keywords focus on **video download**, not audio/thumbnail/transcript.

### 4.1 Metadata rules

| Field | Rule (Latin: en/es/fr/de/pt/ru) | Rule (CJK: ja/zh) | Rule (Arabic: ar) | Example |
|-------|----------------------------------|--------------------|-------------------|---------|
| **title** `metaTitleVideo` | 58–68 chars, primary keyword `{Platform} Video Downloader` in first 28 chars, brand `| DownForge` suffix, one intent modifier (`in HD`, `4K`) | 28–40 chars (CJK chars count ~2× latin), brand suffix, no truncation | 55–65 chars, RTL, primary keyword Arabic `تحميل فيديو {Platform}` first 28 chars, suffix | EN: `Facebook Video Downloader — Download Facebook Videos in HD \| DownForge` (70>68 — shorten to 66) |
| **description** `metaDescriptionVideo` | 145–160 chars, starts `Free {Platform} video downloader.`, lists 4K/HD/MP4, CTA `No app, no sign-up.`, one device mention optional | 80–110 chars (CJK), same structure, shorter CTA | 140–155 chars, RTL, start Arabic `أداة تحميل فيديو {Platform} المجانية.` | EN: `Free Facebook video downloader. Save Facebook videos & Reels in HD & 4K MP4. No app, no sign-up — paste a link and download.` (154) |
| **keywords** `keywords` | 8–12 terms, first 3 cover head: `{platform} video downloader`, `download {platform} videos`, `{platform} to mp4`; next: `facebook reels downloader`, `facebook hd downloader`, `save facebook video`, `fb video downloader` ; no stuffing, unique per platform | Native terms, not literal EN translation: `フェイスブック動画ダウンロード`, `facebook動画保存`, `fb動画ダウンローダー` — mix romaji + kana (JA search mixes both) | Arabic: `تحميل فيديو فيسبوك`, `تنزيل فيديوهات فيسبوك`, `محمل فيديو فيسبوك` | See 4.3 |
| **og:image** | `https://www.downforge.me/og/video-downloader/{slug}.png` (1200×630, per slug) | same | same | `og/video-downloader/facebook.png` |
| **canonical** | `https://www.downforge.me/{locale}/video-downloader/{slug}` (self) | same | same | — |
| **alternates.languages** | 9 + `x-default→/en/...` per `sitemap.ts:60` | same | same | `page.tsx:56` already correct |
| **openGraph.locale** | Map `locale → ogLocale`: `en→en_US`, `es→es_ES`, `fr→fr_FR`, `de→de_DE`, `pt→pt_BR`, `ja→ja_JP`, `ar→ar_SA`, `ru→ru_RU`, `zh→zh_CN` (fix `locale` raw) | — | — | — |
| **robots** | `index,follow`, `googleBot max-snippet:-1, max-image-preview:large` | same | same | `page.tsx:53` already |
| **jsonLd** | `BreadcrumbList` (Home localized `PlatformPage.breadcrumbHome`), `WebApplication` (name=title, description=desc, inLanguage, featureList video-specific `["4K MP4","1080p HD","WebM","MKV"]`), `FAQPage` (localized Q/A), optional `HowTo` (3 steps video download) + `Article` (headline=title, wordCount locale-appropriate) | same | `inLanguage: ar`, `dir` handled by `<html>` | — |

**Title length QA:** Use `python -c "len(title.encode('utf-8'))"`; latin 58–68 ≈ 58–68 bytes, CJK 28–38 chars ≈ 84–114 bytes but SERP pixel width is similar (Google measures pixels, not chars). Keep JA/ZH titles under 35 chars.

### 4.2 Hreflang

- Sitemap: already `buildLanguageAlternates(path):53` with `x-default → /en/...` (correct per Google spec `x-default` must be absolute).
- Page `alternates.languages` (`page.tsx:56`) hardcoded map — must stay in sync with `routing.locales`. Already correct.
- `x-default` correctly points to `en` (defaultLocale). Do not point to auto-detect.
- For `zh`, use `zh` (not `zh-CN`) in `routing.locales` but add `zh-CN` as alias in `alternates.languages` if possible: Next.js `alternates.languages` keys are hreflang values, so add both `zh` and `zh-CN` → same URL, or keep `zh` only (Google accepts `zh`). Keep as-is to avoid sitemap/page mismatch.
- Validate with `https://technicalseo.com/tools/hreflang/` or `curl sitemap.xml | grep -A10 video-downloader/facebook`.

### 4.3 Keyword localization strategy (not literal translation)

Use **locale-native search intent**, not machine translation of EN keywords. Research via DataForSEO / Ahrefs / Google Keyword Planner per locale. For video-downloader intent, core pattern per language:

| Locale | Primary head term (native) | Secondary (romaji/latin mix) | Long-tail examples | Volume tier (proxy from EN 5M head) |
|--------|----------------------------|------------------------------|--------------------|-------------------------------------|
| **en** | `facebook video downloader` | — | `download facebook videos`, `fb video downloader`, `facebook to mp4`, `facebook reels downloader` | 50k–5M |
| **es** | `descargador de videos de facebook` | `facebook video downloader` (ES searches both) | `descargar videos de facebook`, `descargar facebook reels`, `facebook a mp4` | ES head ~40% EN volume |
| **fr** | `téléchargeur vidéo facebook` | `facebook video downloader` | `télécharger vidéos facebook`, `télécharger reels facebook` | — |
| **de** | `facebook video downloader` + `facebook videos herunterladen` | — | `facebook video speichern`, `facebook reels downloader` | DE heavily uses EN loan |
| **pt** | `baixador de vídeos do facebook` | `facebook video downloader` | `baixar vídeos do facebook`, `baixar reels facebook` | — |
| **ja** | `facebook動画ダウンロード` / `フェイスブック動画保存` | `facebook video downloader` (JA mixes) | `facebook 動画 保存`, `fb動画ダウンローダー`, `facebook リール ダウンロード` | JA head ~30% EN |
| **ar** | `تحميل فيديو فيسبوك` | `facebook video downloader` (AR also uses EN) | `تنزيل فيديوهات فيسبوك`, `تحميل ريلز فيسبوك`, `حفظ فيديو فيسبوك` | — |
| **ru** | `скачать видео с фейсбука` | `facebook video downloader` | `загрузчик видео facebook`, `скачать рилз фейсбук` | — |
| **zh** | `facebook视频下载器` / `脸书视频下载` | `facebook video downloader` | `下载facebook视频`, `facebook reels 下载`, `fb视频下载` | CN head large but GFW |

**Implementation:** For each `messages/{locale}.json:Platform.{slug}.keywords` replace English array with 8–12 native terms per above pattern. Keep 1–2 English fallback terms where locale actually searches English (DE, JA young, AR tech). Do not literally translate EN keywords via Google Translate — use native.

### 4.4 Example localized metadata (3 platforms × 3 locales)

**Facebook:**

- **en** `metaTitleVideo`: `Facebook Video Downloader — Download Facebook Videos in HD | DownForge` (68) — *shorten from 70*
  `metaDescriptionVideo`: `Free Facebook video downloader. Save Facebook videos, Reels & Watch in HD & 4K MP4. No app, no sign-up — paste a link.` (148)
  `keywords`: `["facebook video downloader","download facebook videos","fb video downloader","facebook reels downloader","facebook watch download","save facebook video","facebook to mp4","facebook hd downloader"]`
- **es** `metaTitleVideo`: `Descargador de Videos de Facebook — Descarga en HD | DownForge` (64)
  `metaDescriptionVideo`: `Descargador gratuito de videos de Facebook. Guarda videos, Reels y Watch en HD y MP4. Sin app, sin registro — pega el enlace.` (144)
  `keywords`: `["descargador de videos de facebook","descargar videos de facebook","descargar facebook reels","facebook a mp4","guardar video facebook","descargador facebook hd"]`
- **ja** `metaTitleVideo`: `Facebook動画ダウンローダー — HDで保存 | DownForge` (32)
  `metaDescriptionVideo`: `無料のFacebook動画ダウンローダー。Facebook動画・リールをHD/MP4で保存。アプリ不要、登録不要。` (52)
  `keywords`: `["facebook動画ダウンロード","facebook動画保存","フェイスブック動画ダウンロード","facebook リール ダウンロード","fb動画ダウンローダー","facebook hd 保存"]`

**TikTok (no watermark intent):**

- **en**: `TikTok Video Downloader — Download TikTok Without Watermark | DownForge` (68)
  `desc`: `Free TikTok downloader. Download TikTok videos without watermark in HD. No app, no sign-up.` (94 — expand to 150: add `Save slideshows & stories as MP4.`)
- **de**: `TikTok Video Downloader — Ohne Wasserzeichen | DownForge` (56)
  `desc`: `Kostenloser TikTok Downloader. TikTok Videos ohne Wasserzeichen in HD speichern. Ohne App, ohne Anmeldung.` (108)
- **ar**: `تحميل فيديو تيك توك بدون علامة مائية | DownForge` (44)
  `desc`: `أداة تحميل تيك توك المجانية. حمّل فيديوهات تيك توك بدون علامة مائية بجودة HD. بدون تطبيق، بدون تسجيل.` (110)

**YouTube (already has video-specific in EN, needs localization for others):**

- **en** exists: `YouTube Video Downloader — YouTube to MP4, 4K & HD` etc (check `en.json:youtube.metaTitleVideo`)
- **fr**: `Téléchargeur de Vidéos YouTube — YouTube en MP4 & 4K | DownForge`
- **zh**: `YouTube视频下载器 — 下载YouTube视频 支持4K | DownForge`

Full list for 15×9 must be generated — use template in 4.1 + per-platform modifier (e.g., TikTok adds “Without Watermark”, Instagram adds “Reels & Stories”, Twitter adds “ & GIFs”, Twitch adds “VODs & Clips”).

---

## 5. Translation Inventory & Gaps to Fill

### 5.1 Namespaces on video-downloader pages

| Namespace | Key count (en) | Used by | Status per locale |
|-----------|----------------|---------|-------------------|
| `VideoOnly` | 16 | `VideoOnlyHero`, `VideoFeatures`, `VideoFaq` | 14/16 present (missing `featuresTitle/faqTitle` in 8 locales; `headingSuffix/faqKicker` still EN in some) |
| `PlatformShared` | 45 | Hero processing states, FormatGrid, DownloadProgress | 45/45 present (translated) |
| `PlatformPage` | 27 | `PlatformToolFeatures`, `PlatformHowItWorks`, `Tips`, breadcrumbs (shared across download/video) | 26/27 present but **19 values still EN** (all badge/heading/subheading + stats/steps) |
| `Formats` | 38 | `FormatGrid` labels | 38/38 present (translated) |
| `Errors` | 7 | `useDownloader` error toasts | 7/7 present |
| `Nav` / `Footer` | 44 / 20 | `Nav.tsx`, `Footer.tsx` | fully translated |
| `Platform.{slug}` | 28 per platform ×15 = 420 keys | `usePlatformTranslations`, `generateMetadata`, `VideoOnlyHero/Faq` | 26/28 per non-youtube platform (missing `metaTitleVideo/DescriptionVideo`), `keywords` not localized for CJK, `featuresAudio/faqsAudio` partial EN |
| `SEO` | 3 | `app/[locale]/layout.tsx:40` | translated |
| **BlogContent (builders)** | ~12 sections × ~5 strings = ~60 strings per platform | `BlogContent.tsx` + `lib/content/*` | **EN only** — no locale variant |

### 5.2 Required new/updated keys

**For each `messages/{locale}.json`:**

1. **`VideoOnly` — add 2 missing + fix 1:**
   - `featuresTitle` (currently missing in 8 locales) — e.g., ES `Características`, JA `特徴`, AR `المميزات`
   - `faqTitle` — e.g., ES `Preguntas frecuentes`, JA `よくある質問`
   - Ensure `headingSuffix` (`in HD & 4K`) and `faqKicker` (`FAQ`) fully translated (DE `in HD & 4K` → `in HD & 4K` actually should be `in HD & 4K` is ok for DE but better `in HD & 4K` → DE `in HD & 4K` keep? Check `de.json: VideoOnly.headingSuffix` is EN — fix to `in HD & 4K` → `in HD & 4K` vs DE `in HD & 4K` same? Actually DE should be `in HD & 4K` identical, so ok to keep; but `faqKicker` FR `FAQ` → `FAQ` same. So only 2 keys needed.

2. **`PlatformPage` — translate 19 values:**
   - `toolFeaturesBadge`: ES `Por qué DownForge`, DE `Warum DownForge`, JA `DownForgeの特長`, AR `لماذا DownForge`, etc.
   - `toolFeaturesHeading`: `The Best {name} Download Tool` → ES `La mejor herramienta para descargar de {name}`, JA `{name}最強のダウンロードツール`, etc.
   - `toolFeaturesSubheading`, `toolFeaturesStats[6]` (title/value/desc each), `tipsBadge/Heading/Subheading`, `faqBadge/Heading/Subheading`, `howItWorksBadge/Heading/Subheading`, `howItWorksStep1-3Title/Desc`
   - Provide 9-locale translations for all 19. See `messages/en.json:PlatformPage` for EN source.

3. **`VideoOnly` — 6 stat cards (move hardcoded `VideoFeatures.tsx:8` to messages):**
   - Add `VideoOnly.stats` array (or `PlatformPage.toolFeaturesStats` already exists but `VideoFeatures` uses its own). Options: (a) make `VideoFeatures` read `PlatformPage.toolFeaturesStats` (already has 6 stats but currently EN), or (b) add `VideoOnly.stats[6]` with `label/value/desc`. Recommend (a) reuse `PlatformPage.toolFeaturesStats` after translating it (see 2 above) — then `VideoFeatures` becomes i18n without new keys.

4. **`Platform.{slug}` — per platform (15) per locale (9):**
   - Add `metaTitleVideo` (58–68 latin / 28–40 CJK) + `metaDescriptionVideo` (145–160) — distinct from generic `metaTitle` (currently fallback). For 14 non-youtube platforms, create from template. For `youtube`, verify existing `metaTitleVideo` is translated (it is in `es/de/ja` etc — but check `es youtube metaTitleVideo` exists; yes per audit only youtube has it, but its value is still ?? Check `es.json:youtube.metaTitleVideo` — need verify translation quality).
   - **Localize `keywords`**: 8–12 native terms per 4.3. For JA/ZH replace English with native; for ES/FR/DE etc ensure native first, English optional 1–2 terms where code-switching occurs.
   - Ensure `badge/heading/headingAccent/subheading/placeholder/features[5]/faqs[5]` fully native (currently 40% still EN in ja `featuresAudio` — but for video-downloader, `features`/`faqs` are translated; verify). For `featuresAudio/faqsAudio` not needed for video-downloader, but keep future-proof.
   - `heading`/`subheading` etc already translated for `features`/`faqs` (per audit false for EN check — so ok).

5. **BlogContent — i18n long-form:**
   - Option A (recommended for launch): **Disable `BlogContent` for non-EN locales** on video-downloader pages (render `null` unless `locale==="en"`), to avoid English guide under Arabic/JA page (breaks “every word changes”). Show short locale-specific intro instead.
   - Option B: **Localize builders**: add `messages/{locale}.json:Content` or `lib/content/translations/{locale}.json` with translated sections, then `buildContentLocalized(locale, platform, "video")`. This is ~2500 words ×15 platforms ×8 locales = 300k words translation — large. Can be phased: launch with Option A, then Option B in Phase 3.
   - For SEO word count, Option A reduces wordCount for non-EN pages — set `Article.wordCount` accordingly (e.g., 900 for short, 2700 for EN long). Mention in JSON-LD.

**Total new strings:** ~19 PlatformPage + 2 VideoOnly + 2 meta per platform (30) + 8 keywords per platform (120) ≈ 173 strings per locale ×8 = **~1,384 strings** + BlogContent later.

---

## 6. Component & Page Changes (files)

### 6.1 `components/video-downloader/VideoFeatures.tsx:8`

**Problem:** `const stats = [...]` hardcoded EN.

**Fix:**

```ts
// Before
const stats = [{label:"Video Quality", value:"Up to 4K", desc:"Download..."}]

// After
const t = useTranslations("PlatformPage"); // or "VideoOnly"
const stats = t.raw("toolFeaturesStats") as {title:string,value:string,desc:string}[];
// mapping: title→label, value→value, desc→desc
// Icon mapping kept client-side by index (same order as EN)
```

Also translate `featuresKicker` already does `t("featuresKicker")` — keep. Ensure `messages/*:PlatformPage.toolFeaturesStats` translated (see 5.2 #2). If choice is `VideoOnly.stats`, add new keys but reuse is cleaner.

**File:** `components/video-downloader/VideoFeatures.tsx:8-15`, `VideoOnly` vs `PlatformPage` decision. Use `PlatformPage` since it already has stats.

### 6.2 `components/video-downloader/VideoOnlyHero.tsx:99`

Already uses `config.heading` (from `Platform.{slug}.heading` — translated) and `t("VideoOnly")` for badge etc. Verify `VideoOnly.headingSuffix` is translated per locale (fix DE). No code change needed beyond messages.

Trust chips `VideoOnly.trustFree/NoSignup/Quality/Private`: already translated (`de.json: VideoOnly.trustFree="100% Kostenlos"` ok). Keep.

### 6.3 `app/[locale]/video-downloader/[platform]/page.tsx:24`

**Current:** `title = t.has("metaTitleVideo") ? t("metaTitleVideo") : t("metaTitle")` fallback.

**After filling messages:** fallback still safe but should prefer `metaTitleVideo`. Keep code. Ensure `keywords` uses `t.raw("keywords")` which will now be native.

**Also fix OG locale mapping:**

```ts
const ogLocaleMap: Record<string,string> = {en:"en_US",es:"es_ES",fr:"fr_FR",de:"de_DE",pt:"pt_BR",ja:"ja_JP",ar:"ar_SA",ru:"ru_RU",zh:"zh_CN"};
openGraph: { locale: ogLocaleMap[locale] ?? locale }
```

And JSON-LD `inLanguage` already uses `locale` raw — change to BCP47 (`ja-JP`?) but keep `locale` for schema (accepts `ja`). Keep as-is or map to BCP47 hyphen.

**Also consider:** Add `alternates.languages` already hardcoded 9 — ensure sync with `routing.locales`. No change.

### 6.4 `lib/content/builders.ts` / `registry.ts` / `BlogContent.tsx`

**Quick win:** In `app/[locale]/video-downloader/[platform]/page.tsx:129` wrap `{content && <BlogContent content={content} />}` with `locale==="en" && content && <BlogContent ... />` or locale-aware.

**Full i18n:** Create `lib/content/i18n-builders.ts` that loads `messages/{locale}.json` or separate `content/{locale}/{platform}.json` and builds sections from translated strings. Not required for 135-page launch — prioritize 5.2 #5 Option A.

### 6.5 `app/[locale]/layout.tsx:130`

Already `dir={locale==="ar"?"rtl":"ltr"}` — video-downloader pages will be RTL for AR. Test `VideoOnlyHero` flex ordering in RTL (Tailwind handles logical? Need `dir` aware). Add `dir` to component container if needed.

### 6.6 `lib/i18n/request.ts:11`

Keep `mergeWithFallback` for resilience, but add build-time check script instead of changing runtime.

---

## 7. Execution Phases

### Phase 0 — Audit & Baseline (done, this doc)

- [x] Inventory 135 URLs, 15 slugs, 9 locales
- [x] Quantitative gap analysis (40–52% EN remnants, 19 PlatformPage keys, hardcoded stats, EN-only BlogContent)
- [x] SEO spec per locale defined (4.1–4.4)

### Phase 1 — Core namespace translation (VideoOnly + PlatformPage + Formats already ok)

**Files:** `messages/{es,fr,de,pt,ja,ar,ru,zh}.json`

**Tasks:**

1. For each of 8 locales, add/update `VideoOnly.featuresTitle`, `VideoOnly.faqTitle` (2 keys×8=16).
2. Translate `PlatformPage` 19 values ×8 = 152 strings. Use professional native copy, preserve `{name}` placeholder, keep `toolFeaturesStats[6]` order identical to EN.
3. Verify `PlatformShared`, `Formats`, `Errors` already complete — no action.
4. Run `python scripts/check-i18n-coverage.py --ns VideoOnly,PlatformPage` → 0 missing.

**Effort:** ~170 strings, 1–2 days with native speakers or high-quality MT + human review.

### Phase 2 — Per-platform SEO localization (high impact)

**Files:** `messages/{locale}.json:Platform.{slug}` for 15×8=120 platform-locale combos.

**Tasks:**

1. For each non-EN locale, for each of 15 platforms, add `metaTitleVideo` + `metaDescriptionVideo` (30 strings per locale ×8 = 240).
   - Template: `"{Platform} Video Downloader — Download {Platform} Videos in HD | DownForge"` → localize per 4.1. Keep `{Platform}` proper noun, translate surrounding.
   - For TikTok add “Without Watermark” variant translated: ES `Sin Marca de Agua`, JA `透かしなし`, AR `بدون علامة مائية`, etc.
   - For Instagram: `Reels & Stories` → ES `Reels e Historias`, JA `リール＆ストーリー`, etc.
2. Localize `keywords` arrays (8–12 per platform ×15×8 = ~960 strings). Use native terms per 4.3, not literal EN translation.
3. Verify `badge/heading/subheading/placeholder/features/faqs` already translated; spot-check 3 platforms per locale for quality.
4. Run `python scripts/check-seo-length.py --locale all --prefix video-downloader` to ensure title 58–68 / CJK 28–40, description 145–160 / CJK 80–110.

**Effort:** ~1,200 strings, 3–4 days. Prioritize `tiktok, instagram, facebook, youtube, twitter` (largest search volume) first.

### Phase 3 — Component fix (hardcoded → i18n)

**Files:** `components/video-downloader/VideoFeatures.tsx:8`

**Tasks:**

1. Refactor `VideoFeatures` to read `PlatformPage.toolFeaturesStats` (after Phase 1 translation). Preserve icon mapping by index.
2. Test `/{locale}/video-downloader/{platform}` renders stats translated for `es/ja/ar`.
3. Optional: extract `trust chips` already ok; no change.

**Effort:** 0.5 day, one PR.

### Phase 4 — BlogContent i18n decision

**Option A (launch):** In `app/[locale]/video-downloader/[platform]/page.tsx:129`, guard:

```ts
{locale === "en" && content && <BlogContent content={content} />}
```

And update `jsonLd` `Article` `wordCount` / `inLanguage` to reflect short vs long. For non-EN, `wordCount: 900` (hero+features+faq only) vs EN `2700`.

**Option B (later):** Build locale-aware `buildContentLocalized`. Requires `lib/content/translations/{locale}.json` or extending `messages`.

**Effort:** Option A 0.5h; Option B 2–3 weeks translation.

**Recommendation:** Ship Option A for 135-page launch to meet “every word changes” (no English guide under AR/JA). Schedule Option B as fast-follow.

### Phase 5 — Validation & QA (must pass before merge)

**Checks:**

1. **i18n coverage:** `python scripts/check-i18n-coverage.py` — iterates `messages/{locale}.json` vs `en.json` for namespaces `VideoOnly, PlatformShared, PlatformPage, Formats, Platform.*.metaTitleVideo, keywords`. Fails if any value == EN where not proper noun (allowlist: `DownForge`, `yt-dlp`, platform names, `MP4` etc).
2. **SEO length:** `python scripts/check-seo-length.py --max-title 68 --max-desc 160 --cjk-max-title 40` — fails if title >68 latin / >40 CJK or description >160 / >110 CJK.
3. **Sitemap:** `npm run build && python -c "import xml.etree.ElementTree as ET; ET.parse('.next/server/app/sitemap.xml.body')"` + `grep -c video-downloader` 135 + `grep -c xhtml:link` 8460 alternates.
4. **Hreflang:** `curl http://localhost:3000/sitemap.xml | grep video-downloader/facebook` contains 10 `<xhtml:link>` with `hreflang="en|es|fr|de|pt|ja|ar|ru|zh|x-default"` + `curl -I http://localhost:3000/fr/video-downloader/tiktok` 200 + `<link rel="alternate" hreflang=` in HTML head matches sitemap.
5. **Visual:** `npm run dev`, open `/{locale}/video-downloader/{platform}` for `ar` (RTL), `ja/zh` (CJK wrapping), `de` (long words), check no overflow, `text-balance`, `hyphens-auto`.
6. **JSON-LD:** Validate with `https://validator.schema.org/` — `BreadcrumbList`, `WebApplication`, `FAQPage` have localized `name/text`, `inLanguage` correct.
7. **Lighthouse i18n:** `npx lighthouse http://localhost:3000/es/video-downloader/instagram --chrome-flags="--headless"` — check no English fallback strings in `es` page via `document.documentElement.lang==="es"` and `innerText` not containing EN-only `Download HD Videos` etc.
8. **Noindex check:** Ensure `robots` not blocking video-downloader (should be `index,follow`).

### Phase 6 — Deploy & Monitor

1. `npm run build` (generates 135×9 static params, 847 sitemap entries — build time ~90s).
2. Push to `main` → Vercel (`vercel.json` env `NEXT_PUBLIC_SITE_URL=https://www.downforge.me`).
3. Live checks: `curl -I https://www.downforge.me/sitemap.xml` 200, `curl https://www.downforge.me/ja/video-downloader/tiktok | grep -o '<title>.*</title>'` contains Japanese, `curl https://www.downforge.me/ar/video-downloader/youtube | grep 'dir="rtl"'`.
4. Submit sitemap in GSC (already submitted; no resubmit needed but fetch `ja/video-downloader/...` as live test).
5. Monitor GSC “Pages” → video-downloader 135 indexed, no “Duplicate without user-selected canonical”, no “Hreflang errors”.

---

## 8. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| **Literal translation of keywords hurts SERP** (e.g., JA English keywords not searched) | Use native keyword research (Ahrefs/Google Keyword Planner per locale) per 4.3, keep English loanwords only where code-switching real (DE `facebook video downloader` kept). |
| **CJK title truncation** | Enforce shorter CJK titles (28–40 chars) via length checker Phase 5. |
| **Hardcoded stats still EN after Phase 1** | Phase 3 refactor must land before launch; include snapshot test `expect(screen.getByText("Video Quality")).not.toBeInTheDocument()` for `ja` locale. |
| **BlogContent English pollution** | Phase 4 Option A guard; document that non-EN pages have shorter wordCount (honest). |
| **Fallback masks gaps** | Add CI `check-i18n-coverage.py` that fails build if EN fallback detected (allowlist proper nouns). |
| **Arabic RTL layout break** | Test flex `brand-input`, `glass` card, `VideoFeatures` grid in `ar`; add logical CSS where needed (`ps-` vs `pl-`). |
| **Sitemap/page hreflang drift** | Both derive from `routing.locales`; add test asserting `sitemap alternates.languages keys === routing.locales + x-default` and `page alternates.languages` same. |

---

## 9. Appendix

### A. Complete 135-URL list (generation)

```ts
// locales 9 × slugs 15 =135
for (locale of ["en","es","fr","de","pt","ja","ar","ru","zh"])
  for (slug of ["facebook","instagram","tiktok","twitter","vimeo","dailymotion","twitch","reddit","pinterest","linkedin","snapchat","soundcloud","kick","youtube","niconico"])
    url = `https://www.downforge.me/${locale}/video-downloader/${slug}`
```

Verification: `app/[locale]/video-downloader/[platform]/page.tsx:15` `generateStaticParams` already flatMaps locales×platformSlugs.

### B. Title/description template per platform (EN base, to localize)

| Platform | EN title template (66–68) | EN description template (150) |
|----------|---------------------------|--------------------------------|
| facebook | `Facebook Video Downloader — Download Facebook Videos in HD \| DownForge` | `Free Facebook video downloader. Save Facebook videos, Reels & Watch in HD & 4K MP4. No app, no sign-up — paste a link.` |
| instagram | `Instagram Video Downloader — Download Reels & Stories in HD \| DownForge` | `Free Instagram downloader. Download Reels, Stories & IGTV in HD MP4. No app, no sign-up.` |
| tiktok | `TikTok Video Downloader — Download Without Watermark \| DownForge` | `Free TikTok downloader. Download TikTok videos without watermark in HD. Save slideshows — no app.` |
| twitter | `Twitter Video Downloader — Download Videos & GIFs \| DownForge` | `Free Twitter/X downloader. Save videos & GIFs from any tweet in HD MP4. No app.` |
| vimeo | `Vimeo Video Downloader — Download Vimeo Videos in HD \| DownForge` | `Free Vimeo downloader. Download Vimeo videos in HD & 4K. For creators — no sign-up.` |
| dailymotion | `Dailymotion Video Downloader — Download in HD \| DownForge` | `Free Dailymotion downloader. Save Dailymotion videos in HD MP4. No app.` |
| twitch | `Twitch Video Downloader — Download VODs & Clips \| DownForge` | `Free Twitch downloader. Download VODs, clips & live streams in HD. No app.` |
| reddit | `Reddit Video Downloader — Save Reddit Videos \| DownForge` | `Free Reddit downloader. Save Reddit videos & v.redd.it in HD MP4. No sign-up.` |
| pinterest | `Pinterest Video Downloader — Download Idea Pins \| DownForge` | `Free Pinterest downloader. Download videos & Idea Pins in HD. No app.` |
| linkedin | `LinkedIn Video Downloader — Save LinkedIn Videos \| DownForge` | `Free LinkedIn downloader. Save LinkedIn videos in HD MP4 for offline — no app.` |
| snapchat | `Snapchat Video Downloader — Save Spotlight & Stories \| DownForge` | `Free Snapchat downloader. Save Spotlight & Stories in HD. No app.` |
| soundcloud | `SoundCloud Video Downloader — Save Videos in HD \| DownForge` | `SoundCloud video downloader. Save SoundCloud videos in HD MP4. No sign-up.` |
| kick | `Kick Video Downloader — Download Kick VODs & Clips \| DownForge` | `Free Kick downloader. Download Kick VODs & clips in HD MP4. No app.` |
| youtube | `YouTube Video Downloader — YouTube to MP4, 4K & HD \| DownForge` | `Free YouTube downloader. Download YouTube videos in 4K & 1080p MP4. No app, on Android/iPhone/PC.` |
| niconico | `Niconico Video Downloader — Download Niconico Videos \| DownForge` | `Free Niconico downloader. Save Niconico videos in HD MP4. No app, no sign-up.` |

Localize each per 4.1 rules.

### C. Checklist per locale (before marking complete)

- [ ] `VideoOnly` 16/16 present and translated (no `featuresTitle/faqTitle` missing)
- [ ] `PlatformPage` 27/27 present and 0 values == EN (except proper nouns)
- [ ] `Platform.{slug}` `metaTitleVideo` + `metaDescriptionVideo` present for 15/15
- [ ] `Platform.{slug}.keywords` 8–12 native terms, first contains `{platform} video downloader` native equivalent, CJK uses native script
- [ ] `VideoFeatures` stats render translated (check DOM)
- [ ] `BlogContent` guard for non-EN (or localized)
- [ ] `sitemap.xml` 135 entries + 10 hreflang each
- [ ] `og:locale` mapped (`ja_JP` etc)
- [ ] RTL `ar` visual pass
- [ ] Lighthouse no English fallback strings

### D. Scripts to add

- `scripts/check-i18n-coverage.py` — compares `en.json` vs each locale for `video-downloader` namespaces, allowlist `["DownForge","yt-dlp","ffmpeg","MP4","WebM","MKV","4K","HD","SRT","VTT","Facebook","Instagram","TikTok","YouTube","Twitter","X","Vimeo","Dailymotion","Twitch","Reddit","Pinterest","LinkedIn","Snapchat","SoundCloud","Kick","Niconico"]`, fails if `value==enValue`.
- `scripts/check-seo-length.py` — loads `messages/{locale}.json:Platform.*.metaTitleVideo` and asserts length per 4.1.
- CI: `npm run build && python scripts/check-i18n-coverage.py && python scripts/check-seo-length.py`.

---

## 10. Next Steps (await approval)

1. Approve template & keyword strategy (4.3/4.4) and Option A vs B for BlogContent.
2. Create branch `feat/video-downloader-i18n-135` and implement **Phase 1 → 3 → 4A** (est. 5–6 days).
3. Provide interim PR with `es` fully done as sample for review (1 locale ×15 platforms) before bulk 8 locales.
4. After merge, monitor GSC hreflang & indexation 7 days, then start `buildContentLocalized` for long-form (Phase 4B) if desired.

> **Reference files to edit:** `messages/{es,fr,de,pt,ja,ar,ru,zh}.json`, `components/video-downloader/VideoFeatures.tsx:8`, `app/[locale]/video-downloader/[platform]/page.tsx:24,45,129`, `app/[locale]/layout.tsx:67` (og locale map), `lib/content/*` (guard).

