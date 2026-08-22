import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/lib/i18n/navigation";
import { Clock, ArrowRight, BookOpen, Tag } from "lucide-react";
import { routing } from "@/lib/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `https://downforge.me/${l}/blog`]));
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `https://downforge.me/${locale}/blog`, languages },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), type: "website", siteName: "DownForge", locale },
  };
}

const posts = [
  { slug: "how-to-download-youtube-4k", title: "How to Download YouTube Videos in 4K — Complete Guide", excerpt: "Learn the best formats, quality settings, and tips for saving YouTube masters in 4K without losing audio.", date: "2025-08-10", category: "Guide", read: "5 min" },
  { slug: "tiktok-without-watermark", title: "TikTok Without Watermark: What Creators Should Know", excerpt: "Why watermark-free matters for reposts and how DownForge preserves original quality.", date: "2025-08-02", category: "Platform", read: "4 min" },
  { slug: "flac-vs-mp3", title: "FLAC vs MP3: Which Audio Format Should You Choose?", excerpt: "We compare lossless FLAC and 320kbps MP3 for archiving vs everyday listening.", date: "2025-07-22", category: "Audio", read: "6 min" },
  { slug: "batch-playlists", title: "Batch Download Playlists in One Click (Pro)", excerpt: "Save entire playlists or channels without pasting each URL — a Pro walkthrough.", date: "2025-07-12", category: "Pro", read: "3 min" },
  { slug: "privacy-first", title: "Privacy First: Why We Delete Files in 60 Minutes", excerpt: "Our ephemeral design, what we log, and what we never store.", date: "2025-06-28", category: "Privacy", read: "4 min" },
  { slug: "transcripts-ai", title: "From Video to Transcript: SRT, VTT, and AI Captions", excerpt: "Generate accurate transcripts with timestamps for any video — SRT vs VTT vs JSON.", date: "2025-06-18", category: "Transcript", read: "5 min" },
];

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: t("title"),
    description: t("subtitle"),
    url: `https://downforge.me/${locale}/blog`,
  };

  return (
    <>
      <Nav />
      <main className="pt-16 sm:pt-20">
        <section className="bg-[#0d1f26] text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-[#5baab8]/20 to-transparent blur-[70px]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: `22px 22px` }} />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-xs font-bold tracking-[0.14em] uppercase text-white/90 backdrop-blur">
              <BookOpen className="w-3.5 h-3.5 text-[#8fd3df]" /> {t("badge")}
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] font-black tracking-tight font-heading">{t("title")}</h1>
            <p className="mt-3 text-sm sm:text-base text-white/60 max-w-2xl mx-auto font-sans">{t("subtitle")}</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {posts.map((p) => (
              <article key={p.slug} className="rounded-[1.5rem] bg-white dark:bg-white/[0.04] border border-border/60 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                <div className="h-40 bg-gradient-to-br from-[#eef6f8] to-[#d9eef2] dark:from-[#0d1f26] dark:to-[#123040] relative overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `linear-gradient(to right,#0d1f26 1px,transparent 1px), linear-gradient(to bottom,#0d1f26 1px,transparent 1px)`, backgroundSize: `20px 20px` }} />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-white dark:bg-white text-[#0d1f26] px-2.5 py-1 rounded-full text-xs font-bold shadow">
                    <Tag className="w-3 h-3" /> {p.category}
                  </span>
                  <span className="absolute bottom-3 right-3 bg-[#0d1f26] text-white px-2.5 py-1 rounded-full text-xs font-semibold">{p.read}</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                    <Clock className="w-3 h-3" /> {p.date}
                  </div>
                  <h3 className="mt-2 text-base font-bold text-foreground font-heading leading-snug line-clamp-2">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-sans line-clamp-3 flex-1">{p.excerpt}</p>
                  <Link href={`/blog/${p.slug}` as any} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-[#0d1f26] dark:text-white hover:text-[#5baab8] dark:hover:text-[#8fd3df] transition-colors">
                    {t("readMore")} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground font-sans">{t("empty")}</p>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
