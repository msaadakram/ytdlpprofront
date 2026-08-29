import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { routing } from "@/lib/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = { params: Promise<{ locale: string }> };

// Static English metadata — the locale variants are redirect-only shells
// (the real docs live at /api-docs), so no per-locale translations exist.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  const title = "API Documentation — DownForge";
  const description = "DownForge API documentation. Download videos, audio, and thumbnails programmatically.";
  return {
    title,
    description,
    alternates: { canonical: `https://www.downforge.me/api-docs`, languages: { en: `https://www.downforge.me/api-docs`, "x-default": `https://www.downforge.me/api-docs` } },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "DownForge",
      locale: "en_US",
      url: `https://www.downforge.me/api-docs`,
    },
  };
}

export default async function ApiDocsLocalePage({ params }: Props) {
  const { locale } = await params;
  // Locale variants serve no content — canonical (and users) go to the
  // top-level English-only docs page instead of rendering a blank page.
  redirect("/api-docs");
}
