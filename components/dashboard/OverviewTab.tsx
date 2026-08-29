"use client";

import { useState, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Download, Zap, Shield, Globe, ArrowUpRight, ArrowDownRight, Tablet, Smartphone, Monitor, BarChart2, Activity } from "lucide-react";
import { getOverview, getTimeseries, getRecentDownloads } from "@/lib/api-client";
import type { DashboardOverview, TimeseriesBucket, DownloadRow } from "@/lib/api-client";
import { formatBytes } from "@/lib/constants";
import { EmptyState } from "./EmptyState";

function StatCard({ icon: Icon, label, value, trend, positive }: {
  icon: typeof Download; label: string; value: string; trend: string; positive: boolean;
}) {
  return (
    <div className="group relative overflow-hidden bg-card rounded-2xl border border-border/70 p-3.5 sm:p-5 shadow-[0_1px_2px_rgba(13,31,38,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-20px_rgba(13,31,38,0.28)] hover:border-[#5baab8]/30">
      <div aria-hidden className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-[#5baab8]/[0.07] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex items-center justify-between mb-3">
        <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#5baab8]/20 to-[#5baab8]/5 ring-1 ring-[#5baab8]/25 flex items-center justify-center">
          <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#5baab8]" />
        </span>
        <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
          positive
            ? "text-green-700 bg-green-500/10 dark:text-green-400"
            : "text-red-600 bg-red-500/10 dark:text-red-400"
        }`}>
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </span>
      </div>
      <p className="relative text-xl sm:text-[26px] sm:leading-tight font-extrabold text-foreground font-heading truncate">{value}</p>
      <p className="relative text-xs text-muted-foreground font-sans truncate">{label}</p>
    </div>
  );
}

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2.5 shadow-lg">
      <p className="text-[11px] font-medium text-muted-foreground font-sans mb-1">Week of {payload[0].payload.bucket}</p>
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#5baab8] shrink-0" />
        <p className="text-sm font-bold text-foreground font-heading">{payload[0].value.toLocaleString()} calls</p>
      </div>
    </div>
  );
}

// Compact axis labels (1,200 -> 1.2k) so the Y axis stays narrow on phones.
function formatCompactNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${Math.round(n / 1_000)}k`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

// Re-renders the chart after mount/resize so ResponsiveContainer re-measures
// the real container width instead of a stale pre-layout value.
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
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
  const isMobile = useIsMobile();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    // Safety: never leave loading stuck if backend hangs — force resolve after 8s
    const safety = setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 8000);

    const withTimeout = <T,>(p: Promise<T>, ms = 7000): Promise<T> =>
      Promise.race([
        p,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
      ]) as Promise<T>;

    Promise.allSettled([
      withTimeout(getOverview()),
      withTimeout(getTimeseries(7)),
      withTimeout(getRecentDownloads(5)),
    ]).then((results) => {
      if (cancelled) return;
      const [ovRes, tsRes, rcRes] = results;
      if (ovRes.status === "fulfilled" && (ovRes.value as any)?.success && (ovRes.value as any)?.data) setOverview((ovRes.value as any).data);
      if (tsRes.status === "fulfilled" && (tsRes.value as any)?.success && (tsRes.value as any)?.data) setTimeseries((tsRes.value as any).data.buckets);
      if (rcRes.status === "fulfilled" && (rcRes.value as any)?.success && (rcRes.value as any)?.data) setRecent((rcRes.value as any).data.recent);
    }).finally(() => {
      if (!cancelled) {
        clearTimeout(safety);
        setLoading(false);
      }
    });

    return () => { cancelled = true; clearTimeout(safety); };
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/70 p-4 sm:p-5 animate-pulse shadow-[0_1px_2px_rgba(13,31,38,0.04)]">
              <div className="h-20" />
            </div>
          ))}
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/70 p-5 sm:p-6 animate-pulse shadow-[0_1px_2px_rgba(13,31,38,0.04)]">
            <div className="h-48" />
          </div>
        ))}
      </div>
    );
  }

  const o = overview || { totalDownloads: 0, apiCallsToday: 0, platformsUsed: 0, successRate: 0, trends: { downloads: 0, apiCalls: 0, platforms: 0, successRate: 0 } };
  const totalCalls = timeseries.reduce((sum, b) => sum + b.calls, 0);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#5baab8] to-[#3d8896] text-white flex items-center justify-center shadow-[0_10px_24px_-10px_rgba(91,170,184,0.8)]">
          <Activity className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-foreground font-heading tracking-tight">Overview</h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans">Your download activity and API usage at a glance.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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

      <div className="bg-card rounded-2xl border border-border/70 p-4 sm:p-6 min-w-0 shadow-[0_1px_2px_rgba(13,31,38,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5baab8]/20 to-[#5baab8]/5 ring-1 ring-[#5baab8]/25 hidden sm:flex items-center justify-center">
              <BarChart2 className="w-4 h-4 text-[#5baab8]" />
            </span>
            <span className="relative flex w-2 h-2 shrink-0" aria-hidden>
              <span className="absolute inline-flex w-full h-full rounded-full bg-[#5baab8] opacity-60 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-[#5baab8]" />
            </span>
            <h3 className="text-sm font-bold text-foreground font-heading">API Calls Over Time</h3>
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs font-semibold font-sans px-2.5 py-1 rounded-full bg-[#5baab8]/10 text-[#5baab8] whitespace-nowrap">
              {totalCalls.toLocaleString()} {totalCalls === 1 ? "call" : "calls"}
            </span>
            <span className="hidden sm:inline text-xs text-muted-foreground font-sans whitespace-nowrap">Last 7 weeks</span>
          </div>
        </div>
        {timeseries.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="h-56 sm:h-64 lg:h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeseries} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5baab8" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#5baab8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(91,170,184,0.12)" vertical={false} />
                <XAxis
                  dataKey="bucket"
                  tick={{ fontSize: isMobile ? 10 : 11, fill: "#5a7d87" }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                  minTickGap={isMobile ? 12 : 8}
                  tickMargin={8}
                />
                <YAxis
                  width={isMobile ? 34 : 44}
                  tick={{ fontSize: isMobile ? 10 : 11, fill: "#5a7d87" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  tickFormatter={formatCompactNumber}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ stroke: "#5baab8", strokeOpacity: 0.3, strokeDasharray: "4 4" }}
                />
                <Area
                  type="monotone"
                  dataKey="calls"
                  stroke="#5baab8"
                  strokeWidth={2.5}
                  fill="url(#colorCalls)"
                  animationDuration={600}
                  activeDot={{ r: 5, fill: "#5baab8", stroke: "rgba(91,170,184,0.3)", strokeWidth: 6 }}
                  dot={(props: any) => {
                    const { cx, cy, index } = props;
                    if (index !== timeseries.length - 1) return <g key={index} />;
                    return (
                      <g key={index}>
                        <circle cx={cx} cy={cy} r={9} fill="#5baab8" opacity={0.15}>
                          <animate attributeName="r" values="6;11" dur="2.5s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.35;0" dur="2.5s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={cx} cy={cy} r={3.5} fill="#5baab8" stroke="rgba(91,170,184,0.25)" strokeWidth={3} />
                      </g>
                    );
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="bg-card rounded-2xl border border-border/70 p-4 sm:p-6 shadow-[0_1px_2px_rgba(13,31,38,0.04)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground font-heading">Recent Downloads</h3>
          <span className="text-xs font-medium text-muted-foreground font-sans px-2.5 py-1 rounded-full bg-muted/70">Last 24 hours</span>
        </div>
        {recent.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {/* Mobile card layout */}
            <div className="block sm:hidden">
              {recent.map((dl) => (
                <div key={dl.id} className="bg-muted/30 rounded-xl p-4 border border-border/50 transition-colors hover:border-[#5baab8]/30">
                  <div className="flex items-center justify-between mb-2.5 gap-2">
                    <p className="text-sm font-semibold text-foreground font-sans truncate pr-2">{dl.title || dl.filename || "Untitled"}</p>
                    <span className={`flex items-center gap-1.5 text-[11px] font-semibold px-2 py-0.5 rounded-full font-sans shrink-0 ${
                      dl.status === "completed" ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-red-500/10 text-red-700 dark:text-red-400"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dl.status === "completed" ? "bg-green-500" : "bg-red-500"}`} />
                      {dl.status === "completed" ? "Completed" : "Failed"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground font-sans">
                    <div><span className="font-medium">Platform:</span> <span className="capitalize">{dl.platform}</span></div>
                    <div><span className="font-medium">Size:</span> <span>{dl.size > 0 ? formatBytes(dl.size) : "—"}</span></div>
                    <div className="col-span-2"><span className="font-medium">Time:</span> <span>{formatRelativeTime(dl.created_at)}</span></div>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop table layout */}
            <div className="hidden sm:block overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left pb-3 text-[11px] font-bold text-muted-foreground/80 font-mono uppercase tracking-wider">File</th>
                    <th className="text-left pb-3 text-[11px] font-bold text-muted-foreground/80 font-mono uppercase tracking-wider">Platform</th>
                    <th className="text-left pb-3 text-[11px] font-bold text-muted-foreground/80 font-mono uppercase tracking-wider">Status</th>
                    <th className="text-left pb-3 text-[11px] font-bold text-muted-foreground/80 font-mono uppercase tracking-wider">Size</th>
                    <th className="text-right pb-3 text-[11px] font-bold text-muted-foreground/80 font-mono uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((dl) => (
                    <tr key={dl.id} className="border-b border-border/50 last:border-0 transition-colors hover:bg-muted/40">
                      <td className="py-3 text-sm text-foreground font-sans font-medium">{dl.title || dl.filename || "Untitled"}</td>
                      <td className="py-3 text-sm text-muted-foreground font-sans capitalize">{dl.platform}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full font-sans ${
                          dl.status === "completed" ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-red-500/10 text-red-700 dark:text-red-400"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dl.status === "completed" ? "bg-green-500" : "bg-red-500"}`} />
                          {dl.status === "completed" ? "Completed" : "Failed"}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-muted-foreground font-sans">{dl.size > 0 ? formatBytes(dl.size) : "—"}</td>
                      <td className="py-3 text-sm text-muted-foreground text-right font-sans">{formatRelativeTime(dl.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
