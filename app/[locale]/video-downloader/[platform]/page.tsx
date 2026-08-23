import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { VideoOnlyHero } from "@/components/video-downloader/VideoOnlyHero";
import { VideoFeatures } from "@/components/video-downloader/VideoFeatures";
import { VideoFaq } from "@/components/video-downloader/VideoFaq";
import { platformConfigs, platformSlugs } from "@/lib/platform-config";
import { getContent } from "@/lib/content/registry";
import { relatedLinksFor } from "@/lib/content/related-links";
import { BlogContent } from "@/components/content/BlogContent";
import { RelatedLinks } from "@/components/content/RelatedLinks";

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

  // Video-only pages use their own title/description so they don't duplicate
  // the all-in-one /download/{platform} pages in SERPs. Falls back to the
  // generic platform meta when a locale hasn't translated the video variant.
  const title = t.has("metaTitleVideo") ? t("metaTitleVideo") : t("metaTitle");
  const description = t.has("metaDescriptionVideo") ? t("metaDescriptionVideo") : t("metaDescription");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.downforge.me/${locale}/video-downloader/${config.slug}`,
      siteName: "DownForge",
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://www.downforge.me/${locale}/video-downloader/${config.slug}`,
      languages: {
        en: `https://www.downforge.me/en/video-downloader/${config.slug}`,
        es: `https://www.downforge.me/es/video-downloader/${config.slug}`,
        fr: `https://www.downforge.me/fr/video-downloader/${config.slug}`,
        de: `https://www.downforge.me/de/video-downloader/${config.slug}`,
        pt: `https://www.downforge.me/pt/video-downloader/${config.slug}`,
        ja: `https://www.downforge.me/ja/video-downloader/${config.slug}`,
        ar: `https://www.downforge.me/ar/video-downloader/${config.slug}`,
        ru: `https://www.downforge.me/ru/video-downloader/${config.slug}`,
        zh: `https://www.downforge.me/zh/video-downloader/${config.slug}`,
      },
    },
    keywords: t.raw("keywords") as string[],
  };
}

export default async function VideoDownloaderPage({ params }: Props) {
  const { platform, locale } = await params;
  const config = platformConfigs[platform];
  if (!config) notFound();

  const content = getContent(platform, "video");

  const t = await getTranslations({ locale, namespace: `Platform.${platform}` });
  const faqs = t.raw("faqs") as { q: string; a: string }[];
  const metaDescription = t.has("metaDescriptionVideo") ? t("metaDescriptionVideo") : t("metaDescription");
  const related = relatedLinksFor("video-downloader", platform);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `https://www.downforge.me/${locale}/video-downloader/${config.slug}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", position: 1, name: "Home", item: `https://www.downforge.me/${locale}` },
          { "@type": "ListItem", position: 2, name: `${config.name} Video Downloader`, item: `https://www.downforge.me/${locale}/video-downloader/${config.slug}` },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `https://www.downforge.me/${locale}/video-downloader/${config.slug}#webapp`,
        name: `DownForge ${config.name} Video Downloader`,
        url: `https://www.downforge.me/${locale}/video-downloader/${config.slug}`,
        description: metaDescription,
        applicationCategory: "Multimedia",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        "@id": `https://www.downforge.me/${locale}/video-downloader/${config.slug}#faq`,
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
        <VideoOnlyHero platform={platform} />
        <VideoFeatures platform={platform} />
        <VideoFaq platform={platform} />
        {content && <BlogContent content={content} />}
        <RelatedLinks links={related} />
      </main>
      <Footer />
    </>
  );
}
