import type { Metadata } from "next";
import { notFound } from "next/navigation";
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

type Props = { params: Promise<{ platform: string }> };

export function generateStaticParams() {
  return platformSlugs.map((slug) => ({ platform: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform } = await params;
  const config = platformConfigs[platform];
  if (!config) return { title: "Platform Not Found" };

  return {
    title: config.metaTitle,
    description: config.metaDescription,
    openGraph: {
      title: config.metaTitle,
      description: config.metaDescription,
      url: `https://downforge.me/download/${config.slug}`,
      siteName: "DownForge",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: config.metaTitle,
      description: config.metaDescription,
    },
    robots: { index: true, follow: true },
    alternates: { canonical: `https://downforge.me/download/${config.slug}` },
    keywords: config.keywords,
  };
}

export default async function PlatformDownloadPage({ params }: Props) {
  const { platform } = await params;
  const config = platformConfigs[platform];
  if (!config) notFound();

  const content = getContent(platform, "video");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `https://downforge.me/download/${config.slug}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://downforge.me" },
          { "@type": "ListItem", position: 2, name: `${config.name} Downloader`, item: `https://downforge.me/download/${config.slug}` },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `https://downforge.me/download/${config.slug}#webapp`,
        name: `DownForge ${config.name} Downloader`,
        url: `https://downforge.me/download/${config.slug}`,
        description: config.metaDescription,
        applicationCategory: "Multimedia",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        "@id": `https://downforge.me/download/${config.slug}#faq`,
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
