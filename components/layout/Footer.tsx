import Link from "next/link";
import { Download } from "lucide-react";

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

const footerLinks = [
  { title: "Product", links: [["Features", "#features"], ["Pricing", "/pricing"], ["API", "/api"], ["Dashboard", "/dashboard"]] },
  { title: "Resources", links: [["Documentation", "/api"], ["API Status", "#"], ["Changelog", "#"], ["Blog", "#"]] },
  { title: "Company", links: [["About", "#"], ["Privacy", "/privacy"], ["Terms", "#"], ["Contact", "#"]] },
];

export function Footer() {
  return (
    <footer className="bg-[#0d1f26] text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <Download className="w-4 h-4 text-[#5baab8]" />
              </div>
              <span className="font-bold text-lg tracking-tight font-heading">DownForge</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs font-sans">
              Download any video, audio or thumbnail from 200+ platforms. Fast, free, and secure.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white/80 mb-4 font-heading">Platforms</h4>
            <ul className="flex flex-col gap-2.5">
              {platformLinks.map(([label, href]) => (
                <li key={label}>
                  <Link href={href} className="text-sm text-white/50 hover:text-white transition-colors font-sans">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-white/80 mb-4 font-heading">{group.title}</h4>
              <ul className="flex flex-col gap-3">
                {group.links.map(([label, href]) => (
                  <li key={label}>
                    {href.startsWith("/") ? (
                      <Link href={href} className="text-sm text-white/50 hover:text-white transition-colors font-sans">{label}</Link>
                    ) : (
                      <a href={href} className="text-sm text-white/50 hover:text-white transition-colors font-sans">{label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/40 font-sans">&copy; 2025 DownForge. All rights reserved.</p>
          <p className="text-xs text-white/30 font-sans">Powered by yt-dlp &amp; ffmpeg</p>
        </div>
      </div>
    </footer>
  );
}
