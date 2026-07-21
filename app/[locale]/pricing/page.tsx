import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PricingSection } from "@/components/home/PricingSection";
import { Link } from "@/lib/i18n/navigation";
import { ArrowLeft } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pricing" });

  return {
    title: `${t("title")} — DownForge`,
    description: t("subtitle"),
    alternates: {
      canonical: `https://downforge.me/${locale}/pricing`,
      languages: {
        en: "https://downforge.me/en/pricing",
        es: "https://downforge.me/es/pricing",
        fr: "https://downforge.me/fr/pricing",
        de: "https://downforge.me/de/pricing",
        pt: "https://downforge.me/pt/pricing",
        ja: "https://downforge.me/ja/pricing",
        ar: "https://downforge.me/ar/pricing",
        ru: "https://downforge.me/ru/pricing",
        zh: "https://downforge.me/zh/pricing",
      },
    },
  };
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pricing" });

  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 font-sans">
            <ArrowLeft className="w-4 h-4" /> {t("backToHome", { defaultValue: "Back to home" })}
          </Link>
        </div>
        <PricingSection />
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-2xl border border-border p-8">
            <h2 className="text-xl font-bold text-foreground mb-4 font-heading">{t("faqTitle", { defaultValue: "Frequently Asked Questions" })}</h2>
            <div className="space-y-6">
              {[
                { q: t("faq1Q", { defaultValue: "Can I switch plans at any time?" }), a: t("faq1A", { defaultValue: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately." }) },
                { q: t("faq2Q", { defaultValue: "What payment methods do you accept?" }), a: t("faq2A", { defaultValue: "We accept all major credit cards, PayPal, and cryptocurrency." }) },
                { q: t("faq3Q", { defaultValue: "Is there a free trial for Pro?" }), a: t("faq3A", { defaultValue: "Yes, we offer a 7-day free trial of our Pro plan with no commitment required." }) },
                { q: t("faq4Q", { defaultValue: "Can I cancel anytime?" }), a: t("faq4A", { defaultValue: "Absolutely. No contracts, no cancellation fees. Your access continues until the end of the billing period." }) },
              ].map((faq, i) => (
                <div key={i}>
                  <h3 className="text-sm font-bold text-foreground mb-1 font-heading">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground font-sans">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
