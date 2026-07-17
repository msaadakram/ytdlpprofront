import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { DownloadOnlyHero } from "@/components/download-only/DownloadOnlyHero";
import { DownloadFeatures } from "@/components/download-only/DownloadFeatures";
import { DownloadFaq } from "@/components/download-only/DownloadFaq";
import { platformConfigs, platformSlugs } from "@/lib/platform-config";

export function generateStaticParams() {
  return platformSlugs.map((slug) => ({ platform: slug }));
}

type Props = { params: Promise<{ platform: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform } = await params;
  const config = platformConfigs[platform];
  if (!config) return {};

  return {
    title: `${config.name} Audio Downloader — Extract Audio as MP3, FLAC, AAC | fetchwave`,
    description: `Free ${config.name} audio downloader. Extract audio from ${config.name} videos as MP3 320kbps, FLAC, AAC, WAV, and OGG. No sign-up required.`,
    openGraph: {
      title: `${config.name} Audio Downloader — Extract Audio as MP3, FLAC, AAC | fetchwave`,
      description: `Free ${config.name} audio downloader. Extract audio as MP3 320kbps, FLAC, AAC, WAV, and OGG. No sign-up required.`,
      url: `https://fetchwave.com/audio-downloader/${config.slug}`,
      siteName: "fetchwave",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.name} Audio Downloader — Extract Audio as MP3, FLAC, AAC`,
      description: `Free ${config.name} audio downloader. Extract audio as MP3 320kbps, FLAC, AAC, WAV, and OGG.`,
    },
    robots: { index: true, follow: true },
    alternates: { canonical: `https://fetchwave.com/audio-downloader/${config.slug}` },
    keywords: [...config.keywords, "audio downloader", "mp3 downloader", "extract audio"],
  };
}

export default async function AudioDownloaderPage({ params }: Props) {
  const { platform } = await params;
  const config = platformConfigs[platform];
  if (!config) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `https://fetchwave.com/audio-downloader/${config.slug}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://fetchwave.com" },
          { "@type": "ListItem", position: 2, name: `${config.name} Audio Downloader`, item: `https://fetchwave.com/audio-downloader/${config.slug}` },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `https://fetchwave.com/audio-downloader/${config.slug}#webapp`,
        name: `fetchwave ${config.name} Audio Downloader`,
        url: `https://fetchwave.com/audio-downloader/${config.slug}`,
        description: `Free ${config.name} audio downloader. Extract audio as MP3 320kbps, FLAC, AAC, WAV, and OGG. No registration required.`,
        applicationCategory: "Multimedia",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        "@id": `https://fetchwave.com/audio-downloader/${config.slug}#faq`,
        mainEntity: config.faqs.map((faq) => ({
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
      </main>
      <Footer />
    </>
  );
}
