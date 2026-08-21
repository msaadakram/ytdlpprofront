"use client";

import { useState, useRef, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Mail, LockKeyhole, Eye, EyeOff, ArrowLeft, Check, User as UserIcon,
  Sparkles, ShieldCheck, Zap
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTranslations } from "next-intl";
import { GoogleSignInButton } from "./GoogleSignInButton";

type AuthMode = "signin" | "signup";

function AuthAside() {
  const t = useTranslations("Auth");
  return (
    <aside className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#0d1f26] to-[#143542] rounded-[2rem] p-10 text-white shadow-2xl shadow-[#0d1f26]/20 max-w-md w-full shrink-0 lg:h-[640px]">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <img src="/logo.png" alt="DownForge" className="w-12 h-12 object-contain drop-shadow-lg" />
          <span className="text-xl font-extrabold tracking-tight font-heading">DownForge</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight font-heading">{t("asideTitle")}</h2>
        <p className="text-base sm:text-lg text-white/70 leading-relaxed font-sans">{t("asideDesc")}</p>
      </div>
      <div className="space-y-5">
        {[
          { key: "asideCheck1", icon: ShieldCheck },
          { key: "asideCheck2", icon: Zap },
          { key: "asideCheck3", icon: Sparkles },
        ].map(({ key, icon: Icon }) => (
          <div key={key} className="flex items-center gap-4 text-sm sm:text-base text-white/90 font-sans bg-white/5 rounded-xl px-4 py-3 backdrop-blur-sm border border-white/10">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#5baab8]/20 text-[#5baab8] shrink-0">
              <Icon className="w-4 h-4" />
            </span>
            {t(key)}
          </div>
        ))}
      </div>
    </aside>
  );
}

export function AuthPage({ mode }: { mode: AuthMode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const { login, signup } = useAuth();
  const router = useRouter();
  const isSignIn = mode === "signin";
  const t = useTranslations("Auth");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setGoogleError(null);
    const email = emailRef.current?.value?.trim() || "";
    const password = passwordRef.current?.value || "";

    if (!email || !password) {
      setError(t("errorRequired"));
      return;
    }

    setSubmitting(true);
    try {
      if (isSignIn) {
        const result = await login(email, password);
        if (!result.success) {
          setError(result.error || t("errorSignIn"));
          return;
        }
        router.push("/dashboard");
      } else {
        const first_name = firstNameRef.current?.value?.trim() || "";
        const last_name = lastNameRef.current?.value?.trim() || "";
        if (!first_name || !last_name) {
          setError(t("errorNameRequired"));
          return;
        }
        if (password.length < 6) {
          setError(t("errorPasswordShort"));
          return;
        }
        const result = await signup({ first_name, last_name, email, password });
        if (!result.success) {
          setError(result.error || t("errorSignUp"));
          return;
        }
        router.push("/dashboard");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] dark:from-[#0a0f14] dark:via-[#0d1a22] dark:to-[#122b36] flex flex-col">
      {/* Mobile top decorative bar */}
      <div className="lg:hidden w-full h-1 bg-gradient-to-r from-[#5baab8] via-[#0d1f26] to-[#5baab8]" />

      <main className="flex-1 flex flex-col lg:flex-row items-stretch max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-10 xl:px-16 py-8 sm:py-12 lg:py-0">
        {/* Left decorative panel — hidden on mobile/tablet, visible lg+ */}
        <AuthAside />

        {/* Right content area */}
        <section className="flex-1 flex items-center justify-center w-full min-h-[calc(100vh-4rem)] lg:min-h-screen">
          <div className="w-full max-w-md lg:max-w-lg xl:max-w-xl py-8 lg:py-16">
            {/* Back link */}
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-sm font-medium text-[#0d1f26]/60 dark:text-white/40 hover:text-[#0d1f26] dark:hover:text-white transition-colors mb-8 sm:mb-10 font-sans"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#0d1f26]/5 dark:bg-white/10 hover:bg-[#0d1f26]/10 dark:hover:bg-white/15 transition-colors">
                <ArrowLeft className="w-4 h-4" />
              </span>
              {t("backToHome")}
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white/70 dark:bg-[#0d1f26]/40 backdrop-blur-2xl rounded-[2rem] border border-white/40 dark:border-white/5 shadow-[0_24px_60px_-12px_rgba(13,31,38,0.12)] dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.4)] p-6 sm:p-8 md:p-10 lg:p-12 relative overflow-hidden"
            >
              {/* Subtle decorative glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#5baab8]/10 blur-[80px] pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-[#0d1f26]/5 blur-[60px] pointer-events-none" />

              <div className="relative z-10">
                <div className="mb-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#5baab8]/10 dark:bg-[#5baab8]/15 text-[#0d1f26] dark:text-[#5baab8] px-3 py-1 text-xs font-semibold tracking-wide uppercase font-sans">
                    {isSignIn ? t("signInTitle") : t("signUpTitle")}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-[#0d1f26] dark:text-white mb-3 leading-[1.1] tracking-tight font-heading">
                  {isSignIn ? t("signInTitle") : t("signUpTitle")}
                </h1>
                <p className="text-base sm:text-lg text-[#0d1f26]/50 dark:text-white/50 mb-6 font-sans leading-relaxed">
                  {isSignIn ? t("signInSubtitle") : t("signUpSubtitle")}
                </p>

                {/* Google Sign-In — primary, above email/password */}
                <div className="mb-6">
                  <GoogleSignInButton mode={mode} onError={(msg) => setGoogleError(msg)} disabled={submitting} />
                  {googleError && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-50/60 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-xl px-4 py-3 font-sans flex items-start gap-3"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      <span>{googleError}</span>
                    </motion.div>
                  )}
                </div>

                {/* Divider */}
                <div className="relative flex items-center gap-4 mb-6">
                  <div className="flex-1 h-px bg-[#0d1f26]/10 dark:bg-white/10" />
                  <span className="text-xs font-medium text-[#0d1f26]/40 dark:text-white/30 font-sans tracking-wide uppercase bg-white/70 dark:bg-[#0d1f26]/40 px-3 py-1 rounded-full border border-[#0d1f26]/5 dark:border-white/5">
                    {t("orContinueWithEmail") || "or continue with email"}
                  </span>
                  <div className="flex-1 h-px bg-[#0d1f26]/10 dark:bg-white/10" />
                </div>

                <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit} noValidate>
                  {!isSignIn && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="group">
                        <label htmlFor="firstName" className="block text-sm font-semibold text-[#0d1f26]/80 dark:text-white/80 mb-2 font-sans tracking-tight">
                          {t("firstNameLabel")}
                        </label>
                        <div className="flex items-center gap-3 bg-[#f8fafc] dark:bg-white/5 rounded-2xl px-4 py-3.5 border border-transparent focus-within:border-[#5baab8]/40 focus-within:ring-2 focus-within:ring-[#5baab8]/10 transition-all shadow-[inset_0_1px_3px_rgba(13,31,38,0.05)]">
                          <UserIcon className="w-5 h-5 text-[#0d1f26]/30 dark:text-white/30 shrink-0" />
                          <input
                            id="firstName"
                            ref={firstNameRef}
                            type="text"
                            placeholder="Jane"
                            className="flex-1 bg-transparent text-sm text-[#0d1f26] dark:text-white placeholder:text-[#0d1f26]/30 dark:placeholder:text-white/20 outline-none font-sans min-w-0"
                            autoComplete="given-name"
                          />
                        </div>
                      </div>
                      <div className="group">
                        <label htmlFor="lastName" className="block text-sm font-semibold text-[#0d1f26]/80 dark:text-white/80 mb-2 font-sans tracking-tight">
                          {t("lastNameLabel")}
                        </label>
                        <div className="flex items-center gap-3 bg-[#f8fafc] dark:bg-white/5 rounded-2xl px-4 py-3.5 border border-transparent focus-within:border-[#5baab8]/40 focus-within:ring-2 focus-within:ring-[#5baab8]/10 transition-all shadow-[inset_0_1px_3px_rgba(13,31,38,0.05)]">
                          <UserIcon className="w-5 h-5 text-[#0d1f26]/30 dark:text-white/30 shrink-0" />
                          <input
                            id="lastName"
                            ref={lastNameRef}
                            type="text"
                            placeholder="Doe"
                            className="flex-1 bg-transparent text-sm text-[#0d1f26] dark:text-white placeholder:text-[#0d1f26]/30 dark:placeholder:text-white/20 outline-none font-sans min-w-0"
                            autoComplete="family-name"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="group">
                    <label htmlFor="email" className="block text-sm font-semibold text-[#0d1f26]/80 dark:text-white/80 mb-2 font-sans tracking-tight">
                      {t("emailLabel")}
                    </label>
                    <div className="flex items-center gap-3 bg-[#f8fafc] dark:bg-white/5 rounded-2xl px-4 py-3.5 border border-transparent focus-within:border-[#5baab8]/40 focus-within:ring-2 focus-within:ring-[#5baab8]/10 transition-all shadow-[inset_0_1px_3px_rgba(13,31,38,0.05)]">
                      <Mail className="w-5 h-5 text-[#0d1f26]/30 dark:text-white/30 shrink-0" />
                      <input
                        id="email"
                        ref={emailRef}
                        type="email"
                        placeholder={t("emailPlaceholder")}
                        className="flex-1 bg-transparent text-sm text-[#0d1f26] dark:text-white placeholder:text-[#0d1f26]/30 dark:placeholder:text-white/20 outline-none font-sans min-w-0"
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label htmlFor="password" className="block text-sm font-semibold text-[#0d1f26]/80 dark:text-white/80 mb-2 font-sans tracking-tight">
                      {t("passwordLabel")}
                    </label>
                    <div className="flex items-center gap-3 bg-[#f8fafc] dark:bg-white/5 rounded-2xl px-4 py-3.5 border border-transparent focus-within:border-[#5baab8]/40 focus-within:ring-2 focus-within:ring-[#5baab8]/10 transition-all shadow-[inset_0_1px_3px_rgba(13,31,38,0.05)]">
                      <LockKeyhole className="w-5 h-5 text-[#0d1f26]/30 dark:text-white/30 shrink-0" />
                      <input
                        id="password"
                        ref={passwordRef}
                        type={showPassword ? "text" : "password"}
                        placeholder={t("passwordPlaceholder")}
                        className="flex-1 bg-transparent text-sm text-[#0d1f26] dark:text-white placeholder:text-[#0d1f26]/30 dark:placeholder:text-white/20 outline-none font-sans min-w-0"
                        autoComplete={isSignIn ? "current-password" : "new-password"}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="text-[#0d1f26]/30 dark:text-white/30 hover:text-[#0d1f26] dark:hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5baab8]/40 rounded-lg p-0.5"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-sm text-red-600 dark:text-red-400 bg-red-50/60 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 rounded-xl px-4 py-3.5 font-sans flex items-start gap-3"
                    >
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      <span>{error}</span>
                    </motion.div>
                  )}

                  {isSignIn && (
                    <div className="flex justify-end">
                      <a href="#" className="text-xs font-medium text-[#0d1f26]/40 dark:text-white/30 hover:text-[#5baab8] transition-colors font-sans underline underline-offset-2 decoration-1 decoration-[#5baab8]/20 hover:decoration-[#5baab8]">
                        {t("forgotPassword")}
                      </a>
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: submitting ? 1 : 1.015 }}
                    whileTap={{ scale: submitting ? 1 : 0.985 }}
                    className="w-full bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] font-bold text-sm sm:text-base py-4 rounded-2xl hover:bg-[#163647] dark:hover:bg-[#f1f5f9] transition-all shadow-[0_8px_30px_-8px_rgba(13,31,38,0.35)] dark:shadow-[0_8px_30px_-8px_rgba(255,255,255,0.15)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none font-sans tracking-tight"
                  >
                    {submitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 dark:border-[#0d1f26]/30 border-t-white dark:border-t-[#0d1f26] rounded-full animate-spin" />
                        {t("submitting")}
                      </span>
                    ) : isSignIn ? (
                      t("signInButton")
                    ) : (
                      t("signUpButton")
                    )}
                  </motion.button>
                </form>

                {isSignIn && (
                  <div className="mt-6 text-center">
                    <p className="text-xs sm:text-sm text-[#0d1f26]/40 dark:text-white/30 font-sans">
                      {t("demoHint")}{" "}
                      <span className="font-mono text-[#5baab8] font-semibold">demo@downforge.me</span>{" "}
                      <span className="text-[#0d1f26]/20 dark:text-white/10">/</span>{" "}
                      <span className="font-mono text-[#5baab8] font-semibold">demo1234</span>
                    </p>
                  </div>
                )}

                <p className="text-center text-sm text-[#0d1f26]/50 dark:text-white/40 mt-8 font-sans">
                  {isSignIn ? t("noAccount") : t("hasAccount")}{" "}
                  <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="text-[#5baab8] hover:text-[#0d1f26] dark:hover:text-white font-bold transition-colors underline underline-offset-4 decoration-1 decoration-[#5baab8]/30 hover:decoration-[#5baab8]">
                    {isSignIn ? t("signUpLink") : t("signInLink")}
                  </Link>
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
