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

  // Audio SEO: use audio-specific metadata with fallback to legacy video keys
  const hasAudioMeta = (() => {
    try {
      t("metaTitleAudio");
      return true;
    } catch {
      return false;
    }
  })();

  const title = hasAudioMeta ? t("metaTitleAudio") : t("metaTitle");
  const description = hasAudioMeta ? t("metaDescriptionAudio") : t("metaDescription");
  const keywords = (() => {
    try {
      return t.raw("keywordsAudio") as string[];
    } catch {
      return t.raw("keywords") as string[];
    }
  })();

  const ogImage = `https://www.downforge.me/og/audio-downloader/${config.slug}.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.downforge.me/${locale}/audio-downloader/${config.slug}`,
      siteName: "DownForge",
      locale,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `https://www.downforge.me/${locale}/audio-downloader/${config.slug}`,
      languages: {
        en: `https://www.downforge.me/en/audio-downloader/${config.slug}`,
        es: `https://www.downforge.me/es/audio-downloader/${config.slug}`,
        fr: `https://www.downforge.me/fr/audio-downloader/${config.slug}`,
        de: `https://www.downforge.me/de/audio-downloader/${config.slug}`,
        pt: `https://www.downforge.me/pt/audio-downloader/${config.slug}`,
        ja: `https://www.downforge.me/ja/audio-downloader/${config.slug}`,
        ar: `https://www.downforge.me/ar/audio-downloader/${config.slug}`,
        ru: `https://www.downforge.me/ru/audio-downloader/${config.slug}`,
        zh: `https://www.downforge.me/zh/audio-downloader/${config.slug}`,
      },
    },
    keywords,
  };
}

export default async function AudioDownloaderPage({ params }: Props) {
  const { platform, locale } = await params;
  const config = platformConfigs[platform];
  if (!config) notFound();

  const content = getContent(platform, "audio");

  const t = await getTranslations({ locale, namespace: `Platform.${platform}` });

  // Prefer audio-specific FAQs/descriptions with fallback
  const audioFaqs = (() => {
    try {
      return t.raw("faqsAudio") as { q: string; a: string }[];
    } catch {
      return t.raw("faqs") as { q: string; a: string }[];
    }
  })();
  const faqs = audioFaqs;

  const audioDescription = (() => {
    try {
      return t("metaDescriptionAudio");
    } catch {
      return t("metaDescription");
    }
  })();
  const audioTitle = (() => {
    try {
      return t("metaTitleAudio");
    } catch {
      return t("metaTitle");
    }
  })();

  // Build HowTo steps from audio content for rich results
  const howToSteps = content?.stepByStepGuide?.steps?.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.title,
    text: s.body,
  })) ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `https://www.downforge.me/${locale}/audio-downloader/${config.slug}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", position: 1, name: "Home", item: `https://www.downforge.me/${locale}` },
          { "@type": "ListItem", position: 2, name: `${config.name} to MP3 — Audio Downloader`, item: `https://www.downforge.me/${locale}/audio-downloader/${config.slug}` },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `https://www.downforge.me/${locale}/audio-downloader/${config.slug}#webapp`,
        name: audioTitle,
        url: `https://www.downforge.me/${locale}/audio-downloader/${config.slug}`,
        description: audioDescription,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        featureList: ["MP3 320kbps", "FLAC lossless", "AAC 256kbps", "WAV uncompressed", "OGG 192kbps"],
        screenshot: `https://www.downforge.me/og/audio-downloader/${config.slug}.png`,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "HowTo",
        "@id": `https://www.downforge.me/${locale}/audio-downloader/${config.slug}#howto`,
        name: `How to Convert ${config.name} Video to MP3`,
        description: `Convert ${config.name} videos to MP3, FLAC, AAC, WAV or OGG in 3 steps. Paste a link, choose quality, and download — works on Android, iPhone & PC.`,
        totalTime: "PT30S",
        tool: [{ "@type": "HowToTool", name: "DownForge Audio Converter" }],
        step: howToSteps,
      },
      {
        "@type": "FAQPage",
        "@id": `https://www.downforge.me/${locale}/audio-downloader/${config.slug}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@type": "Article",
        "@id": `https://www.downforge.me/${locale}/audio-downloader/${config.slug}#article`,
        headline: audioTitle,
        description: audioDescription,
        inLanguage: locale,
        author: { "@type": "Organization", name: "DownForge", url: "https://www.downforge.me" },
        publisher: { "@type": "Organization", name: "DownForge", logo: { "@type": "ImageObject", url: "https://www.downforge.me/organization-logo.png" } },
        datePublished: "2025-08-22",
        dateModified: new Date().toISOString().slice(0, 10),
        mainEntityOfPage: `https://www.downforge.me/${locale}/audio-downloader/${config.slug}`,
        wordCount: 2400,
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
