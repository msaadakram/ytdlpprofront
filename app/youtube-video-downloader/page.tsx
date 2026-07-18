import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { VideoOnlyHero } from "@/components/youtube-video-downloader/VideoOnlyHero";
import { VideoFeatures } from "@/components/youtube-video-downloader/VideoFeatures";
import { VideoFaq } from "@/components/youtube-video-downloader/VideoFaq";
import { getYouTubeVideoContent } from "@/lib/content/registry";
import { BlogContent } from "@/components/content/BlogContent";

export const metadata: Metadata = {
  title: "YouTube Video Downloader — Download 4K, 1080p, 720p MP4 Videos | DownForge",
  description:
    "Free YouTube video downloader. Download YouTube videos in 4K, 1080p, 720p MP4. Choose from 4K Ultra HD, Full HD, HD, WebM, or MKV formats. Fast, secure, no sign-up required.",
  openGraph: {
    title: "YouTube Video Downloader — Download 4K, 1080p, 720p MP4 Videos | DownForge",
    description:
      "Free YouTube video downloader. Download YouTube videos in 4K, 1080p, 720p MP4. Choose from 4K Ultra HD, Full HD, HD, WebM, or MKV formats. No sign-up required.",
    url: "https://downforge.me/youtube-video-downloader",
    siteName: "DownForge",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YouTube Video Downloader — Download 4K, 1080p, 720p MP4 Videos",
    description:
      "Free YouTube video downloader. Download YouTube videos in 4K, 1080p, 720p MP4. Choose from 4K Ultra HD, Full HD, HD, WebM, or MKV formats. No sign-up required.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://downforge.me/youtube-video-downloader",
  },
  keywords: [
    "youtube video downloader",
    "download youtube videos",
    "youtube to mp4",
    "youtube 4k downloader",
    "youtube 1080p downloader",
    "youtube 720p downloader",
    "free youtube downloader",
    "youtube video saver",
    "youtube mp4 converter",
    "online youtube downloader",
    "youtube hd downloader",
    "youtube 4k video download",
    "youtube webm download",
    "youtube mkv download",
    "youtube video quality",
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": "https://downforge.me/youtube-video-downloader#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://downforge.me" },
        { "@type": "ListItem", position: 2, name: "YouTube Video Downloader", item: "https://downforge.me/youtube-video-downloader" },
      ],
    },
    {
      "@type": "WebApplication",
      "@id": "https://downforge.me/youtube-video-downloader#webapp",
      name: "DownForge YouTube Video Downloader",
      url: "https://downforge.me/youtube-video-downloader",
      description:
        "Free online YouTube video downloader. Download videos in 4K, 1080p, 720p MP4, WebM, and MKV formats. No registration required.",
      applicationCategory: "Multimedia",
      operatingSystem: "All",
      browserRequirements: "Requires JavaScript",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      "@id": "https://downforge.me/youtube-video-downloader#faq",
      mainEntity: [
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
          name: "Can I download 4K YouTube videos?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, you can download YouTube videos in full 4K Ultra HD resolution (2160p). 4K downloads require a Pro subscription. The video will be saved in MP4 format with H.264 or H.265 codec.",
          },
        },
        {
          "@type": "Question",
          name: "What video formats do you support?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "We support MP4, WebM, and MKV formats. MP4 is the most compatible format. WebM offers efficient compression. MKV supports advanced features and multiple codecs.",
          },
        },
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
          name: "Do I need an account to download?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No account or sign-up is required. Simply paste the YouTube video URL, choose your preferred quality, and download. A Pro subscription unlocks 4K downloads and additional features.",
          },
        },
      ],
    },
  ],
};

export default function YoutubeVideoDownloaderPage() {
  const content = getYouTubeVideoContent("video");

  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <VideoOnlyHero />
        <VideoFeatures />
        <VideoFaq />
        {content && <BlogContent content={content} />}
      </main>
      <Footer />
    </>
  );
}
