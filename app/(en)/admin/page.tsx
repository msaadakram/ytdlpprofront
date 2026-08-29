"use client";

import { useEffect, useState } from "react";
import { Cookie, Activity, Users, Shield } from "lucide-react";

interface CookieSummary {
  platform: string;
  notes: string | null;
  updated_at: string;
}

export default function AdminDashboardPage() {
  const [cookies, setCookies] = useState<CookieSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    fetch("/api/admin/proxy/cookies", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setCookies(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const setCount = cookies.length;
  const totalPlatforms = 14;
  const unsetCount = totalPlatforms - setCount;
  const coverage = Math.round((setCount / totalPlatforms) * 100);

  const stats = [
    { label: "Cookies Set", value: setCount, icon: Cookie, color: "text-emerald-600", bg: "bg-emerald-500/10" },
    { label: "Missing Cookies", value: unsetCount, icon: Shield, color: "text-amber-600", bg: "bg-amber-500/10" },
    { label: "Total Platforms", value: totalPlatforms, icon: Activity, color: "text-sky-600", bg: "bg-sky-500/10" },
    { label: "Admin Users", value: 1, icon: Users, color: "text-violet-600", bg: "bg-violet-500/10" },
  ];

  return (
    <div className="space-y-6">
      {/* Coverage banner */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-3">
          <div>
            <p className="text-sm font-bold text-foreground font-heading">Cookie coverage</p>
            <p className="text-xs text-muted-foreground font-sans">
              {setCount} of {totalPlatforms} platforms have extraction cookies configured
            </p>
          </div>
          <p className="text-2xl font-extrabold text-foreground font-heading">{coverage}%</p>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden" role="progressbar" aria-valuenow={coverage} aria-valuemin={0} aria-valuemax={100} aria-label="Cookie coverage">
          <div
            className="h-full rounded-full bg-[#5baab8] transition-all duration-500"
            style={{ width: `${coverage}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card rounded-xl border border-border p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-bold text-foreground truncate">{s.value}</div>
                  <div className="text-xs text-muted-foreground truncate">{s.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card rounded-xl border border-border p-5 sm:p-6">
        <h2 className="text-sm font-bold text-foreground font-heading mb-4">Cookie Status</h2>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 rounded-lg bg-muted/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {cookies.length === 0 && (
              <p className="text-muted-foreground text-sm py-4 text-center">No cookies configured yet.</p>
            )}
            {cookies.map((c) => (
              <div
                key={c.platform}
                className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 xs:gap-2 py-2.5 px-3 rounded-lg bg-muted/30 border border-border/50"
              >
                <span className="text-sm font-medium text-foreground capitalize truncate">{c.platform}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {new Date(c.updated_at + "Z").toLocaleDateString()}
                  </span>
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                    Set
                  </span>
                </div>
              </div>
            ))}
            {unsetCount > 0 && (
              <p className="text-xs text-muted-foreground pt-1">
                {unsetCount} platform{unsetCount > 1 ? "s" : ""} without cookies
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
