"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

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

export function Footer() {
  const t = useTranslations("Nav");
  const f = useTranslations("Footer");

  return (
    <footer className="bg-[#0d1f26] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-10">
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/logo.png"
                alt="DownForge"
                className="w-8 h-8 object-contain"
              />
              <span className="font-bold text-lg tracking-tight font-heading">DownForge</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs font-sans">
              {f("tagline")}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-4 font-heading">{t("platforms")}</h4>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2.5">
              {platformLinks.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/50 hover:text-white transition-colors font-sans">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {footerGroups.map((group) => (
            <div key={group.titleKey}>
              <h4 className="text-sm font-semibold text-white/80 mb-4 font-heading">{t(group.titleKey)}</h4>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.labelKey}>
                    <Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors font-sans">
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40 font-sans">{f("copyright")}</p>
          <p className="text-xs text-white/30 font-sans">{f("poweredBy")}</p>
        </div>
      </div>
    </footer>
  );
}
