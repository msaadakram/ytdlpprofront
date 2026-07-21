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
      url: `https://downforge.me/${locale}/audio-downloader/${config.slug}`,
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
      canonical: `https://downforge.me/${locale}/audio-downloader/${config.slug}`,
      languages: {
        en: `https://downforge.me/en/audio-downloader/${config.slug}`,
        es: `https://downforge.me/es/audio-downloader/${config.slug}`,
        fr: `https://downforge.me/fr/audio-downloader/${config.slug}`,
        de: `https://downforge.me/de/audio-downloader/${config.slug}`,
        pt: `https://downforge.me/pt/audio-downloader/${config.slug}`,
        ja: `https://downforge.me/ja/audio-downloader/${config.slug}`,
        ar: `https://downforge.me/ar/audio-downloader/${config.slug}`,
        ru: `https://downforge.me/ru/audio-downloader/${config.slug}`,
        zh: `https://downforge.me/zh/audio-downloader/${config.slug}`,
      },
    },
    keywords: t.raw("keywords") as string[],
  };
}

export default async function AudioDownloaderPage({ params }: Props) {
  const { platform, locale } = await params;
  const config = platformConfigs[platform];
  if (!config) notFound();

  const content = getContent(platform, "audio");

  const t = await getTranslations({ locale, namespace: `Platform.${platform}` });
  const faqs = t.raw("faqs") as { q: string; a: string }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `https://downforge.me/${locale}/audio-downloader/${config.slug}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", position: 1, name: "Home", item: `https://downforge.me/${locale}` },
          { "@type": "ListItem", position: 2, name: `${config.name} Audio Downloader`, item: `https://downforge.me/${locale}/audio-downloader/${config.slug}` },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `https://downforge.me/${locale}/audio-downloader/${config.slug}#webapp`,
        name: `DownForge ${config.name} Audio Downloader`,
        url: `https://downforge.me/${locale}/audio-downloader/${config.slug}`,
        description: t("metaDescription"),
        applicationCategory: "Multimedia",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        "@id": `https://downforge.me/${locale}/audio-downloader/${config.slug}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
    ],
  };

  return (
    <>
      <Nav />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main>
        <DownloadOnlyHero platform={platform} type="audio" />
        <DownloadFeatures platform={platform} type="audio" />
        <DownloadFaq platform={platform} type="audio" />
        {content && <BlogContent content={content} />}
      </main>
      <Footer />
    </>
  );
}
