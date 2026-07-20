"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, RefreshCw, Trash2 } from "lucide-react";

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

export default function AdminCookiesPage() {
  const [cookies, setCookies] = useState<Record<string, CookieEntry>>({});
  const [loading, setLoading] = useState(true);

  const fetchCookies = async () => {
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Platform Cookies</h1>
        <button
          onClick={fetchCookies}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Platform</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Last Updated</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Notes</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {platforms.map((p) => {
              const entry = cookies[p.id];
              return (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: p.brandColor }}
                      />
                      <span className="text-sm font-medium text-gray-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {entry ? (
                      <span className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                        Set
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                        Not Set
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {entry
                      ? new Date(entry.updated_at + "Z").toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">
                    {entry?.notes || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/cookies/${p.id}`}
                        className="text-xs text-[#5baab8] hover:text-[#4a99a7] font-medium"
                      >
                        {entry ? "Edit" : "Set Cookie"}
                      </Link>
                      {entry && (
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="text-xs text-red-500 hover:text-red-700"
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
  );
}
