import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

type Messages = Record<string, unknown>;

/**
 * Deep-merges locale messages over the default-locale messages so keys that
 * are missing from a translation file fall back to English instead of
 * rendering the raw key path (e.g. "Nav.download") in the UI.
 */
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

  return {
    locale,
    messages: mergeWithFallback(fallback, messages),
  };
});
