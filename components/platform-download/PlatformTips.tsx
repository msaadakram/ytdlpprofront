"use client";

import { motion } from "motion/react";
import { platformConfigs } from "@/lib/platform-config";

export function PlatformTips({ platform }: { platform: string }) {
  const config = platformConfigs[platform];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
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
            Whether you need video for editing, audio for podcasts, or thumbnails for projects — we have you covered.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {config.features.map((tip, i) => {
            const Icon = tip.icon;
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={{ visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="bg-[#eef6f8] rounded-2xl p-5 border border-border hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${config.brandColor}1A` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: config.brandColor }} />
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
