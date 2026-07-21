import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { DownloadOnlyHero } from "@/components/download-only/DownloadOnlyHero";
import { DownloadFeatures } from "@/components/download-only/DownloadFeatures";
import { DownloadFaq } from "@/components/download-only/DownloadFaq";
import { platformConfigs, platformSlugs } from "@/lib/platform-config";
import { getContent } from "@/lib/content/registry";
import { BlogContent } from "@/components/content/BlogContent";

type Props = { params: Promise<{ platform: string; locale: string }> };

export function generateStaticParams() {
  const locales = ["en", "es", "fr", "de", "pt", "ja", "ar", "ru", "zh"];
  return locales.flatMap((locale) =>
    platformSlugs.map((platform) => ({ locale, platform }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform, locale } = await params;
  const config = platformConfigs[platform];
  if (!config) return {};

  const t = await getTranslations({ locale, namespace: `Platform.${platform}` });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `https://downforge.me/${locale}/thumbnail-downloader/${config.slug}`,
      siteName: "DownForge",
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://downforge.me/${locale}/thumbnail-downloader/${config.slug}`,
      languages: {
        en: `https://downforge.me/en/thumbnail-downloader/${config.slug}`,
        es: `https://downforge.me/es/thumbnail-downloader/${config.slug}`,
        fr: `https://downforge.me/fr/thumbnail-downloader/${config.slug}`,
        de: `https://downforge.me/de/thumbnail-downloader/${config.slug}`,
        pt: `https://downforge.me/pt/thumbnail-downloader/${config.slug}`,
        ja: `https://downforge.me/ja/thumbnail-downloader/${config.slug}`,
        ar: `https://downforge.me/ar/thumbnail-downloader/${config.slug}`,
        ru: `https://downforge.me/ru/thumbnail-downloader/${config.slug}`,
        zh: `https://downforge.me/zh/thumbnail-downloader/${config.slug}`,
      },
    },
    keywords: t.raw("keywords") as string[],
  };
}

export default async function ThumbnailDownloaderPage({ params }: Props) {
  const { platform, locale } = await params;
  const config = platformConfigs[platform];
  if (!config) notFound();

  const content = getContent(platform, "thumbnail");

  const t = await getTranslations({ locale, namespace: `Platform.${platform}` });
  const faqs = t.raw("faqs") as { q: string; a: string }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `https://downforge.me/${locale}/thumbnail-downloader/${config.slug}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `https://downforge.me/${locale}` },
          { "@type": "ListItem", position: 2, name: `${config.name} Thumbnail Downloader`, item: `https://downforge.me/${locale}/thumbnail-downloader/${config.slug}` },
        ],
      },
      {
        "@type": "WebApplication",
        url: `https://downforge.me/${locale}/thumbnail-downloader/${config.slug}`,
        name: `DownForge ${config.name} Thumbnail Downloader`,
        applicationCategory: "Multimedia",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
    ],
  };

  return (
    <>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main>
        <DownloadOnlyHero platform={platform} type="thumbnail" />
        <DownloadFeatures platform={platform} type="thumbnail" />
        <DownloadFaq platform={platform} type="thumbnail" />
        {content && <BlogContent content={content} />}
      </main>
      <Footer />
    </>
  );
}
