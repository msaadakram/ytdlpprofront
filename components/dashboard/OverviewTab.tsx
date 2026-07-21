"use client";

import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Download, Zap, Shield, Globe, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { getOverview, getTimeseries, getRecentDownloads } from "@/lib/api-client";
import type { DashboardOverview, TimeseriesBucket, DownloadRow } from "@/lib/api-client";
import { formatBytes } from "@/lib/constants";
import { EmptyState } from "./EmptyState";

function StatCard({ icon: Icon, label, value, trend, positive }: {
  icon: typeof Download; label: string; value: string; trend: string; positive: boolean;
}) {
  return (
    <div className="bg-white rounded-xl border border-border p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-[#eef6f8] flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#5baab8]" />
        </div>
        <span className={`flex items-center gap-1 text-xs font-medium ${positive ? "text-green-600" : "text-red-500"}`}>
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </span>
      </div>
      <p className="text-2xl font-extrabold text-foreground font-heading">{value}</p>
      <p className="text-xs text-muted-foreground font-sans">{label}</p>
    </div>
  );
}

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-border rounded-xl p-3 shadow-lg">
      <p className="text-xs font-medium text-muted-foreground font-sans">{payload[0].payload.bucket}</p>
      <p className="text-sm font-bold text-foreground font-heading">{payload[0].value.toLocaleString()} calls</p>
    </div>
  );
}

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export function OverviewTab() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [timeseries, setTimeseries] = useState<TimeseriesBucket[]>([]);
  const [recent, setRecent] = useState<DownloadRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([
      getOverview(),
      getTimeseries(7),
      getRecentDownloads(5),
    ]).then(([ovRes, tsRes, rcRes]) => {
      if (cancelled) return;
      if (ovRes.success && ovRes.data) setOverview(ovRes.data);
      if (tsRes.success && tsRes.data) setTimeseries(tsRes.data.buckets);
      if (rcRes.success && rcRes.data) setRecent(rcRes.data.recent);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-border p-5 animate-pulse">
            <div className="h-20" />
          </div>
        ))}
      </div>
    );
  }

  const o = overview || { totalDownloads: 0, apiCallsToday: 0, platformsUsed: 0, successRate: 0, trends: { downloads: 0, apiCalls: 0, platforms: 0, successRate: 0 } };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Download}
          label="Total Downloads"
          value={o.totalDownloads.toLocaleString()}
          trend={o.trends.downloads > 0 ? `+${o.trends.downloads}%` : `${o.trends.downloads}%`}
          positive={o.trends.downloads >= 0}
        />
        <StatCard
          icon={Zap}
          label="API Calls Today"
          value={o.apiCallsToday.toLocaleString()}
          trend={o.trends.apiCalls > 0 ? `+${o.trends.apiCalls}%` : `${o.trends.apiCalls}%`}
          positive={o.trends.apiCalls >= 0}
        />
        <StatCard
          icon={Globe}
          label="Platforms Used"
          value={String(o.platformsUsed)}
          trend={String(o.platformsUsed)}
          positive={true}
        />
        <StatCard
          icon={Shield}
          label="Success Rate"
          value={`${o.successRate}%`}
          trend={`${o.trends.successRate}%`}
          positive={o.trends.successRate >= 0}
        />
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-foreground font-heading">API Calls Over Time</h3>
          <span className="text-xs text-muted-foreground font-sans">Last 7 weeks</span>
        </div>
        {timeseries.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeseries}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5baab8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5baab8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(91,170,184,0.1)" />
                <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: "#5a7d87" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#5a7d87" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="calls" stroke="#5baab8" strokeWidth={2} fill="url(#colorCalls)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground font-heading">Recent Downloads</h3>
          <span className="text-xs text-muted-foreground font-sans">Last 24 hours</span>
        </div>
        {recent.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-3 text-xs font-semibold text-muted-foreground font-mono">File</th>
                  <th className="text-left pb-3 text-xs font-semibold text-muted-foreground font-mono">Platform</th>
                  <th className="text-left pb-3 text-xs font-semibold text-muted-foreground font-mono">Status</th>
                  <th className="text-left pb-3 text-xs font-semibold text-muted-foreground font-mono">Size</th>
                  <th className="text-right pb-3 text-xs font-semibold text-muted-foreground font-mono">Time</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((dl) => (
                  <tr key={dl.id} className="border-b border-border/50 last:border-0">
                    <td className="py-3 text-sm text-foreground font-sans">{dl.title || dl.filename || "Untitled"}</td>
                    <td className="py-3 text-sm text-muted-foreground font-sans capitalize">{dl.platform}</td>
                    <td className="py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full font-sans ${
                        dl.status === "completed" ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"
                      }`}>{dl.status === "completed" ? "Completed" : "Failed"}</span>
                    </td>
                    <td className="py-3 text-sm text-muted-foreground font-sans">{dl.size > 0 ? formatBytes(dl.size) : "—"}</td>
                    <td className="py-3 text-sm text-muted-foreground text-right font-sans">{formatRelativeTime(dl.created_at)}</td>
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
