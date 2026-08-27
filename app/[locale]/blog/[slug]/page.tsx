import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/lib/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";

const slugs = [
  "how-to-download-youtube-4k",
  "tiktok-without-watermark",
  "flac-vs-mp3",
  "batch-playlists",
  "privacy-first",
  "transcripts-ai",
] as const;

export function generateStaticParams() {
  return slugs.map((slug) => ({ locale: "en", slug }));
}

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== "en") {
    return {
      alternates: { canonical: `https://www.downforge.me/en/blog/${slug}` },
      robots: { index: false, follow: false },
    };
  }
  const title = slug.replace(/-/g, " ");
  return {
    title: `${title} — DownForge Blog`,
    description: `DownForge blog: ${title}`,
    alternates: {
      canonical: `https://www.downforge.me/en/blog/${slug}`,
      languages: { en: `https://www.downforge.me/en/blog/${slug}`, "x-default": `https://www.downforge.me/en/blog/${slug}` },
    },
    openGraph: {
      title: `${title} — DownForge Blog`,
      description: `DownForge blog: ${title}`,
      type: "article",
      siteName: "DownForge",
      locale: "en_US",
      url: `https://www.downforge.me/en/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  if (locale !== "en") redirect(`/en/blog/${slug}`);
  return (
    <>
      <Nav />
      <main className="pt-20 sm:pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to blog
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black font-heading capitalize">{slug.replace(/-/g, " ")}</h1>
          <p className="mt-4 text-muted-foreground font-sans">Full article coming soon. This is a placeholder for the blog post.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
