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

  const stats = [
    { label: "Cookies Set", value: setCount, icon: Cookie, color: "text-green-600", bg: "bg-green-100" },
    { label: "Missing Cookies", value: unsetCount, icon: Shield, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Total Platforms", value: totalPlatforms, icon: Activity, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Admin Users", value: 1, icon: Users, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Cookie Status</h2>
        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : (
          <div className="space-y-2">
            {cookies.length === 0 && (
              <p className="text-gray-500 text-sm">No cookies configured yet.</p>
            )}
            {cookies.map((c) => (
              <div key={c.platform} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm font-medium text-gray-700 capitalize">{c.platform}</span>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Set</span>
              </div>
            ))}
            {unsetCount > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                {unsetCount} platform{unsetCount > 1 ? "s" : ""} without cookies
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
