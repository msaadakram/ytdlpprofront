"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, HelpCircle } from "lucide-react";

export function PricingFaq() {
  const t = useTranslations("Pricing");
  const [open, setOpen] = useState<number | null>(0);

  const faqs = [
    { q: t("faq1Q", { defaultValue: "Can I switch plans at any time?" }), a: t("faq1A", { defaultValue: "Yes, you can upgrade or downgrade at any time. Changes take effect immediately." }) },
    { q: t("faq2Q", { defaultValue: "What payment methods do you accept?" }), a: t("faq2A", { defaultValue: "We accept all major credit cards, PayPal, and cryptocurrency." }) },
    { q: t("faq3Q", { defaultValue: "Is there a free trial for Pro?" }), a: t("faq3A", { defaultValue: "Yes, we offer a 7-day free trial of our Pro plan with no commitment required." }) },
    { q: t("faq4Q", { defaultValue: "Can I cancel anytime?" }), a: t("faq4A", { defaultValue: "Absolutely. No contracts, no cancellation fees. Your access continues until the end of the billing period." }) },
  ];

  return (
    <div className="rounded-[1.75rem] bg-white dark:bg-white/[0.04] border border-border/60 dark:border-white/10 overflow-hidden shadow-sm">
      <div className="h-1 w-full bg-gradient-to-r from-[#5baab8] via-[#0d1f26] to-[#5baab8] opacity-80" />
      <div className="divide-y divide-border/50 dark:divide-white/5">
        {faqs.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={i} className="group">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 text-left hover:bg-muted/30 dark:hover:bg-white/[0.02] transition-colors"
                aria-expanded={isOpen}
              >
                <span className="flex items-center gap-3 min-w-0">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${isOpen ? "bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] border-[#0d1f26] dark:border-white" : "bg-slate-50 dark:bg-white/5 border-border/60 dark:border-white/10 text-muted-foreground"}`}>
                    <HelpCircle className="w-4 h-4" />
                  </span>
                  <span className={`text-sm sm:text-[15px] font-bold font-sans leading-snug ${isOpen ? "text-foreground" : "text-foreground/90"}`}>{faq.q}</span>
                </span>
                <span className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all ${isOpen ? "bg-[#0d1f26] dark:bg-white border-[#0d1f26] dark:border-white rotate-180" : "bg-white dark:bg-white/5 border-border dark:border-white/10"}`}>
                  <ChevronDown className={`w-4 h-4 ${isOpen ? "text-white dark:text-[#0d1f26]" : "text-muted-foreground"}`} />
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                      <p className="ml-11 text-sm leading-relaxed text-muted-foreground font-sans">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
