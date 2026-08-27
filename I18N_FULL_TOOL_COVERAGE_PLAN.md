# Full i18n Coverage Plan — Audio / Video / Thumbnail / Transcript / All-in-One + Home — Every Word Changes Per Locale

> **User request:** Make audio, video, transcript, thumbnail and all-in-one pages support ALL 9 languages, and home page support ALL languages where *every word* changes with the selected language.
> **Status:** Plan approved, implementation started. This doc is the execution plan (upgrade of `VIDEO_DOWNLOADER_I18N_SEO_PLAN.md` which covered only 135 video-downloader URLs).

---

## 1. Scope & URL Matrix

**Locales (9):** `en, es, fr, de, pt, ja, ar, ru, zh` (`lib/i18n/routing.ts:3`, `localePrefix: "always"`)

**Platforms (15):** `facebook, instagram, tiktok, twitter, vimeo, dailymotion, twitch, reddit, pinterest, linkedin, snapchat, soundcloud, kick, youtube, niconico` (`lib/platform-config.ts:135`)

**Tools (5) + Home:**

| Prefix | Type | Example URL | Count | File |
|---|---|---|---|---|
| `/video-downloader/[platform]` | video | `/{locale}/video-downloader/youtube` | 15×9=135 | `app/[locale]/video-downloader/[platform]/page.tsx:18` |
| `/audio-downloader/[platform]` | audio | `/{locale}/audio-downloader/facebook` | 135 | `app/[locale]/audio-downloader/[platform]/page.tsx:18` |
| `/thumbnail-downloader/[platform]` | thumbnail | `/{locale}/thumbnail-downloader/instagram` | 135 | `app/[locale]/thumbnail-downloader/[platform]/page.tsx:18` |
| `/transcript-downloader/[platform]` | transcript | `/{locale}/transcript-downloader/tiktok` | 135 | `app/[locale]/transcript-downloader/[platform]/page.tsx:18` |
| `/download/[platform]` | all (video+audio+thumb+transcript) | `/{locale}/download/youtube` | 135 | `app/[locale]/download/[platform]/page.tsx:20` |
| `/youtube-download`, `/youtube-video-downloader` | youtube hero | `/{locale}/youtube-download` | 2×9=18 | `app/[locale]/youtube-download/page.tsx` |
| Home | `/` | `/{locale}` | 9 | `app/[locale]/page.tsx:17` |

**Total localized tool URLs:** 135×5 = **675** + 18 + 9 = **702** + static English-only (blog/about etc. 302s) + sitemap 847. Already declared in `app/sitemap.ts:32` `platformRoutePrefixes`.

**Acceptance:** `/{locale}/<tool>/<platform>` renders **zero English fallback strings** for non-EN locales. Every visible word comes from `messages/{locale}.json`.

---

## 2. Current State & Gaps

### 2.1 Already localized (good)
- Routing: `generateStaticParams` flatMaps all 9 locales for every tool (video, audio, thumb, transcript, download). ✅
- Metadata: `getTranslations({locale, namespace: Platform.*})` with `metaTitleVideo/Audio/Thumbnail/Transcript/All` + `keywords` per locale (15 platforms ×9 = 135 per tool). `alternates.languages` 9 + x-default, `openGraph.locale` map `ja→ja_JP` etc. ✅
- PlatformShared, Nav, Footer fully translated (9 locales). ✅
- `usePlatformTranslations.ts:35` merges `Platform.{platform}.heading/badge/placeholder` + `features/faqs` from messages (already 40-52% translated; 2 locales have 100% for platform keys, others 85-95% per audit).
- `PlatformDownload` all-in-one pages hide `BlogContent` for non-EN (`locale==="en"?getUniversalContent: null`) so no English long-form under JA/AR. Same for video/audio/thumb/transcript. ✅
- RTL: `app/[locale]/layout.tsx:145` `dir=ar?"rtl":"ltr"` ✅

### 2.2 Gaps — hardcoded English that does NOT change with locale

| Component | Hardcoded EN | Impact | Every-word? |
|---|---|---|---|
| `components/home/Hero.tsx:177` | `placeholder="Paste your video URL here..."` | Home input placeholder stays EN on es/ja/ar | ❌ |
| `components/home/Hero.tsx:191-192` | `aria-label="Paste from clipboard"` `title="Paste from clipboard"` | Tooltip stays EN | ❌ |
| `components/home/Hero.tsx:199` | `aria-label="Clear URL"` | Stays EN | ❌ |
| `components/home/*` other | `PlatformGrid`, `HowItWorks`, `FormatShowcase`, `Features`, `Testimonials`, `PricingSection`, `CTA` — need audit for hardcoded EN in JSX | High | ❌ |
| `components/download-only/DownloadOnlyHero.tsx:382` | `trustPills` fallback `"320kbps"`, `"FLAC Lossless"` hardcoded when `t("trustPills.*")` missing | Stays EN on ja/ru if keys missing | ❌ |
| `components/download-only/DownloadOnlyHero.tsx:448` | `labelFor="language"` text `"Language:"` hardcoded | Transcript language selector stays EN | ❌ |
| `components/download-only/DownloadFeatures.tsx:16-41` | `fallbackFeatures` 6 cards hardcoded EN (MP3 320 kbps desc etc.) used when `t.raw` fails | Non-EN if messages missing, but currently messages have them — fallback is still EN if gap | ❌ |
| `components/video-downloader/VideoFeatures.tsx:22` | `const stats` 6 cards hardcoded EN label/value/desc | Same — stays EN on all non-EN locales (per plan doc) | ❌ |
| `components/platform-download/*` | Some `PlatformToolFeatures` etc. may use `PlatformPage` namespace which is 19/27 EN in 8 locales (see video plan) | Middle sections English | ❌ |
| `components/home/Hero.tsx:177` placeholder duplication | `DownloadOnlyHero.tsx:481` uses `config.placeholder` (translated) ✅ but Home Hero does not | Inconsistent | ❌ |
| `components/content/ExploreOtherTools.tsx:23` | `defaultSub = You are viewing...` fallback EN | Stays EN if translation missing | ❌ |

**Result:** Even though pages *route* per locale, ~5-10 strings per page stay English, failing "every word changes".

---

## 3. Requirement — Every Word Changes

For each of 702 URLs, the following must be locale-specific:

- `<head>`: `metaTitle*`, `metaDescription*`, `keywords`, `og:locale`, `canonical`, `alternates` (already)
- **Hero**: badge, heading, headingAccent, subheading, placeholder, paste/clear labels, type switcher (`typeVideo/Audio/Thumbnail/Transcript` via `PlatformShared`), CTA button, trust pills, disclaimer — all from `messages`
- **Features**: 6 stat cards (label/value/desc) from `PlatformPage.toolFeaturesStats` or `VideoOnly.stats` or `DownloadOnly.features*` — not hardcoded fallback
- **FAQ**: `Platform.{platform}.faqs` or `faqsAudio` etc. — already translated, keep
- **HowItWorks / Tips / etc.** — from `PlatformPage` namespace — need 19 values translated
- **Home**: badge, heading, headingAccent, headingRest, subheading, disclaimer, worksWith, howItWorks steps, features, testimonials, pricing, CTA — all via `HomePage` namespace (already exists for 9 locales, verify completeness)
- **Nav/Footer** — already

**Acceptance:** `grep -r "Paste your video URL" components` returns 0 after fix; `python scripts/check-i18n-every-word.py --locale es --platform youtube` reports 0 fallback hits.

---

## 4. Implementation Steps

### Phase 1 — Fix hardcoded EN in components (code, not messages)

**Files:**
- `components/home/Hero.tsx:177` → `placeholder={t("placeholder")}` or `t("homePlaceholder", {defaultValue})` — add `HomePage.placeholder` key if missing, fallback to `config.placeholder` pattern. Also `aria-label`/`title` → `t("pasteFromClipboard")` etc.
- `components/download-only/DownloadOnlyHero.tsx:448` → `label` `Language:` → `t("transcriptLanguageLabel")`
- `components/download-only/DownloadFeatures.tsx:16-41` → Keep fallback but ensure it is only fallback; actual source is `t.raw("features*Items")` which is already translated. No code change needed except ensure fallback not used in production — add CI to fail if fallback hit. Optionally move fallback strings to `messages/en.json:DownloadOnly.fallback` for consistency.
- `components/video-downloader/VideoFeatures.tsx:22` → Replace hardcoded `stats` with `t.raw("toolFeaturesStats")` from `PlatformPage` (reuse same as PlatformToolFeatures). See plan doc 6.1.
- `components/content/ExploreOtherTools.tsx:23` → Wrap `defaultSub` with `useTranslations("ExploreTools")` or provide fallback via `t("defaultSub", {platform, tool})`
- Audit remaining `components/home/*` for any literal EN (grep `>[A-Z][a-z]+ [A-Z]`). Move to `HomePage.*` namespace.

**Effort:** 1 day, 5 files.

### Phase 2 — Ensure messages completeness for all 9 locales

**Namespaces to verify completeness (per locale 9):**

- `HomePage` (badge, heading, headingAccent, headingRest, subheading, disclaimer, worksWith, howItWorks, features, testimonials, pricing, CTA) — 45 keys. Already exists for 9 locales (verified `en.json:65` via `es.json`), but spot-check `ja`/`ar` for identical EN values.
- `PlatformShared` (typeVideo etc., fetching/processing states) — 45 keys, already complete.
- `DownloadOnly` (badge, heading, placeholder, trustPills, choose*Format, features*Title etc.) — 30 keys. Verify all 9 locales have `trustPills`, `chooseAudioQuality` etc.
- `VideoOnly` (badge, headingSuffix, subheading, disclaimer, trust*, stats) — 16 keys. Add missing `featuresTitle`/`faqTitle` per video plan.
- `PlatformPage` (toolFeaturesBadge etc. 19 values + stats 6) — 27 keys. Translate 19 EN remnants for 8 locales per video plan 5.2.
- `Platform.{slug}` (badge, heading, subheading, placeholder, features[5], faqs[5], meta* , keywords) — 28 keys ×15 platforms. Already 85-100% translated, fill gaps (metaTitleVideo etc. for 14 platforms missing in non-EN).

**Tool:** `python scripts/check-i18n-coverage.py --ns HomePage,PlatformShared,DownloadOnly,VideoOnly,PlatformPage --locale all` → expect 0 missing.

**Effort:** 2–3 days to audit and fill gaps (MT + native review for high-volume platforms).

### Phase 3 — Home page every-word guarantee

- `app/[locale]/page.tsx:17` already wraps with `Nav`+`Footer` (translated) + components. Ensure each child component uses `useTranslations` not literals.
- Add `generateMetadata` for home that is locale-aware (currently not shown — add if missing, using `HomePage.metaTitle` etc. per `SEO` namespace). Verify `app/[locale]/layout.tsx` already handles `getTranslations("SEO")` for metadata.
- Test `/{locale}` for `ar` RTL, `ja/zh` CJK wrapping, `de` long words — no overflow.

**Effort:** 0.5 day.

### Phase 4 — QA — every-word changes

- Build: `npm run build` generates 9×15×5=675 tool pages + 9 home = 684. Verify `grep -c` in `.next/server/app/sitemap.xml.body`.
- Runtime: `npm run dev`, visit `/en/download/youtube`, `/es/download/youtube`, `/ja/video-downloader/youtube`, `/ar/audio-downloader/facebook` etc. Toggle language switcher (`Nav` localeFlags) and assert hero heading, placeholder, Features, FAQ all change (visual + `document.documentElement.lang`).
- Automated: `python scripts/check-i18n-every-word.py` — iterates all `messages/{locale}.json` vs `en.json`, fails if any `Platform.*` or `HomePage` value == EN where not proper noun allowlist.

---

## 5. Risks & Mitigations

- **Fallback masks gaps** (`request.ts:11` mergeWithFallback) hides missing keys — mitigate with CI `check-i18n-coverage.py` that fails build on fallback.
- **BlogContent English pollution** already mitigated by `locale==="en"?getContent:null` guard — keep for all tools.
- **CJK title length** — keep shorter titles (28–40 chars) as per SEO spec.

---

## 6. Next Steps (immediate)

1. Approve this plan (this file).
2. Branch `feat/i18n-every-word` — implement Phase 1 code fixes (Hero placeholder etc.).
3. Fill messages gaps Phase 2 (prioritize HomePage + PlatformShared + DownloadOnly + VideoOnly + PlatformPage).
4. Phase 4 QA and push to `main` → Vercel → verify `curl /ja/video-downloader/youtube | grep -o '<title>.*</title>'` is Japanese.

> **Implementation now:** Start Phase 1 code fixes in this session.

