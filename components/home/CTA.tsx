"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.98 }}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ visible: { opacity: 1, y: 0, scale: 1 } }}
          transition={{ duration: 0.6, ease: [0.21, 0.6, 0.35, 1] }}
          className="bg-[#0d1f26] rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
        >
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, #5baab8 0%, transparent 70%)" }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.35, 0.2],
              rotate: [0, 45, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, #a8d4dc 0%, transparent 70%)" }}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.1, 0.25, 0.1],
              rotate: [0, -30, 0],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 font-heading">
              Ready to start downloading?
            </h2>
            <p className="text-white/60 max-w-md mx-auto mb-8 font-sans">
              Join thousands of users who trust Fetchwave for their video downloads. No credit card required.
            </p>
            <div className="flex items-center justify-center gap-4">
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/sign-up"
                  className="inline-flex items-center gap-2 bg-[#5baab8] text-white font-semibold text-sm px-7 py-3 rounded-xl hover:bg-[#4a99a7] transition-colors font-sans"
                >
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                <Link
                  href="/api"
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors font-sans"
                >
                  API Access
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
