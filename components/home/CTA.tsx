"use client";

import { useTranslations } from "next-intl";
import { AppLink as Link } from "@/components/shared/AppLink";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function CTA() {
  const t = useTranslations("HomePage.cta");

  return (
    <section className="py-14 md:py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32, scale: 0.98 }}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { opacity: 1, y: 0, scale: 1 } }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="bg-[#0d1f26] rounded-[2rem] p-8 sm:p-12 md:p-16 text-center relative overflow-hidden shadow-[0_40px_100px_-30px_rgba(13,31,38,0.5)]"
        >
          {/* Grid + glow layers */}
          <div
            className="absolute inset-0 opacity-[0.12] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(168,212,220,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(168,212,220,0.35) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
              WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 75%)",
              maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 75%)",
            }}
            aria-hidden
          />
          <motion.div
            className="absolute -top-20 right-0 w-80 h-80 rounded-full pointer-events-none blur-2xl"
            style={{ background: "radial-gradient(circle, #5baab8 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 -left-10 w-56 h-56 rounded-full pointer-events-none blur-2xl"
            style={{ background: "radial-gradient(circle, #a8d4dc 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.35, 1], opacity: [0.12, 0.25, 0.12] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative">
            <h2 className="font-heading font-bold tracking-[-0.02em] text-2xl sm:text-3xl md:text-[2.75rem] leading-[1.1] text-white mb-4 [text-wrap:balance]">
              {t("title")}
            </h2>
            <p className="text-white/60 max-w-md mx-auto mb-8 sm:mb-10 leading-relaxed [text-wrap:pretty]">
              {t("subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
                <Link
                  href="/sign-up"
                  className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#5baab8] to-[#3d8896] bg-[length:150%_auto] hover:bg-right text-white font-semibold text-sm px-8 py-3.5 min-h-[50px] rounded-full transition-[background-position] duration-500 font-sans shadow-[0_15px_40px_-10px_rgba(91,170,184,0.6)] w-full sm:w-auto"
                >
                  {t("button")}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-auto">
                <Link
                  href="/api-docs"
                  className="inline-flex items-center justify-center gap-2 text-white/70 hover:text-white border border-white/15 hover:border-white/30 hover:bg-white/5 text-sm font-medium px-8 py-3.5 min-h-[50px] rounded-full backdrop-blur-sm transition-colors font-sans w-full sm:w-auto"
                >
                  API
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
