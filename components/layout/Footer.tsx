"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { motion } from "motion/react";
import {
  Github,
  Twitter,
  Youtube,
  Facebook,
  Instagram,
  Linkedin,
  Send,
  ChevronDown,
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useId, useState } from "react";

const platformLinks: [string, string][] = [
  ["YouTube Download", "/youtube-download"],
  ["Facebook Download", "/download/facebook"],
  ["Instagram Download", "/download/instagram"],
  ["TikTok Download", "/download/tiktok"],
  ["Twitter / X Download", "/download/twitter"],
  ["Vimeo Download", "/download/vimeo"],
  ["Dailymotion Download", "/download/dailymotion"],
  ["Twitch Download", "/download/twitch"],
  ["Reddit Download", "/download/reddit"],
  ["Pinterest Download", "/download/pinterest"],
  ["LinkedIn Download", "/download/linkedin"],
  ["Snapchat Download", "/download/snapchat"],
  ["SoundCloud Download", "/download/soundcloud"],
  ["Kick Download", "/download/kick"],
  ["Niconico Download", "/download/niconico"],
];

const footerGroups = [
  {
    titleKey: "product" as const,
    links: [
      { labelKey: "features" as const, href: "/pricing" },
      { labelKey: "pricing" as const, href: "/pricing" },
      { labelKey: "api" as const, href: "/api-docs" },
      { labelKey: "dashboard" as const, href: "/dashboard" },
    ],
  },
  {
    titleKey: "resources" as const,
    links: [
      { labelKey: "documentation" as const, href: "/api-docs" },
      { labelKey: "apiStatus" as const, href: "#" },
      { labelKey: "changelog" as const, href: "#" },
      { labelKey: "blog" as const, href: "#" },
    ],
  },
  {
    titleKey: "company" as const,
    links: [
      { labelKey: "about" as const, href: "/about" },
      { labelKey: "privacy" as const, href: "/privacy" },
      { labelKey: "terms" as const, href: "/terms" },
      { labelKey: "contact" as const, href: "/contact" },
    ],
  },
];

const socialLinks = [
  { name: "GitHub", icon: Github, href: "https://github.com/downforge" },
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/downforge" },
  { name: "YouTube", icon: Youtube, href: "https://youtube.com/downforge" },
  { name: "Facebook", icon: Facebook, href: "https://facebook.com/downforge" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/downforge" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/downforge" },
];

type FooterColumnData = {
  title: string;
  links: [string, string][];
  moreLabel?: string;
};

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white/35 flex items-center gap-2">
      <span className="w-1 h-1 rounded-full bg-[#5baab8] shadow-[0_0_8px_rgba(91,170,184,0.6)]" />
      {children}
    </h3>
  );
}

function FooterColumn({ title, links, moreLabel }: FooterColumnData) {
  return (
    <div className="max-md:hidden">
      <ColumnHeading>{title}</ColumnHeading>
      <ul className="mt-5 flex flex-col gap-2.5">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link
              href={href}
              className="group inline-flex items-center gap-1.5 py-1 text-sm text-white/60 transition-colors hover:text-white font-sans"
            >
              <span className="h-px w-0 bg-[#5baab8] transition-all group-hover:w-3" />
              {label}
            </Link>
          </li>
        ))}
        {moreLabel && (
          <li className="pt-2">
            <Link
              href="/youtube-download"
              className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide text-[#8fd3df] hover:text-white transition-colors"
            >
              {moreLabel} <span className="text-[10px]">→</span>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

function FooterAccordion({ title, links }: FooterColumnData) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border-b border-white/[0.07]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="font-heading text-sm font-bold text-white/90">
          {title}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-colors ${open ? "bg-white text-[#0d1f26] border-white" : "bg-white/5 text-white/50 border-white/10"}`}
        >
          <ChevronDown className="h-4 w-4" aria-hidden />
        </motion.span>
      </button>
      <motion.div
        id={panelId}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden"
      >
        <ul className="grid grid-cols-1 gap-x-6 pb-4 sm:grid-cols-2">
          {links.map(([label, href]) => (
            <li key={label}>
              <Link
                href={href}
                className="inline-block py-2 text-sm text-white/60 transition-colors hover:text-white"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

export function Footer() {
  const t = useTranslations("Nav");
  const f = useTranslations("Footer");
  const newsletterId = useId();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const columns: FooterColumnData[] = [
    {
      title: t("platforms"),
      links: platformLinks,
      moreLabel: f("morePlatforms"),
    },
    ...footerGroups.map((group) => ({
      title: t(group.titleKey),
      links: group.links.map(
        (l) => [t(l.labelKey), l.href] as [string, string]
      ),
    })),
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <footer className="relative overflow-hidden bg-[#081016] text-white border-t border-white/[0.06]">
      {/* Top gradient hairline */}
      <div aria-hidden className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#5baab8]/40 to-transparent" />
      {/* Glow & grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(91,170,184,0.12),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(to right,white 1px,transparent 1px), linear-gradient(to bottom,white 1px,transparent 1px)`, backgroundSize: `32px 32px` }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-6 md:py-14 lg:py-16">
        <div className="grid items-start gap-8 sm:gap-10 md:grid-cols-2 lg:grid-cols-6 xl:gap-12">
          {/* Brand + newsletter — modern glass */}
          <div className="md:col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5baab8]/50 focus-visible:rounded-xl"
            >
              <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-[0_8px_24px_-12px_rgba(255,255,255,0.4)] group-hover:shadow-[0_12px_32px_-12px_rgba(91,170,184,0.5)] transition-shadow">
                <img src="/logo.png" alt="DownForge" className="h-6 w-6 object-contain" />
              </div>
              <div className="leading-none">
                <span className="block font-heading text-[22px] font-black tracking-[-0.02em] bg-gradient-to-r from-white via-white to-[#8fd3df] bg-clip-text text-transparent">
                  DownForge
                </span>
                <span className="block font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-[#5baab8]">Download • Convert • Create</span>
              </div>
            </Link>

            <p className="mt-4 max-w-sm font-sans text-sm leading-relaxed text-white/60">
              {f("tagline")}
            </p>

            <div className="mt-4 inline-flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-semibold text-white/70">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> No logs
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-semibold text-white/70">
                <Zap className="w-3 h-3 text-amber-400" /> 200+ sites
              </span>
            </div>

            {/* Social — modern pill */}
            <div className="mt-7">
              <ColumnHeading>{f("socialHeading")}</ColumnHeading>
              <div className="mt-3.5 flex flex-wrap gap-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="group flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-white/60 ring-1 ring-white/10 backdrop-blur-sm transition-all hover:bg-white hover:text-[#0d1f26] hover:ring-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5baab8]/60"
                      whileHover={{ y: -2, scale: 1.06 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Newsletter — glass */}
            <div className="mt-8">
              <ColumnHeading>{f("newsletter")}</ColumnHeading>
              <p className="mt-3 font-sans text-sm leading-relaxed text-white/55">
                {f("newsletterDesc")}
              </p>
              <form onSubmit={handleSubscribe} className="mt-4">
                <label htmlFor={newsletterId} className="sr-only">
                  {f("newsletter")}
                </label>
                <div className="relative flex items-center rounded-full bg-white/[0.06] border border-white/10 p-1 backdrop-blur-xl focus-within:bg-white/[0.08] focus-within:border-[#5baab8]/30 transition-colors">
                  <input
                    id={newsletterId}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={f("newsletterPlaceholder")}
                    required
                    className="flex-1 bg-transparent px-4 py-2 font-sans text-sm text-white placeholder:text-white/40 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={subscribed}
                    aria-label={f("subscribe")}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full bg-white px-4 text-xs font-bold tracking-wide text-[#0d1f26] shadow hover:bg-slate-100 disabled:opacity-60 transition-colors"
                  >
                    {subscribed ? <><Check className="h-3.5 w-3.5" /> {f("subscribed")}</> : <><Send className="h-3.5 w-3.5" /> {f("subscribe")}</>}
                  </button>
                </div>
                <p aria-live="polite" className="mt-2 min-h-4 font-sans text-xs text-[#8fd3df]">
                  {subscribed ? `✓ ${f("subscribed")}` : <span className="text-white/30">No spam, unsubscribe anytime.</span>}
                </p>
              </form>
            </div>
          </div>

          {/* Link columns (tablet and up) */}
          {columns.map((column) => (
            <FooterColumn key={column.title} {...column} />
          ))}

          {/* Accordion (mobile only) */}
          <nav aria-label="Footer" className="mt-2 border-t border-white/[0.06] md:hidden">
            {columns.map((column) => (
              <FooterAccordion key={column.title} {...column} />
            ))}
          </nav>
        </div>

        {/* Large beautiful DownForge watermark */}
        <div className="relative mt-10 sm:mt-12 border-t border-white/[0.06] pt-8 sm:pt-10 overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-40 bg-gradient-to-b from-[#5baab8]/5 to-transparent blur-2xl" />
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span className="font-mono text-[11px] font-bold tracking-[0.18em] uppercase text-white/40">All systems operational • 200+ sites live</span>
              </div>
              <p className="mt-2 font-sans text-xs text-white/40">{f("copyright")}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/privacy" className="rounded-full bg-white/5 border border-white/10 px-3 py-1.5 font-sans text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                {t("privacy")}
              </Link>
              <Link href="/terms" className="rounded-full bg-white/5 border border-white/10 px-3 py-1.5 font-sans text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                Terms
              </Link>
              <Link href="/api-disclaimer" className="rounded-full bg-white/5 border border-white/10 px-3 py-1.5 font-sans text-xs font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                API Disclaimer
              </Link>
            </div>

            <p className="hidden lg:block font-mono text-xs tracking-wide text-white/25">{f("poweredBy")}</p>
          </div>

          {/* Beautiful DownForge large text */}
          <div className="mt-8 sm:mt-10 relative select-none overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-gradient-to-br from-white/[0.06] via-white/[0.02] to-transparent border border-white/[0.06] backdrop-blur-sm px-4 sm:px-6 py-6 sm:py-8">
            <div className="absolute inset-0 bg-gradient-to-r from-[#5baab8]/10 via-transparent to-transparent opacity-60" />
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg">
                  <img src="/logo.png" alt="DownForge" className="w-7 h-7 object-contain" />
                </div>
                <div>
                  <div className="font-heading text-2xl sm:text-3xl font-black tracking-[-0.03em] leading-none bg-gradient-to-r from-white via-white to-[#8fd3df] bg-clip-text text-transparent">
                    DownForge
                  </div>
                  <div className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[#5baab8]">Download • Convert • Create ✨</div>
                </div>
              </div>
              <div className="text-center lg:text-right">
                <div className="font-heading text-sm font-bold text-white/90 flex items-center justify-center lg:justify-end gap-2">
                  <Sparkles className="w-4 h-4 text-[#8fd3df]" /> Crafted for creators
                </div>
                <div className="font-sans text-xs text-white/40 mt-1">Fast • Private • Any format • 200+ platforms</div>
              </div>
            </div>
            {/* Watermark */}
            <div aria-hidden className="pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 font-heading text-[68px] sm:text-[92px] lg:text-[120px] font-black tracking-[-0.05em] leading-none text-white/[0.03] whitespace-nowrap select-none">
              DownForge
            </div>
          </div>

          <p className="mt-4 text-center font-mono text-[11px] tracking-wide text-white/20 lg:hidden">{f("poweredBy")}</p>
        </div>
      </div>
    </footer>
  );
}
