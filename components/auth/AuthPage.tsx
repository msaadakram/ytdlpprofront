"use client";

import { useState, useRef, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Mail, LockKeyhole, Eye, EyeOff, ArrowLeft, Check, User as UserIcon,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useTranslations } from "next-intl";

type AuthMode = "signin" | "signup";

function AuthAside() {
  const t = useTranslations("Auth");
  return (
    <div className="hidden lg:flex flex-col justify-between bg-[#0d1f26] rounded-3xl p-10 text-white max-w-sm">
      <div>
        <img
          src="/logo.png"
          alt="DownForge"
          className="w-10 h-10 object-contain mb-6"
        />
        <h3 className="text-2xl font-bold mb-3 font-heading">{t("asideTitle")}</h3>
        <p className="text-sm text-white/60 leading-relaxed font-sans">
          {t("asideDesc")}
        </p>
      </div>
      <div className="space-y-4">
        {["asideCheck1", "asideCheck2", "asideCheck3"].map((key) => (
          <div key={key} className="flex items-center gap-3 text-sm text-white/80 font-sans">
            <Check className="w-4 h-4 text-[#5baab8]" />
            {t(key)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AuthPage({ mode }: { mode: AuthMode }) {
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
      }
      router.push("/dashboard");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 w-full">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 font-sans">
        <ArrowLeft className="w-4 h-4" /> {t("backToHome")}
      </Link>
      <div className="flex gap-10 items-start">
        <AuthAside />
        <div className="flex-1 max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-extrabold text-foreground mb-2 font-heading">
              {isSignIn ? t("signInTitle") : t("signUpTitle")}
            </h1>
            <p className="text-sm text-muted-foreground mb-8 font-sans">
              {isSignIn ? t("signInSubtitle") : t("signUpSubtitle")}
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {!isSignIn && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5 font-sans">{t("firstNameLabel")}</label>
                    <div className="flex items-center gap-3 bg-[#eef6f8] rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#5baab8]/40 transition-all">
                      <UserIcon className="w-4 h-4 text-muted-foreground" />
                      <input ref={firstNameRef} type="text" placeholder="Jane" className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5 font-sans">{t("lastNameLabel")}</label>
                    <div className="flex items-center gap-3 bg-[#eef6f8] rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#5baab8]/40 transition-all">
                      <UserIcon className="w-4 h-4 text-muted-foreground" />
                      <input ref={lastNameRef} type="text" placeholder="Doe" className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans" />
                    </div>
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 font-sans">{t("emailLabel")}</label>
                <div className="flex items-center gap-3 bg-[#eef6f8] rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#5baab8]/40 transition-all">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <input ref={emailRef} type="email" placeholder={t("emailPlaceholder")} className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 font-sans">{t("passwordLabel")}</label>
                <div className="flex items-center gap-3 bg-[#eef6f8] rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#5baab8]/40 transition-all">
                  <LockKeyhole className="w-4 h-4 text-muted-foreground" />
                  <input
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    placeholder={t("passwordPlaceholder")}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 font-sans">
                  {error}
                </div>
              )}

              {isSignIn && (
                <div className="flex justify-end">
                  <a href="#" className="text-xs text-muted-foreground hover:text-[#5baab8] transition-colors font-sans">{t("forgotPassword")}</a>
                </div>
              )}

              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: submitting ? 1 : 1.02 }}
                whileTap={{ scale: submitting ? 1 : 0.98 }}
                className="w-full bg-[#0d1f26] text-white font-semibold text-sm py-3 rounded-xl hover:bg-[#1a3545] transition-colors font-sans disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? t("submitting") : isSignIn ? t("signInButton") : t("signUpButton")}
              </motion.button>
            </form>

            {isSignIn && (
              <p className="text-xs text-muted-foreground mt-4 text-center font-sans">
                {t("demoHint")} <span className="font-mono text-[#5baab8]">demo@downforge.me</span> / <span className="font-mono text-[#5baab8]">demo1234</span>
              </p>
            )}

            <p className="text-center text-sm text-muted-foreground mt-6 font-sans">
              {isSignIn ? t("noAccount") : t("hasAccount")}{" "}
              <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="text-[#5baab8] hover:underline font-medium">
                {isSignIn ? t("signUpLink") : t("signInLink")}
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
