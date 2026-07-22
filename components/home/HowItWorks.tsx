"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Copy, Sparkles, Zap } from "lucide-react";

const stepIcons = [Copy, Sparkles, Zap];

export function HowItWorks() {
  const t = useTranslations("HomePage.howItWorks");

  return (
    <section className="py-14 md:py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, #5baab8 0%, transparent 50%), radial-gradient(circle at 80% 50%, #5baab8 0%, transparent 50%)`,
        }}
      />
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#5baab8] mb-3 font-mono">
            {t("title", { defaultValue: "How it works" })}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4 font-heading">
            Three simple steps
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-sans">
            No account, no software, no hassle. Just paste, pick, and download.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 sm:gap-8">
          {[1, 2, 3].map((num, i) => {
            const Icon = stepIcons[i];
            return (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 28, rotateX: 5 }}
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{ visible: { opacity: 1, y: 0, rotateX: 0 } }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: [0.21, 0.6, 0.35, 1] }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border p-6 sm:p-8 relative hover:shadow-lg transition-shadow duration-200 group"
              >
                <span className="text-6xl font-black text-[#5baab8]/8 absolute top-4 right-6 font-heading">0{num}</span>
                <motion.div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: "color-mix(in oklab, #5baab8 15%, transparent)" }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.6, ease: "easeInOut" }}
                  >
                    <Icon className="w-5 h-5 text-[#5baab8]" />
                  </motion.div>
                </motion.div>
                <h3 className="text-lg font-bold text-foreground mb-3 font-heading">{t(`step${num}Title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-sans">{t(`step${num}Desc`)}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
