"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Send, Loader2, CheckCircle2, Mail, User, MessageSquare, Tag } from "lucide-react";
import { toast } from "sonner";
import { sendContactMessage } from "@/lib/api-client";

export function ContactForm() {
  const t = useTranslations("Contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  let subjectOptions: string[] = [];
  try {
    const raw = t.raw("subjectOptions") as unknown;
    if (Array.isArray(raw)) subjectOptions = raw as string[];
  } catch {
    subjectOptions = ["General inquiry", "Billing & Pro", "API & Developer", "DMCA / Copyright", "Bug report", "Feature request"];
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim() || !email.includes("@")) {
      toast.error(t("errorRequired"));
      return;
    }
    setSubmitting(true);
    // Rate limiting, spam filtering (honeypot) and persistence happen server side.
    const res = await sendContactMessage({
      name: name.trim(),
      email: email.trim(),
      subject,
      message: message.trim(),
      website: honeypot,
    });
    setSubmitting(false);

    if (res.success) {
      setSuccess(true);
      toast.success(t("successTitle"));
      // reset
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setHoneypot("");
      setTimeout(() => setSuccess(false), 6000);
    } else {
      toast.error(res.error?.message || t("errorSubmit"));
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 p-6 text-center">
        <span className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow">
          <CheckCircle2 className="w-6 h-6" />
        </span>
        <h3 className="mt-4 text-base font-bold text-emerald-900 dark:text-emerald-100 font-heading">{t("successTitle")}</h3>
        <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300/80 font-sans">{t("successDesc")}</p>
        <button onClick={() => setSuccess(false)} className="mt-4 text-sm font-semibold text-emerald-700 dark:text-emerald-300 underline underline-offset-2">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-xs font-bold tracking-wide text-foreground mb-1.5 font-sans">
            {t("nameLabel")} <span className="text-red-500">*</span>
          </span>
          <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.06] border border-border/60 dark:border-white/10 px-3.5 py-3 focus-within:bg-white dark:focus-within:bg-white/[0.08] focus-within:border-[#5baab8]/40 focus-within:ring-4 focus-within:ring-[#5baab8]/10 transition-all">
            <User className="w-4 h-4 text-muted-foreground shrink-0" />
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("namePlaceholder")} className="flex-1 bg-transparent text-sm font-medium placeholder:text-muted-foreground outline-none font-sans min-w-0" autoComplete="name" required />
          </div>
        </label>
        <label className="block">
          <span className="block text-xs font-bold tracking-wide text-foreground mb-1.5 font-sans">
            {t("emailLabel")} <span className="text-red-500">*</span>
          </span>
          <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.06] border border-border/60 dark:border-white/10 px-3.5 py-3 focus-within:bg-white dark:focus-within:bg-white/[0.08] focus-within:border-[#5baab8]/40 focus-within:ring-4 focus-within:ring-[#5baab8]/10 transition-all">
            <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" inputMode="email" placeholder={t("emailPlaceholder")} className="flex-1 bg-transparent text-sm font-medium placeholder:text-muted-foreground outline-none font-sans min-w-0" autoComplete="email" required />
          </div>
        </label>
      </div>

      <label className="block">
        <span className="block text-xs font-bold tracking-wide text-foreground mb-1.5 font-sans">
          {t("subjectLabel")} <span className="text-red-500">*</span>
        </span>
        <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.06] border border-border/60 dark:border-white/10 px-3.5 py-3 focus-within:bg-white dark:focus-within:bg-white/[0.08] focus-within:border-[#5baab8]/40 focus-within:ring-4 focus-within:ring-[#5baab8]/10 transition-all">
          <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className="flex-1 bg-transparent text-sm font-medium outline-none font-sans min-w-0" required>
            <option value="">{t("subjectPlaceholder")}</option>
            {subjectOptions.map((opt) => (
              <option key={opt} value={opt} className="text-foreground">
                {opt}
              </option>
            ))}
          </select>
        </div>
      </label>

      <label className="block">
        <span className="block text-xs font-bold tracking-wide text-foreground mb-1.5 font-sans">
          {t("messageLabel")} <span className="text-red-500">*</span>
        </span>
        <div className="rounded-xl bg-slate-50 dark:bg-white/[0.06] border border-border/60 dark:border-white/10 focus-within:bg-white dark:focus-within:bg-white/[0.08] focus-within:border-[#5baab8]/40 focus-within:ring-4 focus-within:ring-[#5baab8]/10 transition-all">
          <div className="flex gap-2.5 px-3.5 pt-3">
            <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t("messagePlaceholder")} rows={5} maxLength={1000} className="flex-1 bg-transparent text-sm font-medium placeholder:text-muted-foreground outline-none font-sans min-w-0 resize-none" required />
          </div>
          <div className="flex items-center justify-between px-3.5 pb-3 pt-2">
            <span className="text-xs text-muted-foreground font-mono">{message.length}/1000</span>
            <span className="text-xs text-muted-foreground font-sans hidden sm:inline">We reply within 24 hours</span>
          </div>
        </div>
      </label>

      {/* Honeypot - hidden (bots fill this; real users never see it) */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] px-6 py-3.5 rounded-full text-sm font-bold hover:bg-[#1a3545] dark:hover:bg-slate-100 transition-all shadow-[0_8px_20px_-12px_rgba(13,31,38,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        {submitting ? t("submitting") : t("submitButton")}
      </button>
      <p className="text-center text-xs text-muted-foreground font-sans">By sending, you agree to our Terms and Privacy.</p>
    </form>
  );
}
