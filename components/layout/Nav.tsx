"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Download, Menu, X, BarChart2, Play, Music, Image, FileText,
  ChevronDown, LogOut, ExternalLink,
} from "lucide-react";
import { platforms } from "@/lib/constants";
import { useAuth } from "@/lib/auth-context";

function platformSlug(name: string): string {
  return name.toLowerCase().replace(/ \/ x$/, "").replace(/\s+/g, "");
}

const downloadTypes = [
  { label: "Video", type: "video" as const, route: "/video-downloader", icon: Play },
  { label: "Audio", type: "audio" as const, route: "/audio-downloader", icon: Music },
  { label: "Thumbnail", type: "thumbnail" as const, route: "/thumbnail-downloader", icon: Image },
  { label: "Transcript", type: "transcript" as const, route: "/transcript-downloader", icon: FileText },
];

const quickLinks: [string, string, boolean][] = [
  ["Features", "#features", false],
  ["Pricing", "/pricing", true],
  ["API", "/api", true],
];

export function Nav() {
  const { isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpenDropdown(null); setMenuOpen(false); }
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
  }

  function closeAll() {
    setOpenDropdown(null);
    setMenuOpen(false);
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
    <motion.header
      ref={navRef}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/60"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="DownForge home">
          <motion.div
            className="w-8 h-8 rounded-xl bg-[#0d1f26] flex items-center justify-center"
            whileHover={{ scale: 1.08, rotate: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Download className="w-4 h-4 text-[#5baab8]" />
          </motion.div>
          <span className="font-bold text-lg tracking-tight text-foreground font-heading">
            DownForge
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          {downloadTypes.map((dt, i) => {
            const isOpen = openDropdown === i;
            const Icon = dt.icon;
            return (
              <div key={dt.type} className="relative">
                <button
                  onClick={() => toggleDropdown(i)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl transition-all duration-200 font-sans ${
                    isOpen
                      ? "text-foreground bg-muted/80"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{dt.label}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="flex"
                  >
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.94, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.94, y: -6 }}
                      transition={{ type: "spring", stiffness: 350, damping: 26 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2.5 bg-white/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl shadow-black/5 overflow-hidden min-w-[540px]"
                    >
                      <div
                        className="h-0.5 w-full"
                        style={{
                          background: `linear-gradient(90deg, #5baab8, #3d8896, #5baab8)`,
                        }}
                      />
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-3 px-1">
                          <Icon className="w-4 h-4 text-[#5baab8]" />
                          <span className="text-xs font-semibold text-muted-foreground font-sans tracking-wide">
                            Download {dt.label}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-1">
                          {platforms.map((p) => {
                            const slug = platformSlug(p.name);
                            const href = `${dt.route}/${slug}`;
                            return (
                              <Link
                                key={p.name}
                                href={href}
                                onClick={closeAll}
                                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 group"
                              >
                                <motion.div
                                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                  style={{ backgroundColor: p.bg }}
                                  whileHover={{ scale: 1.12 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 12 }}
                                >
                                  <p.Logo className="w-4 h-4" style={{ color: p.fg }} />
                                </motion.div>
                                <span className="text-xs font-medium text-foreground font-sans group-hover:text-accent transition-colors">
                                  {p.name}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          <div className="w-px h-5 bg-border/70 mx-2" />

          {quickLinks.map(([label, href, isPage]) =>
            isPage ? (
              <Link key={label} href={href} className="relative px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group font-sans">
                {label}
                <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#5baab8] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
              </Link>
            ) : (
              <a key={label} href={href} className="relative px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group font-sans">
                {label}
                <span className="absolute bottom-0 left-3.5 right-3.5 h-0.5 bg-[#5baab8] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
              </a>
            )
          )}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-accent transition-colors px-3.5 py-2 font-sans">
                <BarChart2 className="w-3.5 h-3.5" />
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors px-3.5 py-2 font-sans"
              >
                <LogOut className="w-3.5 h-3.5" />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm font-medium text-foreground hover:text-accent transition-colors px-3.5 py-2 font-sans">
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="text-sm font-semibold bg-[#0d1f26] text-white px-5 py-2.5 rounded-full hover:bg-[#1a3545] transition-all duration-200 font-sans shadow-sm hover:shadow-md"
              >
                Start Free
              </Link>
            </>
          )}
        </div>

        <button
          className="lg:hidden relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted/60 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <div className="flex flex-col items-center justify-center gap-1">
            <motion.span
              variants={hamburgerVariants}
              custom={0}
              animate={menuOpen ? "open" : "closed"}
              className="block h-0.5 rounded-full bg-foreground origin-center"
              style={{ width: 20 }}
            />
            <motion.span
              variants={hamburgerVariants}
              custom={1}
              animate={menuOpen ? "open" : "closed"}
              className="block h-0.5 rounded-full bg-foreground origin-center"
              style={{ width: 20 }}
            />
            <motion.span
              variants={hamburgerVariants}
              custom={2}
              animate={menuOpen ? "open" : "closed"}
              className="block h-0.5 rounded-full bg-foreground origin-center"
              style={{ width: 20 }}
            />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              ref={menuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white border-l border-border/60 shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between px-5 h-16 border-b border-border/50">
                <Link href="/" onClick={closeAll} className="flex items-center gap-2" aria-label="DownForge home">
                  <div className="w-7 h-7 rounded-lg bg-[#0d1f26] flex items-center justify-center">
                    <Download className="w-3.5 h-3.5 text-[#5baab8]" />
                  </div>
                  <span className="font-bold text-base tracking-tight text-foreground font-heading">DownForge</span>
                </Link>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-5 py-4 space-y-5">
                {downloadTypes.map((dt) => {
                  const Icon = dt.icon;
                  return (
                    <div key={dt.type}>
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <div className="w-7 h-7 rounded-lg bg-[#eef6f8] flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5 text-[#5baab8]" />
                        </div>
                        <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground font-mono">
                          {dt.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {platforms.map((p) => {
                          const slug = platformSlug(p.name);
                          const href = `${dt.route}/${slug}`;
                          return (
                            <Link
                              key={p.name}
                              href={href}
                              onClick={closeAll}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-muted/50 transition-colors group"
                            >
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: p.bg }}
                              >
                                <p.Logo className="w-3.5 h-3.5" style={{ color: p.fg }} />
                              </div>
                              <span className="text-xs font-medium text-foreground font-sans group-hover:text-accent transition-colors truncate">
                                {p.name}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                <div className="border-t border-border/50 pt-4 space-y-1">
                  <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground font-mono px-1 pb-1 block">
                    Quick Links
                  </span>
                  {quickLinks.map(([label, href, isPage]) =>
                    isPage ? (
                      <Link key={label} href={href} onClick={closeAll} className="flex items-center justify-between text-sm font-medium text-foreground hover:text-accent transition-colors px-3 py-2.5 rounded-xl hover:bg-muted/50">
                        {label}
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </Link>
                    ) : (
                      <a key={label} href={href} className="flex items-center justify-between text-sm font-medium text-foreground hover:text-accent transition-colors px-3 py-2.5 rounded-xl hover:bg-muted/50">
                        {label}
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </a>
                    )
                  )}
                </div>
              </div>

              <div className="border-t border-border/50 px-5 py-4 mt-auto">
                {isLoggedIn ? (
                  <div className="flex flex-col gap-2.5">
                    <Link
                      href="/dashboard"
                      onClick={closeAll}
                      className="flex items-center justify-center gap-2 text-sm font-semibold bg-[#0d1f26] text-white px-5 py-3 rounded-full hover:bg-[#1a3545] transition-all font-sans"
                    >
                      <BarChart2 className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => { logout(); closeAll(); }}
                      className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors px-5 py-3 rounded-full border border-border hover:border-destructive/30"
                    >
                      <LogOut className="w-4 h-4" />
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    <Link
                      href="/sign-up"
                      onClick={closeAll}
                      className="flex items-center justify-center text-sm font-semibold bg-[#0d1f26] text-white px-5 py-3 rounded-full hover:bg-[#1a3545] transition-all font-sans shadow-sm"
                    >
                      Start Free
                    </Link>
                    <Link
                      href="/sign-in"
                      onClick={closeAll}
                      className="flex items-center justify-center text-sm font-medium text-foreground hover:text-accent transition-colors px-5 py-3 rounded-full border border-border hover:border-accent/30"
                    >
                      Sign in
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
