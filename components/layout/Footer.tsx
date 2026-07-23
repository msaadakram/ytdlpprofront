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
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

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
      { labelKey: "about" as const, href: "#" },
      { labelKey: "privacy" as const, href: "/privacy" },
      { labelKey: "terms" as const, href: "#" },
      { labelKey: "contact" as const, href: "#" },
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

const mobileAccordionItems = [
  {
    titleKey: "platforms" as const,
    links: platformLinks,
  },
  ...footerGroups.map((group) => ({
    titleKey: group.titleKey,
    links: group.links.map((l) => [t_label(l.labelKey), l.href] as [string, string]),
  })),
];

function t_label(key: string): string {
  const labels: Record<string, string> = {
    features: "Features",
    pricing: "Pricing",
    api: "API",
    dashboard: "Dashboard",
    documentation: "Documentation",
    apiStatus: "API Status",
    changelog: "Changelog",
    blog: "Blog",
    about: "About",
    privacy: "Privacy",
    terms: "Terms",
    contact: "Contact",
  };
  return labels[key] || key;
}

export function Footer() {
  const t = useTranslations("Nav");
  const f = useTranslations("Footer");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#0d1f26] text-white pt-12 md:pt-16 pb-6 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-8 xl:gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/logo.png"
                alt="DownForge"
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-lg tracking-tight font-heading">
                DownForge
              </span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed font-sans mb-6">
              {f("tagline")}
            </p>

            {/* Social Links */}
            <div className="flex flex-col gap-2.5">
              <h5 className="text-xs font-semibold text-white/50 uppercase tracking-widest font-mono">
                Follow Us
              </h5>
              <div className="flex flex-wrap gap-2.5">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all duration-200"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Platforms Column */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-4 font-heading">
              {t("platforms")}
            </h4>
            <ul className="flex flex-col gap-2.5">
              {platformLinks.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-white/50 hover:text-white transition-colors font-sans"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/youtube-download"
                  className="text-xs text-[#5baab8] hover:text-white transition-colors font-sans"
                >
                  + 200+ more platforms →
                </Link>
              </li>
            </ul>
          </div>

          {/* Footer Groups */}
          {footerGroups.map((group) => (
            <div key={group.titleKey}>
              <h4 className="text-sm font-semibold text-white/80 mb-4 font-heading">
                {t(group.titleKey)}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors font-sans"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Column */}
          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-4 font-heading">
              Newsletter
            </h4>
            <p className="text-sm text-white/60 leading-relaxed font-sans mb-4">
              Get the latest updates and platform support news.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#5baab8]/40 transition-all font-sans"
                />
                <button
                  type="submit"
                  disabled={subscribed}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg bg-[#5baab8] text-white flex items-center justify-center hover:bg-[#3d8fa0] transition-colors disabled:opacity-50"
                >
                  {subscribed ? (
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <Send className="w-3 h-3" />
                  )}
                </button>
              </div>
              {subscribed && (
                <p className="text-xs text-[#5baab8] font-sans">
                  ✓ Subscribed! Check your email.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Mobile Accordion */}
        <div className="lg:hidden space-y-3 mt-8">
          {mobileAccordionItems.map((item) => (
            <MobileAccordionItem
              key={item.titleKey}
              title={t(item.titleKey)}
              links={item.links}
            />
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 md:mt-12 pt-6 md:pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
              <p className="text-xs text-white/40 font-sans">
                {f("copyright")}
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/privacy"
                  className="text-xs text-white/30 hover:text-white/60 transition-colors font-sans"
                >
                  Privacy Policy
                </Link>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <Link
                  href="/api-disclaimer"
                  className="text-xs text-white/30 hover:text-white/60 transition-colors font-sans"
                >
                  API Disclaimer
                </Link>
              </div>
            </div>
            <p className="text-xs text-white/30 font-sans">
              {f("poweredBy")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Mobile Accordion Item Component
function MobileAccordionItem({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="border border-white/10 rounded-xl overflow-hidden"
      initial={false}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-semibold text-white/80 font-heading">
          {title}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <svg
            className="w-4 h-4 text-white/50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.span>
      </button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="overflow-hidden"
      >
        <ul className="px-4 pb-3 space-y-2">
          {links.map(([label, href]) => (
            <li key={label}>
              <Link
                href={href}
                className="text-sm text-white/50 hover:text-white transition-colors font-sans"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}
