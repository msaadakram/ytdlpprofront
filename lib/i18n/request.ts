import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

type Messages = Record<string, unknown>;

/**
 * Deep-merges locale messages over the default-locale messages so keys that
 * are missing from a translation file fall back to English instead of
 * rendering the raw key path (e.g. "Nav.download") in the UI.
 *
 * Missing-key observability (dev only, never fails the build): counts keys
 * present in the fallback but absent in the locale override and warns once
 * per locale so gaps get translated instead of silently staying English.
 */
let warnedLocales = new Set<string>();

function countMissingKeys(base: Messages, override: Messages): number {
  let missing = 0;
  for (const [key, value] of Object.entries(base)) {
    if (!(key in override)) {
      missing++;
      continue;
    }
    const ov = (override as Messages)[key];
    const bothPlainObjects =
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      ov !== null &&
      typeof ov === "object" &&
      !Array.isArray(ov);
    if (bothPlainObjects) {
      missing += countMissingKeys(value as Messages, ov as Messages);
    }
  }
  return missing;
}
function mergeWithFallback(base: Messages, override: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const existing = out[key];
    const bothPlainObjects =
      value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      existing !== null &&
      typeof existing === "object" &&
      !Array.isArray(existing);
    if (bothPlainObjects) {
      out[key] = mergeWithFallback(existing as Messages, value as Messages);
    } else {
      out[key] = value;
    }
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;
  const fallback =
    locale === routing.defaultLocale
      ? {}
      : (await import(`../../messages/${routing.defaultLocale}.json`)).default;

  if (process.env.NODE_ENV !== "production" && locale !== routing.defaultLocale && !warnedLocales.has(locale)) {
    warnedLocales.add(locale);
    const missing = countMissingKeys(fallback as Messages, messages as Messages);
    if (missing > 0) {
      console.warn(`[i18n] locale "${locale}" is missing ${missing} key(s) — falling back to English (no build failure).`);
    }
  }

  return {
    locale,
    messages: mergeWithFallback(fallback, messages),
  };
});
