"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Download, Menu, X, BarChart2, Play, Music, Image, FileText, ChevronDown } from "lucide-react";
import { platforms } from "@/lib/constants";

function platformSlug(name: string): string {
  return name.toLowerCase().replace(/ \/ x$/, "").replace(/\s+/g, "");
}

const downloadTypes = [
  { label: "Video", type: "video" as const, route: "/video-downloader", icon: Play },
  { label: "Audio", type: "audio" as const, route: "/audio-downloader", icon: Music },
  { label: "Thumbnail", type: "thumbnail" as const, route: "/thumbnail-downloader", icon: Image },
  { label: "Transcript", type: "transcript" as const, route: "/transcript-downloader", icon: FileText },
];

const simpleLinks: [string, string][] = [
  ["Features", "#features"],
  ["Pricing", "/pricing"],
  ["API", "/api"],
];

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenDropdown(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function toggleDropdown(i: number) {
    setOpenDropdown(openDropdown === i ? null : i);
  }

  function closeAll() {
    setOpenDropdown(null);
    setMenuOpen(false);
  }

  return (
    <motion.header
      ref={navRef}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="fetchwave home">
          <div className="w-8 h-8 rounded-lg bg-[#0d1f26] flex items-center justify-center">
            <Download className="w-4 h-4 text-[#5baab8]" />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground font-heading">
            fetchwave
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {downloadTypes.map((dt, i) => {
            const isOpen = openDropdown === i;
            const Icon = dt.icon;
            return (
              <div key={dt.type} className="relative">
                <button
                  onClick={() => toggleDropdown(i)}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50 font-sans"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {dt.label}
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white/90 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl shadow-black/5 p-5 min-w-[520px]"
                    >
                      <div className="flex items-center gap-2 mb-3 px-1">
                        <Icon className="w-4 h-4" style={{ color: "#5baab8" }} />
                        <span className="text-xs font-semibold text-muted-foreground font-sans">
                          Download {dt.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {platforms.map((p) => {
                          const slug = platformSlug(p.name);
                          const href = `${dt.route}/${slug}`;
                          return (
                            <Link
                              key={p.name}
                              href={href}
                              onClick={closeAll}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-muted/60 transition-all duration-200 group"
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110"
                                style={{ backgroundColor: p.bg }}
                              >
                                <p.Logo className="w-4 h-4" style={{ color: p.fg }} />
                              </div>
                              <span className="text-xs font-medium text-foreground font-sans group-hover:text-accent transition-colors">
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

          <div className="w-px h-5 bg-border mx-2" />

          {simpleLinks.map(([label, href]) =>
            href.startsWith("/") ? (
              <Link key={label} href={href} className="relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group font-sans">
                {label}
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#5baab8] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>
            ) : (
              <a key={label} href={href} className="relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group font-sans">
                {label}
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#5baab8] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </a>
            )
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2 flex items-center gap-1.5 font-sans">
            <BarChart2 className="w-3.5 h-3.5" /> Dashboard
          </Link>
          <Link href="/sign-in" className="text-sm font-medium text-foreground hover:text-accent transition-colors px-4 py-2 font-sans">
            Sign in
          </Link>
          <Link href="/sign-up" className="block text-sm font-semibold bg-[#0d1f26] text-white px-5 py-2.5 rounded-full hover:bg-[#1a3545] transition-colors font-sans">
            Start Free
          </Link>
        </div>

        <button className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-t border-border overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {downloadTypes.map((dt) => {
                const Icon = dt.icon;
                return (
                  <div key={dt.type} className="border-b border-border/50 last:border-0 pb-2 last:pb-0">
                    <div className="flex items-center gap-2 py-2">
                      <Icon className="w-4 h-4 text-[#5baab8]" />
                      <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground font-mono">
                        {dt.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1 pb-2">
                      {platforms.map((p) => {
                        const slug = platformSlug(p.name);
                        const href = `${dt.route}/${slug}`;
                        return (
                          <Link
                            key={p.name}
                            href={href}
                            onClick={closeAll}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/60 transition-colors"
                          >
                            <div
                              className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                              style={{ backgroundColor: p.bg }}
                            >
                              <p.Logo className="w-3 h-3" style={{ color: p.fg }} />
                            </div>
                            <span className="text-xs text-foreground font-sans">{p.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })}

              <div className="flex flex-col gap-1 pt-1">
                {simpleLinks.map(([label, href]) =>
                  href.startsWith("/") ? (
                    <Link key={label} href={href} onClick={closeAll} className="text-sm font-medium text-foreground py-2">{label}</Link>
                  ) : (
                    <a key={label} href={href} className="text-sm font-medium text-foreground py-2">{label}</a>
                  )
                )}
              </div>

              <div className="flex items-center gap-3 pt-3 mt-1 border-t border-border">
                <Link href="/sign-in" onClick={closeAll} className="text-sm font-medium text-foreground px-2 py-3">Sign in</Link>
                <Link href="/sign-up" onClick={closeAll} className="flex-1 text-sm font-semibold bg-[#0d1f26] text-white px-5 py-3 rounded-full text-center">Start Free</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
