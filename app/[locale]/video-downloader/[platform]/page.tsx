import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { VideoOnlyHero } from "@/components/video-downloader/VideoOnlyHero";
import { VideoFeatures } from "@/components/video-downloader/VideoFeatures";
import { VideoFaq } from "@/components/video-downloader/VideoFaq";
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

  return {
    title: `${config.name} Video Downloader — Download ${config.name} Videos in HD | DownForge`,
    description: config.metaDescription,
    openGraph: {
      title: `${config.name} Video Downloader — Download ${config.name} Videos in HD | DownForge`,
      description: config.metaDescription,
      url: `https://downforge.me/${locale}/video-downloader/${config.slug}`,
      siteName: "DownForge",
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${config.name} Video Downloader — Download ${config.name} Videos in HD`,
      description: config.metaDescription,
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://downforge.me/${locale}/video-downloader/${config.slug}`,
      languages: {
        en: `https://downforge.me/en/video-downloader/${config.slug}`,
        es: `https://downforge.me/es/video-downloader/${config.slug}`,
        fr: `https://downforge.me/fr/video-downloader/${config.slug}`,
        de: `https://downforge.me/de/video-downloader/${config.slug}`,
        pt: `https://downforge.me/pt/video-downloader/${config.slug}`,
        ja: `https://downforge.me/ja/video-downloader/${config.slug}`,
        ar: `https://downforge.me/ar/video-downloader/${config.slug}`,
        ru: `https://downforge.me/ru/video-downloader/${config.slug}`,
        zh: `https://downforge.me/zh/video-downloader/${config.slug}`,
      },
    },
    keywords: config.keywords,
  };
}

export default async function VideoDownloaderPage({ params }: Props) {
  const { platform, locale } = await params;
  const config = platformConfigs[platform];
  if (!config) notFound();

  const content = getContent(platform, "video");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `https://downforge.me/${locale}/video-downloader/${config.slug}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", position: 1, name: "Home", item: `https://downforge.me/${locale}` },
          { "@type": "ListItem", position: 2, name: `${config.name} Video Downloader`, item: `https://downforge.me/${locale}/video-downloader/${config.slug}` },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `https://downforge.me/${locale}/video-downloader/${config.slug}#webapp`,
        name: `DownForge ${config.name} Video Downloader`,
        url: `https://downforge.me/${locale}/video-downloader/${config.slug}`,
        description: config.metaDescription,
        applicationCategory: "Multimedia",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        "@id": `https://downforge.me/${locale}/video-downloader/${config.slug}#faq`,
        mainEntity: config.faqs.map((faq: any) => ({
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
        {content && <BlogContent content={content} />}
      </main>
      <Footer />
    </>
  );
}
