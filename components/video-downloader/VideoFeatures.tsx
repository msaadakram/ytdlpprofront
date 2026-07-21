"use client";

import { motion } from "motion/react";
import { MonitorPlay, Shield, Zap, Globe, Star, Copy } from "lucide-react";
import { platformConfigs } from "@/lib/platform-config";

const stats = [
  { icon: MonitorPlay, label: "Video Quality", value: "Up to 4K", desc: "Download videos in stunning quality — from 4K Ultra HD to standard definition." },
  { icon: Zap, label: "Blazing Fast", value: "< 3 Seconds", desc: "Server-side processing with instant CDN delivery. Start your download in seconds." },
  { icon: Shield, label: "Private & Secure", value: "Zero Storage", desc: "Files processed ephemerally and deleted immediately after download." },
  { icon: Globe, label: "Format Choices", value: "MP4 · WebM · MKV", desc: "Choose the container format that works best for your device and use case." },
  { icon: Star, label: "No Account Required", value: "Free Forever", desc: "Start downloading instantly — no sign-up or login needed." },
  { icon: Copy, label: "Batch Processing", value: "Playlists", desc: "Download entire channels and playlists in one click with a Pro plan." },
];

export function VideoFeatures({ platform }: { platform: string }) {
  const config = platformConfigs[platform];
  const brandColor = config?.brandColor || "#5baab8";

  return (
    <section className="py-14 md:py-20 px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, ${brandColor}03 0%, white 50%, ${brandColor}03 100%)`,
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
          <span
            className="text-xs font-bold tracking-widest uppercase font-mono"
            style={{ color: brandColor }}
          >
            Why DownForge
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mt-3 mb-4 font-heading">
            The Best {config?.name || ""} Video Download Tool
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto font-sans">
            Built for speed, privacy, and quality. Download {config?.name || ""} videos the way they were meant to be saved.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.article
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{ visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.21, 0.6, 0.35, 1] }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-border p-5 transition-all duration-200"
                style={{
                  boxShadow: `0 1px 3px rgba(0,0,0,0.04)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 12px ${brandColor}15`;
                  e.currentTarget.style.borderColor = `${brandColor}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                  e.currentTarget.style.borderColor = "";
                }}
              >
                <div className="flex items-start gap-3.5">
                  <motion.div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${brandColor}12` }}
                    whileHover={{ scale: 1.12 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <Icon className="w-5 h-5" style={{ color: brandColor }} />
                  </motion.div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-foreground font-heading">{stat.label}</h3>
                      <span
                        className="text-[11px] font-bold font-mono px-1.5 py-0.5 rounded-md"
                        style={{
                          backgroundColor: `${brandColor}12`,
                          color: brandColor,
                        }}
                      >
                        {stat.value}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 font-sans leading-relaxed">{stat.desc}</p>
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
