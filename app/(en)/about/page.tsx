import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { ShieldCheck, Zap, Globe, Users, Clock, Star, Sparkles, ArrowRight, Award, Lock, Download } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "en", namespace: "About" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `https://www.downforge.me/about`, languages: { en: `https://www.downforge.me/about`, "x-default": `https://www.downforge.me/about` } },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      type: "website",
      siteName: "DownForge",
      locale: "en_US",
      url: `https://www.downforge.me/about`,
      images: [{ url: "/logo.png", width: 1254, height: 1254, alt: "About DownForge" }],
    },
    twitter: { card: "summary_large_image", title: t("metaTitle"), description: t("metaDescription"), images: ["/logo.png"] },
  };
}

export default async function AboutPage() {
  const t = await getTranslations({ locale: "en", namespace: "About" });

  const stats: { value: string; label: string; sub: string }[] = [
    { value: "200+", label: "Platforms supported", sub: "YouTube to niche sites" },
    { value: "< 3s", label: "Average processing", sub: "Server-side, CDN delivered" },
    { value: "4.9/5", label: "User rating", sub: "Trusted by creators" },
    { value: "Zero", label: "Logs kept", sub: "Ephemeral by design" },
  ];
  try {
    const raw = t.raw("stats") as unknown;
    if (Array.isArray(raw)) {
      // use translated stats if available
      (raw as typeof stats).forEach((s, i) => { if (stats[i]) stats[i] = s; });
    }
  } catch {}

  const timeline: { year: string; title: string; desc: string }[] = [
    { year: "2024", title: "Founded", desc: "Launched with YouTube + TikTok support" },
    { year: "2025", title: "200+ sites", desc: "Expanded to 14 major platforms, universal auto-detect" },
    { year: "Now", title: "Pro & API", desc: "Unlimited, 4K, batch, and developer API" },
  ];
  try {
    const rawTl = t.raw("timeline") as unknown;
    if (Array.isArray(rawTl)) (rawTl as typeof timeline).forEach((item, i) => { if (timeline[i]) timeline[i] = item as typeof timeline[0]; });
  } catch {}

  const values: { title: string; desc: string }[] = [
    { title: "Privacy first", desc: "We don’t store URLs or files. Ephemeral processing, auto-deleted in 60 minutes. No selling data. Ever." },
    { title: "Blazing fast", desc: "Server-side conversion with CDN streaming. Your download starts in under 3 seconds." },
    { title: "Any format, any quality", desc: "MP4, WebM, FLAC, PNG, SRT — from 144p to 4K and 320 kbps to lossless." },
  ];
  try {
    const rawVals = t.raw("values") as unknown;
    if (Array.isArray(rawVals)) (rawVals as typeof values).forEach((v, i) => { if (values[i]) values[i] = v as typeof values[0]; });
  } catch {}

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: t("metaTitle"),
    description: t("metaDescription"),
    url: `https://www.downforge.me/about`,
    inLanguage: "en",
    isPartOf: { "@type": "WebSite", name: "DownForge", url: "https://www.downforge.me" },
    about: { "@type": "Organization", name: "DownForge", url: "https://www.downforge.me", logo: "https://www.downforge.me/logo.png", foundingDate: "2024" },
  };

  return (
    <NextIntlClientProvider messages={enMessages} locale="en">
<>
      <Nav />
      <main className="pt-16 sm:pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#0d1f26] text-white">
          <div className="absolute inset-0">
            <div className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-[#5baab8]/25 via-[#3d8896]/15 to-transparent blur-[70px]" />
            <div className="absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full bg-gradient-to-tr from-[#0ea5b0]/20 via-[#5baab8]/10 to-transparent blur-[60px]" />
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: `24px 24px` }} />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-md px-3 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-[0.14em] uppercase text-white/90">{t("badge")}</span>
            </div>
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-[3.25rem] font-black tracking-[-0.03em] leading-[0.95] font-heading max-w-3xl">
              {t("title")} <span className="bg-gradient-to-r from-[#5baab8] to-[#8fd3df] bg-clip-text text-transparent">{t("titleAccent")}</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-relaxed text-white/65 max-w-2xl font-sans">{t("subtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-[#0d1f26] px-6 py-3 rounded-full text-sm font-bold hover:bg-slate-100 transition-colors shadow-lg">
                {t("ctaButton")} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/pricing" className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/15 transition-colors backdrop-blur">
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl sm:rounded-[1.5rem] bg-white border border-border/60 shadow-[0_8px_32px_-12px_rgba(13,31,38,0.12)] p-4 sm:p-6">
                <div className="text-2xl sm:text-3xl font-black tracking-tight text-[#0d1f26] font-heading">{s.value}</div>
                <div className="text-sm font-bold text-foreground mt-1 font-sans">{s.label}</div>
                <div className="text-xs text-muted-foreground font-sans">{s.sub}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-3">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-[#5baab8] bg-[#eef6f8] border border-[#5baab8]/20 px-3 py-1 rounded-full mb-4">
                <Sparkles className="w-3 h-3" /> {t("storyBadge")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground font-heading">{t("storyTitle")}</h2>
              <div className="mt-4 space-y-4 text-sm sm:text-[15px] leading-relaxed text-muted-foreground font-sans">
                <p>{t("storyP1")}</p>
                <p>{t("storyP2")}</p>
                <p>{t("storyP3")}</p>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="rounded-[1.75rem] bg-[#0d1f26] text-white p-6 sm:p-7 border border-white/5 shadow-xl">
                <h3 className="text-sm font-bold tracking-wide font-heading flex items-center gap-2"><Award className="w-4 h-4 text-[#5baab8]" /> {t("milestonesTitle")}</h3>
                <div className="mt-6 space-y-5 relative">
                  <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10" />
                  {timeline.map((item) => (
                    <div key={item.year} className="relative flex gap-4">
                      <span className="w-6 h-6 rounded-full bg-[#5baab8] border-4 border-[#0d1f26] flex items-center justify-center shrink-0 mt-0.5 shadow" />
                      <div>
                        <div className="text-xs font-bold tracking-widest uppercase text-[#5baab8] font-mono">{item.year}</div>
                        <div className="text-sm font-bold text-white font-sans">{item.title}</div>
                        <div className="text-xs text-white/60 font-sans">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="bg-slate-50 dark:bg-white/[0.02] border-y border-border/50 py-12 sm:py-16 lg:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl">
              <span className="inline-flex text-[11px] font-bold tracking-[0.14em] uppercase text-[#5baab8] bg-white border border-[#5baab8]/20 px-3 py-1 rounded-full">{t("valuesBadge")}</span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-foreground font-heading">{t("valuesTitle")}</h2>
            </div>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[
                { icon: Lock, ...values[0] },
                { icon: Zap, ...values[1] },
                { icon: Globe, ...values[2] },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-[1.5rem] bg-white dark:bg-white/[0.04] border border-border/60 dark:border-white/10 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <span className="w-10 h-10 rounded-xl bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] flex items-center justify-center shadow-sm">
                    <Icon className="w-5 h-5" />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-foreground font-heading">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-sans">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="rounded-[1.75rem] sm:rounded-[2rem] bg-[#0d1f26] text-white p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8 border border-white/5 shadow-[0_24px_64px_-16px_rgba(13,31,38,0.4)] overflow-hidden relative">
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-gradient-to-br from-[#5baab8]/20 to-transparent blur-[40px]" />
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight font-heading">{t("ctaTitle")}</h3>
              <p className="mt-2 text-sm sm:text-base text-white/60 font-sans">{t("ctaSubtitle")}</p>
            </div>
            <div className="flex flex-wrap gap-3 relative">
              <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-[#0d1f26] px-6 py-3 rounded-full text-sm font-bold hover:bg-slate-100 transition-colors shadow-lg">
                {t("ctaButton")} <Download className="w-4 h-4" />
              </Link>
              <Link href="/pricing" className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-white/15 transition-colors">
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
    </NextIntlClientProvider>
  );
}
