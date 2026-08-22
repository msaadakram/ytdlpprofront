"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, Mail, ShieldCheck } from "lucide-react";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const admin = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("admin_user") || "{}")
    : {};

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match" });
      return;
    }
    if (newPassword.length < 6) {
      setStatus({ type: "error", message: "New password must be at least 6 characters" });
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("admin_token");
    const res = await fetch("/api/admin/proxy/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const json = await res.json();
    setLoading(false);

    if (json.success) {
      setStatus({ type: "success", message: "Password changed successfully" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setStatus({ type: "error", message: json.error?.message || "Failed to change password" });
    }
  };

  const inputClass =
    "w-full bg-input-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-[#5baab8]/50 focus:border-[#5baab8]/50 transition-all";

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-card rounded-xl border border-border p-5 sm:p-6">
        <h2 className="text-sm font-bold text-foreground font-heading mb-4">Admin Profile</h2>
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-muted/30 border border-border/60">
          <span className="w-10 h-10 rounded-full bg-[#5baab8]/15 text-[#5baab8] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{admin.name || "Administrator"}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 truncate">
              <Mail className="w-3 h-3 shrink-0" />
              {admin.email || "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 sm:p-6">
        <h2 className="text-sm font-bold text-foreground font-heading mb-4">Change Password</h2>

        {status && (
          <div
            className={`flex items-center gap-2 p-3 rounded-xl text-sm mb-4 border ${
              status.type === "success"
                ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                : "bg-destructive/10 text-destructive border-destructive/20"
            }`}
          >
            {status.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {status.message}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label htmlFor="current-password" className="block text-sm font-medium text-foreground mb-1.5">
              Current Password
            </label>
            <input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={inputClass}
              required
              autoComplete="current-password"
            />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-foreground mb-1.5">
              New Password
            </label>
            <input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground mb-1.5">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#5baab8] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4a99a7] transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
