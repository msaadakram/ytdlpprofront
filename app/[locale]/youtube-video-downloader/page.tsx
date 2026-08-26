import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { VideoOnlyHero } from "@/components/youtube-video-downloader/VideoOnlyHero";
import { VideoFeatures } from "@/components/video-downloader/VideoFeatures";
import { VideoFaq } from "@/components/video-downloader/VideoFaq";
import { getYouTubeVideoContent } from "@/lib/content/registry";
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

  const title = t.has("metaTitleVideo") ? t("metaTitleVideo") : t("metaTitle");
  const description = t.has("metaDescriptionVideo")
    ? t("metaDescriptionVideo")
    : t("metaDescription");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.downforge.me/${locale}/youtube-video-downloader`,
      siteName: "DownForge",
      locale: ogLocaleMap[locale] ?? locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://www.downforge.me/${locale}/youtube-video-downloader`,
      languages: {
        en: "https://www.downforge.me/en/youtube-video-downloader",
        es: "https://www.downforge.me/es/youtube-video-downloader",
        fr: "https://www.downforge.me/fr/youtube-video-downloader",
        de: "https://www.downforge.me/de/youtube-video-downloader",
        pt: "https://www.downforge.me/pt/youtube-video-downloader",
        ja: "https://www.downforge.me/ja/youtube-video-downloader",
        ar: "https://www.downforge.me/ar/youtube-video-downloader",
        ru: "https://www.downforge.me/ru/youtube-video-downloader",
        zh: "https://www.downforge.me/zh/youtube-video-downloader",
      },
    },
    keywords: t.raw("keywords") as string[],
  };
}

export default async function YoutubeVideoDownloaderPage({ params }: Props) {
  const { locale } = await params;
  const content = locale === "en" ? getYouTubeVideoContent("video") : null;

  const t = await getTranslations({ locale, namespace: "Platform.youtube" });
  const pt = await getTranslations({ locale, namespace: "PlatformPage" });
  const faqs = t.raw("faqs") as { q: string; a: string }[];
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
        "@id": `https://www.downforge.me/${locale}/youtube-video-downloader#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: breadcrumbHome, item: `https://www.downforge.me/${locale}` },
          { "@type": "ListItem", position: 2, name: "YouTube Video Downloader", item: `https://www.downforge.me/${locale}/youtube-video-downloader` },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `https://www.downforge.me/${locale}/youtube-video-downloader#webapp`,
        name: "DownForge YouTube Video Downloader",
        url: `https://www.downforge.me/${locale}/youtube-video-downloader`,
        description: t.has("metaDescriptionVideo") ? t("metaDescriptionVideo") : t("metaDescription"),
        applicationCategory: "Multimedia",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        "@id": `https://www.downforge.me/${locale}/youtube-video-downloader#faq`,
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <VideoOnlyHero />
        <VideoFeatures platform="youtube" />
        <VideoFaq platform="youtube" />
        {content && <BlogContent content={content} />}
        <RelatedLinks links={relatedLinksFor("youtube-video-downloader")} />
      </main>
      <Footer />
    </>
  );
}
