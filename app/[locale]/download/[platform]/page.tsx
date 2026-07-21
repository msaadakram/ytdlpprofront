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
  if (!config) return { title: "Platform Not Found" };

  const t = await getTranslations({ locale, namespace: `Platform.${platform}` });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      url: `https://downforge.me/${locale}/download/${config.slug}`,
      siteName: "DownForge",
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://downforge.me/${locale}/download/${config.slug}`,
      languages: {
        en: `https://downforge.me/en/download/${config.slug}`,
        es: `https://downforge.me/es/download/${config.slug}`,
        fr: `https://downforge.me/fr/download/${config.slug}`,
        de: `https://downforge.me/de/download/${config.slug}`,
        pt: `https://downforge.me/pt/download/${config.slug}`,
        ja: `https://downforge.me/ja/download/${config.slug}`,
        ar: `https://downforge.me/ar/download/${config.slug}`,
        ru: `https://downforge.me/ru/download/${config.slug}`,
        zh: `https://downforge.me/zh/download/${config.slug}`,
      },
    },
    keywords: t.raw("keywords") as string[],
  };
}

export default async function PlatformDownloadPage({ params }: Props) {
  const { platform, locale } = await params;
  const config = platformConfigs[platform];
  if (!config) notFound();

  const content = getContent(platform, "video");

  const t = await getTranslations({ locale, namespace: "PlatformPage" });
  const pt = await getTranslations({ locale, namespace: `Platform.${platform}` });
  const faqs = pt.raw("faqs") as { q: string; a: string }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `https://downforge.me/${locale}/download/${config.slug}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: t("breadcrumbHome"), item: `https://downforge.me/${locale}` },
          { "@type": "ListItem", position: 2, name: `${config.name} Downloader`, item: `https://downforge.me/${locale}/download/${config.slug}` },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `https://downforge.me/${locale}/download/${config.slug}#webapp`,
        name: `DownForge ${config.name} Downloader`,
        url: `https://downforge.me/${locale}/download/${config.slug}`,
        description: pt("metaDescription"),
        applicationCategory: "Multimedia",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        "@id": `https://downforge.me/${locale}/download/${config.slug}#faq`,
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
        <PlatformHero platform={config.id} />
        <PlatformToolFeatures platform={config.id} />
        <PlatformHowItWorks platform={config.id} />
        <PlatformTips platform={config.id} />
        <PlatformFaq platform={config.id} />
        {content && <BlogContent content={content} />}
      </main>
      <Footer />
    </>
  );
}
