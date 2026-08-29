import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Scale, ShieldCheck, FileText, Clock, ArrowRight } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "en", namespace: "Terms" });
  const languages = { en: `https://www.downforge.me/terms`, "x-default": `https://www.downforge.me/terms` };
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `https://www.downforge.me/terms`, languages },
    robots: { index: false, follow: true, noarchive: true },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      type: "website",
      siteName: "DownForge",
      locale: "en_US",
      url: `https://www.downforge.me/terms`,
    },
  };
}

export default async function TermsPage() {
  const t = await getTranslations({ locale: "en", namespace: "Terms" });

  let sections: { id: string; title: string; body: string }[] = [];
  try {
    const raw = t.raw("sections") as unknown;
    if (Array.isArray(raw)) sections = raw as typeof sections;
  } catch {}
  if (sections.length === 0) {
    sections = [
      { id: "acceptance", title: "1. Acceptance of Terms", body: "By using DownForge you agree to these Terms." },
    ];
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("title"),
    description: t("metaDescription"),
    url: `https://www.downforge.me/terms`,
    dateModified: "2025-08-22",
    isPartOf: { "@type": "WebSite", name: "DownForge", url: "https://www.downforge.me" },
  };

  return (
    <NextIntlClientProvider messages={enMessages} locale="en">
<>
      <Nav />
      <main className="pt-16 sm:pt-20">
        {/* Hero */}
        <section className="bg-[#0d1f26] text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-24 -right-24 w-[460px] h-[460px] rounded-full bg-gradient-to-br from-[#5baab8]/20 to-transparent blur-[60px]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: `22px 22px` }} />
          </div>
          <div className="relative max-w-6xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-6 xl:px-6 py-8 sm:py-10 lg:py-12 xl:py-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1.5 mb-3 lg:mb-4">
              <Scale className="w-3.5 h-3.5 text-[#8fd3df]" />
              <span className="text-xs font-bold tracking-[0.14em] uppercase text-white/90">{t("badge")}</span>
            </div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-4xl xl:text-[2.75rem] font-black tracking-tight font-heading leading-[0.95]">{t("title")}</h1>
            <p className="mt-2 lg:mt-3 text-sm lg:text-[15px] xl:text-base text-white/60 max-w-2xl font-sans">{t("subtitle")}</p>
            <p className="mt-3 lg:mt-4 inline-flex items-center gap-2 text-xs font-medium text-white/50 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <Clock className="w-3 h-3" /> {t("lastUpdated")}
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-3 xs:px-4 sm:px-6 py-6 xs:py-8 sm:py-10 lg:py-10 xl:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)] gap-4 sm:gap-6 lg:gap-6 xl:gap-10 items-start">
            {/* TOC - sticky on desktop, horizontal scroll on mobile */}
            <aside className="lg:sticky lg:top-[72px] xl:top-20 self-start min-w-0">
              <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-border/60 dark:border-white/10 p-3 xs:p-4 xl:p-5 shadow-sm">
                <h2 className="text-xs font-bold tracking-[0.14em] uppercase text-muted-foreground font-mono flex items-center gap-2 mb-3">
                  <FileText className="w-3.5 h-3.5" /> {t("tocTitle")}
                </h2>
                <nav className="hidden lg:block space-y-1">
                  {sections.map((s) => (
                    <a key={s.id} href={`#${s.id}`} className="block text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl px-3 py-2 transition-colors font-sans">
                      {s.title}
                    </a>
                  ))}
                </nav>
                <div className="lg:hidden flex gap-2 overflow-x-auto overscroll-x-contain scrollbar-none pb-1">
                  {sections.map((s) => (
                    <a key={s.id} href={`#${s.id}`} className="shrink-0 text-xs font-semibold bg-muted border border-border rounded-full px-3 py-1.5 whitespace-nowrap hover:bg-white transition-colors">
                      {s.title.replace(/^\d+\.\s*/, "")}
                    </a>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl bg-[#eef6f8] dark:bg-[#5baab8]/10 border border-[#5baab8]/20 flex gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#5baab8] shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed break-words text-[#0d1f26]/70 dark:text-white/70 font-sans">
                    Questions? <Link href="/contact" className="font-bold underline">Contact us</Link> or email legal@downforge.me
                  </p>
                </div>
              </div>
            </aside>

            {/* Content */}
            <div className="min-w-0">
              <div className="rounded-2xl lg:rounded-[1.75rem] bg-white dark:bg-white/[0.04] border border-border/60 dark:border-white/10 shadow-sm overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-[#5baab8] via-[#0d1f26] to-[#5baab8]" />
                <div className="p-4 xs:p-6 sm:p-6 lg:p-7 xl:p-10">
                  <div className="max-w-none">
                    {sections.map((s) => (
                      <section key={s.id} id={s.id} className="scroll-mt-20 lg:scroll-mt-24 py-5 lg:py-6 first:pt-0 border-b border-border/50 last:border-0">
                        <h2 className="text-base xs:text-lg lg:text-lg xl:text-xl font-bold text-foreground !mb-2 lg:!mb-3 break-words">{s.title}</h2>
                        <p className="text-sm lg:text-sm xl:text-[15px] leading-relaxed text-muted-foreground !mt-0 break-words">{s.body}</p>
                      </section>
                    ))}
                  </div>
                  <div className="mt-6 lg:mt-8 flex flex-col xs:flex-row flex-wrap gap-2.5 lg:gap-3">
                    <Link href="/privacy" className="inline-flex items-center justify-center gap-2 text-sm font-semibold bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] px-5 py-2.5 rounded-full hover:bg-[#1a3545] dark:hover:bg-slate-100 transition-colors w-full xs:w-auto">
                      Privacy Policy <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href="/contact" className="inline-flex items-center justify-center gap-2 text-sm font-semibold bg-white dark:bg-white/10 border border-border dark:border-white/10 text-foreground px-5 py-2.5 rounded-full hover:bg-muted/50 transition-colors w-full xs:w-auto">
                      Contact support
                    </Link>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground text-center font-sans">This is a template and does not constitute legal advice. Consult counsel for your jurisdiction.</p>
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
