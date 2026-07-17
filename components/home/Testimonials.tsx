"use client";

import { motion } from "motion/react";
import { testimonials } from "@/lib/constants";
import { Star } from "lucide-react";

export function Testimonials() {
  return (
    <section className="py-20 px-6 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none opacity-[0.03]"
        style={{ background: "radial-gradient(circle, #5baab8 0%, transparent 70%)" }}
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
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#5baab8] mb-3 font-mono">
            Testimonials
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground mb-4 font-heading">
            Loved by creators
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto font-sans">
            Join thousands of satisfied users who download with Fetchwave daily.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{ visible: { opacity: 1, y: 0, scale: 1 } }}
              transition={{ duration: 0.4, delay: i * 0.1, ease: [0.21, 0.6, 0.35, 1] }}
              whileHover={{ y: -6, scale: 1.01, transition: { duration: 0.2 } }}
              className="bg-[#eef6f8] rounded-2xl p-8 relative group"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, ri) => (
                  <motion.span
                    key={ri}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{ visible: { scale: 1, rotate: 0 } }}
                    transition={{ type: "spring", stiffness: 400, damping: 20, delay: i * 0.1 + ri * 0.1 }}
                  >
                    <Star className="w-4 h-4 fill-[#5baab8] text-[#5baab8]" />
                  </motion.span>
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-6 font-sans">&ldquo;{t.text}&rdquo;</p>
              <div>
                <p className="text-sm font-bold text-foreground font-heading">{t.name}</p>
                <p className="text-xs text-muted-foreground font-sans">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
