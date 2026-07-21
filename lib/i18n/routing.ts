import { defineRouting } from "next-intl/routing";

export const locales = ["en", "es", "fr", "de", "pt", "ja", "ar", "ru", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale = "en" as const;

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeCookie: {
    name: "DOWNFORGE_LOCALE",
    maxAge: 60 * 60 * 24 * 365,
  },
});
