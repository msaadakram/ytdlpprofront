"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Props = {
  eyebrow: string;
  title: ReactNode;
  description?: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, className = "" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: easeOutExpo }}
      className={`text-center mb-10 sm:mb-14 ${className}`}
    >
      <span className="flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.2em] uppercase text-[#5baab8] mb-4 font-mono">
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#5baab8]/50" aria-hidden />
        {eyebrow}
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#5baab8]/50" aria-hidden />
      </span>
      <h2 className="font-heading font-bold tracking-[-0.02em] text-foreground mb-4 text-[clamp(1.65rem,2.6vw+0.6rem,2.6rem)] leading-[1.12] [text-wrap:balance]">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed [text-wrap:pretty]">
          {description}
        </p>
      )}
    </motion.div>
  );
}
