"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Download, Menu, X, BarChart2 } from "lucide-react";

const navLinks: [string, string][] = [
  ["Features", "#features"],
  ["Platforms", "#platforms"],
  ["Pricing", "/pricing"],
  ["API", "/api"],
];

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" aria-label="fetchwave home">
          <div className="w-8 h-8 rounded-lg bg-[#0d1f26] flex items-center justify-center">
            <Download className="w-4 h-4 text-[#5baab8]" />
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground font-heading">
            fetchwave
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(([label, href]) =>
            href.startsWith("/") ? (
              <Link key={label} href={href} className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group font-sans">
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#5baab8] group-hover:w-full transition-all duration-300" />
              </Link>
            ) : (
              <a key={label} href={href} className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group font-sans">
                {label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#5baab8] group-hover:w-full transition-all duration-300" />
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
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map(([label, href]) =>
                href.startsWith("/") ? (
                  <Link key={label} href={href} onClick={() => setMenuOpen(false)} className="text-sm font-medium text-foreground py-1">{label}</Link>
                ) : (
                  <a key={label} href={href} className="text-sm font-medium text-foreground py-1">{label}</a>
                )
              )}
              <div className="flex items-center gap-3 pt-1">
                <Link href="/sign-in" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-foreground px-2 py-3">Sign in</Link>
                <Link href="/sign-up" onClick={() => setMenuOpen(false)} className="flex-1 text-sm font-semibold bg-[#0d1f26] text-white px-5 py-3 rounded-full text-center">Start Free</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
