import { getTranslations } from "next-intl/server";

export type LocalizedFaq = { q: string; a: string };

/**
 * Resolve the type-specific templated FAQ set from the `DownloadOnly`
 * namespace (`faqAudioItems` / `faqThumbnailItems` / `faqTranscriptItems`)
 * with the `{platform}` placeholder interpolated. These templated sets are
 * fully translated in every supported locale, so FAQ copy always matches the
 * page language (per-platform `faqsAudio`-style arrays are English-only).
 * Returns null when the key is missing so callers can fall back.
 */
export async function getTemplatedFaqs(
  locale: string,
  type: "all" | "audio" | "thumbnail" | "transcript",
  platformName: string
): Promise<LocalizedFaq[] | null> {
  const t = await getTranslations({ locale, namespace: "DownloadOnly" });
  const key =
    type === "audio"
      ? "faqAudioItems"
      : type === "thumbnail"
      ? "faqThumbnailItems"
      : type === "transcript"
      ? "faqTranscriptItems"
      : "faqAllItems";

  let raw: unknown;
  try {
    raw = t.raw(key);
  } catch {
    return null;
  }
  if (!Array.isArray(raw)) return null;

  const out = (raw as Array<{ q?: unknown; a?: unknown }>)
    .map((f) => ({
      q: String(f?.q ?? "").replace(/\{platform\}/g, platformName),
      a: String(f?.a ?? "").replace(/\{platform\}/g, platformName),
    }))
    .filter((f) => f.q.length > 0 && f.a.length > 0);

  return out.length > 0 ? out : null;
}
