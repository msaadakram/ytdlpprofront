"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getDownloadsHistory } from "@/lib/api-client";
import type { DownloadRow } from "@/lib/api-client";
import { formatBytes } from "@/lib/constants";
import { EmptyState } from "./EmptyState";

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
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-border p-6 animate-pulse"><div className="h-48" /></div>
        <div className="bg-white rounded-xl border border-border p-6 animate-pulse"><div className="h-64" /></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="text-sm font-bold text-foreground mb-4 font-heading">This Week</h3>
        {weekly.length === 0 || weekly.every((d) => d.downloads === 0) ? (
          <EmptyState />
        ) : (
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(91,170,184,0.1)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#5a7d87" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#5a7d87" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid rgba(91,170,184,0.18)" }} />
                <Bar dataKey="downloads" fill="#5baab8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
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

        {items.length === 0 ? (
          <EmptyState />
        ) : (
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
                {items.map((dl) => (
                  <tr key={dl.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 pr-4 text-sm text-foreground font-sans whitespace-nowrap">{dl.title || dl.filename || "Untitled"}</td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground font-sans whitespace-nowrap capitalize">{dl.platform}</td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground font-sans whitespace-nowrap capitalize">{dl.type}</td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground font-sans whitespace-nowrap">{dl.format_label || "—"}</td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground font-sans whitespace-nowrap">{dl.size > 0 ? formatBytes(dl.size) : "—"}</td>
                    <td className="py-3 pr-4 text-sm text-muted-foreground font-sans whitespace-nowrap">
                      {dl.created_at ? new Date(dl.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full font-sans ${
                        dl.status === "completed" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>{dl.status === "completed" ? "Completed" : "Failed"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
