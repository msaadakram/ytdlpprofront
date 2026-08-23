"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { platforms } from "@/lib/constants";
import { useTranslations } from "next-intl";
import { SectionHeading } from "./SectionHeading";

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

function PlatformCard({ name }: { name: string }) {
  const p = platforms.find((pl) => pl.name === name);
  if (!p) return null;
  const Logo = p.Logo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      whileInView="visible"
      viewport={{ once: true, margin: "-30px" }}
      variants={{ visible: { opacity: 1, y: 0, scale: 1 } }}
      transition={{ duration: 0.4, ease: easeOutExpo }}
    >
      <Link
        href={p.href}
        className="glass flex items-center gap-3 sm:gap-4 rounded-2xl border border-border/70 p-3 sm:p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#5baab8]/40 hover:shadow-[0_18px_40px_-16px_rgba(13,31,38,0.22)] group"
      >
        <motion.div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-shadow group-hover:shadow-md"
          style={{ background: p.bg }}
          whileHover={{ scale: 1.12, rotate: -4 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <Logo className="w-5 h-5" style={{ color: p.fg }} />
        </motion.div>
        <span className="text-sm font-semibold text-foreground font-sans group-hover:text-[#5baab8] transition-colors">
          {name}
        </span>
      </Link>
    </motion.div>
  );
}

const featuredPlatforms = [
  "YouTube", "Facebook", "Instagram", "TikTok", "Twitter / X",
  "Vimeo", "Dailymotion", "Twitch", "Reddit", "Pinterest",
  "LinkedIn", "Snapchat", "SoundCloud", "Kick", "Niconico",
];

export function PlatformGrid() {
  const t = useTranslations("HomePage");

  return (
    <section id="platforms" className="py-14 md:py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, var(--muted) 0%, var(--background) 100%)" }} />
      <div className="max-w-6xl mx-auto relative">
        <SectionHeading
          eyebrow={t("platformGridTitle")}
          title={
            <span className="bg-gradient-to-r from-[#5baab8] via-[#3d8896] to-[#0d1f26] bg-clip-text text-transparent">
              {t("platformGridBadge")}
            </span>
          }
          description={t("platformGridDesc")}
        />

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3 md:gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-30px" }}
          variants={{ visible: { transition: { staggerChildren: 0.045 } } }}
        >
          {featuredPlatforms.map((name) => (
            <PlatformCard key={name} name={name} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
