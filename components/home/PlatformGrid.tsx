"use client";

import { motion } from "motion/react";
import { platforms } from "@/lib/constants";
import type { ComponentType } from "react";

type BrandLogoProps = { className?: string; style?: React.CSSProperties };

function PlatformCard({ name }: { name: string }) {
  const p = platforms.find((pl) => pl.name === name);
  if (!p) return null;
  const Logo = p.Logo as ComponentType<BrandLogoProps>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      variants={{ visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.15 } }}
      className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-xl border border-border p-4 hover:shadow-lg hover:border-[#5baab8]/20 transition-all duration-200 group"
    >
      <motion.div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: p.bg }}
        whileHover={{ scale: 1.12 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <Logo className="w-5 h-5" style={{ color: p.fg }} />
      </motion.div>
      <span className="text-sm font-semibold text-foreground font-sans group-hover:text-[#5baab8] transition-colors">
        {name}
      </span>
    </motion.div>
  );
}

const featuredPlatforms = [
  "YouTube", "Facebook", "Instagram", "TikTok", "Twitter / X",
  "Vimeo", "Dailymotion", "Twitch", "Reddit", "Pinterest",
  "LinkedIn", "Snapchat", "SoundCloud", "Kick", "Niconico",
];

export function PlatformGrid() {
  return (
    <section id="platforms" className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, #eef6f8 0%, white 100%)" }} />
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#5baab8] mb-3 font-mono">
            Supported platforms
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground mb-4 font-heading">
            200+ Platforms & Growing
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-sans">
            From the biggest names to the niche platforms — if there&apos;s a video, we can fetch it.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
        >
          {featuredPlatforms.map((name) => (
            <PlatformCard key={name} name={name} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
