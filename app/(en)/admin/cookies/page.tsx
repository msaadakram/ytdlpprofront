"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCw, Trash2, ChevronRight } from "lucide-react";

type PlatformInfo = {
  id: string;
  name: string;
  brandColor: string;
  fgColor: string;
};

const platforms: PlatformInfo[] = [
  { id: "youtube", name: "YouTube", brandColor: "#FF0000", fgColor: "#ffffff" },
  { id: "tiktok", name: "TikTok", brandColor: "#010101", fgColor: "#ffffff" },
  { id: "instagram", name: "Instagram", brandColor: "#E1306C", fgColor: "#ffffff" },
  { id: "facebook", name: "Facebook", brandColor: "#1877F2", fgColor: "#ffffff" },
  { id: "vimeo", name: "Vimeo", brandColor: "#1AB7EA", fgColor: "#ffffff" },
  { id: "twitch", name: "Twitch", brandColor: "#9146FF", fgColor: "#ffffff" },
  { id: "dailymotion", name: "Dailymotion", brandColor: "#0066DC", fgColor: "#ffffff" },
  { id: "reddit", name: "Reddit", brandColor: "#FF4500", fgColor: "#ffffff" },
  { id: "soundcloud", name: "SoundCloud", brandColor: "#FF5500", fgColor: "#ffffff" },
  { id: "kick", name: "Kick", brandColor: "#53FC18", fgColor: "#000000" },
  { id: "snapchat", name: "Snapchat", brandColor: "#FFB300", fgColor: "#1a1300" },
  { id: "linkedin", name: "LinkedIn", brandColor: "#0A66C2", fgColor: "#ffffff" },
  { id: "pinterest", name: "Pinterest", brandColor: "#E60023", fgColor: "#ffffff" },
  { id: "niconico", name: "Niconico", brandColor: "#FF69B3", fgColor: "#ffffff" },
];

interface CookieEntry {
  platform: string;
  notes: string | null;
  updated_at: string;
}

function StatusBadge({ set }: { set: boolean }) {
  return set ? (
    <span className="text-xs font-medium text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full">Set</span>
  ) : (
    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Not Set</span>
  );
}

export default function AdminCookiesPage() {
  const [cookies, setCookies] = useState<Record<string, CookieEntry>>({});
  const [loading, setLoading] = useState(true);

  const fetchCookies = async () => {
    setLoading(true);
    const token = localStorage.getItem("admin_token");
    const res = await fetch("/api/admin/proxy/cookies", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    if (json.success) {
      const map: Record<string, CookieEntry> = {};
      for (const c of json.data) {
        map[c.platform] = c;
      }
      setCookies(map);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCookies();
  }, []);

  const handleDelete = async (platform: string) => {
    if (!confirm(`Delete cookie for ${platform}?`)) return;
    const token = localStorage.getItem("admin_token");
    await fetch(`/api/admin/proxy/cookies/${platform}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    await fetchCookies();
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground font-heading">Platform Cookies</h1>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">
            Cookies are used server-side for authenticated extractions
          </p>
        </div>
        <button
          onClick={fetchCookies}
          className="flex items-center gap-2 text-sm font-medium text-foreground bg-card border border-border rounded-xl px-3.5 py-2 hover:bg-muted transition-colors shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Mobile: card list */}
      <div className="space-y-3 md:hidden">
        {platforms.map((p) => {
          const entry = cookies[p.id];
          return (
            <div key={p.id} className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: p.brandColor }}
                  />
                  <span className="text-sm font-semibold text-foreground truncate">{p.name}</span>
                </div>
                <StatusBadge set={Boolean(entry)} />
              </div>
              {entry && (
                <p className="text-xs text-muted-foreground mb-3">
                  Updated {new Date(entry.updated_at + "Z").toLocaleDateString()}
                  {entry.notes ? ` · ${entry.notes}` : ""}
                </p>
              )}
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/cookies/${p.id}`}
                  className="flex-1 flex items-center justify-center gap-1 text-sm font-semibold text-[#5baab8] bg-[#5baab8]/10 rounded-lg px-3 py-2.5 hover:bg-[#5baab8]/20 transition-colors"
                >
                  {entry ? "Edit" : "Set Cookie"}
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
                {entry && (
                  <button
                    onClick={() => handleDelete(p.id)}
                    aria-label={`Delete ${p.name} cookie`}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg p-2.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Platform</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Last Updated</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Notes</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((p) => {
                const entry = cookies[p.id];
                return (
                  <tr key={p.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: p.brandColor }}
                        />
                        <span className="text-sm font-medium text-foreground">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge set={Boolean(entry)} />
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {entry ? new Date(entry.updated_at + "Z").toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate">
                      {entry?.notes || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/cookies/${p.id}`}
                          className="text-xs text-[#5baab8] hover:text-[#3d8fa0] font-semibold"
                        >
                          {entry ? "Edit" : "Set Cookie"}
                        </Link>
                        {entry && (
                          <button
                            onClick={() => handleDelete(p.id)}
                            aria-label={`Delete ${p.name} cookie`}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
