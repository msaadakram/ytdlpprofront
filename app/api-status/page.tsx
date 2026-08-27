import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en.json";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { StatusClient } from "@/components/status/StatusClient";
import { AlertTriangle } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations({ locale: "en", namespace: "ApiStatus" });
  const languages = { en: `https://www.downforge.me/api-status`, "x-default": `https://www.downforge.me/api-status` };
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `https://www.downforge.me/api-status`, languages },
    openGraph: { title: t("metaTitle"), description: t("metaDescription"), type: "website", siteName: "DownForge", locale: "en_US", url: `https://www.downforge.me/api-status` },
  };
}

const incidents = [
  { date: "2025-08-18", title: "Brief latency spike on /info", status: "Resolved", color: "bg-amber-500" },
  { date: "2025-07-30", title: "YouTube extractor updated — no downtime", status: "Completed", color: "bg-emerald-500" },
  { date: "2025-07-12", title: "Scheduled maintenance — 2 min", status: "Completed", color: "bg-slate-400" },
];

export default async function ApiStatusPage() {
  const t = await getTranslations({ locale: "en", namespace: "ApiStatus" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("title"),
    description: t("subtitle"),
    url: `https://www.downforge.me/api-status`,
  };

  return (
    <NextIntlClientProvider messages={enMessages} locale="en">
<>
      <Nav />
      <main className="pt-16 sm:pt-20">
        <section className="bg-[#0d1f26] text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-emerald-500/15 via-[#5baab8]/10 to-transparent blur-[70px]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: `22px 22px` }} />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 text-xs font-bold tracking-[0.14em] uppercase text-emerald-300 backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> {t("badge")}
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] font-black tracking-tight font-heading">{t("title")}</h1>
            <p className="mt-3 text-sm sm:text-base text-white/60 max-w-2xl font-sans">{t("subtitle")}</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
          <StatusClient />

          <div className="mt-8 rounded-2xl bg-white dark:bg-white/[0.04] border border-border/60 dark:border-white/10 p-5 sm:p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground font-heading flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> {t("incidents")}
            </h3>
            <div className="mt-4 space-y-3">
              {incidents.map((inc) => (
                <div key={inc.date} className="flex gap-3 p-3 rounded-xl bg-muted/40 dark:bg-white/[0.03] border border-border/40 dark:border-white/5">
                  <span className={`w-2 h-2 rounded-full ${inc.color} mt-2 shrink-0`} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-foreground font-sans">{inc.title}</div>
                    <div className="text-xs text-muted-foreground font-mono">{inc.date} • {inc.status}</div>
                  </div>
                  <span className="hidden sm:inline-flex text-xs font-bold bg-white dark:bg-white/10 border border-border dark:border-white/10 px-2 py-1 rounded-full self-start">{inc.status}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground font-sans">{t("noIncidents")}</p>
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
    </NextIntlClientProvider>
  );
}
