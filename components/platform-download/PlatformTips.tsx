"use client";

import { motion } from "motion/react";
import { platformConfigs } from "@/lib/platform-config";

export function PlatformTips({ platform }: { platform: string }) {
  const config = platformConfigs[platform];

  return (
    <section className="py-20 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, white 0%, ${config.brandColor}03 100%)`,
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
            Tips & Tricks
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-3 mb-4 font-heading">
            Get the Most from {config.name} Downloads
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto font-sans">
            Whether you need video for editing, audio for podcasts, thumbnails for projects, or AI transcripts for accessibility — we have you covered.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {config.features.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 24, rotateX: 5 }}
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={{ visible: { opacity: 1, y: 0, rotateX: 0 } }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.21, 0.6, 0.35, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-5 border border-border hover:shadow-lg transition-shadow duration-200 relative overflow-hidden group"
              >
                <div
                  className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ backgroundColor: config.brandColor }}
                />
                <div className="flex items-start gap-4">
                  <motion.div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${config.brandColor}15` }}
                    whileHover={{ scale: 1.1, backgroundColor: `${config.brandColor}25` }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <Icon className="w-5 h-5" style={{ color: config.brandColor }} />
                  </motion.div>
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
