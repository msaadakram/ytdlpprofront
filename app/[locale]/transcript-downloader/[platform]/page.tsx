import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

  const title = `${config.name} Transcript Downloader — Generate ${config.name} AI Transcripts | DownForge`;
  const description = `Free ${config.name} transcript downloader. Generate AI transcripts with timestamps from ${config.name} videos. Download as SRT, VTT, TXT, or JSON. No sign-up required.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://downforge.me/${locale}/transcript-downloader/${config.slug}`,
      siteName: "DownForge",
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://downforge.me/${locale}/transcript-downloader/${config.slug}`,
      languages: {
        en: `https://downforge.me/en/transcript-downloader/${config.slug}`,
        es: `https://downforge.me/es/transcript-downloader/${config.slug}`,
        fr: `https://downforge.me/fr/transcript-downloader/${config.slug}`,
        de: `https://downforge.me/de/transcript-downloader/${config.slug}`,
        pt: `https://downforge.me/pt/transcript-downloader/${config.slug}`,
        ja: `https://downforge.me/ja/transcript-downloader/${config.slug}`,
        ar: `https://downforge.me/ar/transcript-downloader/${config.slug}`,
        ru: `https://downforge.me/ru/transcript-downloader/${config.slug}`,
        zh: `https://downforge.me/zh/transcript-downloader/${config.slug}`,
      },
    },
    keywords: [...config.keywords, "transcript downloader", "ai transcript", "subtitle downloader"],
  };
}

export default async function TranscriptDownloaderPage({ params }: Props) {
  const { platform, locale } = await params;
  const config = platformConfigs[platform];
  if (!config) notFound();

  const content = getContent(platform, "transcript");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `https://downforge.me/${locale}/transcript-downloader/${config.slug}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `https://downforge.me/${locale}` },
          { "@type": "ListItem", position: 2, name: `${config.name} Transcript Downloader`, item: `https://downforge.me/${locale}/transcript-downloader/${config.slug}` },
        ],
      },
      {
        "@type": "WebApplication",
        url: `https://downforge.me/${locale}/transcript-downloader/${config.slug}`,
        name: `DownForge ${config.name} Transcript Downloader`,
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
        <DownloadOnlyHero platform={platform} type="transcript" />
        <DownloadFeatures platform={platform} type="transcript" />
        <DownloadFaq platform={platform} type="transcript" />
        {content && <BlogContent content={content} />}
      </main>
      <Footer />
    </>
  );
}
