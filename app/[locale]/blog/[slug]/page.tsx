import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/lib/i18n/navigation";
import { ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return [
    { slug: "how-to-download-youtube-4k" },
    { slug: "tiktok-without-watermark" },
    { slug: "flac-vs-mp3" },
    { slug: "batch-playlists" },
    { slug: "privacy-first" },
    { slug: "transcripts-ai" },
  ];
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
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
