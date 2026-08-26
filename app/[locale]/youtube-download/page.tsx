import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { YoutubeHero } from "@/components/youtube-download/YoutubeHero";
import { RelatedTips } from "@/components/youtube-download/RelatedTips";
import { FaqSection } from "@/components/youtube-download/FaqSection";
import { PlatformToolFeatures } from "@/components/platform-download/PlatformToolFeatures";
import { PlatformHowItWorks } from "@/components/platform-download/PlatformHowItWorks";
import { getYouTubeUniversalContent } from "@/lib/content/registry";
import { relatedLinksFor } from "@/lib/content/related-links";
import { BlogContent } from "@/components/content/BlogContent";
import { RelatedLinks } from "@/components/content/RelatedLinks";

type Props = { params: Promise<{ locale: string }> };

const ogLocaleMap: Record<string, string> = {
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
  pt: "pt_BR",
  ja: "ja_JP",
  ar: "ar_SA",
  ru: "ru_RU",
  zh: "zh_CN",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Platform.youtube" });
  const tryGet = (key: string, fallback: string) => {
    try {
      return t(key as any);
    } catch {
      return t(fallback as any);
    }
  };
  const tryRaw = (key: string, fallback: string) => {
    try {
      return t.raw(key as any) as string[];
    } catch {
      return t.raw(fallback as any) as string[];
    }
  };
  const pageTitle = tryGet("metaTitleAll", "metaTitle");
  const pageDescription = tryGet("metaDescriptionAll", "metaDescription");
  const keywords = tryRaw("keywordsAll", "keywords");

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `https://www.downforge.me/${locale}/youtube-download`,
      siteName: "DownForge",
      locale: ogLocaleMap[locale] ?? locale,
      type: "website",
      images: [
        {
          url: "https://www.downforge.me/og/download/youtube.png",
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: ["https://www.downforge.me/og/download/youtube.png"],
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
      canonical: `https://www.downforge.me/${locale}/youtube-download`,
      languages: {
        en: "https://www.downforge.me/en/youtube-download",
        es: "https://www.downforge.me/es/youtube-download",
        fr: "https://www.downforge.me/fr/youtube-download",
        de: "https://www.downforge.me/de/youtube-download",
        pt: "https://www.downforge.me/pt/youtube-download",
        ja: "https://www.downforge.me/ja/youtube-download",
        ar: "https://www.downforge.me/ar/youtube-download",
        ru: "https://www.downforge.me/ru/youtube-download",
        zh: "https://www.downforge.me/zh/youtube-download",
      },
    },
    keywords,
  };
}

export default async function YoutubeDownloadPage({ params }: Props) {
  const { locale } = await params;
  const content = locale === "en" ? getYouTubeUniversalContent() : null;
  const t = await getTranslations({ locale, namespace: "Platform.youtube" });
  const tPage = await getTranslations({ locale, namespace: "PlatformPage" });
  const tryGet = (key: string, fallback: string) => {
    try {
      return t(key as any);
    } catch {
      return t(fallback as any);
    }
  };
  const pageTitle = tryGet("metaTitleAll", "metaTitle");
  const pageDescription = tryGet("metaDescriptionAll", "metaDescription");
  const faqs = (() => {
    try {
      return t.raw("faqs") as { q: string; a: string }[];
    } catch {
      return [];
    }
  })();
  const breadcrumbHome = (() => {
    try {
      return tPage("breadcrumbHome");
    } catch {
      return "Home";
    }
  })();

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
        "@id": `https://www.downforge.me/${locale}/youtube-download#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: breadcrumbHome, item: `https://www.downforge.me/${locale}` },
          { "@type": "ListItem", position: 2, name: pageTitle, item: `https://www.downforge.me/${locale}/youtube-download` },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `https://www.downforge.me/${locale}/youtube-download#webapp`,
        name: pageTitle,
        url: `https://www.downforge.me/${locale}/youtube-download`,
        description: pageDescription,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        featureList: ["Video 4K/1080p MP4", "Audio MP3 320kbps FLAC", "Thumbnail JPG/PNG/WebP", "Transcript SRT/VTT JSON AI"],
        screenshot: "https://www.downforge.me/og/download/youtube.png",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "HowTo",
        "@id": `https://www.downforge.me/${locale}/youtube-download#howto`,
        name: "How to Download from YouTube — Video, Audio, Thumbnail & Transcript",
        description: "Paste a YouTube link, pick Video, MP3, Thumbnail or Transcript, and download. Works on Android, iPhone & PC.",
        totalTime: "PT30S",
        tool: [{ "@type": "HowToTool", name: "DownForge" }],
        step: howToSteps,
      },
      {
        "@type": "FAQPage",
        "@id": `https://www.downforge.me/${locale}/youtube-download#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@type": "Article",
        "@id": `https://www.downforge.me/${locale}/youtube-download#article`,
        headline: pageTitle,
        description: pageDescription,
        inLanguage: locale,
        author: { "@type": "Organization", name: "DownForge", url: "https://www.downforge.me" },
        publisher: { "@type": "Organization", name: "DownForge", logo: { "@type": "ImageObject", url: "https://www.downforge.me/organization-logo.png" } },
        datePublished: "2025-08-22",
        dateModified: new Date().toISOString().slice(0, 10),
        mainEntityOfPage: `https://www.downforge.me/${locale}/youtube-download`,
        wordCount: 2800,
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
        <YoutubeHero />
        <PlatformToolFeatures platform="youtube" />
        <PlatformHowItWorks platform="youtube" />
        <RelatedTips />
        <FaqSection />
        {content && <BlogContent content={content} />}
        <RelatedLinks links={relatedLinksFor("youtube-download")} />
      </main>
      <Footer />
    </>
  );
}
