import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { YoutubeHero } from "@/components/youtube-download/YoutubeHero";
import { RelatedTips } from "@/components/youtube-download/RelatedTips";
import { FaqSection } from "@/components/youtube-download/FaqSection";

export const metadata: Metadata = {
  title: "YouTube Video Downloader — fetchwave",
  description:
    "Download YouTube videos in 4K, 1080p, 720p. Extract audio as MP3, FLAC, AAC. Get thumbnails in HD. Fast, free, no sign-up required.",
  openGraph: {
    title: "YouTube Video Downloader — fetchwave",
    description:
      "Download YouTube videos in 4K, 1080p, 720p. Extract audio as MP3, FLAC, AAC. Get thumbnails in HD.",
  },
};

export default function YoutubeDownloadPage() {
  return (
    <>
      <Nav />
      <main>
        <YoutubeHero />
        <RelatedTips />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
