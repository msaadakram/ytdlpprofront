"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Shield } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/proxy/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json = await res.json();
    setLoading(false);

    if (json.success) {
      localStorage.setItem("admin_token", json.data.token);
      localStorage.setItem("admin_user", JSON.stringify(json.data.admin));
      router.push("/admin");
    } else {
      setError(json.error?.message || "Login failed");
    }
  };

  const inputClass =
    "w-full bg-input-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-[#5baab8]/50 focus:border-[#5baab8]/50 transition-all";

  return (
    <div className="min-h-screen bg-[#0d1f26] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative brand glows */}
      <div aria-hidden className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-[#5baab8]/15 blur-3xl pointer-events-none" />
      <div aria-hidden className="absolute -bottom-40 -right-32 w-[460px] h-[460px] rounded-full bg-[#5baab8]/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm relative">
        <div className="flex flex-col items-center text-center mb-8">
          <span className="w-14 h-14 rounded-2xl bg-[#5baab8] text-[#06272d] flex items-center justify-center shadow-lg shadow-[#5baab8]/25 mb-4">
            <Shield className="w-7 h-7" />
          </span>
          <h1 className="text-2xl font-bold text-white font-heading">Admin Login</h1>
          <p className="text-white/50 text-sm mt-1">DownForge Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-7 space-y-4 shadow-2xl">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 p-3 rounded-xl" role="alert">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="admin@downforge.me"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#5baab8] text-white font-semibold py-2.5 rounded-xl hover:bg-[#4a99a7] transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-white/30 text-xs mt-6">
          Restricted area · Authorized personnel only
        </p>
      </div>
    </div>
  );
}
