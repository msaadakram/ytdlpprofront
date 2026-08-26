import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { TranscriptHero } from "@/components/download-only/TranscriptHero";
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
  if (!config) return {};

  const t = await getTranslations({ locale, namespace: `Platform.${platform}` });

  const title = t.has("metaTitleTranscript") ? t("metaTitleTranscript") : t("metaTitle");
  const description = t.has("metaDescriptionTranscript") ? t("metaDescriptionTranscript") : t("metaDescription");
  const keywords = t.has("keywordsTranscript") ? (t.raw("keywordsTranscript") as string[]) : (t.raw("keywords") as string[]);
  const ogImage = `https://www.downforge.me/og/transcript-downloader/${config.slug}.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.downforge.me/${locale}/transcript-downloader/${config.slug}`,
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
      googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
    },
    alternates: {
      canonical: `https://www.downforge.me/${locale}/transcript-downloader/${config.slug}`,
      languages: {
        en: `https://www.downforge.me/en/transcript-downloader/${config.slug}`,
        es: `https://www.downforge.me/es/transcript-downloader/${config.slug}`,
        fr: `https://www.downforge.me/fr/transcript-downloader/${config.slug}`,
        de: `https://www.downforge.me/de/transcript-downloader/${config.slug}`,
        pt: `https://www.downforge.me/pt/transcript-downloader/${config.slug}`,
        ja: `https://www.downforge.me/ja/transcript-downloader/${config.slug}`,
        ar: `https://www.downforge.me/ar/transcript-downloader/${config.slug}`,
        ru: `https://www.downforge.me/ru/transcript-downloader/${config.slug}`,
        zh: `https://www.downforge.me/zh/transcript-downloader/${config.slug}`,
      },
    },
    keywords,
  };
}

export default async function TranscriptDownloaderPage({ params }: Props) {
  const { platform, locale } = await params;
  const config = platformConfigs[platform];
  if (!config) notFound();

  const content = locale === "en" ? getContent(platform, "transcript") : null;

  const t = await getTranslations({ locale, namespace: `Platform.${platform}` });
  const pt = await getTranslations({ locale, namespace: "PlatformPage" });
  const faqs = t.raw("faqs") as { q: string; a: string }[];
  const metaDescription = t.has("metaDescriptionTranscript") ? t("metaDescriptionTranscript") : t("metaDescription");
  const metaTitle = t.has("metaTitleTranscript") ? t("metaTitleTranscript") : t("metaTitle");

  const breadcrumbHome = (() => {
    try {
      return pt("breadcrumbHome");
    } catch {
      return "Home";
    }
  })();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `https://www.downforge.me/${locale}/transcript-downloader/${config.slug}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: breadcrumbHome, item: `https://www.downforge.me/${locale}` },
          { "@type": "ListItem", position: 2, name: `${config.name} Transcript Downloader`, item: `https://www.downforge.me/${locale}/transcript-downloader/${config.slug}` },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `https://www.downforge.me/${locale}/transcript-downloader/${config.slug}#webapp`,
        url: `https://www.downforge.me/${locale}/transcript-downloader/${config.slug}`,
        name: metaTitle,
        description: metaDescription,
        applicationCategory: "Multimedia",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        "@id": `https://www.downforge.me/${locale}/transcript-downloader/${config.slug}#faq`,
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
        <TranscriptHero platform={platform} />
        <DownloadFeatures platform={platform} type="transcript" />
        <DownloadFaq platform={platform} type="transcript" />
        {content && <BlogContent content={content} />}
      </main>
      <Footer />
    </>
  );
}
