import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Clock, Tag, Sparkles, Wrench, Bug } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "en", namespace: "Changelog" });
  const languages = { en: `https://www.downforge.me/changelog`, "x-default": `https://www.downforge.me/changelog` };
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `https://www.downforge.me/changelog`, languages },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), type: "website", siteName: "DownForge", locale: "en_US", url: `https://www.downforge.me/changelog` },
  };
}

const entries = [
  { version: "2.1.0", date: "2025-08-22", type: "Major", color: "bg-[#0d1f26] text-white", icon: Sparkles, changes: ["Added About, Terms, Contact, Features, Blog, Changelog, API Status pages", "Moved Pricing/API into Other dropdown with hover", "White logo background, flag language selector"] },
  { version: "2.0.0", date: "2025-08-15", type: "Major", color: "bg-[#5baab8] text-white", icon: Sparkles, changes: ["Google Sign-In with account linking and avatar", "Modern glass Auth with strength meter", "Floating glass navbar with laptop fixes"] },
  { version: "1.9.2", date: "2025-07-28", type: "Fix", color: "bg-amber-500 text-white", icon: Bug, changes: ["Fixed ffmpeg path resolution for Heroku", "Improved transcription language detection"] },
  { version: "1.9.0", date: "2025-07-12", type: "Major", color: "bg-emerald-500 text-white", icon: Wrench, changes: ["Universal auto-detect for all platforms", "Batch playlist support for Pro"] },
];

export default async function ChangelogPage() {
  const t = await getTranslations({ locale: "en", namespace: "Changelog" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("title"),
    url: `https://www.downforge.me/changelog`,
  };

  return (
    <NextIntlClientProvider messages={enMessages} locale="en">
<>
      <Nav />
      <main className="pt-16 sm:pt-20">
        <section className="bg-[#0d1f26] text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-[#5baab8]/20 to-transparent blur-[70px]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: `22px 22px` }} />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-xs font-bold tracking-[0.14em] uppercase text-white/90">
              <Clock className="w-3.5 h-3.5 text-[#8fd3df]" /> {t("badge")}
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] font-black tracking-tight font-heading">{t("title")}</h1>
            <p className="mt-3 text-sm sm:text-base text-white/60 max-w-2xl mx-auto font-sans">{t("subtitle")}</p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {[
              { key: "filterAll", label: t("filterAll"), count: entries.length },
              { key: "filterMajor", label: t("filterMajor"), count: entries.filter((e) => e.type === "Major").length },
              { key: "filterFix", label: t("filterFix"), count: entries.filter((e) => e.type === "Fix").length },
            ].map((f) => (
              <span key={f.key} className="inline-flex items-center gap-1.5 bg-white dark:bg-white/[0.04] border border-border/60 dark:border-white/10 rounded-full px-3 py-1.5 text-xs font-bold">
                {f.label} <span className="bg-muted dark:bg-white/10 rounded-full px-1.5 py-0.5 text-[11px]">{f.count}</span>
              </span>
            ))}
          </div>

          <div className="relative">
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-border/60 dark:bg-white/10 hidden sm:block" />
            <div className="space-y-6">
              {entries.map((e) => {
                const Icon = e.icon;
                return (
                  <div key={e.version} className="relative flex gap-4 sm:gap-6">
                    <span className={`hidden sm:flex w-12 h-12 rounded-full ${e.color} items-center justify-center shrink-0 shadow-md border-4 border-white dark:border-[#0a1218]`}>
                      <Icon className="w-5 h-5" />
                    </span>
                    <div className="flex-1 rounded-2xl bg-white dark:bg-white/[0.04] border border-border/60 dark:border-white/10 p-5 sm:p-6 shadow-sm">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-sm font-black font-mono bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] px-2.5 py-1 rounded-full">{e.version}</span>
                        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {e.date}
                        </span>
                        <span className={`text-xs font-bold tracking-wide uppercase px-2 py-1 rounded-full border ${e.type === "Major" ? "bg-[#eef6f8] border-[#5baab8]/20 text-[#0d1f26] dark:bg-[#5baab8]/15 dark:text-[#8fd3df]" : "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300"}`}>
                          <Tag className="w-3 h-3 inline mr-1" /> {e.type}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {e.changes.map((c) => (
                          <li key={c} className="flex gap-2 text-sm text-foreground font-sans">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#5baab8] mt-2 shrink-0" />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
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
