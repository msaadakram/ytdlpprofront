"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";
import { SectionHeading } from "./SectionHeading";

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

const avatarGradients = [
  "from-[#5baab8] to-[#3d8896]",
  "from-[#0d1f26] to-[#143d4a]",
  "from-[#8fd3df] to-[#5baab8]",
];

export function Testimonials() {
  const t = useTranslations("HomePage.testimonials");
  const items = t.raw("items") as Array<{ name: string; role: string; text: string }>;

  return (
    <section className="py-14 md:py-20 px-4 sm:px-6 bg-card relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none opacity-[0.035]"
        style={{ background: "radial-gradient(circle, #5baab8 0%, transparent 70%)" }}
      />
      <div className="max-w-6xl mx-auto relative">
        <SectionHeading
          eyebrow={t("title", { defaultValue: "Testimonials" })}
          title="Loved by creators"
          description="Join thousands of satisfied users who download with DownForge daily."
        />

        <div className="grid md:grid-cols-3 gap-5 sm:gap-8">
          {items.map((item, i) => (
            <motion.figure
              key={item.name}
              initial={{ opacity: 0, y: 26 }}
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{ visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: easeOutExpo }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group relative rounded-2xl border border-border/60 bg-gradient-to-b from-muted/70 to-muted/25 p-6 sm:p-8 transition-shadow duration-300 hover:shadow-[0_22px_50px_-20px_rgba(13,31,38,0.22)]"
            >
              <Quote className="absolute top-5 right-6 w-8 h-8 text-[#5baab8]/15 group-hover:text-[#5baab8]/25 transition-colors" aria-hidden />
              <div className="flex gap-1 mb-4" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, ri) => (
                  <motion.span
                    key={ri}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={{ visible: { scale: 1, rotate: 0 } }}
                    transition={{ type: "spring", stiffness: 400, damping: 20, delay: i * 0.1 + ri * 0.08 }}
                  >
                    <Star className="w-4 h-4 fill-[#5baab8] text-[#5baab8]" />
                  </motion.span>
                ))}
              </div>
              <blockquote className="text-sm text-foreground leading-relaxed mb-6 font-sans [text-wrap:pretty]">
                &ldquo;{item.text}&rdquo;
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} flex items-center justify-center text-white text-sm font-bold font-heading shadow-md shrink-0`}>
                  {item.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                </span>
                <span>
                  <span className="block text-sm font-bold text-foreground font-heading">{item.name}</span>
                  <span className="block text-xs text-muted-foreground font-sans">{item.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
