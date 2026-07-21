import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { VideoOnlyHero } from "@/components/youtube-video-downloader/VideoOnlyHero";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "YouTube Video Downloader — Download Videos in 4K & HD | DownForge",
    description: "Download YouTube videos in 4K, 1080p, and 720p. Free online video downloader. No account required.",
    alternates: {
      canonical: `https://downforge.me/${locale}/youtube-video-downloader`,
    },
  };
}

export default async function YoutubeVideoDownloaderPage({ params }: Props) {
  return (
    <>
      <Nav />
      <main>
        <VideoOnlyHero />
      </main>
      <Footer />
    </>
  );
}
