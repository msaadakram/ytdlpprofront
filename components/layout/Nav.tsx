"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/lib/i18n/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Download, Menu, X, BarChart2, Play, Music, Image, FileText,
  ChevronDown, LogOut, ExternalLink, Globe, Check, Sparkles,
} from "lucide-react";
import { platforms } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";
import { locales, type Locale } from "@/lib/i18n/routing";

function platformSlug(name: string): string {
  return name.toLowerCase().replace(/ \/ x$/, "").replace(/\s+/g, "");
}

const downloadTypes = [
  { label: "Video", type: "video" as const, route: "/video-downloader", icon: Play },
  { label: "Audio", type: "audio" as const, route: "/audio-downloader", icon: Music },
  { label: "Thumbnail", type: "thumbnail" as const, route: "/thumbnail-downloader", icon: Image },
  { label: "Transcript", type: "transcript" as const, route: "/transcript-downloader", icon: FileText },
];

const localeFlags: Record<Locale, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
  pt: "🇵🇹",
  ja: "🇯🇵",
  ar: "🇸🇦",
  ru: "🇷🇺",
  zh: "🇨🇳",
};

export function Nav() {
  const t = useTranslations("Nav");
  const lt = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated: isLoggedIn, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [langOpen, setLangOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileAccordions, setMobileAccordions] = useState<Record<string, boolean>>({
    video: true, audio: false, thumbnail: false, transcript: false,
  });
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
        setLangOpen(false);
        setAccountOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpenDropdown(null); setLangOpen(false); setMenuOpen(false); setAccountOpen(false); }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function toggleDropdown(i: number) {
    setOpenDropdown(openDropdown === i ? null : i);
    setLangOpen(false);
    setAccountOpen(false);
  }

  function closeAll() {
    setOpenDropdown(null);
    setLangOpen(false);
    setAccountOpen(false);
    setMenuOpen(false);
  }

  function switchLocale(nextLocale: Locale) {
    router.replace(pathname, { locale: nextLocale });
    setLangOpen(false);
  }

  const hamburgerVariants = {
    open: (i: number) => ({
      rotate: i === 0 ? 45 : i === 1 ? -45 : 0,
      y: i === 0 ? 6 : i === 1 ? -6 : 0,
      width: i === 2 ? 0 : 20,
      opacity: i === 2 ? 0 : 1,
    }),
    closed: {
      rotate: 0,
      y: 0,
      width: 20,
      opacity: 1,
    },
  };

  return (
    <>
    <motion.header
      ref={navRef}
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/85 dark:bg-[#0a1218]/75 backdrop-blur-2xl border-white/40 dark:border-white/5 shadow-[0_8px_32px_-16px_rgba(13,31,38,0.12)]"
          : "bg-white/70 dark:bg-[#0a1218]/50 backdrop-blur-xl border-border/40 dark:border-white/5"
      }`}
    >
      <div className="mx-auto max-w-[1280px] px-3 sm:px-4 lg:px-6 h-[60px] sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 group" aria-label="DownForge home">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white border border-border/60 shadow-sm group-hover:shadow-md transition-shadow flex items-center justify-center">
            <img src="/logo.png" alt="DownForge" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
          </div>
          <span className="font-bold text-[17px] sm:text-lg tracking-tight text-foreground font-heading">
            DownForge
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
          {downloadTypes.map((dt, i) => {
            const isOpen = openDropdown === i;
            const Icon = dt.icon;
            const alignClass = i === 0 ? "left-0" : i === 3 ? "right-0" : "left-1/2 -translate-x-1/2";
            return (
              <div
                key={dt.type}
                className="relative"
                onMouseEnter={() => {
                  setOpenDropdown(i);
                  setLangOpen(false);
                  setAccountOpen(false);
                }}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button
                  onClick={() => toggleDropdown(i)}
                  aria-expanded={isOpen}
                  className={`flex items-center gap-1 xl:gap-1.5 px-2.5 xl:px-3.5 py-1.5 xl:py-2 text-xs xl:text-sm font-semibold rounded-full border transition-all duration-200 font-sans whitespace-nowrap ${
                    isOpen
                      ? "bg-[#0d1f26] text-white border-[#0d1f26] shadow-md dark:bg-white dark:text-[#0d1f26] dark:border-white"
                      : "text-muted-foreground border-transparent hover:text-foreground hover:bg-white hover:border-border/60 hover:shadow-sm bg-transparent"
                  }`}
                >
                  <span className={`w-5 h-5 xl:w-6 xl:h-6 rounded-full flex items-center justify-center shrink-0 ${isOpen ? "bg-white/15 dark:bg-[#0d1f26]/10" : "bg-muted"}`}>
                    <Icon className="w-3 xl:w-3.5 h-3 xl:h-3.5" />
                  </span>
                  <span>{dt.label}</span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.22 }} className="flex">
                    <ChevronDown className="w-3 h-3 xl:w-3.5 xl:h-3.5 opacity-60" />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: -8 }}
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      className={`absolute top-full mt-3 bg-white/95 dark:bg-[#0f1e26]/90 backdrop-blur-2xl border border-border/60 dark:border-white/10 rounded-[1.75rem] shadow-[0_24px_64px_-16px_rgba(13,31,38,0.18)] overflow-hidden min-w-[300px] sm:min-w-[520px] lg:min-w-[560px] xl:min-w-[620px] max-w-[92vw] z-50 ${alignClass}`}
                    >
                      <div className="h-1 w-full bg-gradient-to-r from-[#5baab8] via-[#0d1f26] to-[#5baab8] opacity-80" />
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-4 px-1">
                          <span className="flex items-center gap-2 text-xs font-bold tracking-[0.14em] uppercase text-muted-foreground font-mono">
                            <span className="w-7 h-7 rounded-full bg-[#eef6f8] dark:bg-white/10 flex items-center justify-center">
                              <Icon className="w-3.5 h-3.5 text-[#5baab8]" />
                            </span>
                            {t("download")} {dt.label}
                          </span>
                          <span className="hidden sm:inline-flex text-[11px] font-medium text-muted-foreground bg-muted/60 border border-border/40 rounded-full px-2.5 py-1">15 platforms • instant</span>
                        </div>
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-1.5">
                          {platforms.map((p) => {
                            const slug = platformSlug(p.name);
                            const href = `${dt.route}/${slug}`;
                            return (
                              <Link
                                key={p.name}
                                href={href}
                                onClick={closeAll}
                                className="flex items-center gap-2.5 px-2.5 sm:px-3 py-2.5 rounded-xl border border-transparent hover:bg-slate-50 dark:hover:bg-white/5 hover:border-border/40 hover:shadow-sm transition-all group"
                              >
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-black/5" style={{ backgroundColor: p.bg }}>
                                  <p.Logo className="w-4 h-4 sm:w-[16px] sm:h-[16px]" style={{ color: p.fg }} />
                                </div>
                                <span className="text-xs sm:text-[13px] font-semibold text-foreground font-sans group-hover:text-[#0d1f26] dark:group-hover:text-white transition-colors truncate">
                                  {p.name}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                      <div className="bg-muted/30 dark:bg-white/[0.04] border-t border-border/50 px-4 py-3 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-sans">Paste any public URL • no login required</span>
                        <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#5baab8]">All formats <ExternalLink className="w-3 h-3" /></span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          <div className="w-px h-6 bg-border/60 mx-1 hidden xl:block" />

          <Link href="/pricing" className="hidden xl:inline-flex items-center px-3.5 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-white hover:border-border/60 border border-transparent rounded-full transition-colors font-sans">
            {t("pricing")}
          </Link>
          <Link href="/api-docs" className="hidden xl:inline-flex items-center gap-1 px-3.5 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-white hover:border-border/60 border border-transparent rounded-full transition-colors font-sans">
            {t("api")} <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>
        </nav>

        <div className="hidden lg:flex items-center gap-1 xl:gap-2">
          {/* Locale Switcher — modern with flags */}
          <div className="relative">
            <button
              onClick={() => { setLangOpen(!langOpen); setOpenDropdown(null); setAccountOpen(false); }}
              className="flex items-center gap-1 xl:gap-1.5 pl-0.5 xl:pl-1 pr-1 xl:pr-2.5 py-0.5 xl:py-1 rounded-full bg-white border border-border/60 shadow-sm hover:shadow-md hover:border-border hover:bg-white transition-all font-sans"
              aria-label={lt("label")}
            >
              <span className="w-6 h-6 xl:w-7 xl:h-7 rounded-full flex items-center justify-center text-[13px] xl:text-[16px] bg-gradient-to-br from-slate-50 to-slate-100 border border-border/40 shadow-inner shrink-0">
                {localeFlags[locale as Locale] || "🌐"}
              </span>
              <span className="hidden xl:block text-sm font-semibold text-foreground">{lt(locale as Locale)}</span>
              <span className="hidden xl:inline-flex text-xs font-mono text-muted-foreground border border-border/60 rounded-full px-1.5 py-0.5 bg-muted/40">{locale.toUpperCase()}</span>
              <motion.span animate={{ rotate: langOpen ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex">
                <ChevronDown className="w-3 h-3 xl:w-3.5 xl:h-3.5 text-muted-foreground" />
              </motion.span>
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -8 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className="absolute top-full right-0 mt-3 bg-white/95 dark:bg-[#0f1e26]/95 backdrop-blur-xl border border-border/60 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden min-w-[268px] z-50"
                >
                  <div className="p-2">
                    <div className="flex items-center gap-2 px-3 pt-1 pb-2 text-[11px] font-bold tracking-[0.14em] uppercase text-muted-foreground font-mono">
                      <Globe className="w-3 h-3" /> {lt("label")}
                    </div>
                    <div className="space-y-1">
                      {locales.map((l) => {
                        const isActive = l === locale;
                        return (
                          <button
                            key={l}
                            onClick={() => switchLocale(l)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                              isActive ? "bg-[#0d1f26] text-white shadow-md dark:bg-white dark:text-[#0d1f26]" : "hover:bg-muted/60 text-foreground"
                            }`}
                          >
                            <span className="w-9 h-9 rounded-full flex items-center justify-center text-[18px] bg-white border border-border/50 shadow-sm shrink-0">
                              {localeFlags[l]}
                            </span>
                            <div className="min-w-0 flex-1 text-left">
                              <div className={`text-sm font-semibold leading-none font-sans ${isActive ? "text-white dark:text-[#0d1f26]" : "text-foreground"}`}>{lt(l)}</div>
                              <div className={`text-xs font-mono ${isActive ? "text-white/60 dark:text-[#0d1f26]/60" : "text-muted-foreground"}`}>{l.toUpperCase()} • {l === "en" ? "English" : l === "es" ? "Español" : l === "fr" ? "Français" : l === "de" ? "Deutsch" : l === "pt" ? "Português" : l === "ja" ? "日本語" : l === "ar" ? "العربية" : l === "ru" ? "Русский" : "中文"}</div>
                            </div>
                            {isActive && (
                              <span className="w-6 h-6 rounded-full bg-white/15 dark:bg-[#0d1f26]/10 flex items-center justify-center shrink-0">
                                <Check className="w-4 h-4 text-white dark:text-[#0d1f26]" />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="h-px bg-border/50" />
                  <div className="px-3 py-2 text-[11px] text-muted-foreground font-sans text-center flex items-center justify-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Auto-saves to cookie • 1 year
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="hidden xl:flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-accent transition-colors px-3 py-2 rounded-full hover:bg-white hover:border-border/60 border border-transparent hover:shadow-sm font-sans">
                <BarChart2 className="w-4 h-4" />
                {t("dashboard")}
              </Link>
              <div className="relative">
                <button
                  onClick={() => { setAccountOpen(!accountOpen); setLangOpen(false); setOpenDropdown(null); }}
                  className="flex items-center gap-2 pl-1 pr-2 sm:pr-3 py-1 rounded-full border border-border/60 hover:border-border bg-white shadow-sm hover:shadow-md transition-all"
                  aria-label="Account menu"
                >
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name || "Account"} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-border/40" />
                  ) : (
                    <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] flex items-center justify-center text-xs font-bold shadow-sm">
                      {(user?.name || user?.email || "U")[0]?.toUpperCase()}
                    </span>
                  )}
                  <span className="hidden xl:block text-sm font-semibold text-foreground max-w-[120px] truncate font-sans">
                    {user?.name || user?.email}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${accountOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: -8 }}
                      transition={{ type: "spring", stiffness: 380, damping: 28 }}
                      className="absolute top-full right-0 mt-3 bg-white dark:bg-[#0f1e26] border border-border/60 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden min-w-[280px] z-50"
                    >
                      <div className="px-4 py-3 border-b border-border/50 bg-gradient-to-br from-slate-50 to-white dark:from-white/[0.04] dark:to-transparent">
                        <div className="flex items-center gap-3">
                          {user?.avatar_url ? (
                            <img src={user.avatar_url} alt={user.name || "Account"} className="w-10 h-10 rounded-full object-cover border border-border/50" />
                          ) : (
                            <span className="w-10 h-10 rounded-full bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] flex items-center justify-center text-sm font-bold shrink-0">
                              {(user?.name || user?.email || "U")[0]?.toUpperCase()}
                            </span>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-foreground truncate font-sans">{user?.name || "Account"}</div>
                            <div className="text-xs text-muted-foreground truncate font-sans">{user?.email}</div>
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase px-2 py-1 rounded-full border ${user?.provider === "google" ? "bg-white border-[#4285F4]/20 text-[#4285F4]" : user?.provider === "both" ? "bg-[#eef6f8] dark:bg-[#5baab8]/15 border-[#5baab8]/30 text-[#0d1f26] dark:text-[#8fd3df]" : "bg-muted border-border text-muted-foreground"}`}>
                                {user?.provider === "google" ? "Google" : user?.provider === "both" ? "Linked" : "Email"}
                              </span>
                              <span className={`text-[10px] font-bold tracking-wide px-2 py-1 rounded-full ${user?.plan === "pro" ? "bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26]" : "bg-muted text-muted-foreground border border-border"}`}>
                                {user?.plan?.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link href="/dashboard" onClick={() => setAccountOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-foreground hover:bg-slate-50 dark:hover:bg-white/5 transition-colors font-sans">
                          <BarChart2 className="w-4 h-4 text-muted-foreground" />
                          {t("dashboard")}
                        </Link>
                        <button
                          onClick={() => { setAccountOpen(false); logout(); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors font-sans"
                        >
                          <LogOut className="w-4 h-4" />
                          {t("logOut")}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="hidden sm:inline-flex text-sm font-semibold text-foreground hover:text-accent transition-colors px-3 sm:px-3.5 py-2 rounded-full hover:bg-white hover:border-border/60 border border-transparent hover:shadow-sm font-sans">
                {t("signIn")}
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex text-sm font-bold bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] px-4 sm:px-5 py-2 sm:py-2.5 rounded-full hover:bg-[#1a3545] dark:hover:bg-slate-100 transition-all duration-200 font-sans shadow-[0_8px_20px_-12px_rgba(13,31,38,0.4)] hover:shadow-[0_12px_28px_-12px_rgba(13,31,38,0.5)] hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              >
                <span className="hidden sm:inline">{t("startFree")}</span><span className="sm:hidden">Start</span>
              </Link>
            </>
          )}
        </div>

        <button
          className="lg:hidden relative w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl sm:rounded-2xl bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] hover:bg-[#1a3545] dark:hover:bg-slate-100 transition-all duration-200 shadow-md active:scale-95 shrink-0"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
          aria-expanded={menuOpen}
        >
          <div className="flex flex-col items-center justify-center gap-[5px] w-5">
            <motion.span variants={hamburgerVariants} custom={0} animate={menuOpen ? "open" : "closed"} className="block h-[2.5px] rounded-full bg-white dark:bg-[#0d1f26] origin-center" style={{ width: 20 }} />
            <motion.span variants={hamburgerVariants} custom={1} animate={menuOpen ? "open" : "closed"} className="block h-[2.5px] rounded-full bg-white dark:bg-[#0d1f26] origin-center" style={{ width: 16 }} />
            <motion.span variants={hamburgerVariants} custom={2} animate={menuOpen ? "open" : "closed"} className="block h-[2.5px] rounded-full bg-white dark:bg-[#0d1f26] origin-center" style={{ width: 12 }} />
          </div>
        </button>
      </div>
    </motion.header>

    <AnimatePresence>
      {menuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-slate-900/20 dark:bg-black/40 backdrop-blur-md z-[55] lg:hidden"
            onClick={() => setMenuOpen(false)}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            className="fixed top-0 right-0 bottom-0 w-[92%] max-w-[380px] sm:max-w-[420px] bg-white dark:bg-[#0a1218] border-l border-border/50 dark:border-white/10 shadow-[0_0_80px_-16px_rgba(13,31,38,0.25)] z-[60] lg:hidden flex flex-col overflow-hidden"
          >
              <div className="flex items-center justify-between px-5 h-[60px] sm:h-16 border-b border-border/50 dark:border-white/5 shrink-0 bg-gradient-to-r from-white to-slate-50/50 dark:from-[#0a1218] dark:to-[#0f1e26]/50">
                <Link href="/" onClick={closeAll} className="flex items-center gap-2.5" aria-label="DownForge home">
                  <div className="w-8 h-8 rounded-xl bg-white border border-border/60 shadow-sm flex items-center justify-center">
                    <img src="/logo.png" alt="DownForge" className="w-5 h-5 object-contain" />
                  </div>
                  <span className="font-bold text-base tracking-tight text-foreground font-heading">DownForge</span>
                </Link>
                <button onClick={() => setMenuOpen(false)} className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 border border-border/50 dark:border-white/10 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto overscroll-contain px-4 sm:px-5 py-4 sm:py-5 space-y-5 sm:space-y-6">
                {downloadTypes.map((dt) => {
                  const Icon = dt.icon;
                  const isExpanded = mobileAccordions[dt.type];
                  return (
                    <div key={dt.type} className="rounded-2xl border border-border/50 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.03] overflow-hidden">
                      <button
                        onClick={() => setMobileAccordions((p) => ({ ...p, [dt.type]: !p[dt.type] }))}
                        className="w-full flex items-center gap-3 px-3.5 py-3.5 text-left"
                      >
                        <span className="w-9 h-9 rounded-xl bg-white dark:bg-[#0d1f26] border border-border/50 dark:border-white/10 shadow-sm flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-[#5baab8] dark:text-white" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold text-foreground font-sans leading-none">{dt.label}</div>
                          <div className="text-xs text-muted-foreground font-sans">15 platforms • instant</div>
                        </div>
                        <span className={`w-7 h-7 rounded-full bg-white dark:bg-white/10 border border-border/50 dark:border-white/10 flex items-center justify-center transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                            <div className="px-2 pb-3 grid grid-cols-2 gap-1.5">
                              {platforms.map((p) => {
                                const slug = platformSlug(p.name);
                                const href = `${dt.route}/${slug}`;
                                return (
                                  <Link key={p.name} href={href} onClick={closeAll} className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-xl bg-white dark:bg-[#0f1e26] border border-border/40 dark:border-white/5 hover:border-border hover:shadow-sm hover:bg-white transition-all group">
                                    <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-black/5" style={{ backgroundColor: p.bg }}>
                                      <p.Logo className="w-4 h-4" style={{ color: p.fg }} />
                                    </span>
                                    <span className="text-xs font-semibold text-foreground font-sans group-hover:text-[#0d1f26] dark:group-hover:text-white truncate">
                                      {p.name}
                                    </span>
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                <div className="rounded-2xl border border-border/50 dark:border-white/5 bg-white dark:bg-white/[0.03] p-3.5 space-y-1">
                  <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground font-mono px-1 pb-1 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> {t("quickLinks")}
                  </span>
                  <Link href="/pricing" onClick={closeAll} className="flex items-center justify-between text-sm font-semibold text-foreground hover:text-accent transition-colors px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent hover:border-border/40">
                    {t("pricing")} <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                  </Link>
                  <Link href="/api-docs" onClick={closeAll} className="flex items-center justify-between text-sm font-semibold text-foreground hover:text-accent transition-colors px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent hover:border-border/40">
                    {t("api")} <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                  </Link>
                </div>

                <div className="rounded-2xl border border-border/50 dark:border-white/5 bg-gradient-to-br from-slate-50 to-white dark:from-white/[0.03] dark:to-transparent p-4">
                  <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground font-mono flex items-center gap-2 mb-3">
                    <Globe className="w-3.5 h-3" /> {lt("label")}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {locales.map((l) => {
                      const isActive = l === locale;
                      return (
                        <button
                          key={l}
                          onClick={() => switchLocale(l)}
                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left border transition-all font-sans ${
                            isActive ? "bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] border-[#0d1f26] dark:border-white shadow-md" : "bg-white dark:bg-[#0f1e26] border-border dark:border-white/5 hover:border-border hover:bg-slate-50 dark:hover:bg-white/5 text-foreground"
                          }`}
                        >
                          <span className="w-8 h-8 rounded-full flex items-center justify-center text-[16px] bg-slate-50 dark:bg-white/10 border border-border/40 dark:border-white/10 shadow-sm shrink-0">
                            {localeFlags[l]}
                          </span>
                          <div className="min-w-0">
                            <div className={`text-xs font-bold leading-none ${isActive ? "text-white dark:text-[#0d1f26]" : "text-foreground"}`}>{lt(l)}</div>
                            <div className={`text-[11px] font-mono ${isActive ? "text-white/60 dark:text-[#0d1f26]/60" : "text-muted-foreground"}`}>{l.toUpperCase()}</div>
                          </div>
                          {isActive && <Check className="w-3.5 h-3.5 text-white dark:text-[#0d1f26] ml-auto shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="shrink-0 border-t border-border/50 dark:border-white/5 bg-gradient-to-t from-slate-50/80 to-white dark:from-[#0f1e26]/50 dark:to-[#0a1218] px-4 sm:px-5 py-4 sm:py-5 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                {isLoggedIn ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-white/[0.04] border border-border/50 dark:border-white/5">
                      {user?.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name || "Account"} className="w-10 h-10 rounded-full object-cover border border-border/50" />
                      ) : (
                        <span className="w-10 h-10 rounded-full bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] flex items-center justify-center text-sm font-bold shrink-0">
                          {(user?.name || user?.email || "U")[0]?.toUpperCase()}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-foreground truncate font-sans">{user?.name || "Account"}</div>
                        <div className="text-xs text-muted-foreground truncate font-sans">{user?.email}</div>
                        <span className={`inline-flex text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full border mt-1 ${user?.provider === "google" ? "bg-white border-[#4285F4]/20 text-[#4285F4]" : user?.provider === "both" ? "bg-[#eef6f8] dark:bg-[#5baab8]/15 border-[#5baab8]/30 text-[#0d1f26] dark:text-[#8fd3df]" : "bg-muted border-border text-muted-foreground"}`}>
                          {user?.provider === "google" ? "Google" : user?.provider === "both" ? "Linked" : "Email"}
                        </span>
                      </div>
                      <span className={`text-[10px] font-bold tracking-wide px-2 py-1 rounded-full shrink-0 ${user?.plan === "pro" ? "bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26]" : "bg-slate-100 dark:bg-white/10 text-muted-foreground border border-border"}`}>
                        {user?.plan?.toUpperCase()}
                      </span>
                    </div>
                    <Link href="/dashboard" onClick={closeAll} className="flex items-center justify-center gap-2 text-sm font-bold bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] px-5 py-3.5 rounded-full hover:bg-[#1a3545] dark:hover:bg-slate-100 transition-all font-sans shadow-md active:scale-[0.98]">
                      <BarChart2 className="w-4 h-4" /> {t("dashboard")}
                    </Link>
                    <button onClick={() => { logout(); closeAll(); }} className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-destructive transition-colors px-5 py-3.5 rounded-full border border-border hover:border-destructive/20 hover:bg-destructive/5 font-sans">
                      <LogOut className="w-4 h-4" /> {t("logOut")}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <Link href="/sign-up" onClick={closeAll} className="flex items-center justify-center gap-2 text-sm font-bold bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] px-5 py-3.5 rounded-full hover:bg-[#1a3545] dark:hover:bg-slate-100 transition-all font-sans shadow-[0_8px_20px_-10px_rgba(13,31,38,0.4)] active:scale-[0.98]">
                      {t("startFree")} <Download className="w-4 h-4" />
                    </Link>
                    <Link href="/sign-in" onClick={closeAll} className="flex items-center justify-center gap-2 text-sm font-semibold text-foreground hover:text-accent transition-colors px-5 py-3.5 rounded-full border border-border hover:border-accent/20 hover:bg-slate-50 dark:hover:bg-white/5 font-sans">
                      {t("signIn")}
                    </Link>
                    <p className="text-center text-xs text-muted-foreground font-sans">Free forever • No credit card</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
