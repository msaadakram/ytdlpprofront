"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { plans } from "@/lib/constants";
import { Check } from "lucide-react";

export function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, white 0%, #eef6f8 100%)" }} />
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
            Pricing
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-foreground mb-4 font-heading">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8 font-sans">
            Start free, upgrade when you need more.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView="visible"
            viewport={{ once: true }}
            variants={{ visible: { opacity: 1, scale: 1 } }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-white border border-border rounded-full px-4 py-2 shadow-sm"
          >
            <motion.span
              className="text-sm font-medium font-sans"
              animate={{ color: annual ? "#a0a0a0" : "#0d1f26" }}
              transition={{ duration: 0.2 }}
            >
              Monthly
            </motion.span>
            <button
              onClick={() => setAnnual(!annual)}
              className="relative w-12 h-6 rounded-full transition-colors"
              style={{ backgroundColor: annual ? "#5baab8" : "#a8d4dc" }}
            >
              <motion.span
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
                animate={{ left: annual ? "calc(100% - 22px)" : "2px" }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              />
            </button>
            <span className="text-sm font-medium font-sans" style={{ color: annual ? "#0d1f26" : "#a0a0a0" }}>
              Annual <span className="text-[#5baab8]">Save 20%</span>
            </span>
          </motion.div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{ visible: { opacity: 1, y: 0, scale: 1 } }}
              transition={{ duration: 0.45, delay: i * 0.1, ease: [0.21, 0.6, 0.35, 1] }}
              whileHover={{ y: plan.highlight ? -8 : -4, transition: { duration: 0.2 } }}
              className={`bg-white/80 backdrop-blur-sm rounded-2xl border p-8 relative flex flex-col ${
                plan.highlight
                  ? "border-[#5baab8] shadow-xl ring-1 ring-[#5baab8]/20 md:scale-105"
                  : "border-border shadow-sm"
              }`}
            >
              {plan.highlight && (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{ visible: { opacity: 1, y: 0 } }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#5baab8] text-white text-xs font-bold px-4 py-1 rounded-full font-mono"
                >
                  MOST POPULAR
                </motion.span>
              )}
              <h3 className="text-lg font-bold text-foreground mb-1 font-heading">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-foreground font-heading">
                  {annual && plan.price !== "$0" ? `$${parseInt(plan.price.slice(1)) * 10}` : plan.price}
                </span>
                <span className="text-sm text-muted-foreground ml-2 font-sans">/{annual ? "year" : plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <motion.li
                    key={f}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView="visible"
                    viewport={{ once: true, margin: "-20px" }}
                    variants={{ visible: { opacity: 1, x: 0 } }}
                    transition={{ duration: 0.25 }}
                    className="flex items-start gap-3 text-sm text-foreground font-sans"
                  >
                    <Check className="w-4 h-4 text-[#5baab8] mt-0.5 shrink-0" />
                    {f}
                  </motion.li>
                ))}
              </ul>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href={plan.name === "Team" ? "/api-disclaimer" : "/sign-up"}
                  className={`block text-center text-sm font-semibold py-3 rounded-xl transition-colors font-sans ${
                    plan.highlight
                      ? "bg-[#0d1f26] text-white hover:bg-[#1a3545]"
                      : "bg-[#eef6f8] text-foreground hover:bg-[#d4ecf0]"
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
