"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AppLink as Link } from "@/components/shared/AppLink";
import { motion, AnimatePresence } from "motion/react";
import { Check, Crown, Users, Sparkles, Zap, ArrowRight } from "lucide-react";

type PlanKey = "free" | "pro" | "team";

export function PricingSection() {
  const t = useTranslations("HomePage.pricing");
  const [annual, setAnnual] = useState(false);

  const plans: { key: PlanKey; highlight: boolean; href: string; icon: typeof Crown; gradient: string }[] = [
    { key: "free", highlight: false, href: "/sign-up", icon: Sparkles, gradient: "from-slate-50 to-white" },
    { key: "pro", highlight: true, href: "/sign-up", icon: Crown, gradient: "from-[#0d1f26] via-[#123040] to-[#0d1f26]" },
    { key: "team", highlight: false, href: "/contact", icon: Users, gradient: "from-slate-50 to-white" },
  ];

  return (
    <section id="pricing" className="py-8 sm:py-12 lg:py-16 relative overflow-hidden">
      {/* Mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-gradient-to-br from-[#5baab8]/10 via-[#8fd3df]/5 to-transparent blur-[60px]" />
      </div>

      <div className="max-w-6xl mx-auto relative px-0">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 lg:mb-10"
        >
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-[#5baab8] bg-[#eef6f8] border border-[#5baab8]/20 px-3 py-1 rounded-full font-mono">
            <Zap className="w-3 h-3" /> {t("title", { defaultValue: "Pricing" })}
          </span>
          <h2 className="mt-3 text-2xl xs:text-3xl sm:text-4xl lg:text-[2.5rem] font-black tracking-tight text-foreground font-heading leading-[0.95]">
            {t("heading", { defaultValue: "Simple, transparent" })} <span className="bg-gradient-to-r from-[#5baab8] to-[#0d1f26] bg-clip-text text-transparent">{t("headingAccent", { defaultValue: "pricing" })}</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto font-sans">
            {t("subheading", { defaultValue: "Start free, upgrade when you need more. Cancel anytime." })}
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-6 inline-flex items-center gap-1 bg-white dark:bg-white/[0.06] border border-border/60 dark:border-white/10 rounded-full p-1 shadow-sm"
          >
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${!annual ? "bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t("monthly", { defaultValue: "Monthly" })}
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${annual ? "bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t("annual", { defaultValue: "Annual" })} <span className="hidden sm:inline-flex text-[10px] font-bold tracking-wide bg-[#5baab8] text-white px-2 py-0.5 rounded-full">{t("save20", { defaultValue: "Save 20%" })}</span>
            </button>
          </motion.div>
          <p className="sm:hidden mt-2 text-xs font-semibold text-[#5baab8]">{t("annualSave", { defaultValue: "Annual — Save 20%" })}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 lg:gap-6 xl:gap-8 max-w-5xl mx-auto items-stretch">
          {plans.map((plan, i) => {
            const p = t.raw(plan.key) as {
              name: string; price: string; period: string;
              features: string[]; cta: string;
            };
            const Icon = plan.icon;
            const isPro = plan.highlight;
            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: [0.21, 0.6, 0.35, 1] }}
                whileHover={{ y: isPro ? -6 : -4, transition: { duration: 0.2 } }}
                className={`relative flex flex-col ${isPro ? "lg:scale-[1.03] xl:scale-[1.04] z-10" : ""}`}
              >
                {isPro && (
                  <motion.span
                    initial={{ opacity: 0, y: -8, scale: 0.9, x: "-50%" }}
                    whileInView={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 + 0.2, type: "spring", stiffness: 400, damping: 18 }}
                    className="absolute -top-3 left-1/2 z-20 bg-gradient-to-r from-[#5baab8] to-[#3d8896] text-white text-[10px] sm:text-xs font-black tracking-[0.1em] uppercase px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-md whitespace-nowrap"
                  >
                    {t("popular", { defaultValue: "MOST POPULAR" })}
                  </motion.span>
                )}
                <div
                  className={`flex flex-col flex-1 rounded-[1.75rem] sm:rounded-[2rem] border overflow-hidden ${
                    isPro
                      ? "bg-[#0d1f26] dark:bg-[#0a1218] border-[#0d1f26] dark:border-white/10 shadow-[0_24px_64px_-16px_rgba(13,31,38,0.35)]"
                      : "bg-white dark:bg-white/[0.04] border-border/60 dark:border-white/10 shadow-[0_8px_32px_-12px_rgba(13,31,38,0.1)]"
                  }`}
                >
                  {isPro && <div className="h-1 w-full bg-gradient-to-r from-[#5baab8] via-white to-[#5baab8] opacity-90" />}
                  <div className={`p-6 sm:p-7 lg:p-7 xl:p-8 flex flex-col flex-1 ${isPro ? "pt-7 sm:pt-8" : ""}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${isPro ? "bg-white text-[#0d1f26]" : "bg-[#eef6f8] dark:bg-white/10 text-[#5baab8] dark:text-white"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className={`text-lg font-black font-heading ${isPro ? "text-white" : "text-foreground"}`}>{p.name}</h3>
                    <p className={`text-xs font-medium mt-1 ${isPro ? "text-white/60" : "text-muted-foreground"} font-sans`}>{isPro ? t("forPowerUsers", { defaultValue: "For power users" }) : plan.key === "free" ? t("perfectToTry", { defaultValue: "Perfect to try" }) : t("forCollaborators", { defaultValue: "For collaborators" })}</p>
                    <div className="mt-5 flex items-baseline gap-1">
                      <span className={`text-4xl sm:text-[2.5rem] font-black tracking-tight font-heading ${isPro ? "text-white" : "text-foreground"}`}>
                        {annual && p.price !== "$0" ? `$${parseInt(p.price.slice(1)) * 10}` : p.price}
                      </span>
                      <span className={`text-sm font-medium ${isPro ? "text-white/50" : "text-muted-foreground"} font-sans`}>/{annual ? t("perYear", { defaultValue: "year" }) : p.period}</span>
                    </div>
                    {annual && p.price !== "$0" && (
                      <p className="mt-1 text-xs font-semibold text-emerald-500 dark:text-emerald-400">{t("saveYearly", { amount: (parseInt(p.price.slice(1)) * 12 - parseInt(p.price.slice(1)) * 10), defaultValue: "Save {amount} yearly" })}</p>
                    )}
                    <ul className="mt-6 space-y-3 flex-1">
                      {p.features.map((f: string) => (
                        <li key={f} className={`flex items-start gap-2.5 text-sm font-medium font-sans ${isPro ? "text-white/90" : "text-foreground"}`}>
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isPro ? "bg-white/15 text-white" : "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/30"}`}>
                            <Check className="w-3 h-3" />
                          </span>
                          <span className="leading-snug">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={plan.href}
                      className={`mt-6 sm:mt-8 block text-center text-sm font-bold py-3.5 rounded-full transition-all font-sans flex items-center justify-center gap-2 group ${
                        isPro
                          ? "bg-white text-[#0d1f26] hover:bg-slate-100 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                          : "bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] hover:bg-[#1a3545] dark:hover:bg-slate-100 hover:scale-[1.01] active:scale-[0.99]"
                      }`}
                    >
                      {p.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <p className={`mt-3 text-center text-xs ${isPro ? "text-white/40" : "text-muted-foreground"} font-sans`}>{plan.key === "free" ? t("noCreditCard", { defaultValue: "No credit card" }) : plan.key === "pro" ? t("cancelAnytime", { defaultValue: "Cancel anytime" }) : t("contactSales", { defaultValue: "Contact sales" })}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="mt-8 lg:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-medium text-muted-foreground font-sans">
          <span className="inline-flex items-center gap-1.5 bg-white dark:bg-white/5 border border-border/60 dark:border-white/10 rounded-full px-3 py-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> {t("noSetupFee", { defaultValue: "No setup fee" })}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" /> {t("moneyBack", { defaultValue: "30-day money back" })}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-500" /> {t("downgrade", { defaultValue: "Downgrade anytime" })}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
