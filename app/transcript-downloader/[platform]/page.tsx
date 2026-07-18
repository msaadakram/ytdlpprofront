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
    title: `${config.name} Transcript Downloader — AI Subtitles SRT, VTT, TXT, JSON | DownForge`,
    description: `Free ${config.name} transcript generator. Get AI-powered transcripts for any ${config.name} video as SRT, VTT, TXT, or JSON subtitles. No sign-up required.`,
    openGraph: {
      title: `${config.name} Transcript Downloader — AI Subtitles SRT, VTT, TXT, JSON | DownForge`,
      description: `Free ${config.name} transcript generator. Get AI transcripts for any ${config.name} video as SRT, VTT, TXT, or JSON. No sign-up required.`,
      url: `https://downforge.me/transcript-downloader/${config.slug}`,
      siteName: "DownForge",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.name} Transcript Downloader — AI Subtitles SRT, VTT, TXT, JSON`,
      description: `Free ${config.name} transcript generator. Get AI transcripts as SRT, VTT, TXT, or JSON subtitles.`,
    },
    robots: { index: true, follow: true },
    alternates: { canonical: `https://downforge.me/transcript-downloader/${config.slug}` },
    keywords: [...config.keywords, "transcript downloader", "ai transcript", "subtitle downloader", "srt download"],
  };
}

export default async function TranscriptDownloaderPage({ params }: Props) {
  const { platform } = await params;
  const config = platformConfigs[platform];
  if (!config) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `https://downforge.me/transcript-downloader/${config.slug}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://downforge.me" },
          { "@type": "ListItem", position: 2, name: `${config.name} Transcript Downloader`, item: `https://downforge.me/transcript-downloader/${config.slug}` },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `https://downforge.me/transcript-downloader/${config.slug}#webapp`,
        name: `DownForge ${config.name} Transcript Downloader`,
        url: `https://downforge.me/transcript-downloader/${config.slug}`,
        description: `Free ${config.name} transcript generator. Get AI-powered transcripts for any ${config.name} video as SRT, VTT, TXT, or JSON subtitles. No registration required.`,
        applicationCategory: "Multimedia",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        "@id": `https://downforge.me/transcript-downloader/${config.slug}#faq`,
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
        <DownloadOnlyHero platform={platform} type="transcript" />
        <DownloadFeatures platform={platform} type="transcript" />
        <DownloadFaq platform={platform} type="transcript" />
      </main>
      <Footer />
    </>
  );
}
