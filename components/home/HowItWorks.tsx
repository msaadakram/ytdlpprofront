"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Copy, Sparkles, Zap } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

const stepIcons = [Copy, Sparkles, Zap];

export function HowItWorks() {
  const t = useTranslations("HomePage.howItWorks");

  return (
    <section className="py-14 md:py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #5baab8 0%, transparent 50%), radial-gradient(circle at 80% 50%, #5baab8 0%, transparent 50%)`,
        }}
      />
      <div className="max-w-6xl mx-auto relative">
        <SectionHeading
          eyebrow={t("title", { defaultValue: "How it works" })}
          title={t("heading", { defaultValue: "Three simple steps" })}
          description={t("subheading", { defaultValue: "No account, no software, no hassle. Just paste, pick, and download." })}
        />

        <div className="relative">
          {/* Connector line between steps (laptop+) */}
          <div
            className="hidden md:block absolute top-[52px] left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[#5baab8]/40 to-transparent"
            aria-hidden
          />

          <div className="grid md:grid-cols-3 gap-5 sm:gap-8">
            {[1, 2, 3].map((num, i) => {
              const Icon = stepIcons[i];
              return (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={{ visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.55, delay: i * 0.12, ease: easeOutExpo }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="glass rounded-2xl border border-border/70 p-6 sm:p-8 relative hover:border-[#5baab8]/30 hover:shadow-[0_22px_50px_-20px_rgba(13,31,38,0.25)] transition-all duration-300 group"
                >
                  <span className="text-5xl sm:text-6xl md:text-7xl font-black text-[#5baab8]/[0.07] absolute top-3 right-5 font-heading select-none" aria-hidden>
                    0{num}
                  </span>
                  <div className="relative z-10 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5baab8] to-[#3d8896] flex items-center justify-center mb-5 shadow-[0_10px_24px_-8px_rgba(91,170,184,0.55)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3 font-heading">{t(`step${num}Title`)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-sans">{t(`step${num}Desc`)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
