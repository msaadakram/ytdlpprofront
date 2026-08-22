import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/lib/i18n/navigation";
import { ShieldCheck, Lock, FileText, Clock, Eye, Cookie, UserCheck, ArrowRight } from "lucide-react";
import { routing } from "@/lib/i18n/routing";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy" });
  const languages = Object.fromEntries(routing.locales.map((l) => [l, `https://www.downforge.me/${l}/privacy`]));
  return {
    title: `${t("title")} — DownForge`,
    description: "DownForge privacy policy. Learn how we handle your data, what we collect, and your rights.",
    alternates: { canonical: `https://www.downforge.me/${locale}/privacy`, languages },
    openGraph: {
      title: `${t("title")} — DownForge`,
      description: "How DownForge handles your data. Ephemeral processing, no logs, your rights.",
      type: "website",
      siteName: "DownForge",
      locale,
    },
  };
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Privacy" });

  const sections = [
    { id: "collect", title: t("section1Title", { defaultValue: "1. Information We Collect" }), body: t("section1Body", { defaultValue: "We collect only the information necessary to provide our service: the URLs you submit for download, your IP address for rate limiting, and account information (email, name) if you create an account. We do not collect or store the actual content of your downloads beyond the processing period." }), icon: FileText },
    { id: "use", title: t("section2Title", { defaultValue: "2. How We Use Your Data" }), body: t("section2Body", { defaultValue: "URLs are used solely to process your download request and are deleted from our servers immediately after processing. Account information is used for authentication, billing, and communication about your account. We do not sell, trade, or share your personal data with third parties." }), icon: Eye },
    { id: "security", title: t("section3Title", { defaultValue: "3. Data Security" }), body: t("section3Body", { defaultValue: "We implement industry-standard security measures including encryption in transit (TLS), secure API authentication, and regular security audits. Downloaded files are stored temporarily in isolated storage and automatically purged." }), icon: Lock },
    { id: "cookies", title: t("section4Title", { defaultValue: "4. Cookies" }), body: t("section4Body", { defaultValue: "We use essential cookies for authentication and session management. Analytics cookies are used only with your consent. You can control cookie preferences through your browser settings." }), icon: Cookie },
    { id: "rights", title: t("section5Title", { defaultValue: "5. Your Rights" }), body: t("section5Body", { defaultValue: "You have the right to access, correct, or delete your personal data at any time. Contact us at privacy@downforge.me to exercise these rights. We will respond to your request within 30 days." }), icon: UserCheck },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("title"),
    description: "DownForge privacy policy. Learn how we handle your data.",
    url: `https://www.downforge.me/${locale}/privacy`,
    dateModified: "2025-01-01",
    isPartOf: { "@type": "WebSite", name: "DownForge", url: "https://www.downforge.me" },
  };

  return (
    <>
      <Nav />
      <main className="pt-16 sm:pt-20">
        {/* Hero */}
        <section className="bg-[#0d1f26] text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-[#5baab8]/20 via-[#3d8896]/10 to-transparent blur-[70px]" />
            <div className="absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full bg-gradient-to-tr from-[#0ea5b0]/15 to-transparent blur-[60px]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: `22px 22px` }} />
          </div>
          <div className="relative max-w-6xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-6 xl:px-6 py-8 sm:py-10 lg:py-12 xl:py-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1.5 mb-3 lg:mb-4 backdrop-blur">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8fd3df]" />
              <span className="text-xs font-bold tracking-[0.14em] uppercase text-white/90">Privacy</span>
            </div>
            <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-4xl xl:text-[2.75rem] font-black tracking-tight font-heading leading-[0.95]">{t("title")}</h1>
            <p className="mt-2 lg:mt-3 inline-flex items-center gap-2 text-xs font-medium text-white/60 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
              <Clock className="w-3 h-3" /> {t("lastUpdated")}
            </p>
            <p className="mt-3 lg:mt-4 text-sm lg:text-[15px] xl:text-base leading-relaxed text-white/60 max-w-2xl font-sans">
              Your privacy is the core of DownForge. We process ephemerally, store nothing, and give you full control.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-3 xs:px-4 sm:px-6 py-6 xs:py-8 sm:py-10 lg:py-10 xl:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)] gap-4 sm:gap-6 lg:gap-6 xl:gap-10 items-start">
            {/* TOC */}
            <aside className="lg:sticky lg:top-[72px] xl:top-20 self-start min-w-0">
              <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-border/60 dark:border-white/10 p-3 xs:p-4 xl:p-5 shadow-sm">
                <h2 className="text-xs font-bold tracking-[0.14em] uppercase text-muted-foreground font-mono flex items-center gap-2 mb-3">
                  <FileText className="w-3.5 h-3.5" /> Contents
                </h2>
                <nav className="hidden lg:block space-y-1">
                  {sections.map((s) => (
                    <a key={s.id} href={`#${s.id}`} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl px-3 py-2 transition-colors font-sans">
                      <s.icon className="w-3.5 h-3.5 text-[#5baab8] shrink-0" /> {s.title.replace(/^\d+\.\s*/, "")}
                    </a>
                  ))}
                </nav>
                <div className="lg:hidden flex gap-2 overflow-x-auto overscroll-x-contain scrollbar-none pb-1">
                  {sections.map((s) => (
                    <a key={s.id} href={`#${s.id}`} className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold bg-muted border border-border rounded-full px-3 py-1.5 whitespace-nowrap hover:bg-white transition-colors">
                      <s.icon className="w-3 h-3 text-[#5baab8]" /> {s.title.replace(/^\d+\.\s*/, "")}
                    </a>
                  ))}
                </div>
                <div className="mt-4 p-3 rounded-xl bg-[#eef6f8] dark:bg-[#5baab8]/10 border border-[#5baab8]/20 flex gap-2.5">
                  <Lock className="w-4 h-4 text-[#5baab8] shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed break-words text-[#0d1f26]/70 dark:text-white/70 font-sans">
                    Questions about data? <Link href="/contact" className="font-bold underline">Contact us</Link> — we reply within 24 hours.
                  </p>
                </div>
              </div>
            </aside>

            {/* Content */}
            <div className="min-w-0">
              <div className="rounded-2xl lg:rounded-[1.75rem] bg-white dark:bg-white/[0.04] border border-border/60 dark:border-white/10 shadow-sm overflow-hidden">
                <div className="h-1 w-full bg-gradient-to-r from-[#5baab8] via-[#0d1f26] to-[#5baab8]" />
                <div className="p-4 xs:p-6 sm:p-6 lg:p-7 xl:p-10">
                  <div className="space-y-2 mb-5 lg:mb-6">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.14em] uppercase text-[#5baab8] bg-[#eef6f8] border border-[#5baab8]/20 px-3 py-1 rounded-full">
                      <ShieldCheck className="w-3 h-3" /> Transparent & minimal
                    </span>
                  </div>
                  <div className="space-y-6 lg:space-y-8">
                    {sections.map((s) => (
                      <section key={s.id} id={s.id} className="scroll-mt-20 lg:scroll-mt-24">
                        <h2 className="flex items-start gap-2.5 lg:gap-3 text-base xs:text-lg lg:text-lg xl:text-xl font-bold text-foreground font-heading">
                          <span className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                            <s.icon className="w-4 h-4" />
                          </span>
                          <span className="min-w-0 break-words">{s.title}</span>
                        </h2>
                        <p className="mt-2.5 lg:mt-3 ml-10 lg:ml-12 text-sm lg:text-sm xl:text-[15px] leading-relaxed text-muted-foreground font-sans break-words">{s.body}</p>
                      </section>
                    ))}
                  </div>
                  <div className="mt-8 lg:mt-10 flex flex-col xs:flex-row flex-wrap gap-2.5 lg:gap-3 border-t border-border/50 pt-5 lg:pt-6">
                    <Link href="/terms" className="inline-flex items-center justify-center gap-2 text-sm font-semibold bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] px-5 py-2.5 lg:py-2.5 rounded-full hover:bg-[#1a3545] dark:hover:bg-slate-100 transition-colors w-full xs:w-auto">
                      Terms of Service <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link href="/contact" className="inline-flex items-center justify-center gap-2 text-sm font-semibold bg-white dark:bg-white/10 border border-border dark:border-white/10 text-foreground px-5 py-2.5 rounded-full hover:bg-muted/50 transition-colors w-full xs:w-auto">
                      Contact support
                    </Link>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-center text-muted-foreground font-sans">We never sell your data. For deletion requests, email privacy@downforge.me</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
