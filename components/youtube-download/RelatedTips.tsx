"use client";

import { motion } from "motion/react";
import { Music, Video, Image, Layers, FileText } from "lucide-react";
import { useTranslations } from "next-intl";

const tipIcons = [Video, Music, FileText, Image, Layers];

export function RelatedTips() {
  const t = useTranslations("YoutubeTips");

  const tips = [
    { icon: tipIcons[0], title: t("tip1Title"), desc: t("tip1Desc") },
    { icon: tipIcons[1], title: t("tip2Title"), desc: t("tip2Desc") },
    { icon: tipIcons[2], title: t("tip3Title"), desc: t("tip3Desc") },
    { icon: tipIcons[3], title: t("tip4Title"), desc: t("tip4Desc") },
    { icon: tipIcons[4], title: t("tip5Title"), desc: t("tip5Desc") },
  ];

  return (
    <section className="py-14 md:py-20 px-4 sm:px-6 bg-card">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-[#5baab8] font-mono">
            {t("title")}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mt-3 mb-4 font-heading">
            Get the Most from YouTube Downloads
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto font-sans">
            Whether you need video for editing, audio for podcasts, thumbnails for projects, or AI transcripts for accessibility — we have you covered.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {tips.map((tip, i) => {
            const Icon = tip.icon;
            return (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={{ visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                   className="bg-muted rounded-2xl p-4 sm:p-5 border border-border hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#5baab8]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#5baab8]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground mb-1.5 font-heading">{tip.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed font-sans">{tip.desc}</p>
                    </div>
                  </div>
                </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
