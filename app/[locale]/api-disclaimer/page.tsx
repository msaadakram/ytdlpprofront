import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Link } from "@/lib/i18n/navigation";
import { ShieldCheck, ArrowLeft } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ApiDisclaimer" });

  return {
    title: `${t("title")} — DownForge`,
    description: t("subtitle"),
    alternates: { canonical: `https://downforge.me/${locale}/api-disclaimer` },
  };
}

export default async function ApiDisclaimerPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "ApiDisclaimer" });

  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 font-sans">
            <ArrowLeft className="w-4 h-4" /> {t("backToHome")}
          </Link>

          <div className="bg-[#0d1f26] rounded-3xl p-8 md:p-12 mb-10 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#5baab8]/20 flex items-center justify-center mx-auto mb-5">
              <ShieldCheck className="w-7 h-7 text-[#5baab8]" />
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 font-heading">{t("title")}</h1>
            <p className="text-white/60 max-w-lg mx-auto font-sans">{t("subtitle")}</p>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3 font-heading">{t("fairUse.title")}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">{t("fairUse.body")}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3 font-heading">{t("noWarranty.title")}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">{t("noWarranty.body")}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3 font-heading">{t("legal.title")}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">{t("legal.body")}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3 font-heading">{t("dataRetention.title")}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">{t("dataRetention.body")}</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3 font-heading">{t("rateLimits.title")}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed font-sans">{t("rateLimits.body")}</p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
