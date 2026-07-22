"use client";

import { motion } from "motion/react";
import { Link2, ListChecks, Download } from "lucide-react";
import { platformConfigs } from "@/lib/platform-config";
import { useTranslations } from "next-intl";

const stepIcons = [Link2, ListChecks, Download];

export function PlatformHowItWorks({ platform }: { platform: string }) {
  const config = platformConfigs[platform];
  const t = useTranslations("PlatformPage");

  return (
    <section className="py-14 md:py-20 px-4 sm:px-6 bg-card relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, ${config.brandColor} 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${config.brandColor} 0%, transparent 50%)`,
        }}
      />
      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span
            className="text-xs font-bold tracking-widest uppercase font-mono"
            style={{ color: config.brandColor }}
          >
            {t("howItWorksBadge")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mt-3 mb-4 font-heading">
            {t("howItWorksHeading", { name: config.name })}
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto font-sans">
            {t("howItWorksSubheading")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((num, i) => {
            const Icon = stepIcons[i];
            const title = t(`howItWorksStep${num}Title`);
            const desc = t(`howItWorksStep${num}Desc`, { name: config.name });
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{ visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.21, 0.6, 0.35, 1] }}
                className="relative"
              >
                {i < 2 && (
                  <motion.div
                    className="hidden md:block absolute top-10 left-[calc(100%+0.5rem)] w-[calc(100%-2rem)] h-px"
                    style={{ background: `linear-gradient(90deg, ${config.brandColor}40, transparent)`, transformOrigin: "left" }}
                    initial={{ scaleX: 0 }}
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{ visible: { scaleX: 1 } }}
                    transition={{ duration: 0.6, delay: i * 0.12 + 0.3, ease: "easeOut" }}
                  />
                )}
                <motion.div
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="bg-[#eef6f8] rounded-2xl p-6 md:p-8 h-full relative overflow-hidden group"
                >
                  <span className="text-7xl font-black font-heading absolute -top-2 -right-2"
                    style={{ color: `${config.brandColor}0D` }}
                  >
                    0{i + 1}
                  </span>
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ backgroundColor: `${config.brandColor}15` }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <Icon className="w-5 h-5" style={{ color: config.brandColor }} />
                  </motion.div>
                  <h3 className="text-lg font-bold text-foreground mb-3 font-heading relative">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-sans relative">
                    {desc}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
