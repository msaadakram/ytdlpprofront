import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { VideoOnlyHero } from "@/components/video-downloader/VideoOnlyHero";
import { VideoFeatures } from "@/components/video-downloader/VideoFeatures";
import { VideoFaq } from "@/components/video-downloader/VideoFaq";
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
    title: `${config.name} Video Downloader — Download ${config.name} Videos in HD | fetchwave`,
    description: config.metaDescription,
    openGraph: {
      title: `${config.name} Video Downloader — Download ${config.name} Videos in HD | fetchwave`,
      description: config.metaDescription,
      url: `https://fetchwave.com/video-downloader/${config.slug}`,
      siteName: "fetchwave",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.name} Video Downloader — Download ${config.name} Videos in HD`,
      description: config.metaDescription,
    },
    robots: { index: true, follow: true },
    alternates: { canonical: `https://fetchwave.com/video-downloader/${config.slug}` },
    keywords: config.keywords,
  };
}

export default async function VideoDownloaderPage({ params }: Props) {
  const { platform } = await params;
  const config = platformConfigs[platform];
  if (!config) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `https://fetchwave.com/video-downloader/${config.slug}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://fetchwave.com" },
          { "@type": "ListItem", position: 2, name: `${config.name} Video Downloader`, item: `https://fetchwave.com/video-downloader/${config.slug}` },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `https://fetchwave.com/video-downloader/${config.slug}#webapp`,
        name: `fetchwave ${config.name} Video Downloader`,
        url: `https://fetchwave.com/video-downloader/${config.slug}`,
        description: config.metaDescription,
        applicationCategory: "Multimedia",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        "@id": `https://fetchwave.com/video-downloader/${config.slug}#faq`,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <VideoOnlyHero platform={platform} />
        <VideoFeatures platform={platform} />
        <VideoFaq platform={platform} />
      </main>
      <Footer />
    </>
  );
}
