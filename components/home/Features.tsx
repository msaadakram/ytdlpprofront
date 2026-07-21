"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Globe, Zap, Shield, MonitorPlay, Clock, Star } from "lucide-react";

const featureKeys = ["platforms", "speed", "security", "quality", "queue", "batch"] as const;
const featureIcons = [Globe, Zap, Shield, MonitorPlay, Clock, Star];

export function FeaturesSection() {
  const t = useTranslations("HomePage.features");

  return (
    <section id="features" className="py-14 md:py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, white 0%, #eef6f8 100%)" }} />
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#5baab8] mb-3 font-mono">
            {t("title", { defaultValue: "Features" })}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4 font-heading">
            Everything you need
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-sans">
            Built for speed, reliability, and quality. No compromises.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureKeys.map((key, i) => {
            const Icon = featureIcons[i];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{ visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.21, 0.6, 0.35, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-border p-6 hover:shadow-lg hover:border-[#5baab8]/20 transition-all duration-200"
              >
                <motion.div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#eef6f8" }}
                  whileHover={{ scale: 1.12, backgroundColor: "#d4ecf0" }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <Icon className="w-5 h-5 text-[#5baab8]" />
                </motion.div>
                <h3 className="text-base font-bold text-foreground mb-2 font-heading">{t(`${key}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-sans">{t(`${key}.desc`)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
