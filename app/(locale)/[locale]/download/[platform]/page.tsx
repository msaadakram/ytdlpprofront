import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PlatformHero } from "@/components/platform-download/PlatformHero";
import { PlatformTips } from "@/components/platform-download/PlatformTips";
import { PlatformFaq } from "@/components/platform-download/PlatformFaq";
import { PlatformToolFeatures } from "@/components/platform-download/PlatformToolFeatures";
import { PlatformHowItWorks } from "@/components/platform-download/PlatformHowItWorks";
import { platformConfigs, platformSlugs } from "@/lib/platform-config";
import { getUniversalContent } from "@/lib/content/registry";
import { getTemplatedFaqs } from "@/lib/content/templated-faqs";
import { relatedLinksFor } from "@/lib/content/related-links";
import { BlogContent } from "@/components/content/BlogContent";
import { RelatedLinks } from "@/components/content/RelatedLinks";
import { ExploreOtherTools } from "@/components/content/ExploreOtherTools";

type Props = { params: Promise<{ platform: string; locale: string }> };

export function generateStaticParams() {
  const locales = ["en", "es", "fr", "de", "pt", "ja", "ar", "ru", "zh"];
  return locales.flatMap((locale) =>
    platformSlugs.map((platform) => ({ locale, platform }))
  );
}

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
  const { platform, locale } = await params;
  const config = platformConfigs[platform];
  if (!config) return { title: "Platform Not Found" };

  const t = await getTranslations({ locale, namespace: `Platform.${platform}` });

  // All-tools metadata: video + audio + thumbnail + transcript on one page
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

  const title = tryGet("metaTitleAll", "metaTitle");
  const description = tryGet("metaDescriptionAll", "metaDescription");
  const keywords = tryRaw("keywordsAll", "keywords");
  const ogImage = `https://www.downforge.me/og/download/${config.slug}.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.downforge.me/${locale}/download/${config.slug}`,
      siteName: "DownForge",
      locale: ogLocaleMap[locale] ?? locale,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
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
      canonical: `https://www.downforge.me/${locale}/download/${config.slug}`,
      languages: {
        en: `https://www.downforge.me/en/download/${config.slug}`,
        es: `https://www.downforge.me/es/download/${config.slug}`,
        fr: `https://www.downforge.me/fr/download/${config.slug}`,
        de: `https://www.downforge.me/de/download/${config.slug}`,
        pt: `https://www.downforge.me/pt/download/${config.slug}`,
        ja: `https://www.downforge.me/ja/download/${config.slug}`,
        ar: `https://www.downforge.me/ar/download/${config.slug}`,
        ru: `https://www.downforge.me/ru/download/${config.slug}`,
        zh: `https://www.downforge.me/zh/download/${config.slug}`,
      },
    },
    keywords,
  };
}

export default async function PlatformDownloadPage({ params }: Props) {
  const { platform, locale } = await params;
  const config = platformConfigs[platform];
  if (!config) notFound();

  const content = locale === "en" ? getUniversalContent(platform) : null;

  const t = await getTranslations({ locale, namespace: "PlatformPage" });
  const pt = await getTranslations({ locale, namespace: `Platform.${platform}` });
  const et = await getTranslations({ locale, namespace: "ExploreTools" });
  // Templated all-tools FAQ set — translated in every locale (the per-platform
  // faqsAudio/faqs arrays are English-only or video-intent outside EN).
  const faqs =
    (await getTemplatedFaqs(locale, "all", config.name)) ??
    (pt.raw("faqs") as { q: string; a: string }[]);

  const tryGetAll = (key: string, fallback: string) => {
    try {
      return pt(key as any);
    } catch {
      return pt(fallback as any);
    }
  };
  const allTitle = tryGetAll("metaTitleAll", "metaTitle");
  const allDescription = tryGetAll("metaDescriptionAll", "metaDescription");

  // HowTo steps from universal content
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
        "@id": `https://www.downforge.me/${locale}/download/${config.slug}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t("breadcrumbHome"), item: `https://www.downforge.me/${locale}` },
          { "@type": "ListItem", position: 2, name: `${config.name} ${et("tools.all.label")}`, item: `https://www.downforge.me/${locale}/download/${config.slug}` },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `https://www.downforge.me/${locale}/download/${config.slug}#webapp`,
        name: allTitle,
        url: `https://www.downforge.me/${locale}/download/${config.slug}`,
        description: allDescription,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        featureList: ["Video 4K/1080p MP4", "Audio MP3 320kbps FLAC", "Thumbnail JPG/PNG/WebP", "Transcript SRT/VTT JSON AI"],
        screenshot: `https://www.downforge.me/og/download/${config.slug}.png`,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "HowTo",
        "@id": `https://www.downforge.me/${locale}/download/${config.slug}#howto`,
        name: `How to Download from ${config.name} — Video, Audio, Thumbnail & Transcript`,
        description: `Paste a ${config.name} link, pick Video, Audio, Thumbnail or Transcript, and download. Works on Android, iPhone & PC.`,
        totalTime: "PT30S",
        tool: [{ "@type": "HowToTool", name: "DownForge" }],
        step: howToSteps,
      },
      {
        "@type": "FAQPage",
        "@id": `https://www.downforge.me/${locale}/download/${config.slug}#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@type": "Article",
        "@id": `https://www.downforge.me/${locale}/download/${config.slug}#article`,
        headline: allTitle,
        description: allDescription,
        inLanguage: locale,
        author: { "@type": "Organization", name: "DownForge", url: "https://www.downforge.me" },
        publisher: { "@type": "Organization", name: "DownForge", logo: { "@type": "ImageObject", url: "https://www.downforge.me/organization-logo.png" } },
        datePublished: "2025-08-22",
        dateModified: new Date().toISOString().slice(0, 10),
        mainEntityOfPage: `https://www.downforge.me/${locale}/download/${config.slug}`,
        wordCount: 2700,
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
        <PlatformHero platform={config.id} />
        <PlatformToolFeatures platform={config.id} />
        <PlatformHowItWorks platform={config.id} />
        <PlatformTips platform={config.id} />
        <PlatformFaq platform={config.id} />
        {content && <BlogContent content={content} />}
        <RelatedLinks links={relatedLinksFor("download", platform)} />
        <ExploreOtherTools platform={platform} currentTool="all" />
      </main>
      <Footer />
    </>
  );
}
