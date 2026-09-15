"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, RefreshCw, ScrollText, Search } from "lucide-react";

interface AuditEntry {
  id?: string | number;
  action: string;
  target?: string | null;
  admin_email?: string | null;
  adminEmail?: string | null;
  created_at?: string | null;
  createdAt?: string | null;
  detail?: unknown;
  meta?: unknown;
  data?: unknown;
}

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  return { Authorization: `Bearer ${token}` };
}

function formatDetail(v: unknown): string {
  if (v == null) return "—";
  if (typeof v === "string") return v || "—";
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

export default function AdminAuditPage() {
  const [rows, setRows] = useState<AuditEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);
  const limit = 20;

  const load = useCallback(async (p: number, q: string) => {
    setLoading(true);
    setNotice(null);
    try {
      const qs = new URLSearchParams({ page: String(p), limit: String(limit) });
      if (q.trim()) qs.set("search", q.trim());
      const res = await fetch(`/api/admin/proxy/audit?${qs}`, { headers: authHeaders() });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success) {
        setRows(json.data?.logs || json.data?.entries || json.data?.audit || json.data?.events || []);
        setTotal(json.data?.total || 0);
      } else {
        setNotice(json?.error?.message || `Failed to load audit log (HTTP ${res.status}).`);
        setRows([]);
      }
    } catch {
      setNotice("Network error — is the backend reachable?");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(1, "");
  }, [load]);

  function doSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    load(1, search);
  }

  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-[#5baab8]/15 text-[#5baab8] flex items-center justify-center shrink-0">
          <ScrollText className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground font-heading">Audit Log</h1>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">Every admin action, newest first</p>
        </div>
        <button
          onClick={() => load(page, search)}
          className="ml-auto flex items-center gap-2 text-sm font-medium text-foreground bg-card border border-border rounded-xl px-3.5 py-2 hover:bg-muted transition-colors shrink-0"
          aria-label="Refresh audit log"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      <form onSubmit={doSearch} className="flex gap-2">
        <div className="flex items-center gap-2 flex-1 rounded-xl bg-card border border-border px-3.5 py-2.5">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, target or admin email…"
            className="flex-1 bg-transparent text-sm outline-none min-w-0"
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] px-5 py-2.5 text-sm font-bold"
        >
          Search
        </button>
      </form>

      {notice && (
        <p className="text-xs rounded-xl px-3.5 py-2.5 border bg-destructive/10 text-destructive border-destructive/20 font-sans">
          {notice}
        </p>
      )}

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 flex items-center justify-center gap-2 text-sm text-muted-foreground font-sans">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading audit log…
          </div>
        ) : rows.length === 0 ? (
          <p className="p-8 text-sm text-muted-foreground text-center font-sans">No audit entries found.</p>
        ) : (
          <>
            {/* Mobile: card list */}
            <ul className="divide-y divide-border/60 md:hidden">
              {rows.map((a, i) => {
                const detail = formatDetail(a.detail ?? a.meta ?? a.data);
                return (
                  <li key={a.id != null ? String(a.id) : i} className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#5baab8] break-all">{a.action}</span>
                      <span className="ml-auto text-[11px] text-muted-foreground shrink-0">
                        {a.created_at || a.createdAt ? new Date((a.created_at || a.createdAt) as string).toLocaleString() : "—"}
                      </span>
                    </div>
                    {(a.target || a.admin_email || a.adminEmail) && (
                      <p className="text-xs text-muted-foreground mt-1 truncate font-sans">
                        {[a.target, a.admin_email || a.adminEmail].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    {detail !== "—" && <p className="text-xs text-muted-foreground/70 mt-1 truncate font-sans">{detail}</p>}
                  </li>
                );
              })}
            </ul>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Action</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Target</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Admin</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Created</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((a, i) => {
                    const detail = formatDetail(a.detail ?? a.meta ?? a.data);
                    return (
                      <tr key={a.id != null ? String(a.id) : i} className="border-b border-border/60 last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-bold text-[#5baab8] whitespace-nowrap">{a.action}</td>
                        <td className="px-4 py-3 text-sm text-foreground max-w-[200px] truncate" title={a.target || undefined}>
                          {a.target || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate">{a.admin_email || a.adminEmail || "—"}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                          {a.created_at || a.createdAt ? new Date((a.created_at || a.createdAt) as string).toLocaleString() : "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground max-w-[260px] truncate" title={detail !== "—" ? detail : undefined}>
                          {detail}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/60">
          <span className="text-xs text-muted-foreground font-sans">Page {page} of {pages}</span>
          <div className="flex gap-1">
            <button
              disabled={page <= 1 || loading}
              onClick={() => { setPage(page - 1); load(page - 1, search); }}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center disabled:opacity-40"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= pages || loading}
              onClick={() => { setPage(page + 1); load(page + 1, search); }}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center disabled:opacity-40"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
