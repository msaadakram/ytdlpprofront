import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { YoutubeHero } from "@/components/youtube-download/YoutubeHero";
import { RelatedTips } from "@/components/youtube-download/RelatedTips";
import { FaqSection } from "@/components/youtube-download/FaqSection";
import { PlatformToolFeatures } from "@/components/platform-download/PlatformToolFeatures";
import { PlatformHowItWorks } from "@/components/platform-download/PlatformHowItWorks";
import { getYouTubeDownloadContent } from "@/lib/content/registry";
import { BlogContent } from "@/components/content/BlogContent";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "YouTube Video Downloader — Download YouTube Videos in 4K, MP3, Transcripts & Thumbnails | DownForge",
    description: "Free YouTube video downloader. Download YouTube videos in 4K, 1080p, 720p. Extract audio as MP3 320kbps, FLAC, AAC. Get AI transcripts as SRT, VTT, TXT or JSON. Get HD thumbnails. No sign-up required.",
    openGraph: {
      title: "YouTube Video Downloader — Download YouTube Videos in 4K, MP3, Transcripts & Thumbnails | DownForge",
      description: "Free YouTube video downloader. Download YouTube videos in 4K, 1080p, 720p. Extract audio as MP3 320kbps, FLAC, AAC. Get AI transcripts as SRT, VTT, TXT or JSON. No sign-up required.",
      url: `https://downforge.me/${locale}/youtube-download`,
      siteName: "DownForge",
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "YouTube Video Downloader — Download YouTube Videos in 4K, MP3, Transcripts & Thumbnails",
      description: "Free YouTube video downloader. Download YouTube videos in 4K, 1080p, 720p. Extract audio as MP3, FLAC, AAC. Get AI transcripts as SRT, VTT, TXT or JSON. No sign-up required.",
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: `https://downforge.me/${locale}/youtube-download`,
      languages: {
        en: "https://downforge.me/en/youtube-download",
        es: "https://downforge.me/es/youtube-download",
        fr: "https://downforge.me/fr/youtube-download",
        de: "https://downforge.me/de/youtube-download",
        pt: "https://downforge.me/pt/youtube-download",
        ja: "https://downforge.me/ja/youtube-download",
        ar: "https://downforge.me/ar/youtube-download",
        ru: "https://downforge.me/ru/youtube-download",
        zh: "https://downforge.me/zh/youtube-download",
      },
    },
    keywords: [
      "youtube video downloader", "download youtube videos", "youtube to mp4",
      "youtube to mp3", "youtube 4k downloader", "free youtube downloader",
      "youtube video saver", "youtube thumbnail downloader", "youtube audio extractor",
      "youtube mp3 converter", "youtube transcript downloader", "youtube subtitle downloader",
      "youtube srt download", "youtube ai transcript", "online youtube downloader",
      "youtube hd downloader",
    ],
  };
}

const faqs = [
  {
    q: "Is downloading YouTube videos legal?",
    a: "Downloading videos for personal offline use is generally permitted. However, redistributing copyrighted content without permission may violate YouTube's Terms of Service. Always respect copyright and use downloaded content responsibly.",
  },
  {
    q: "What video qualities are available?",
    a: "YouTube videos can be downloaded in multiple qualities including 4K (2160p), 1440p, 1080p (Full HD), 720p (HD), 480p, and 360p. The available qualities depend on what the original uploader provided.",
  },
  {
    q: "What audio formats do you support?",
    a: "We support MP3 (up to 320 kbps), AAC (256 kbps), FLAC (lossless), WAV (uncompressed), and OGG (192 kbps). For music production and archiving, FLAC is recommended.",
  },
  {
    q: "Can I download YouTube thumbnails?",
    a: "Yes, you can download YouTube video thumbnails in maximum resolution. Available in JPG, PNG, and WebP formats at up to 1920x1080 resolution.",
  },
  {
    q: "How long are downloaded files stored?",
    a: "Files are stored temporarily and deleted automatically after the download is complete. We do not keep copies of your downloaded content. For Pro users, files remain available for 24 hours.",
  },
  {
    q: "Can I download YouTube transcripts and subtitles?",
    a: "Yes, select the Transcript mode and choose from SRT, VTT, TXT, or JSON formats. Our AI generates accurate transcripts with timestamps from any video with audio.",
  },
];

export default async function YoutubeDownloadPage({ params }: Props) {
  const { locale } = await params;
  const content = getYouTubeDownloadContent("video");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "@id": `https://downforge.me/${locale}/youtube-download#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", position: 1, name: "Home", item: `https://downforge.me/${locale}` },
          { "@type": "ListItem", position: 2, name: "YouTube Video Downloader", item: `https://downforge.me/${locale}/youtube-download` },
        ],
      },
      {
        "@type": "WebApplication",
        "@id": `https://downforge.me/${locale}/youtube-download#webapp`,
        name: "DownForge YouTube Video Downloader",
        url: `https://downforge.me/${locale}/youtube-download`,
        description: "Free online YouTube video downloader. Download videos up to 4K, extract audio as MP3/FLAC/AAC, generate AI transcripts as SRT/VTT/TXT/JSON, save HD thumbnails. No registration required.",
        applicationCategory: "Multimedia",
        operatingSystem: "All",
        browserRequirements: "Requires JavaScript",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        "@id": `https://downforge.me/${locale}/youtube-download#faq`,
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
        <YoutubeHero />
        <PlatformToolFeatures platform="youtube" />
        <PlatformHowItWorks platform="youtube" />
        <RelatedTips />
        <FaqSection />
        {content && <BlogContent content={content} />}
      </main>
      <Footer />
    </>
  );
}
