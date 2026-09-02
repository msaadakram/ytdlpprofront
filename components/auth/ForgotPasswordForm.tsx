"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import {
  Mail,
  LockKeyhole,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Check,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTranslations } from "next-intl";

type Step = "email" | "reset" | "done";

const RESEND_COOLDOWN_SECONDS = 60;

export function ForgotPasswordForm() {
  const { requestPasswordReset, resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Auth");

  // Prefilled from the reset email's CTA link (?code=...). When a code arrives
  // via the link we skip straight to the reset step (email field is there).
  const emailParam = searchParams.get("email") || "";
  const codeParam = searchParams.get("code") || "";
  const [step, setStep] = useState<Step>(codeParam ? "reset" : "email");
  const [email, setEmail] = useState(emailParam);
  const [code, setCode] = useState(codeParam);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function handleEmailSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError(t("emailRequired"));
      return;
    }
    setSubmitting(true);
    try {
      const result = await requestPasswordReset(email.trim());
      if (!result.success) {
        setError(result.error || t("resetFailed"));
        return;
      }
      setStep("reset");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setResendNotice(null);
    if (!email.trim()) {
      setError(t("emailRequired"));
      return;
    }
    if (!/^\d{6}$/.test(code.trim())) {
      setError(t("invalidCode"));
      return;
    }
    if (newPassword.length < 6) {
      setError(t("errorPasswordShort"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t("passwordsDontMatch"));
      return;
    }
    setSubmitting(true);
    try {
      const result = await resetPassword(email.trim(), code.trim(), newPassword);
      if (!result.success) {
        setError(result.error || t("resetFailed"));
        return;
      }
      setStep("done");
    } finally {
      setSubmitting(false);
    }
  }

  // Resend a fresh reset code (used when the first email didn't arrive or the
  // code expired). Reuses the same rate-limited endpoint as the initial send.
  async function handleResendCode() {
    setError(null);
    setResendNotice(null);
    if (!email.trim()) return;
    setResending(true);
    try {
      const result = await requestPasswordReset(email.trim());
      if (!result.success) {
        // Surface cooldown / rate-limit wait times so the button counts down
        // instead of the user hammering the endpoint.
        const msg = result.error || t("resetFailed");
        const waitMatch = msg.match(/(\d+)\s*s/);
        if (result.code === "RATE_LIMIT" || /wait/i.test(msg) || waitMatch) {
          const secs = waitMatch ? parseInt(waitMatch[1], 10) : RESEND_COOLDOWN_SECONDS;
          setCooldown(Math.min(300, Math.max(5, secs)));
        }
        setError(msg);
        return;
      }
      setResendNotice(t("resetResentNotice"));
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } finally {
      setResending(false);
    }
  }

  if (step === "done") {
    return (
      <Card>
        <div className="mx-auto w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 grid place-items-center mb-5">
          <Check className="w-7 h-7 text-emerald-600" />
        </div>
        <h1 className="text-[1.6rem] sm:text-[1.85rem] font-black tracking-[-0.03em] text-[#0d1f26] dark:text-white font-heading text-center">
          {t("resetSuccessTitle")}
        </h1>
        <p className="text-sm text-[#0d1f26]/60 dark:text-white/60 mt-2 font-sans text-center">
          {t("resetSuccessDesc")}
        </p>
        <button
          onClick={() => router.push("/sign-in")}
          className="mt-6 w-full bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] font-bold text-sm py-3.5 rounded-2xl hover:bg-[#122a35] dark:hover:bg-[#f1f5f9] transition-all shadow-[0_12px_32px_-12px_rgba(13,31,38,0.45)] font-sans inline-flex items-center justify-center gap-2"
        >
          {t("continueToSignIn")} <ArrowRight className="w-4 h-4" />
        </button>
      </Card>
    );
  }

  return (
    <Card>
      <div className="h-[3px] w-full bg-gradient-to-r from-[#5baab8] via-[#0d1f26] to-[#5baab8] opacity-90" />
      <div className="p-5 xs:p-6 sm:p-8 lg:p-9">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-[#f8fafc] dark:bg-white/[0.06] border border-[#0d1f26]/5 dark:border-white/10 grid place-items-center mb-5">
          {step === "email" ? (
            <Mail className="w-7 h-7 text-[#5baab8]" />
          ) : (
            <ShieldCheck className="w-7 h-7 text-[#5baab8]" />
          )}
        </div>
        <h1 className="text-[1.6rem] sm:text-[1.85rem] font-black tracking-[-0.03em] leading-tight text-[#0d1f26] dark:text-white font-heading text-center">
          {step === "email" ? t("forgotTitle") : t("resetTitle")}
        </h1>
        <p className="text-[13px] sm:text-[14px] leading-relaxed text-[#0d1f26]/60 dark:text-white/60 mt-2 font-sans text-center break-words">
          {step === "email" ? t("forgotSubtitle") : t("resetSubtitle")}
        </p>

        {step === "email" ? (
          <form className="space-y-3.5 sm:space-y-4 mt-6" onSubmit={handleEmailSubmit} noValidate>
            <label htmlFor="forgot-email" className="group block">
              <span className="block text-xs font-bold tracking-wide text-[#0d1f26]/70 dark:text-white/70 mb-1.5 font-sans">
                {t("emailLabel")}
              </span>
              <div className="flex items-center gap-2.5 rounded-2xl bg-[#f8fafc] dark:bg-white/[0.06] border border-[#0d1f26]/5 dark:border-white/10 px-3.5 py-3.5 focus-within:bg-white dark:focus-within:bg-white/[0.08] focus-within:border-[#5baab8]/40 focus-within:ring-4 focus-within:ring-[#5baab8]/10 transition-all">
                <Mail className="w-4 h-4 text-[#0d1f26]/30 dark:text-white/30 shrink-0" />
                <input
                  id="forgot-email"
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

            {error && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-700 dark:text-red-300 bg-red-50/90 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/30 rounded-2xl px-4 py-3 font-sans flex items-start gap-2.5">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <span className="break-words">{error}</span>
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
                  {t("submitting")}
                </>
              ) : (
                <>
                  {t("sendResetCode")} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-[#0d1f26]/60 dark:text-white/50 font-sans pt-1">
              <Link href="/sign-in" className="inline-flex items-center gap-1 font-bold text-[#0d1f26] dark:text-white hover:text-[#5baab8] dark:hover:text-[#8fd3df] transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> {t("backToSignIn")}
              </Link>
            </p>
          </form>
        ) : (
          <form className="space-y-3.5 sm:space-y-4 mt-6" onSubmit={handleResetSubmit} noValidate>
            <label htmlFor="reset-email" className="group block">
              <span className="block text-xs font-bold tracking-wide text-[#0d1f26]/70 dark:text-white/70 mb-1.5 font-sans">
                {t("emailLabel")}
              </span>
              <div className="flex items-center gap-2.5 rounded-2xl bg-[#f8fafc] dark:bg-white/[0.06] border border-[#0d1f26]/5 dark:border-white/10 px-3.5 py-3.5 focus-within:bg-white dark:focus-within:bg-white/[0.08] focus-within:border-[#5baab8]/40 focus-within:ring-4 focus-within:ring-[#5baab8]/10 transition-all">
                <Mail className="w-4 h-4 text-[#0d1f26]/30 dark:text-white/30 shrink-0" />
                <input
                  id="reset-email"
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

            <label htmlFor="reset-code" className="group block">
              <span className="block text-xs font-bold tracking-wide text-[#0d1f26]/70 dark:text-white/70 mb-1.5 font-sans">
                {t("codeLabel")}
              </span>
              <div className="flex items-center gap-2.5 rounded-2xl bg-[#f8fafc] dark:bg-white/[0.06] border border-[#0d1f26]/5 dark:border-white/10 px-3.5 py-3.5 focus-within:bg-white dark:focus-within:bg-white/[0.08] focus-within:border-[#5baab8]/40 focus-within:ring-4 focus-within:ring-[#5baab8]/10 transition-all">
                <ShieldCheck className="w-4 h-4 text-[#0d1f26]/30 dark:text-white/30 shrink-0" />
                <input
                  id="reset-code"
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

            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-[#0d1f26]/50 dark:text-white/40 font-sans">
                {t("resetNoCode")}
              </p>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={cooldown > 0 || resending || submitting}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5baab8] hover:text-[#0d1f26] dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-sans"
              >
                {resending ? (
                  <span className="w-3.5 h-3.5 border-2 border-[#5baab8]/30 border-t-[#5baab8] rounded-full animate-spin" />
                ) : (
                  <RefreshCw className="w-3.5 h-3.5" />
                )}
                {cooldown > 0 ? t("resendIn", { seconds: cooldown }) : t("resendCode")}
              </button>
            </div>

            {resendNotice && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50/90 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30 rounded-2xl px-4 py-3 font-sans flex items-start gap-2.5">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="break-words">{resendNotice}</span>
              </motion.div>
            )}

            <label htmlFor="new-password" className="group block">
              <span className="block text-xs font-bold tracking-wide text-[#0d1f26]/70 dark:text-white/70 mb-1.5 font-sans">
                {t("newPasswordLabel")}
              </span>
              <div className="flex items-center gap-2.5 rounded-2xl bg-[#f8fafc] dark:bg-white/[0.06] border border-[#0d1f26]/5 dark:border-white/10 px-3.5 py-3.5 focus-within:bg-white dark:focus-within:bg-white/[0.08] focus-within:border-[#5baab8]/40 focus-within:ring-4 focus-within:ring-[#5baab8]/10 transition-all">
                <LockKeyhole className="w-4 h-4 text-[#0d1f26]/30 dark:text-white/30 shrink-0" />
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t("passwordPlaceholder")}
                  className="flex-1 bg-transparent text-sm font-medium text-[#0d1f26] dark:text-white placeholder:text-[#0d1f26]/30 dark:placeholder:text-white/30 outline-none font-sans min-w-0"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="w-8 h-8 grid place-items-center rounded-xl bg-white dark:bg-white/10 border border-[#0d1f26]/5 dark:border-white/10 text-[#0d1f26]/40 dark:text-white/40 hover:text-[#0d1f26] dark:hover:text-white transition-colors shrink-0" aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </label>


            <label htmlFor="confirm-password" className="group block">
              <span className="block text-xs font-bold tracking-wide text-[#0d1f26]/70 dark:text-white/70 mb-1.5 font-sans">
                {t("confirmPasswordLabel")}
              </span>
              <div className="flex items-center gap-2.5 rounded-2xl bg-[#f8fafc] dark:bg-white/[0.06] border border-[#0d1f26]/5 dark:border-white/10 px-3.5 py-3.5 focus-within:bg-white dark:focus-within:bg-white/[0.08] focus-within:border-[#5baab8]/40 focus-within:ring-4 focus-within:ring-[#5baab8]/10 transition-all">
                <LockKeyhole className="w-4 h-4 text-[#0d1f26]/30 dark:text-white/30 shrink-0" />
                <input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t("passwordPlaceholder")}
                  className="flex-1 bg-transparent text-sm font-medium text-[#0d1f26] dark:text-white placeholder:text-[#0d1f26]/30 dark:placeholder:text-white/30 outline-none font-sans min-w-0"
                  autoComplete="new-password"
                />
              </div>
            </label>

            {error && (
              <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-700 dark:text-red-300 bg-red-50/90 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/30 rounded-2xl px-4 py-3 font-sans flex items-start gap-2.5">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <span className="break-words">{error}</span>
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
                  {t("resetting")}
                </>
              ) : (
                <>
                  {t("resetButton")} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="text-center text-sm text-[#0d1f26]/60 dark:text-white/50 font-sans pt-1">
              <Link href="/sign-in" className="inline-flex items-center gap-1 font-bold text-[#0d1f26] dark:text-white hover:text-[#5baab8] dark:hover:text-[#8fd3df] transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> {t("backToSignIn")}
              </Link>
            </p>
          </form>
        )}
      </div>
    </Card>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[520px] mx-auto bg-white/85 dark:bg-white/[0.06] backdrop-blur-2xl rounded-[1.75rem] sm:rounded-[2rem] border border-white/60 dark:border-white/10 shadow-[0_20px_48px_-16px_rgba(13,31,38,0.16)] overflow-hidden">
      {children}
    </div>
  );
}
