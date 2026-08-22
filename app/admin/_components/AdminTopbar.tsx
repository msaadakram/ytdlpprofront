"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

const titles: { match: (pathname: string) => boolean; title: string; subtitle: string }[] = [
  { match: (p) => p === "/admin", title: "Dashboard", subtitle: "Platform cookie health at a glance" },
  { match: (p) => p.startsWith("/admin/cookies/"), title: "Cookie Editor", subtitle: "Paste and verify platform cookies" },
  { match: (p) => p === "/admin/cookies", title: "Platform Cookies", subtitle: "Manage extraction cookies per platform" },
  { match: (p) => p === "/admin/settings", title: "Settings", subtitle: "Admin profile and security" },
];

export function AdminTopbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname();
  const entry = titles.find((t) => t.match(pathname)) || {
    title: "Admin",
    subtitle: "DownForge operations console",
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-card/95 backdrop-blur-sm border-b border-border flex items-center justify-between gap-3 px-4 sm:px-6">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenu}
          className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-foreground shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="min-w-0">
          <h1 className="text-sm font-bold text-foreground font-heading truncate">{entry.title}</h1>
          <p className="text-xs text-muted-foreground font-sans truncate">{entry.subtitle}</p>
        </div>
      </div>
      <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground font-sans bg-muted/60 border border-border rounded-full px-3 py-1.5 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-[#5baab8]" />
        Operations console
      </span>
    </header>
  );
}
