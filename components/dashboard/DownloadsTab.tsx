"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Download, File, Globe, Type, FileText, Calendar, CheckCircle, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getDownloadsHistory } from "@/lib/api-client";
import type { DownloadRow } from "@/lib/api-client";
import { formatBytes } from "@/lib/constants";
import { EmptyState } from "./EmptyState";

function DownloadCard({ dl }: { dl: DownloadRow }) {
  return (
    <div className="bg-card rounded-2xl border border-border/70 p-4 shadow-[0_1px_2px_rgba(13,31,38,0.04)] transition-all duration-300 hover:border-[#5baab8]/30">
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-sm font-semibold text-foreground font-sans truncate pr-2">{dl.title || dl.filename || "Untitled"}</p>
        <span className={`flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full font-sans shrink-0 ${
          dl.status === "completed" ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-red-500/10 text-red-700 dark:text-red-400"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dl.status === "completed" ? "bg-green-500" : "bg-red-500"}`} />
          {dl.status === "completed" ? "Completed" : "Failed"}
        </span>
      </div>
      <div className="space-y-2 text-sm text-muted-foreground font-sans">
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 shrink-0 text-[#5baab8]/80" />
          <span className="capitalize">{dl.platform}</span>
        </div>
        <div className="flex items-center gap-2">
          <Type className="w-3.5 h-3.5 shrink-0 text-[#5baab8]/80" />
          <span className="capitalize">{dl.type}</span>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="w-3.5 h-3.5 shrink-0 text-[#5baab8]/80" />
          <span>{dl.format_label || "—"}</span>
        </div>
        <div className="flex items-center gap-2">
          <File className="w-3.5 h-3.5 shrink-0 text-[#5baab8]/80" />
          <span>{dl.size > 0 ? formatBytes(dl.size) : "—"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 shrink-0 text-[#5baab8]/80" />
          <span>{dl.created_at ? new Date(dl.created_at).toLocaleDateString() : "—"}</span>
        </div>
      </div>
    </div>
  );
}

export function DownloadsTab() {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<DownloadRow[]>([]);
  const [weekly, setWeekly] = useState<{ day: string; downloads: number }[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    const res = await getDownloadsHistory({ search, page: 1, limit: 50 });
    if (res.success && res.data) {
      setItems(res.data.items);
      setWeekly(res.data.weekly);
      setTotalPages(res.data.totalPages);
    }
    setLoading(false);
  }, [search]);

  useEffect(() => {
    const debounce = setTimeout(fetchHistory, 300);
    return () => clearTimeout(debounce);
  }, [fetchHistory]);

  if (loading) {
    return (
      <div className="space-y-5 sm:space-y-6">
        <div className="bg-card rounded-2xl border border-border/70 p-4 sm:p-6 skeleton-shimmer shadow-[0_1px_2px_rgba(13,31,38,0.04)]"><div className="h-48" /></div>
        <div className="bg-card rounded-2xl border border-border/70 p-4 sm:p-6 skeleton-shimmer shadow-[0_1px_2px_rgba(13,31,38,0.04)]"><div className="h-64" /></div>
      </div>
    );
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#5baab8] to-[#3d8896] text-white flex items-center justify-center shadow-[0_10px_24px_-10px_rgba(91,170,184,0.8)] shrink-0">
          <Download className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-foreground font-heading tracking-tight">Downloads</h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans">Browse and search your full download history.</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/70 p-4 sm:p-6 shadow-[0_1px_2px_rgba(13,31,38,0.04)]">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h3 className="text-sm font-bold text-foreground font-heading">This Week</h3>
          <span className="text-xs font-medium text-muted-foreground font-sans px-2.5 py-1 rounded-full bg-muted/70">7 days</span>
        </div>
        {weekly.length === 0 || weekly.every((d) => d.downloads === 0) ? (
          <EmptyState />
        ) : (
          <div className="h-48 sm:h-56 lg:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(91,170,184,0.1)" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#5a7d87" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#5a7d87" }} axisLine={false} tickLine={false} allowDecimals={false} tickFormatter={(value) => value.toLocaleString()} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(91,170,184,0.18)" }} />
                <Bar dataKey="downloads" fill="#5baab8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="bg-card rounded-2xl border border-border/70 p-4 sm:p-6 shadow-[0_1px_2px_rgba(13,31,38,0.04)]">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="flex-1 flex items-center gap-3 bg-muted/60 rounded-full px-4 py-2.5 ring-1 ring-transparent focus-within:ring-[#5baab8]/40 focus-within:bg-background transition-all">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search downloads..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans"
            />
          </div>
        </div>

        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Mobile: Card layout */}
            <div className="space-y-3 sm:hidden">
              {items.map((dl) => (
                <DownloadCard key={dl.id} dl={dl} />
              ))}
            </div>

            {/* Desktop: Table layout */}
            <div className="hidden sm:block overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left pb-3 text-[11px] font-bold text-muted-foreground/80 font-mono uppercase tracking-wider whitespace-nowrap">File</th>
                    <th className="text-left pb-3 text-[11px] font-bold text-muted-foreground/80 font-mono uppercase tracking-wider whitespace-nowrap">Platform</th>
                    <th className="text-left pb-3 text-[11px] font-bold text-muted-foreground/80 font-mono uppercase tracking-wider whitespace-nowrap">Type</th>
                    <th className="text-left pb-3 text-[11px] font-bold text-muted-foreground/80 font-mono uppercase tracking-wider whitespace-nowrap">Format</th>
                    <th className="text-left pb-3 text-[11px] font-bold text-muted-foreground/80 font-mono uppercase tracking-wider whitespace-nowrap">Size</th>
                    <th className="text-left pb-3 text-[11px] font-bold text-muted-foreground/80 font-mono uppercase tracking-wider whitespace-nowrap">Date</th>
                    <th className="text-left pb-3 text-[11px] font-bold text-muted-foreground/80 font-mono uppercase tracking-wider whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((dl) => (
                    <tr key={dl.id} className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/40">
                      <td className="py-3 pr-4 text-sm text-foreground font-sans font-medium whitespace-nowrap">{dl.title || dl.filename || "Untitled"}</td>
                      <td className="py-3 pr-4 text-sm text-muted-foreground font-sans whitespace-nowrap capitalize">{dl.platform}</td>
                      <td className="py-3 pr-4 text-sm text-muted-foreground font-sans whitespace-nowrap capitalize">{dl.type}</td>
                      <td className="py-3 pr-4 text-sm text-muted-foreground font-sans whitespace-nowrap">{dl.format_label || "—"}</td>
                      <td className="py-3 pr-4 text-sm text-muted-foreground font-sans whitespace-nowrap">{dl.size > 0 ? formatBytes(dl.size) : "—"}</td>
                      <td className="py-3 pr-4 text-sm text-muted-foreground font-sans whitespace-nowrap">
                        {dl.created_at ? new Date(dl.created_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full font-sans ${
                          dl.status === "completed" ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-red-500/10 text-red-700 dark:text-red-400"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dl.status === "completed" ? "bg-green-500" : "bg-red-500"}`} />
                          {dl.status === "completed" ? "Completed" : "Failed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}