"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Download, Zap, Shield, Globe, ArrowUpRight, ArrowDownRight } from "lucide-react";

const apiCallsData = [
  { day: "Jan 1", calls: 420, errors: 12 },
  { day: "Jan 8", calls: 580, errors: 8 },
  { day: "Jan 15", calls: 390, errors: 15 },
  { day: "Jan 22", calls: 720, errors: 6 },
  { day: "Jan 29", calls: 610, errors: 10 },
  { day: "Feb 5", calls: 890, errors: 5 },
  { day: "Feb 12", calls: 940, errors: 7 },
];

const recentDownloads = [
  { filename: "Rick Astley - Never Gonna Give You Up.mp4", platform: "YouTube", status: "Completed", size: "52.4 MB", date: "2 min ago" },
  { filename: "Nature Documentary - 4K.mp4", platform: "Vimeo", status: "Completed", size: "1.2 GB", date: "15 min ago" },
  { filename: "Podcast Episode #42.mp3", platform: "SoundCloud", status: "Processing", size: "—", date: "1 min ago" },
  { filename: "Tutorial - React Hooks.mp4", platform: "YouTube", status: "Completed", size: "248 MB", date: "1 hour ago" },
  { filename: "Music Video - FLAC.flac", platform: "YouTube", status: "Failed", size: "—", date: "2 hours ago" },
];

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
      <p className="text-xs font-medium text-muted-foreground font-sans">{payload[0].payload.day}</p>
      <p className="text-sm font-bold text-foreground font-heading">{payload[0].value.toLocaleString()} calls</p>
    </div>
  );
}

export function OverviewTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Download} label="Total Downloads" value="1,284" trend="+12.5%" positive />
        <StatCard icon={Zap} label="API Calls Today" value="942" trend="+8.2%" positive />
        <StatCard icon={Globe} label="Platforms Used" value="34" trend="+3" positive />
        <StatCard icon={Shield} label="Success Rate" value="98.7%" trend="-0.3%" positive={false} />
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-bold text-foreground font-heading">API Calls Over Time</h3>
          <span className="text-xs text-muted-foreground font-sans">Last 7 weeks</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={apiCallsData}>
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5baab8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#5baab8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(91,170,184,0.1)" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#5a7d87" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#5a7d87" }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="calls" stroke="#5baab8" strokeWidth={2} fill="url(#colorCalls)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground font-heading">Recent Downloads</h3>
          <span className="text-xs text-muted-foreground font-sans">Last 24 hours</span>
        </div>
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
              {recentDownloads.map((dl, i) => (
                <tr key={i} className="border-b border-border/50 last:border-0">
                  <td className="py-3 text-sm text-foreground font-sans">{dl.filename}</td>
                  <td className="py-3 text-sm text-muted-foreground font-sans">{dl.platform}</td>
                  <td className="py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full font-sans ${
                      dl.status === "Completed" ? "bg-green-100 text-green-700" :
                      dl.status === "Processing" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>{dl.status}</span>
                  </td>
                  <td className="py-3 text-sm text-muted-foreground font-sans">{dl.size}</td>
                  <td className="py-3 text-sm text-muted-foreground text-right font-sans">{dl.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
