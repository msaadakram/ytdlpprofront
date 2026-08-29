"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { Mail, ShieldCheck, ArrowRight, ArrowLeft, RefreshCw, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTranslations } from "next-intl";

const RESEND_COOLDOWN_SECONDS = 60;

export function VerifyEmailForm() {
  const { verifyEmail, resendVerification } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Auth");

  const emailParam = searchParams.get("email") || "";
  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (!email.trim()) {
      setError(t("errorRequired"));
      return;
    }
    if (!/^\d{6}$/.test(code.trim())) {
      setError(t("invalidCode"));
      return;
    }

    setSubmitting(true);
    try {
      const result = await verifyEmail(email.trim(), code.trim());
      if (!result.success) {
        setError(result.error || t("verifyFailed"));
        return;
      }
      setVerified(true);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResend() {
    setError(null);
    setNotice(null);
    if (!email.trim()) {
      setError(t("errorRequired"));
      return;
    }
    const result = await resendVerification(email.trim());
    if (!result.success) {
      // If the backend is throttling (cooldown or rate-limit), surface the
      // wait time in the UI so the user understands and the button counts down.
      const msg = result.error || t("verifyFailed");
      const waitMatch = msg.match(/(\d+)\s*s/);
      if (result.code === "RATE_LIMIT" || /wait/i.test(msg) || waitMatch) {
        const secs = waitMatch ? parseInt(waitMatch[1], 10) : RESEND_COOLDOWN_SECONDS;
        // Clamp to sensible range (5..300s) and show as cooldown
        const cooldownSecs = Math.min(300, Math.max(5, secs));
        setCooldown(cooldownSecs);
      }
      setError(msg);
      return;
    }
    setNotice(t("resentNotice"));
    setCooldown(RESEND_COOLDOWN_SECONDS);
  }

  if (verified) {
    return (
      <div className="w-full max-w-[520px] mx-auto bg-white/85 dark:bg-white/[0.06] backdrop-blur-2xl rounded-[1.75rem] sm:rounded-[2rem] border border-white/60 dark:border-white/10 shadow-[0_20px_48px_-16px_rgba(13,31,38,0.16)] p-6 sm:p-9 text-center">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 grid place-items-center mb-5">
          <Check className="w-7 h-7 text-emerald-600" />
        </div>
        <h1 className="text-[1.6rem] sm:text-[1.85rem] font-black tracking-[-0.03em] text-[#0d1f26] dark:text-white font-heading">
          {t("verifySuccessTitle")}
        </h1>
        <p className="text-sm text-[#0d1f26]/60 dark:text-white/60 mt-2 font-sans">
          {t("verifySuccessDesc")}
        </p>
        <button
          onClick={() => router.push("/sign-in")}
          className="mt-6 w-full bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] font-bold text-sm py-3.5 rounded-2xl hover:bg-[#122a35] dark:hover:bg-[#f1f5f9] transition-all shadow-[0_12px_32px_-12px_rgba(13,31,38,0.45)] font-sans inline-flex items-center justify-center gap-2"
        >
          {t("continueToSignIn")} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[520px] mx-auto bg-white/85 dark:bg-white/[0.06] backdrop-blur-2xl rounded-[1.75rem] sm:rounded-[2rem] border border-white/60 dark:border-white/10 shadow-[0_20px_48px_-16px_rgba(13,31,38,0.16)] overflow-hidden">
      <div className="h-[3px] w-full bg-gradient-to-r from-[#5baab8] via-[#0d1f26] to-[#5baab8] opacity-90" />
      <div className="p-5 xs:p-6 sm:p-8 lg:p-9">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-[#f8fafc] dark:bg-white/[0.06] border border-[#0d1f26]/5 dark:border-white/10 grid place-items-center mb-5">
          <Mail className="w-7 h-7 text-[#5baab8]" />
        </div>
        <h1 className="text-[1.6rem] sm:text-[1.85rem] font-black tracking-[-0.03em] leading-tight text-[#0d1f26] dark:text-white font-heading text-center">
          {t("verifyTitle")}
        </h1>
        <p className="text-[13px] sm:text-[14px] leading-relaxed text-[#0d1f26]/60 dark:text-white/60 mt-2 font-sans text-center break-words">
          {t("verifySubtitle")}
        </p>

        <form className="space-y-3.5 sm:space-y-4 mt-6" onSubmit={handleSubmit} noValidate>
          {!emailParam && (
            <label htmlFor="verify-email" className="group block">
              <span className="block text-xs font-bold tracking-wide text-[#0d1f26]/70 dark:text-white/70 mb-1.5 font-sans">
                {t("emailLabel")}
              </span>
              <div className="flex items-center gap-2.5 rounded-2xl bg-[#f8fafc] dark:bg-white/[0.06] border border-[#0d1f26]/5 dark:border-white/10 px-3.5 py-3.5 focus-within:bg-white dark:focus-within:bg-white/[0.08] focus-within:border-[#5baab8]/40 focus-within:ring-4 focus-within:ring-[#5baab8]/10 transition-all">
                <Mail className="w-4 h-4 text-[#0d1f26]/30 dark:text-white/30 shrink-0" />
                <input
                  id="verify-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  className="flex-1 bg-transparent text-sm font-medium text-[#0d1f26] dark:text-white placeholder:text-[#0d1f26]/30 dark:placeholder:text-white/30 outline-none font-sans min-w-0"
                  autoComplete="email"
                  inputMode="email"
                />
              </div>
            </label>
          )}

          <label htmlFor="verify-code" className="group block">
            <span className="block text-xs font-bold tracking-wide text-[#0d1f26]/70 dark:text-white/70 mb-1.5 font-sans">
              {t("codeLabel")}
            </span>
            <div className="flex items-center gap-2.5 rounded-2xl bg-[#f8fafc] dark:bg-white/[0.06] border border-[#0d1f26]/5 dark:border-white/10 px-3.5 py-3.5 focus-within:bg-white dark:focus-within:bg-white/[0.08] focus-within:border-[#5baab8]/40 focus-within:ring-4 focus-within:ring-[#5baab8]/10 transition-all">
              <ShieldCheck className="w-4 h-4 text-[#0d1f26]/30 dark:text-white/30 shrink-0" />
              <input
                id="verify-code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder={t("codePlaceholder")}
                className="flex-1 bg-transparent text-lg font-bold tracking-[0.4em] text-[#0d1f26] dark:text-white placeholder:text-[#0d1f26]/30 dark:placeholder:text-white/30 placeholder:tracking-[0.2em] outline-none font-sans min-w-0"
                autoComplete="one-time-code"
                inputMode="numeric"
                maxLength={6}
              />
            </div>
          </label>

          {error && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-700 dark:text-red-300 bg-red-50/90 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/30 rounded-2xl px-4 py-3 font-sans flex items-start gap-2.5">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span className="break-words">{error}</span>
            </motion.div>
          )}
          {notice && (
            <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50/90 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30 rounded-2xl px-4 py-3 font-sans flex items-start gap-2.5">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="break-words">{notice}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] font-bold text-sm sm:text-[15px] py-3.5 rounded-2xl hover:bg-[#122a35] dark:hover:bg-[#f1f5f9] transition-all shadow-[0_12px_32px_-12px_rgba(13,31,38,0.45)] disabled:opacity-60 disabled:cursor-not-allowed font-sans inline-flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 dark:border-[#0d1f26]/20 border-t-white dark:border-t-[#0d1f26] rounded-full animate-spin" />
                {t("verifying")}
              </>
            ) : (
              <>
                {t("verifyButton")} <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center text-sm font-sans text-[#0d1f26]/60 dark:text-white/50">
            {t("codeSentTo")}{" "}
            {emailParam ? (
              <span className="font-semibold text-[#0d1f26] dark:text-white break-all">{emailParam}</span>
            ) : (
              t("yourEmail")
            )}
          </div>

          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border border-[#0d1f26]/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.04] px-4 py-3 text-sm font-semibold text-[#0d1f26] dark:text-white hover:bg-white dark:hover:bg-white/[0.08] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans"
          >
            <RefreshCw className={`w-4 h-4 ${cooldown > 0 ? "opacity-40" : ""}`} />
            {cooldown > 0 ? t("resendIn", { seconds: cooldown }) : t("resendCode")}
          </button>

          <p className="text-center text-sm text-[#0d1f26]/60 dark:text-white/50 font-sans pt-1">
            <Link href="/sign-in" className="inline-flex items-center gap-1 font-bold text-[#0d1f26] dark:text-white hover:text-[#5baab8] dark:hover:text-[#8fd3df] transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> {t("backToSignIn")}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
