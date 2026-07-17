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
      url: `https://fetchwave.com/download/${config.slug}`,
      siteName: "fetchwave",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: config.metaTitle,
      description: config.metaDescription,
    },
    robots: { index: true, follow: true },
    alternates: { canonical: `https://fetchwave.com/download/${config.slug}` },
    keywords: config.keywords,
  };
}

export default async function PlatformDownloadPage({ params }: Props) {
  const { platform } = await params;
  const config = platformConfigs[platform];
  if (!config) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `https://fetchwave.com/download/${config.slug}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://fetchwave.com" },
          { "@type": "ListItem", position: 2, name: `${config.name} Downloader`, item: `https://fetchwave.com/download/${config.slug}` },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `https://fetchwave.com/download/${config.slug}#webapp`,
        name: `fetchwave ${config.name} Downloader`,
        url: `https://fetchwave.com/download/${config.slug}`,
        description: config.metaDescription,
        applicationCategory: "Multimedia",
        operatingSystem: "All",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        "@id": `https://fetchwave.com/download/${config.slug}#faq`,
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
      </main>
      <Footer />
    </>
  );
}
