import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Sparkles, ShieldCheck, Zap, Globe, MonitorPlay, Clock, Star, ArrowRight } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "en", namespace: "Features" });
  const languages = { en: `https://www.downforge.me/features`, "x-default": `https://www.downforge.me/features` };
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `https://www.downforge.me/features`, languages },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), type: "website", siteName: "DownForge", locale: "en_US", url: `https://www.downforge.me/features` },
  };
}

const features = [
  { icon: Globe, titleKey: "platforms", descKey: "platforms" },
  { icon: Zap, titleKey: "speed", descKey: "speed" },
  { icon: ShieldCheck, titleKey: "security", descKey: "security" },
  { icon: MonitorPlay, titleKey: "quality", descKey: "quality" },
  { icon: Clock, titleKey: "queue", descKey: "queue" },
  { icon: Star, titleKey: "batch", descKey: "batch" },
];

export default async function FeaturesPage() {
  const t = await getTranslations({ locale: "en", namespace: "Features" });
  const th = await getTranslations({ locale: "en", namespace: "HomePage.features" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("title"),
    description: t("subtitle"),
    url: `https://www.downforge.me/features`,
    isPartOf: { "@type": "WebSite", name: "DownForge", url: "https://www.downforge.me" },
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
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 lg:py-16 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1.5 text-xs font-bold tracking-[0.14em] uppercase text-white/90 backdrop-blur">
              <Sparkles className="w-3.5 h-3.5 text-[#8fd3df]" /> {t("badge")}
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] font-black tracking-tight font-heading leading-[0.95]">
              {t("title")} <span className="bg-gradient-to-r from-[#5baab8] to-[#8fd3df] bg-clip-text text-transparent">{t("titleAccent")}</span>
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-white/60 max-w-2xl mx-auto font-sans">{t("subtitle")}</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map(({ icon: Icon, titleKey, descKey }) => (
              <div key={titleKey} className="rounded-[1.5rem] sm:rounded-[1.75rem] bg-white dark:bg-white/[0.04] border border-border/60 dark:border-white/10 p-6 shadow-sm hover:shadow-md transition-shadow">
                <span className="w-10 h-10 rounded-xl bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-foreground font-heading">{th(`${titleKey}.title`)}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground font-sans">{th(`${titleKey}.desc`)}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 sm:mt-14 rounded-[1.75rem] bg-[#0d1f26] text-white p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 border border-white/5">
            <div>
              <h3 className="text-xl sm:text-2xl font-black font-heading">{t("ctaTitle")}</h3>
              <p className="mt-2 text-sm text-white/60 font-sans">{t("ctaSubtitle")}</p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link href="/sign-up" className="inline-flex items-center gap-2 bg-white text-[#0d1f26] px-6 py-3 rounded-full text-sm font-bold hover:bg-slate-100 transition-colors">
                {t("ctaButton")} <ArrowRight className="w-4 h-4" />
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
