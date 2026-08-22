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
    <h3 className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
      {children}
    </h3>
  );
}

function FooterColumn({ title, links, moreLabel }: FooterColumnData) {
  return (
    <div className="max-md:hidden">
      <ColumnHeading>{title}</ColumnHeading>
      <ul className="mt-5 flex flex-col gap-1">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link
              href={href}
              className="inline-block py-1 text-sm text-white/55 transition-colors hover:text-white"
            >
              {label}
            </Link>
          </li>
        ))}
        {moreLabel && (
          <li className="pt-2">
            <Link
              href="/youtube-download"
              className="inline-block text-xs font-medium text-[#6fc1cf] transition-colors hover:text-white"
            >
              {moreLabel}
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
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5baab8]/50 focus-visible:rounded-lg"
      >
        <span className="font-heading text-sm font-semibold text-white/85">
          {title}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50"
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
                className="inline-block py-1.5 text-sm text-white/55 transition-colors hover:text-white"
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
    <footer className="relative overflow-hidden bg-[#0d1f26] text-white">
      {/* Accent hairline + soft glow */}
      <div
        aria-hidden
        className="h-px w-full bg-gradient-to-r from-transparent via-[#5baab8]/50 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(91,170,184,0.09),transparent_70%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16">
        <div className="grid items-start gap-10 md:grid-cols-2 lg:grid-cols-6 xl:gap-12">
          {/* Brand + newsletter */}
          <div className="md:col-span-2 lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5baab8]/50 focus-visible:rounded-lg"
            >
              <img
                src="/logo.png"
                alt="DownForge"
                className="h-9 w-9 object-contain"
              />
              <span className="font-heading text-lg font-bold tracking-tight">
                DownForge
              </span>
            </Link>

            <p className="mt-4 max-w-sm font-sans text-sm leading-relaxed text-white/60">
              {f("tagline")}
            </p>

            {/* Social links */}
            <div className="mt-6">
              <ColumnHeading>{f("socialHeading")}</ColumnHeading>
              <div className="mt-3.5 flex flex-wrap gap-2.5">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-white/60 ring-1 ring-white/10 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5baab8]/60"
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-8 lg:mt-10">
              <ColumnHeading>{f("newsletter")}</ColumnHeading>
              <p className="mt-3.5 font-sans text-sm leading-relaxed text-white/60">
                {f("newsletterDesc")}
              </p>
              <form onSubmit={handleSubscribe} className="mt-4">
                <label htmlFor={newsletterId} className="sr-only">
                  {f("newsletter")}
                </label>
                <div className="relative">
                  <input
                    id={newsletterId}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={f("newsletterPlaceholder")}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-4 pr-12 font-sans text-sm text-white transition-colors placeholder:text-white/40 focus:border-[#5baab8]/50 focus:outline-none focus:ring-2 focus:ring-[#5baab8]/30"
                  />
                  <button
                    type="submit"
                    disabled={subscribed}
                    aria-label={f("subscribe")}
                    className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg bg-[#5baab8] text-white transition-colors hover:bg-[#3d8fa0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5baab8]/60 disabled:opacity-60"
                  >
                    {subscribed ? (
                      <Check className="h-4 w-4" aria-hidden />
                    ) : (
                      <Send className="h-3.5 w-3.5" aria-hidden />
                    )}
                  </button>
                </div>
                <p
                  aria-live="polite"
                  className="mt-2 min-h-4 font-sans text-xs text-[#6fc1cf]"
                >
                  {subscribed ? `✓ ${f("subscribed")}` : ""}
                </p>
              </form>
            </div>
          </div>

          {/* Link columns (tablet and up) */}
          {columns.map((column) => (
            <FooterColumn key={column.title} {...column} />
          ))}

          {/* Accordion (mobile only) */}
          <nav aria-label="Footer" className="mt-2 border-t border-white/10 md:hidden">
            {columns.map((column) => (
              <FooterAccordion key={column.title} {...column} />
            ))}
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-6 md:mt-16 md:pt-8">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
            <p className="font-sans text-xs text-white/40">{f("copyright")}</p>

            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <Link
                href="/privacy"
                className="inline-block py-1 font-sans text-xs text-white/40 transition-colors hover:text-white/80"
              >
                {t("privacy")}
              </Link>
              <span
                aria-hidden
                className="hidden h-1 w-1 rounded-full bg-white/20 sm:block"
              />
              <Link
                href="/api-disclaimer"
                className="inline-block py-1 font-sans text-xs text-white/40 transition-colors hover:text-white/80"
              >
                API Disclaimer
              </Link>
            </div>

            <p className="font-sans text-xs text-white/30">{f("poweredBy")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
