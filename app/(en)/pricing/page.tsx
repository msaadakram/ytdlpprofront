import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PricingSection } from "@/components/home/PricingSection";
import { PricingFaq } from "@/components/pricing/PricingFaq";
import Link from "next/link";
import { Sparkles, ShieldCheck, Zap, Clock, ArrowRight } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "en", namespace: "Pricing" });
  const languages = { en: `https://www.downforge.me/pricing`, "x-default": `https://www.downforge.me/pricing` };
  return {
    title: `${t("title")} — DownForge`,
    description: t("subtitle"),
    alternates: { canonical: `https://www.downforge.me/pricing`, languages },
    openGraph: {
      title: `${t("title")} — DownForge`,
      description: t("subtitle"),
      type: "website",
      siteName: "DownForge",
      locale: "en_US",
      url: `https://www.downforge.me/pricing`,
    },
  };
}

export default async function PricingPage() {
  const t = await getTranslations({ locale: "en", namespace: "Pricing" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("title"),
    description: t("subtitle"),
    url: `https://www.downforge.me/pricing`,
    isPartOf: { "@type": "WebSite", name: "DownForge", url: "https://www.downforge.me" },
  };

  return (
    <NextIntlClientProvider messages={enMessages} locale="en">
<>
      <Nav />
      <main className="pt-16 sm:pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#0d1f26] text-white">
          <div className="absolute inset-0">
            <div className="absolute -top-28 -right-28 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-[#5baab8]/20 via-[#3d8896]/10 to-transparent blur-[70px]" />
            <div className="absolute -bottom-24 -left-24 w-[460px] h-[460px] rounded-full bg-gradient-to-tr from-[#0ea5b0]/15 to-transparent blur-[60px]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: `22px 22px` }} />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 lg:py-16 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-xs font-bold tracking-[0.14em] uppercase text-white/90 backdrop-blur">
              <Sparkles className="w-3.5 h-3.5 text-[#8fd3df]" /> {t("title")}
            </span>
            <h1 className="mt-4 text-3xl xs:text-4xl sm:text-5xl lg:text-[2.75rem] font-black tracking-tight font-heading leading-[0.95]">
              {t("heroTitle")} <span className="bg-gradient-to-r from-[#5baab8] to-[#8fd3df] bg-clip-text text-transparent">{t("heroTitleAccent")}</span>
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg leading-relaxed text-white/60 max-w-2xl mx-auto font-sans">
              {t("subtitle")}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs font-medium">
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-white/80">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {t("trustNoCard")}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-white/80">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> {t("trustCancel")}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-white/80">
                <Clock className="w-3.5 h-3.5 text-[#8fd3df]" /> {t("trustRefund")}
              </span>
            </div>
          </div>
        </section>

        <div className="bg-gradient-to-b from-[#0d1f26] via-[#0d1f26] to-[#f8fafc] dark:to-[#070d12] h-6 sm:h-8" />

        <PricingSection />

        {/* Comparison strip */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 mt-6 lg:mt-8">
          <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-border/60 dark:border-white/10 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="text-sm font-sans">
              <div className="font-bold text-foreground">{t("notSureTitle")}</div>
              <div className="text-muted-foreground">{t("notSureDesc")}</div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Link href="/sign-up" className="inline-flex items-center gap-2 bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] px-5 py-2.5 rounded-full text-sm font-bold hover:bg-[#1a3545] dark:hover:bg-slate-100 transition-colors">
                {t("ctaStartFree")} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 bg-white dark:bg-white/10 border border-border dark:border-white/10 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-muted/50 transition-colors">
                {t("ctaTalkToUs")}
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ modern accordion */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 mt-10 sm:mt-12 lg:mt-16 pb-12 sm:pb-16 lg:pb-20">
          <div className="text-center mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-[#5baab8] bg-[#eef6f8] border border-[#5baab8]/20 px-3 py-1 rounded-full font-mono">
              FAQ
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black tracking-tight text-foreground font-heading">{t("faqTitle")}</h2>
          </div>
          <PricingFaq />
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
    </NextIntlClientProvider>
  );
}
