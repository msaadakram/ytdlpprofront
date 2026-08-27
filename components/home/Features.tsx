"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Globe, Zap, Shield, MonitorPlay, Clock, Star } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

const featureKeys = ["platforms", "speed", "security", "quality", "queue", "batch"] as const;
const featureIcons = [Globe, Zap, Shield, MonitorPlay, Clock, Star];

export function FeaturesSection() {
  const t = useTranslations("HomePage.features");

  return (
    <section id="features" className="py-14 md:py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, var(--background) 0%, var(--muted) 100%)" }} />
      <div className="max-w-6xl mx-auto relative">
        <SectionHeading
          eyebrow={t("title", { defaultValue: "Features" })}
          title={t("heading", { defaultValue: "Everything you need" })}
          description={t("subheading", { defaultValue: "Built for speed, reliability, and quality. No compromises." })}
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featureKeys.map((key, i) => {
            const Icon = featureIcons[i];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 24 }}
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{ visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: easeOutExpo }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="glass group relative rounded-2xl border border-border/70 p-5 sm:p-6 overflow-hidden transition-all duration-300 hover:border-[#5baab8]/35 hover:shadow-[0_22px_50px_-20px_rgba(13,31,38,0.25)]"
              >
                {/* Hover glow */}
                <div
                  className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-2xl"
                  style={{ background: "radial-gradient(circle, rgba(91,170,184,0.25) 0%, transparent 70%)" }}
                  aria-hidden
                />
                <div className="relative z-10 w-10 h-10 rounded-xl bg-gradient-to-br from-[#5baab8] to-[#3d8896] flex items-center justify-center mb-4 shadow-[0_10px_24px_-8px_rgba(91,170,184,0.55)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="relative z-10 text-base font-bold text-foreground mb-2 font-heading">{t(`${key}.title`)}</h3>
                <p className="relative z-10 text-sm text-muted-foreground leading-relaxed font-sans">{t(`${key}.desc`)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
