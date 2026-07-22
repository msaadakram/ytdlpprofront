"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Monitor, Headphones, Image, FileText } from "lucide-react";
import { videoFormats, audioFormats, thumbnailFormats, transcriptFormats } from "@/lib/constants";
import { useTranslations } from "next-intl";

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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#5baab8] mb-3 font-mono">
            {t("formatShowcaseBadge")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4 font-heading">
            {t("formatShowcaseTitle")}
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-sans">
            {t("formatShowcaseSubtitle")}
          </p>
        </motion.div>

        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="max-w-full overflow-x-auto px-2 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="inline-flex bg-muted rounded-xl p-1 gap-1">
            {tabs.map((tab) => {
              const active = activeTab === tab.key;
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  whileHover={{ scale: active ? 1 : 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`relative flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-sm font-semibold transition-colors font-sans whitespace-nowrap ${
                    active ? "text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="formatTab"
                      className="absolute inset-0 bg-[#0d1f26] rounded-lg shadow-md"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
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
            initial={{ opacity: 0, y: 12, rotateX: 5 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -12, rotateX: -5 }}
            transition={{ duration: 0.35, ease: [0.21, 0.6, 0.35, 1] }}
            className="bg-muted rounded-2xl p-5 sm:p-8"
          >
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <motion.div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: "#5baab8" }}
                initial={{ rotate: -10, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
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
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="flex items-center justify-between bg-card/70 backdrop-blur-sm rounded-xl px-4 py-3 hover:bg-card hover:shadow-sm transition-all group"
                >
                  <span className="text-sm text-foreground font-medium font-sans group-hover:text-[#5baab8] transition-colors">
                    {f.label}
                  </span>
                  <span className="text-[11px] uppercase text-muted-foreground font-mono px-2 py-0.5 rounded-md bg-muted group-hover:bg-muted/70 transition-colors shrink-0">
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
