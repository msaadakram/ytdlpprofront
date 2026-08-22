import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/contact/ContactForm";
import { Mail, ShieldCheck, Clock, MessageCircle, HelpCircle, ArrowRight } from "lucide-react";
import { routing } from "@/lib/i18n/routing";
import { Link } from "@/lib/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `https://downforge.me/${l}/contact`]));
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `https://downforge.me/${locale}/contact`, languages },
    openGraph: {
      title: t("metaTitle"),
      description: t("metaDescription"),
      type: "website",
      siteName: "DownForge",
      locale,
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });

  let faqs: { q: string; a: string }[] = [];
  try {
    const raw = t.raw("faqs") as unknown;
    if (Array.isArray(raw)) faqs = raw as typeof faqs;
  } catch {}

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: t("title"),
    description: t("metaDescription"),
    url: `https://downforge.me/${locale}/contact`,
    isPartOf: { "@type": "WebSite", name: "DownForge", url: "https://downforge.me" },
    mainEntity: {
      "@type": "Organization",
      name: "DownForge",
      url: "https://downforge.me",
      contactPoint: [
        { "@type": "ContactPoint", contactType: "customer support", email: "support@downforge.me", availableLanguage: routing.locales },
        { "@type": "ContactPoint", contactType: "legal", email: "legal@downforge.me" },
      ],
    },
  };

  return (
    <>
      <Nav />
      <main className="pt-16 sm:pt-20">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#f8fafc] via-white to-white dark:from-[#070d12] dark:via-[#0a1218] dark:to-[#070d12] border-b border-border/40">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-80px] right-[-80px] w-[520px] h-[520px] rounded-full bg-gradient-to-br from-[#5baab8]/15 to-transparent blur-[60px]" />
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: `linear-gradient(to right,#0d1f26 1px,transparent 1px), linear-gradient(to bottom,#0d1f26 1px,transparent 1px)`, backgroundSize: `28px 28px` }} />
          </div>
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] px-3 py-1.5 text-xs font-bold tracking-[0.14em] uppercase">
              <MessageCircle className="w-3.5 h-3.5" /> {t("badge")}
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-[2.75rem] font-black tracking-tight font-heading text-foreground">{t("title")}</h1>
            <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl font-sans">{t("subtitle")}</p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:py-12">
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-start">
            {/* Form - 3 cols */}
            <div className="lg:col-span-3">
              <div className="rounded-[1.75rem] bg-white dark:bg-white/[0.04] border border-border/60 dark:border-white/10 shadow-[0_12px_32px_-12px_rgba(13,31,38,0.12)] overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-[#5baab8] via-[#0d1f26] to-[#5baab8]" />
                <div className="p-6 sm:p-8">
                  <h2 className="text-lg font-bold text-foreground font-heading flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] flex items-center justify-center">
                      <MessageCircle className="w-4 h-4" />
                    </span>
                    {t("formTitle")}
                  </h2>
                  <div className="mt-6">
                    <ContactForm />
                  </div>
                </div>
              </div>
            </div>

            {/* Info - 2 cols */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-5">
              <div className="rounded-2xl bg-[#0d1f26] text-white p-6 border border-white/5 shadow-xl">
                <h3 className="text-sm font-bold tracking-wide font-heading flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#5baab8]" /> {t("infoTitle")}
                </h3>
                <div className="mt-5 space-y-4">
                  <div className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="w-9 h-9 rounded-xl bg-white text-[#0d1f26] flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold font-sans">{t("infoEmail")}</div>
                      <div className="text-xs text-white/60 font-sans break-all">{t("infoEmail")}</div>
                      <div className="text-xs text-white/40 font-sans">{t("infoEmailSub")}</div>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <span className="w-9 h-9 rounded-xl bg-[#5baab8] text-white flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-bold font-sans">{t("infoLegal")}</div>
                      <div className="text-xs text-white/60 font-sans">{t("infoLegal")}</div>
                      <div className="text-xs text-white/40 font-sans">{t("infoLegalSub")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-white/60 bg-white/5 border border-white/10 rounded-full px-3 py-2 justify-center">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" /> {t("infoResponse")}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-border/60 dark:border-white/10 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-foreground font-heading flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-[#5baab8]" /> {t("faqTitle")}
                </h3>
                <div className="mt-4 space-y-4">
                  {faqs.map((f) => (
                    <div key={f.q} className="pb-4 border-b border-border/50 last:border-0 last:pb-0">
                      <div className="text-sm font-semibold text-foreground font-sans">{f.q}</div>
                      <div className="text-xs leading-relaxed text-muted-foreground mt-1 font-sans">{f.a}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href="/privacy" className="text-xs font-semibold text-[#5baab8] hover:text-foreground underline underline-offset-2">
                    Privacy
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="/terms" className="text-xs font-semibold text-[#5baab8] hover:text-foreground underline underline-offset-2">
                    Terms
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link href="/api-docs" className="text-xs font-semibold text-[#5baab8] hover:text-foreground underline underline-offset-2">
                    API Docs <ArrowRight className="w-3 h-3 inline" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
