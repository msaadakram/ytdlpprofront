# Translation Guide — Audio SEO Patch

## Files

- `messages.en-audio-patch.json` — **EN source** (15 platforms × 10 keys). Merge into `messages/en.json`:
  ```bash
  jq -s '.[0] * .[1]' messages/en.json messages.en-audio-patch.json > tmp.json && mv tmp.json messages/en.json
  ```

- `content/translations-audio/{locale}.audio.json` — per-locale staging (currently EN copy as placeholder). Translate then merge:
  ```bash
  # After translating es.audio.json (values translated to Spanish):
  jq -s '.[0] * .[1]' messages/es.json <(jq 'del(._TODO_TRANSLATE,._DO_NOT_MERGE_UNTIL_TRANSLATED)' content/translations-audio/es.audio.json) > tmp.json && mv tmp.json messages/es.json
  # Repeat for fr,de,pt,ja,ar,ru,zh (same del filter)
# IMPORTANT: files contain _TODO_TRANSLATE + _DO_NOT_MERGE_UNTIL_TRANSLATED until translated — do NOT merge until values are actually translated. EN file en.audio.json has no marker and is safe.
  ```

## Translation Prompt (Groq)

For each locale, send EN values to Groq:

```
System: You are a professional translator for an SEO-focused downloader site. Translate accurately, keep SEO keywords natural for the target language, preserve brand "DownForge" and format names like MP3, FLAC, AAC, WAV, OGG, keep JSON structure.
User: Translate the following JSON values from English to {LANGUAGE} ({LOCALE}). Preserve {placeholders} and brand names. Return valid JSON only.
{ EN_JSON }
```

## Validation

- After merging, `npm run build` must show 0 next-intl missing translation warnings.
- Check one page per locale: `curl -s https://downforge.me/{locale}/audio-downloader/youtube | grep -o '<title>.*</title>'`
- For `ar` (RTL): visual QA required for hero input alignment (URL input stays LTR).

## Why EN First?

Google crawls `en` most. Getting EN live validates schema + titles before propagating hreflang.
