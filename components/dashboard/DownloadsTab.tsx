"use client";

import { useState } from "react";
import { Search, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const weeklyData = [
  { day: "Mon", downloads: 45 },
  { day: "Tue", downloads: 62 },
  { day: "Wed", downloads: 38 },
  { day: "Thu", downloads: 71 },
  { day: "Fri", downloads: 89 },
  { day: "Sat", downloads: 52 },
  { day: "Sun", downloads: 33 },
];

const allDownloads = [
  { file: "Rick Astley - Never Gonna Give You Up.mp4", platform: "YouTube", type: "Video", format: "MP4 • 1080p", size: "52.4 MB", date: "2025-02-12", status: "Completed" },
  { file: "Nature Documentary - 4K.mp4", platform: "Vimeo", type: "Video", format: "MP4 • 4K", size: "1.2 GB", date: "2025-02-12", status: "Completed" },
  { file: "Podcast Episode #42.mp3", platform: "SoundCloud", type: "Audio", format: "MP3 • 320kbps", size: "48 MB", date: "2025-02-12", status: "Processing" },
  { file: "Tutorial - React Hooks.mp4", platform: "YouTube", type: "Video", format: "MP4 • 1080p", size: "248 MB", date: "2025-02-12", status: "Completed" },
  { file: "Album - Full Discography.flac", platform: "YouTube", type: "Audio", format: "FLAC", size: "1.8 GB", date: "2025-02-11", status: "Completed" },
  { file: "Live Stream Recording.mp4", platform: "Twitch", type: "Video", format: "MP4 • 720p", size: "892 MB", date: "2025-02-11", status: "Failed" },
  { file: "Music Video - 4K HDR.mp4", platform: "YouTube", type: "Video", format: "MP4 • 4K", size: "2.1 GB", date: "2025-02-10", status: "Completed" },
  { file: "Thumbnail - maxresdefault.jpg", platform: "YouTube", type: "Thumbnail", format: "JPG", size: "245 KB", date: "2025-02-10", status: "Completed" },
];

export function DownloadsTab() {
  const [search, setSearch] = useState("");

  const filtered = allDownloads.filter(
    (d) => d.file.toLowerCase().includes(search.toLowerCase()) || d.platform.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="text-sm font-bold text-foreground mb-4 font-heading">This Week</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(91,170,184,0.1)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#5a7d87" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#5a7d87" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(91,170,184,0.18)" }} />
              <Bar dataKey="downloads" fill="#5baab8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 flex items-center gap-3 bg-[#eef6f8] rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#5baab8]/40 transition-all">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search downloads..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans"
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left pb-3 text-xs font-semibold text-muted-foreground font-mono whitespace-nowrap">File</th>
                <th className="text-left pb-3 text-xs font-semibold text-muted-foreground font-mono whitespace-nowrap">Platform</th>
                <th className="text-left pb-3 text-xs font-semibold text-muted-foreground font-mono whitespace-nowrap">Type</th>
                <th className="text-left pb-3 text-xs font-semibold text-muted-foreground font-mono whitespace-nowrap">Format</th>
                <th className="text-left pb-3 text-xs font-semibold text-muted-foreground font-mono whitespace-nowrap">Size</th>
                <th className="text-left pb-3 text-xs font-semibold text-muted-foreground font-mono whitespace-nowrap">Date</th>
                <th className="text-left pb-3 text-xs font-semibold text-muted-foreground font-mono whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((dl, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="py-3 pr-4 text-sm text-foreground font-sans whitespace-nowrap">{dl.file}</td>
                  <td className="py-3 pr-4 text-sm text-muted-foreground font-sans whitespace-nowrap">{dl.platform}</td>
                  <td className="py-3 pr-4 text-sm text-muted-foreground font-sans whitespace-nowrap">{dl.type}</td>
                  <td className="py-3 pr-4 text-sm text-muted-foreground font-sans whitespace-nowrap">{dl.format}</td>
                  <td className="py-3 pr-4 text-sm text-muted-foreground font-sans whitespace-nowrap">{dl.size}</td>
                  <td className="py-3 pr-4 text-sm text-muted-foreground font-sans whitespace-nowrap">{dl.date}</td>
                  <td className="py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full font-sans ${
                      dl.status === "Completed" ? "bg-green-100 text-green-700" :
                      dl.status === "Processing" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>{dl.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
