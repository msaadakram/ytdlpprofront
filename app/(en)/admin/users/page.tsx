"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Search,
  Loader2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Trash2,
  KeyRound,
  Ban,
  CheckCircle2,
  X,
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  plan: string;
  plan_expires_at: string | null;
  email_verified: boolean | null;
  disabled: boolean;
  provider: string;
  created_at: string | null;
}

interface UserDetail extends AdminUser {
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

interface UserStats {
  downloads_total: number;
  requests_this_month: number;
  active_sessions: number;
  api_keys: number;
  recent_invoices: Array<{ number: string; amount: number; currency: string; status: string; created_at: string }>;
}

function authHeaders(extra: Record<string, string> = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...extra };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<(UserDetail & { stats?: UserStats }) | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const limit = 20;

  const load = useCallback(async (p: number, q: string, plan: string) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(p), limit: String(limit) });
      if (q.trim()) qs.set("search", q.trim());
      if (plan) qs.set("plan", plan);
      const res = await fetch(`/api/admin/proxy/users?${qs}`, { headers: authHeaders() });
      const json = await res.json();
      if (json.success) {
        setUsers(json.data.users);
        setTotal(json.data.total);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(1, "", ""); }, [load]);

  function doSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    load(1, search, planFilter);
  }

  async function openUser(id: string) {
    setDetailLoading(true);
    setSelected(null);
    try {
      const res = await fetch(`/api/admin/proxy/users/${id}`, { headers: authHeaders() });
      const json = await res.json();
      if (json.success) setSelected({ ...json.data.user, stats: json.data.stats });
    } finally {
      setDetailLoading(false);
    }
  }

  async function patchUser(patch: Record<string, unknown>, label: string) {
    if (!selected) return;
    setBusy(label);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/proxy/users/${selected.id}`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(patch),
      });
      const json = await res.json();
      if (json.success) {
        setSelected((s) => (s ? { ...s, ...json.data.user } : s));
        setUsers((us) => us.map((u) => (u.id === selected.id ? { ...u, ...json.data.user } : u)));
        setNotice({ type: "success", text: "User updated." });
      } else {
        setNotice({ type: "error", text: json.error?.message || "Update failed." });
      }
    } finally {
      setBusy(null);
    }
  }

  async function resetPassword() {
    if (!selected) return;
    setBusy("reset");
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/proxy/users/${selected.id}/reset-password`, {
        method: "POST",
        headers: authHeaders(),
      });
      const json = await res.json();
      setNotice(json.success
        ? { type: "success", text: json.data.message }
        : { type: "error", text: json.error?.message || "Failed." });
    } finally {
      setBusy(null);
    }
  }

  async function deleteUser() {
    if (!selected) return;
    if (!window.confirm(`Permanently delete ${selected.email}? Sessions, keys and download rows go too. Billing history is kept.`)) return;
    setBusy("delete");
    try {
      const res = await fetch(`/api/admin/proxy/users/${selected.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        setUsers((us) => us.filter((u) => u.id !== selected.id));
        setTotal((t) => t - 1);
        setSelected(null);
      } else {
        setNotice({ type: "error", text: json.error?.message || "Delete failed." });
      }
    } finally {
      setBusy(null);
    }
  }

  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="max-w-6xl space-y-5">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-[#5baab8]/15 text-[#5baab8] flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-base font-bold text-foreground font-heading">Users <span className="text-xs font-bold text-muted-foreground">({total})</span></h1>
          <p className="text-xs text-muted-foreground">Search, inspect, grant plans, verify, disable, delete.</p>
        </div>
        <button onClick={() => load(page, search, planFilter)} className="ml-auto w-9 h-9 rounded-xl flex items-center justify-center bg-muted/60 border border-border/60 text-muted-foreground hover:text-foreground" aria-label="Refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <form onSubmit={doSearch} className="flex flex-col sm:flex-row gap-2">
        <div className="flex items-center gap-2 flex-1 rounded-xl bg-card border border-border px-3.5 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search email or name…" className="flex-1 bg-transparent text-sm outline-none min-w-0" />
        </div>
        <select value={planFilter} onChange={(e) => { setPlanFilter(e.target.value); setPage(1); load(1, search, e.target.value); }} className="rounded-xl bg-card border border-border px-3.5 py-2.5 text-sm">
          <option value="">All plans</option>
          <option value="free">Free</option>
          <option value="starter">Starter</option>
          <option value="pro">Pro</option>
        </select>
        <button type="submit" className="rounded-xl bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] px-5 py-2.5 text-sm font-bold">Search</button>
      </form>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading users…
          </div>
        ) : users.length === 0 ? (
          <p className="p-8 text-sm text-muted-foreground text-center">No users found.</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {users.map((u) => (
              <li key={u.id}>
                <button onClick={() => openUser(u.id)} className={`w-full text-left px-4 py-3 hover:bg-muted/40 transition-colors flex items-center gap-3 ${selected?.id === u.id ? "bg-[#5baab8]/10" : ""}`}>
                  {!u.email_verified && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" title="Unverified" />}
                  {u.disabled && <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" title="Disabled" />}
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-foreground truncate">{u.email}</span>
                    <span className="block text-[11px] text-muted-foreground truncate">{u.name} · {u.provider}</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wide bg-muted px-2 py-0.5 rounded-full shrink-0">{u.plan}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/60">
          <span className="text-xs text-muted-foreground">Page {page} of {pages}</span>
          <div className="flex gap-1">
            <button disabled={page <= 1} onClick={() => { setPage(page - 1); load(page - 1, search, planFilter); }} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center disabled:opacity-40" aria-label="Previous page">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button disabled={page >= pages} onClick={() => { setPage(page + 1); load(page + 1, search, planFilter); }} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center disabled:opacity-40" aria-label="Next page">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail drawer */}
      {(selected || detailLoading) && (
        <div className="bg-card rounded-xl border border-border p-5 sm:p-6">
          {detailLoading || !selected ? (
            <div className="py-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading user…
            </div>
          ) : (
            <div>
              <div className="flex items-start gap-3 mb-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-bold text-foreground font-heading break-all">{selected.email}</h2>
                  <p className="text-xs text-muted-foreground">{selected.name} · {selected.provider} · joined {selected.created_at ? new Date(selected.created_at).toLocaleDateString() : "—"}</p>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground" aria-label="Close detail">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {notice && (
                <p className={`text-xs rounded-xl px-3.5 py-2.5 mb-4 border ${notice.type === "success" ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>
                  {notice.text}
                </p>
              )}

              {selected.stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {[
                    ["Downloads", selected.stats.downloads_total],
                    ["Req. month", selected.stats.requests_this_month],
                    ["Sessions", selected.stats.active_sessions],
                    ["API keys", selected.stats.api_keys],
                  ].map(([label, v]) => (
                    <div key={label as string} className="rounded-xl bg-muted/40 border border-border/60 px-3 py-2.5">
                      <p className="text-lg font-bold text-foreground">{v as number}</p>
                      <p className="text-[11px] text-muted-foreground">{label as string}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid sm:grid-cols-3 gap-2 mb-4">
                <label className="block text-xs font-semibold">
                  <span className="block text-muted-foreground mb-1">Plan</span>
                  <select
                    value={selected.plan}
                    onChange={(e) => patchUser({ plan: e.target.value }, "plan")}
                    disabled={busy !== null}
                    className="w-full rounded-xl bg-muted/40 border border-border px-3 py-2.5 text-sm disabled:opacity-60"
                  >
                    <option value="free">Free</option>
                    <option value="starter">Starter</option>
                    <option value="pro">Pro</option>
                  </select>
                </label>
                <button onClick={() => patchUser({ email_verified: !selected.email_verified }, "verify")} disabled={busy !== null} className="rounded-xl border border-border px-3 py-2.5 text-xs font-bold hover:bg-muted/50 disabled:opacity-60 inline-flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  {selected.email_verified ? "Verified — revoke" : "Mark verified"}
                </button>
                <button onClick={() => patchUser({ disabled: !selected.disabled }, "disable")} disabled={busy !== null} className={`rounded-xl border px-3 py-2.5 text-xs font-bold disabled:opacity-60 inline-flex items-center justify-center gap-1.5 ${selected.disabled ? "border-emerald-500/30 text-emerald-600" : "border-red-500/30 text-red-600 hover:bg-red-500/5"}`}>
                  <Ban className="w-3.5 h-3.5" />
                  {selected.disabled ? "Re-enable" : "Disable (ban)"}
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={resetPassword} disabled={busy !== null} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-border hover:bg-muted/50 disabled:opacity-60">
                  <KeyRound className="w-3.5 h-3.5" /> {busy === "reset" ? "Sending…" : "Email reset code"}
                </button>
                <button onClick={deleteUser} disabled={busy !== null} className="ml-auto inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 disabled:opacity-60">
                  <Trash2 className="w-3.5 h-3.5" /> {busy === "delete" ? "Deleting…" : "Delete user"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
