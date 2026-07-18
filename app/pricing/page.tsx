import type { Metadata } from "next";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { PricingSection } from "@/components/home/PricingSection";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — DownForge",
  description: "Simple, transparent pricing for DownForge. Start free, upgrade when you need more.",
};

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="pt-28 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 font-sans">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>
        <PricingSection />
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-white rounded-2xl border border-border p-8">
            <h2 className="text-xl font-bold text-foreground mb-4 font-heading">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "Can I switch plans at any time?", a: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately." },
                { q: "What payment methods do you accept?", a: "We accept all major credit cards, PayPal, and cryptocurrency." },
                { q: "Is there a free trial for Pro?", a: "Yes, we offer a 7-day free trial of our Pro plan with no commitment required." },
                { q: "Can I cancel anytime?", a: "Absolutely. No contracts, no cancellation fees. Your access continues until the end of the billing period." },
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
