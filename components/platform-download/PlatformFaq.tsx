"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Minus } from "lucide-react";
import { usePlatformTranslations } from "@/lib/usePlatformTranslations";
import { useTranslations } from "next-intl";

export function PlatformFaq({ platform }: { platform: string }) {
  const config = usePlatformTranslations(platform);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const t = useTranslations("PlatformPage");

  return (
    <section className="py-14 md:py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span
            className="text-xs font-bold tracking-widest uppercase font-mono"
            style={{ color: config.brandColor }}
          >
            {t("faqBadge")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mt-3 mb-4 font-heading">
            {t("faqHeading", { name: config.name })}
          </h2>
          <p className="text-muted-foreground text-sm font-sans">
            {t("faqSubheading", { name: config.name })}
          </p>
        </motion.div>

        <dl className="space-y-3">
          {config.faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={{ visible: { opacity: 1, x: 0 } }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                className={`bg-white rounded-2xl border overflow-hidden transition-shadow duration-200 ${
                  isOpen ? "shadow-md border-[#5baab8]/20" : "border-border shadow-sm"
                }`}
                itemScope
                itemType="https://schema.org/Question"
              >
                <dt>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                     className="w-full flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 text-left group"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${config.id}-${i}`}
                  >
                    <span className="text-sm font-semibold text-foreground pr-4 font-heading group-hover:text-[#5baab8] transition-colors" itemProp="name">
                      {faq.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="shrink-0 w-6 h-6 rounded-full bg-[#eef6f8] flex items-center justify-center"
                      style={{ backgroundColor: isOpen ? `${config.brandColor}15` : undefined }}
                    >
                      {isOpen ? (
                        <Minus className="w-3.5 h-3.5" style={{ color: config.brandColor }} />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </motion.span>
                  </button>
                </dt>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.dd
                      id={`faq-answer-${config.id}-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 25, mass: 0.8 }}
                      className="overflow-hidden"
                      itemScope
                      itemType="https://schema.org/Answer"
                    >
                       <div className="px-4 pb-4 sm:px-5">
                        <div
                          className="w-8 h-0.5 rounded-full mb-3"
                          style={{ backgroundColor: config.brandColor }}
                        />
                        <p className="text-sm text-muted-foreground leading-relaxed font-sans" itemProp="text">
                          <span className="font-semibold text-foreground">{faq.a.split(" ").slice(0, 3).join(" ")}</span>
                          {" "}
                          {faq.a.split(" ").slice(3).join(" ")}
                        </p>
                      </div>
                    </motion.dd>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
