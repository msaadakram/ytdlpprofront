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

export function generateStaticParams() {
  return platformSlugs.map((slug) => ({ platform: slug }));
}

type Props = { params: Promise<{ platform: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform } = await params;
  const config = platformConfigs[platform];
  if (!config) return {};

  return {
    title: `${config.name} Thumbnail Downloader — Download HD Thumbnails | DownForge`,
    description: `Free ${config.name} thumbnail downloader. Save ${config.name} video thumbnails in HD resolution as JPG, PNG, and WebP. No sign-up required.`,
    openGraph: {
      title: `${config.name} Thumbnail Downloader — Download HD Thumbnails | DownForge`,
      description: `Free ${config.name} thumbnail downloader. Save video thumbnails in HD as JPG, PNG, and WebP. No sign-up required.`,
      url: `https://downforge.me/thumbnail-downloader/${config.slug}`,
      siteName: "DownForge",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.name} Thumbnail Downloader — Download HD Thumbnails`,
      description: `Free ${config.name} thumbnail downloader. Save video thumbnails in HD as JPG, PNG, and WebP.`,
    },
    robots: { index: true, follow: true },
    alternates: { canonical: `https://downforge.me/thumbnail-downloader/${config.slug}` },
    keywords: [...config.keywords, "thumbnail downloader", "hd thumbnail", "save thumbnail"],
  };
}

export default async function ThumbnailDownloaderPage({ params }: Props) {
  const { platform } = await params;
  const config = platformConfigs[platform];
  if (!config) notFound();

  const content = getContent(platform, "thumbnail");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `https://downforge.me/thumbnail-downloader/${config.slug}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://downforge.me" },
          { "@type": "ListItem", position: 2, name: `${config.name} Thumbnail Downloader`, item: `https://downforge.me/thumbnail-downloader/${config.slug}` },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `https://downforge.me/thumbnail-downloader/${config.slug}#webapp`,
        name: `DownForge ${config.name} Thumbnail Downloader`,
        url: `https://downforge.me/thumbnail-downloader/${config.slug}`,
        description: `Free ${config.name} thumbnail downloader. Save video thumbnails in HD as JPG, PNG, and WebP. No registration required.`,
        applicationCategory: "Multimedia",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        "@id": `https://downforge.me/thumbnail-downloader/${config.slug}#faq`,
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
        <DownloadOnlyHero platform={platform} type="thumbnail" />
        <DownloadFeatures platform={platform} type="thumbnail" />
        <DownloadFaq platform={platform} type="thumbnail" />
        {content && <BlogContent content={content} />}
      </main>
      <Footer />
    </>
  );
}
