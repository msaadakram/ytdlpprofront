"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Monitor, Headphones, Image, FileText } from "lucide-react";
import { videoFormats, audioFormats, thumbnailFormats, transcriptFormats } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { SectionHeading } from "./SectionHeading";

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

const tabs = [
  { key: "video" as const, icon: Monitor, formats: videoFormats },
  { key: "audio" as const, icon: Headphones, formats: audioFormats },
  { key: "thumbnail" as const, icon: Image, formats: thumbnailFormats },
  { key: "transcript" as const, icon: FileText, formats: transcriptFormats },
];

export function FormatShowcase() {
  const [activeTab, setActiveTab] = useState<"video" | "audio" | "thumbnail" | "transcript">("video");
  const current = tabs.find((t) => t.key === activeTab)!;
  const t = useTranslations("HomePage");
  const tabLabel = t(`formatShowcaseTabs.${activeTab}`);

  return (
    <section className="py-14 md:py-20 px-4 sm:px-6 bg-card">
      <div className="max-w-5xl mx-auto">
        <SectionHeading
          eyebrow={t("formatShowcaseBadge")}
          title={
            <>
              Any Format, <span className="bg-gradient-to-r from-[#5baab8] to-[#3d8896] bg-clip-text text-transparent">Any Quality</span>
            </>
          }
          description={t("formatShowcaseSubtitle")}
        />

        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="max-w-full min-w-0 overflow-x-auto px-2 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="glass inline-flex border border-border/70 rounded-full p-1 gap-1 shadow-[0_10px_36px_-14px_rgba(13,31,38,0.18)]">
              {tabs.map((tab) => {
                const active = activeTab === tab.key;
                const Icon = tab.icon;
                return (
                  <motion.button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    whileHover={{ scale: active ? 1 : 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className={`relative flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm font-semibold transition-colors font-sans whitespace-nowrap ${
                      active ? "text-white" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="formatTab"
                        className="absolute inset-0 bg-gradient-to-r from-[#0d1f26] to-[#143d4a] rounded-full shadow-[0_8px_20px_-6px_rgba(13,31,38,0.5)]"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <Icon className={`w-3.5 h-3.5 relative z-10 transition-colors ${active ? "text-[#8fd3df]" : ""}`} />
                    <span className="relative z-10">{t(`formatShowcaseTabs.${tab.key}`)}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.3, ease: easeOutExpo }}
            className="rounded-3xl border border-border/60 bg-gradient-to-b from-muted/60 to-muted/20 p-5 sm:p-8"
          >
            <div className="flex items-center gap-2.5 mb-4 sm:mb-6">
              <motion.div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-[#5baab8] to-[#3d8896] shadow-[0_8px_20px_-6px_rgba(91,170,184,0.5)]"
                initial={{ rotate: -12, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 16 }}
              >
                <current.icon className="w-4 h-4 text-white" />
              </motion.div>
              <h3 className="text-base sm:text-lg font-bold text-foreground font-heading">
                {tabLabel} {t("formatShowcaseFormats")}
              </h3>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {current.formats.map((f, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.045, ease: easeOutExpo }}
                  className="glass flex items-center justify-between rounded-xl border border-border/50 px-4 py-3 hover:border-[#5baab8]/40 hover:shadow-[0_10px_28px_-14px_rgba(13,31,38,0.2)] hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <span className="text-sm text-foreground font-medium font-sans group-hover:text-[#5baab8] transition-colors">
                    {f.label}
                  </span>
                  <span className="text-[11px] uppercase tracking-wide text-muted-foreground font-mono px-2 py-0.5 rounded-md bg-muted/80 group-hover:bg-[#5baab8]/10 group-hover:text-[#5baab8] transition-colors shrink-0">
                    {f.ext}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
