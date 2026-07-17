"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Download, Mail, LockKeyhole, Eye, EyeOff, ArrowLeft, Check,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

type AuthMode = "signin" | "signup";

function AuthAside() {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-[#0d1f26] rounded-3xl p-10 text-white max-w-sm">
      <div>
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-6">
          <Download className="w-5 h-5 text-[#5baab8]" />
        </div>
        <h3 className="text-2xl font-bold mb-3 font-heading">Join thousands of creators</h3>
        <p className="text-sm text-white/60 leading-relaxed font-sans">
          Download videos, audio, and thumbnails from 200+ platforms. Fast, secure, and reliable.
        </p>
      </div>
      <div className="space-y-4">
        {["No credit card required", "Unlimited free downloads", "200+ platforms supported"].map((text) => (
          <div key={text} className="flex items-center gap-3 text-sm text-white/80 font-sans">
            <Check className="w-4 h-4 text-[#5baab8]" />
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AuthPage({ mode }: { mode: AuthMode }) {
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const { login } = useAuth();
  const router = useRouter();
  const isSignIn = mode === "signin";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const email = emailRef.current?.value?.trim() || "user@example.com";
    login(email);
    router.push("/dashboard");
  }

  return (
    <div className="max-w-4xl mx-auto px-6 w-full">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 font-sans">
        <ArrowLeft className="w-4 h-4" /> Back to home
      </Link>
      <div className="flex gap-10 items-start">
        <AuthAside />
        <div className="flex-1 max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-3xl font-extrabold text-foreground mb-2 font-heading">
              {isSignIn ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-muted-foreground mb-8 font-sans">
              {isSignIn ? "Sign in to access your dashboard and downloads." : "Start downloading from 200+ platforms instantly."}
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 font-sans">Email</label>
                <div className="flex items-center gap-3 bg-[#eef6f8] rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#5baab8]/40 transition-all">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <input ref={emailRef} type="email" placeholder="you@example.com" className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5 font-sans">Password</label>
                <div className="flex items-center gap-3 bg-[#eef6f8] rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#5baab8]/40 transition-all">
                  <LockKeyhole className="w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isSignIn && (
                <div className="flex justify-end">
                  <a href="#" className="text-xs text-muted-foreground hover:text-[#5baab8] transition-colors font-sans">Forgot password?</a>
                </div>
              )}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#0d1f26] text-white font-semibold text-sm py-3 rounded-xl hover:bg-[#1a3545] transition-colors font-sans"
              >
                {isSignIn ? "Sign In" : "Create Account"}
              </motion.button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6 font-sans">
              {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
              <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="text-[#5baab8] hover:underline font-medium">
                {isSignIn ? "Sign up" : "Sign in"}
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
