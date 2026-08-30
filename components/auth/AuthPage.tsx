"use client";

import { useState, useRef, type FormEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  Check,
  User as UserIcon,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  Star,
  Play,
  Download,
  Globe,
  Lock,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTranslations } from "next-intl";
import { GoogleSignInButton } from "./GoogleSignInButton";

type AuthMode = "signin" | "signup";

function AuthAside() {
  const t = useTranslations("Auth");
  return (
    <aside className="hidden lg:flex relative flex-col justify-between overflow-hidden rounded-[2.5rem] bg-[#0d1f26] p-10 text-white shadow-[0_32px_80px_-20px_rgba(13,31,38,0.45)] max-w-[440px] w-full shrink-0 min-h-[680px] lg:h-auto">
      {/* Mesh gradients */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-gradient-to-br from-[#5baab8]/30 via-[#3d8896]/20 to-transparent blur-[60px]" />
        <div className="absolute -bottom-24 -left-24 w-[380px] h-[380px] rounded-full bg-gradient-to-tr from-[#0ea5b0]/20 via-[#5baab8]/15 to-transparent blur-[50px]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: `22px 22px` }} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg">
            <img src="/logo.png" alt="DownForge" className="w-9 h-9 object-contain scale-110" />
          </div>
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-white/60 font-sans">DownForge</span>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide text-white/90 font-sans">200+ platforms live</span>
        </div>

        <h2 className="text-[2.1rem] xl:text-[2.4rem] font-black leading-[0.95] tracking-[-0.03em] font-heading mb-4">
          {t("asideTitle")}
          <span className="bg-gradient-to-r from-[#5baab8] to-[#8fd3df] bg-clip-text text-transparent">.</span>
        </h2>
        <p className="text-[15px] leading-relaxed text-white/65 font-sans max-w-[32ch]">{t("asideDesc")}</p>

        {/* Mock preview card */}
        <div className="mt-8 rounded-[1.6rem] bg-white/[0.07] backdrop-blur-xl border border-white/10 p-4 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow">
                <Play className="w-4 h-4 text-[#0d1f26] ml-0.5" fill="currentColor" />
              </div>
              <div>
                <div className="text-xs font-bold text-white font-sans">4K Video ready</div>
                <div className="text-[11px] text-white/50 font-sans">youtube.com/watch?v=...</div>
              </div>
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase bg-emerald-400 text-[#0d1f26] px-2 py-1 rounded-full">Done</span>
          </div>
          <div className="space-y-3">
            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.8, ease: "easeOut", delay: 0.4 }} className="h-full bg-gradient-to-r from-[#5baab8] to-white" />
            </div>
            <div className="flex items-center gap-2 text-[11px] font-medium text-white/60 font-sans">
              <Download className="w-3.5 h-3.5" />
              <span>MP4 • 2160p • 342 MB</span>
              <span className="ml-auto flex items-center gap-1 text-white">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Secure
              </span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { k: "4K", l: "Video" },
              { k: "FLAC", l: "Audio" },
              { k: "SRT", l: "Captions" },
            ].map((f) => (
              <div key={f.k} className="rounded-xl bg-white text-[#0d1f26] px-3 py-2.5 text-center">
                <div className="text-xs font-black font-heading">{f.k}</div>
                <div className="text-[10px] font-semibold tracking-wide uppercase text-black/50 font-sans">{f.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 space-y-3 mt-8">
        {[
          { key: "asideCheck1", icon: ShieldCheck, sub: "AES-256 • No logs" },
          { key: "asideCheck2", icon: Zap, sub: "< 3s avg processing" },
          { key: "asideCheck3", icon: Globe, sub: "YouTube → 200+ sites" },
        ].map(({ key, icon: Icon, sub }) => (
          <div key={key} className="flex items-center gap-3 rounded-2xl bg-white/[0.06] border border-white/10 px-4 py-3 backdrop-blur-sm">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white text-[#0d1f26] shadow-sm shrink-0">
              <Icon className="w-4 h-4" />
            </span>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-white font-sans leading-none">{t(key)}</div>
              <div className="text-xs text-white/50 font-sans">{sub}</div>
            </div>
            <Check className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />
          </div>
        ))}

        <div className="flex items-center gap-3 pt-4 border-t border-white/10 mt-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <img key={i} src={`https://i.pravatar.cc/100?img=${10 + i}`} alt="" className="w-8 h-8 rounded-full border-2 border-[#0d1f26] object-cover" />
            ))}
            <span className="w-8 h-8 rounded-full bg-white text-[#0d1f26] border-2 border-[#0d1f26] flex items-center justify-center text-[11px] font-bold">+2k</span>
          </div>
          <div className="text-xs font-sans">
            <div className="flex items-center gap-1 text-white font-semibold">
              <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" /> 4.9/5
              <span className="text-white/40 font-normal">• trusted by creators</span>
            </div>
            <div className="text-white/50">No credit card required</div>
          </div>
        </div>
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
  const [agree, setAgree] = useState(false);
  const [password, setPassword] = useState("");
  const [pwFocused, setPwFocused] = useState(false);
  const { login, signup, logout, user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const isSignIn = mode === "signin";
  const t = useTranslations("Auth");

  // If already signed in with a verified account, redirect to dashboard.
  // If an unverified session somehow exists (stale token), force verification
  // instead of allowing dashboard access — closes signup-without-verify loophole.
  useEffect(() => {
    if (!authLoading && user && user.email_verified === false) {
      const email = encodeURIComponent(user.email || emailRef.current?.value?.trim() || "");
      router.replace(`/verify-email?email=${email}`);
      return;
    }
    if (!authLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [authLoading, isAuthenticated, user, router]);

  // Live strength - updates as you type (reactive via state)
  const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;

  // While auth state is loading, show spinner; if already authenticated, redirecting state
  if (authLoading || isAuthenticated) {
    return (
      <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#070d12] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#5baab8] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-sans">{authLoading ? "Loading…" : "Redirecting to dashboard…"}</p>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setGoogleError(null);
    const email = emailRef.current?.value?.trim() || "";
    // Use state-driven password for reliability (keeps ref in sync)
    const pwd = password || passwordRef.current?.value || "";

    if (!email || !pwd) {
      setError(t("errorRequired"));
      return;
    }
    if (!isSignIn && !agree) {
      setError("Please agree to the Terms and Privacy Policy.");
      return;
    }

    setSubmitting(true);
    try {
      if (isSignIn) {
        const result = await login(email, pwd);
        if (!result.success) {
          if (result.code === "EMAIL_NOT_VERIFIED") {
            // Route the user into the email verification flow.
            router.push(`/verify-email?email=${encodeURIComponent(email)}`);
            return;
          }
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
        if (pwd.length < 6) {
          setError(t("errorPasswordShort"));
          return;
        }
        const result = await signup({ first_name, last_name, email, password: pwd });
        if (!result.success) {
          setError(result.error || t("errorSignUp"));
          return;
        }
        // Account created unverified — no session is issued (backend no longer
        // creates a token for unverified users, closing the loophole). Go
        // straight to verification; no logout needed.
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] dark:bg-[#070d12] flex flex-col relative overflow-x-hidden">
      {/* Background mesh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] dark:from-[#0a0f14] dark:via-[#0d1a22] dark:to-[#0b1e29]" />
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]" style={{ backgroundImage: `linear-gradient(to right,#0d1f26 1px,transparent 1px), linear-gradient(to bottom,#0d1f26 1px,transparent 1px)`, backgroundSize: `32px 32px` }} />
        <div className="absolute top-[-80px] right-[-80px] w-[400px] sm:w-[560px] h-[400px] sm:h-[560px] rounded-full bg-gradient-to-br from-[#5baab8]/18 via-[#8fd3df]/12 to-transparent blur-[60px] sm:blur-[70px]" />
        <div className="absolute bottom-[-80px] left-[-80px] w-[420px] sm:w-[640px] h-[420px] sm:h-[640px] rounded-full bg-gradient-to-tr from-[#0d1f26]/8 via-[#5baab8]/10 to-transparent blur-[60px] sm:blur-[80px]" />
      </div>

      <main className="relative flex-1 flex flex-col lg:flex-row items-center justify-center max-w-[1120px] mx-auto w-full px-3 xs:px-4 sm:px-6 lg:px-8 py-6 xs:py-6 sm:py-10 lg:py-10 gap-4 sm:gap-6 lg:gap-8">
        <AuthAside />

        {/* Right card */}
        <section className="flex-1 flex items-center justify-center w-full min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-[520px] bg-white/85 dark:bg-white/[0.06] backdrop-blur-2xl rounded-[1.75rem] sm:rounded-[2rem] border border-white/60 dark:border-white/10 shadow-[0_20px_48px_-16px_rgba(13,31,38,0.16),0_1px_0_0_rgba(255,255,255,0.6)_inset] dark:shadow-[0_24px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Top accent */}
            <div className="h-[3px] w-full bg-gradient-to-r from-[#5baab8] via-[#0d1f26] to-[#5baab8] opacity-90" />
            <div className="p-5 xs:p-6 sm:p-8 lg:p-9">
              <div className="flex items-center justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
                <span className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#0d1f26] text-white dark:bg-white dark:text-[#0d1f26] px-3 sm:px-3.5 py-1.5 text-[10px] sm:text-[11px] font-bold tracking-[0.12em] sm:tracking-[0.14em] uppercase font-sans shadow-sm shrink-0">
                  <Lock className="w-3 h-3 shrink-0" />
                  {isSignIn ? t("signInTitle") : t("signUpTitle")}
                </span>
                <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-medium text-[#0d1f26]/50 dark:text-white/40 font-sans shrink-0">
                  <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" /> <span className="hidden xs:inline">Encrypted & secure</span><span className="xs:hidden">Secure</span>
                </span>
              </div>

              <h1 className="text-[1.65rem] xs:text-[1.85rem] sm:text-[2.05rem] font-black tracking-[-0.03em] leading-[0.95] text-[#0d1f26] dark:text-white font-heading break-words">
                {isSignIn ? t("signInTitle") : t("signUpTitle")}
              </h1>
              <p className="text-[13px] sm:text-[14px] leading-relaxed text-[#0d1f26]/60 dark:text-white/60 mt-2 sm:mt-2.5 font-sans break-words">
                {isSignIn ? t("signInSubtitle") : t("signUpSubtitle")}
              </p>

              {/* Google */}
              <div className="mt-5 sm:mt-7">
                <GoogleSignInButton mode={mode} onError={(msg) => setGoogleError(msg)} disabled={submitting} />
                {googleError && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-sm text-red-700 dark:text-red-300 bg-red-50/90 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/30 rounded-2xl px-3 sm:px-4 py-3 font-sans flex items-start gap-2.5 break-words"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    <span className="break-words min-w-0">{googleError}</span>
                  </motion.div>
                )}
              </div>

              <div className="relative flex items-center gap-2 sm:gap-4 my-5 sm:my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#0d1f26]/10 dark:via-white/10 to-transparent" />
                <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.12em] sm:tracking-[0.14em] uppercase text-[#0d1f26]/40 dark:text-white/30 bg-white dark:bg-white/5 border border-[#0d1f26]/5 dark:border-white/10 px-2.5 sm:px-3 py-1 rounded-full font-sans whitespace-nowrap">
                  {t("orContinueWithEmail") || "or continue with email"}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#0d1f26]/10 dark:via-white/10 to-transparent" />
              </div>

              <form className="space-y-3.5 sm:space-y-4" onSubmit={handleSubmit} noValidate>
                {!isSignIn && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    {[
                      { id: "firstName", ref: firstNameRef, label: t("firstNameLabel"), placeholder: "Jane", auto: "given-name" },
                      { id: "lastName", ref: lastNameRef, label: t("lastNameLabel"), placeholder: "Doe", auto: "family-name" },
                    ].map((f) => (
                      <label key={f.id} htmlFor={f.id} className="group block">
                        <span className="block text-xs font-bold tracking-wide text-[#0d1f26]/70 dark:text-white/70 mb-1.5 font-sans">{f.label}</span>
                        <div className="flex items-center gap-2 sm:gap-2.5 rounded-xl sm:rounded-2xl bg-[#f8fafc] dark:bg-white/[0.06] border border-[#0d1f26]/5 dark:border-white/10 px-3 sm:px-3.5 py-3 sm:py-3 focus-within:bg-white dark:focus-within:bg-white/[0.08] focus-within:border-[#5baab8]/40 focus-within:ring-4 focus-within:ring-[#5baab8]/10 transition-all">
                          <UserIcon className="w-4 h-4 text-[#0d1f26]/30 dark:text-white/30 group-focus-within:text-[#5baab8] transition-colors shrink-0" />
                          <input id={f.id} ref={f.ref as any} type="text" placeholder={f.placeholder} className="flex-1 bg-transparent text-sm font-medium text-[#0d1f26] dark:text-white placeholder:text-[#0d1f26]/30 dark:placeholder:text-white/30 outline-none font-sans min-w-0" autoComplete={f.auto} />
                        </div>
                      </label>
                    ))}
                  </motion.div>
                )}

                <label htmlFor="email" className="group block">
                  <span className="block text-xs font-bold tracking-wide text-[#0d1f26]/70 dark:text-white/70 mb-1.5 font-sans">{t("emailLabel")}</span>
                  <div className="flex items-center gap-2 sm:gap-2.5 rounded-xl sm:rounded-2xl bg-[#f8fafc] dark:bg-white/[0.06] border border-[#0d1f26]/5 dark:border-white/10 px-3 sm:px-3.5 py-3 sm:py-3.5 focus-within:bg-white dark:focus-within:bg-white/[0.08] focus-within:border-[#5baab8]/40 focus-within:ring-4 focus-within:ring-[#5baab8]/10 transition-all">
                    <Mail className="w-4 h-4 text-[#0d1f26]/30 dark:text-white/30 group-focus-within:text-[#5baab8] transition-colors shrink-0" />
                    <input id="email" ref={emailRef} type="email" placeholder={t("emailPlaceholder")} className="flex-1 bg-transparent text-sm font-medium text-[#0d1f26] dark:text-white placeholder:text-[#0d1f26]/30 dark:placeholder:text-white/30 outline-none font-sans min-w-0" autoComplete="email" inputMode="email" />
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-2 py-1 rounded-full shrink-0">
                      <Check className="w-3 h-3" /> Verified
                    </span>
                  </div>
                </label>

                <label htmlFor="password" className="group block">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold tracking-wide text-[#0d1f26]/70 dark:text-white/70 font-sans">{t("passwordLabel")}</span>
                    {isSignIn && <Link href="/forgot-password" className="text-xs font-semibold text-[#5baab8] hover:text-[#0d1f26] dark:hover:text-white transition-colors font-sans shrink-0">{t("forgotPassword")}</Link>}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-2.5 rounded-xl sm:rounded-2xl bg-[#f8fafc] dark:bg-white/[0.06] border border-[#0d1f26]/5 dark:border-white/10 px-3 sm:px-3.5 py-3 sm:py-3.5 focus-within:bg-white dark:focus-within:bg-white/[0.08] focus-within:border-[#5baab8]/40 focus-within:ring-4 focus-within:ring-[#5baab8]/10 transition-all">
                    <LockKeyhole className="w-4 h-4 text-[#0d1f26]/30 dark:text-white/30 group-focus-within:text-[#5baab8] transition-colors shrink-0" />
                    <input
                      id="password"
                      ref={passwordRef}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (!pwFocused) setPwFocused(true);
                      }}
                      type={showPassword ? "text" : "password"}
                      placeholder={t("passwordPlaceholder")}
                      onFocus={() => setPwFocused(true)}
                      onBlur={() => setPwFocused(false)}
                      className="flex-1 bg-transparent text-sm font-medium text-[#0d1f26] dark:text-white placeholder:text-[#0d1f26]/30 dark:placeholder:text-white/30 outline-none font-sans min-w-0"
                      autoComplete={isSignIn ? "current-password" : "new-password"}
                    />
                    <button type="button" onClick={() => setShowPassword((s) => !s)} className="w-8 h-8 grid place-items-center rounded-xl bg-white dark:bg-white/10 border border-[#0d1f26]/5 dark:border-white/10 text-[#0d1f26]/40 dark:text-white/40 hover:text-[#0d1f26] dark:hover:text-white transition-colors shrink-0" aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {!isSignIn && (
                    <div className="mt-2 flex items-center gap-1.5">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i <= pwStrength ? (pwStrength === 1 ? "bg-red-400" : pwStrength === 2 ? "bg-amber-400" : "bg-emerald-500") : "bg-[#0d1f26]/10 dark:bg-white/10"}`} />
                      ))}
                      <span className="ml-2 text-xs font-medium text-[#0d1f26]/50 dark:text-white/40 font-sans min-w-[40px] text-right">{pwStrength === 0 ? " " : pwStrength === 1 ? "Weak" : pwStrength === 2 ? "Good" : "Strong"}</span>
                    </div>
                  )}
                </label>

                {!isSignIn && (
                  <label className="flex items-start gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl bg-[#f8fafc]/70 dark:bg-white/[0.04] border border-[#0d1f26]/5 dark:border-white/5 px-3 sm:px-3.5 py-3 cursor-pointer">
                    <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 w-4 h-4 rounded-md border-[#0d1f26]/20 text-[#0d1f26] focus:ring-[#5baab8]/30 shrink-0" />
                    <span className="text-xs leading-relaxed text-[#0d1f26]/60 dark:text-white/50 font-sans break-words">
                      I agree to the <Link href="/privacy" className="font-semibold text-[#0d1f26] dark:text-white underline decoration-1 underline-offset-2">Terms</Link> and <Link href="/privacy" className="font-semibold text-[#0d1f26] dark:text-white underline decoration-1 underline-offset-2">Privacy Policy</Link>.
                    </span>
                  </label>
                )}

                {error && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-700 dark:text-red-300 bg-red-50/90 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/30 rounded-2xl px-3 sm:px-4 py-3 font-sans flex items-start gap-2.5 break-words">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                    <span className="break-words min-w-0">{error}</span>
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: submitting ? 1 : 1.012 }}
                  whileTap={{ scale: submitting ? 1 : 0.985 }}
                  className="group/button relative w-full overflow-hidden bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] font-bold text-sm sm:text-[15px] py-3.5 sm:py-[15px] rounded-xl sm:rounded-2xl hover:bg-[#122a35] dark:hover:bg-[#f1f5f9] transition-all shadow-[0_12px_32px_-12px_rgba(13,31,38,0.45)] dark:shadow-[0_12px_32px_-12px_rgba(255,255,255,0.25)] disabled:opacity-60 disabled:cursor-not-allowed font-sans flex items-center justify-center gap-2 touch-manipulation"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover/button:translate-x-[100%] transition-transform duration-700" />
                  {submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 dark:border-[#0d1f26]/20 border-t-white dark:border-t-[#0d1f26] rounded-full animate-spin" />
                      {t("submitting")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      {isSignIn ? t("signInButton") : t("signUpButton")}
                      <ArrowRight className="w-4 h-4 group-hover/button:translate-x-0.5 transition-transform" />
                    </span>
                  )}
                </motion.button>
              </form>

              <p className="text-center text-sm text-[#0d1f26]/60 dark:text-white/50 mt-5 sm:mt-6 font-sans px-2">
                {isSignIn ? t("noAccount") : t("hasAccount")}{" "}
                <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="inline-flex items-center gap-1 font-bold text-[#0d1f26] dark:text-white hover:text-[#5baab8] dark:hover:text-[#8fd3df] transition-colors">
                  {isSignIn ? t("signUpLink") : t("signInLink")} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </p>

              <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-medium tracking-wide text-[#0d1f26]/35 dark:text-white/30 font-sans px-2">
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <Lock className="w-3 h-3" /> SSL secured
                </span>
                <span className="hidden xs:block w-1 h-1 rounded-full bg-current opacity-30" />
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                  <ShieldCheck className="w-3 h-3" /> No spam
                </span>
                <span className="hidden xs:block w-1 h-1 rounded-full bg-current opacity-30" />
                <span className="whitespace-nowrap">Cancel anytime</span>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
