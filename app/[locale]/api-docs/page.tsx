import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { routing } from "@/lib/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ApiDocs" }).catch(() => null);
  // Fallback if namespace missing
  const title = t ? `${t("metaTitle" as any)} — DownForge` : "API Documentation — DownForge";
  const description = t ? (t as any)("metaDescription") : "DownForge API documentation. Download videos, audio, and thumbnails programmatically.";
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
  return null;
}
