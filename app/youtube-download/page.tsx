import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { YoutubeHero } from "@/components/youtube-download/YoutubeHero";
import { RelatedTips } from "@/components/youtube-download/RelatedTips";
import { FaqSection } from "@/components/youtube-download/FaqSection";
import { PlatformToolFeatures } from "@/components/platform-download/PlatformToolFeatures";
import { PlatformHowItWorks } from "@/components/platform-download/PlatformHowItWorks";

export const metadata: Metadata = {
  title: "YouTube Video Downloader — Download YouTube Videos in 4K, MP3 & Thumbnails | fetchwave",
  description:
    "Free YouTube video downloader. Download YouTube videos in 4K, 1080p, 720p. Extract audio as MP3 320kbps, FLAC, AAC. Get HD thumbnails. No sign-up required. Fast, free & secure.",
  openGraph: {
    title: "YouTube Video Downloader — Download YouTube Videos in 4K, MP3 & Thumbnails | fetchwave",
    description:
      "Free YouTube video downloader. Download YouTube videos in 4K, 1080p, 720p. Extract audio as MP3 320kbps, FLAC, AAC. Get HD thumbnails. No sign-up required.",
    url: "https://fetchwave.com/youtube-download",
    siteName: "fetchwave",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Video Downloader — Download YouTube Videos in 4K, MP3 & Thumbnails",
    description:
      "Free YouTube video downloader. Download YouTube videos in 4K, 1080p, 720p. Extract audio as MP3, FLAC, AAC. No sign-up required.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://fetchwave.com/youtube-download",
  },
  keywords: [
    "youtube video downloader",
    "download youtube videos",
    "youtube to mp4",
    "youtube to mp3",
    "youtube 4k downloader",
    "free youtube downloader",
    "youtube video saver",
    "youtube thumbnail downloader",
    "youtube audio extractor",
    "youtube mp3 converter",
    "online youtube downloader",
    "youtube hd downloader",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": "https://fetchwave.com/youtube-download#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://fetchwave.com" },
        { "@type": "ListItem", position: 2, name: "YouTube Video Downloader", item: "https://fetchwave.com/youtube-download" },
      ],
    },
    {
      "@type": "WebApplication",
      "@id": "https://fetchwave.com/youtube-download#webapp",
      name: "fetchwave YouTube Video Downloader",
      url: "https://fetchwave.com/youtube-download",
      description:
        "Free online YouTube video downloader. Download videos up to 4K, extract audio as MP3/FLAC/AAC, save HD thumbnails. No registration required.",
      applicationCategory: "Multimedia",
      operatingSystem: "All",
      browserRequirements: "Requires JavaScript",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      "@id": "https://fetchwave.com/youtube-download#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is downloading YouTube videos legal?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Downloading videos for personal offline use is generally permitted. However, redistributing copyrighted content without permission may violate YouTube's Terms of Service. Always respect copyright and use downloaded content responsibly.",
          },
        },
        {
          "@type": "Question",
          name: "What video qualities are available?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "YouTube videos can be downloaded in multiple qualities including 4K (2160p), 1440p, 1080p (Full HD), 720p (HD), 480p, and 360p. The available qualities depend on what the original uploader provided.",
          },
        },
        {
          "@type": "Question",
          name: "What audio formats do you support?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We support MP3 (up to 320 kbps), AAC (256 kbps), FLAC (lossless), WAV (uncompressed), and OGG (192 kbps). For music production and archiving, FLAC is recommended.",
          },
        },
        {
          "@type": "Question",
          name: "Can I download YouTube thumbnails?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, you can download YouTube video thumbnails in maximum resolution. Available in JPG, PNG, and WebP formats at up to 1920x1080 resolution.",
          },
        },
        {
          "@type": "Question",
          name: "How long are downloaded files stored?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Files are stored temporarily and deleted automatically after the download is complete. We do not keep copies of your downloaded content. For Pro users, files remain available for 24 hours.",
          },
        },
      ],
    },
  ],
};

export default function YoutubeDownloadPage() {
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
      </main>
      <Footer />
    </>
  );
}
