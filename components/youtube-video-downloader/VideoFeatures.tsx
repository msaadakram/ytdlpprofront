"use client";

import { motion } from "motion/react";
import {
  MonitorPlay, Clapperboard, Film, Waves, Cone, Zap,
} from "lucide-react";

const features = [
  {
    icon: MonitorPlay,
    label: "4K Ultra HD",
    value: "2160p",
    desc: "Download YouTube videos in stunning 4K resolution with crystal-clear detail and vibrant colors.",
  },
  {
    icon: Clapperboard,
    label: "Full HD",
    value: "1080p",
    desc: "Perfect balance of quality and file size. Full HD 1080p for the best viewing experience.",
  },
  {
    icon: Film,
    label: "HD Ready",
    value: "720p",
    desc: "Fast downloads with great quality. Ideal for mobile devices and slower connections.",
  },
  {
    icon: Waves,
    label: "WebM Support",
    value: "Open Format",
    desc: "Download in WebM format for superior compression and broad browser compatibility.",
  },
  {
    icon: Cone,
    label: "MKV Format",
    value: "Lossless",
    desc: "MKV container supports multiple codecs and advanced features for maximum flexibility.",
  },
  {
    icon: Zap,
    label: "Lightning Speed",
    value: "< 3 Seconds",
    desc: "Server-side processing with instant CDN delivery. Start your download in seconds.",
  },
];

export function VideoFeatures() {
  return (
    <section className="py-14 md:py-20 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, #FF000003 0%, white 50%, #FF000003 100%)",
        }}
      />
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-[#FF0000] font-mono">
            Download Qualities
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mt-3 mb-4 font-heading">
            Every Resolution You Need
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto font-sans">
            From 4K Ultra HD to standard definition — download YouTube videos in the quality that suits you best.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{ visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.21, 0.6, 0.35, 1] }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-border p-5 hover:shadow-md hover:border-[#FF0000]/20 transition-all duration-200"
              >
                <div className="flex items-start gap-3.5">
                  <motion.div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "#FF000012" }}
                    whileHover={{ scale: 1.12 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <Icon className="w-5 h-5 text-[#FF0000]" />
                  </motion.div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-foreground font-heading">{feature.label}</h3>
                      <span
                        className="text-[11px] font-bold font-mono px-1.5 py-0.5 rounded-md"
                        style={{
                          backgroundColor: "#FF000012",
                          color: "#FF0000",
                        }}
                      >
                        {feature.value}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 font-sans leading-relaxed">{feature.desc}</p>
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
