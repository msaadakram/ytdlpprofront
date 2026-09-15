"use client";

import { useCallback, useEffect, useState } from "react";
import { ListVideo, Loader2, RefreshCw, Trash2 } from "lucide-react";

type JobStatus = "all" | "queued" | "downloading" | "processing" | "completed" | "failed" | "expired";

const filters: JobStatus[] = ["all", "queued", "downloading", "processing", "completed", "failed", "expired"];

interface Job {
  id: string;
  type?: string | null;
  kind?: string | null;
  platform?: string | null;
  status?: string | null;
  progress?: number | null;
  error?: string | null;
  error_message?: string | null;
  created_at?: string | null;
  createdAt?: string | null;
}

function authHeaders(extra: Record<string, string> = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...extra };
}

function statusBadge(status: string): string {
  switch (status) {
    case "completed":
      return "text-emerald-700 bg-emerald-500/10";
    case "failed":
    case "expired":
      return "text-red-700 bg-red-500/10";
    case "downloading":
    case "processing":
      return "text-[#5baab8] bg-[#5baab8]/10";
    case "queued":
      return "text-amber-700 bg-amber-500/15";
    default:
      return "text-muted-foreground bg-muted";
  }
}

function formatProgress(p: unknown): string {
  if (typeof p !== "number" || !Number.isFinite(p)) return "—";
  const pct = p <= 1 && p > 0 ? Math.round(p * 100) : Math.round(p);
  return `${pct}%`;
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filter, setFilter] = useState<JobStatus>("all");
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async (status: JobStatus) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ limit: "100" });
      if (status !== "all") qs.set("status", status);
      const res = await fetch(`/api/admin/proxy/jobs?${qs}`, { headers: authHeaders() });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success) {
        setJobs(json.data?.jobs || []);
      } else {
        setNotice({ type: "error", text: json?.error?.message || `Failed to load jobs (HTTP ${res.status}).` });
        setJobs([]);
      }
    } catch {
      setNotice({ type: "error", text: "Network error — is the backend reachable?" });
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filter);
  }, [filter, load]);

  async function clearFinished() {
    if (!window.confirm("Delete all finished jobs (completed / failed / expired)? Active jobs are kept.")) return;
    setClearing(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/proxy/jobs?which=finished", {
        method: "DELETE",
        headers: authHeaders(),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success) {
        const n = json.data?.deleted ?? json.data?.removed ?? json.data?.count;
        setNotice({
          type: "success",
          text: n != null ? `Cleared ${n} finished job${n === 1 ? "" : "s"}.` : json.data?.message || "Finished jobs cleared.",
        });
        load(filter);
      } else {
        setNotice({ type: "error", text: json?.error?.message || "Clear failed." });
      }
    } catch {
      setNotice({ type: "error", text: "Network error — is the backend reachable?" });
    } finally {
      setClearing(false);
    }
  }

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-[#5baab8]/15 text-[#5baab8] flex items-center justify-center shrink-0">
          <ListVideo className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground font-heading">Jobs</h1>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">Download queue — filter by status, clear finished work</p>
        </div>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <button
            onClick={clearFinished}
            disabled={clearing || loading}
            className="flex items-center gap-2 text-sm font-medium text-destructive border border-destructive/20 bg-card rounded-xl px-3.5 py-2 hover:bg-destructive/10 transition-colors disabled:opacity-50"
          >
            {clearing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{clearing ? "Clearing…" : "Clear finished"}</span>
            <span className="sm:hidden">Clear</span>
          </button>
          <button
            onClick={() => load(filter)}
            className="flex items-center gap-2 text-sm font-medium text-foreground bg-card border border-border rounded-xl px-3.5 py-2 hover:bg-muted transition-colors shrink-0"
            aria-label="Refresh jobs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      <div className="inline-flex items-center gap-1 bg-muted/60 border border-border/60 rounded-full p-1 max-w-full overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all whitespace-nowrap ${
              filter === f
                ? "bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {notice && (
        <p
          className={`text-xs rounded-xl px-3.5 py-2.5 border font-sans ${
            notice.type === "success"
              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
              : "bg-destructive/10 text-destructive border-destructive/20"
          }`}
        >
          {notice.text}
        </p>
      )}

      {loading ? (
        <div className="bg-card rounded-xl border border-border p-8 flex items-center justify-center gap-2 text-sm text-muted-foreground font-sans">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading jobs…
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center text-sm text-muted-foreground font-sans">
          No jobs in this state.
        </div>
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="space-y-3 md:hidden">
            {jobs.map((j) => {
              const status = (j.status || "—").toLowerCase();
              const err = j.error || j.error_message || "";
              return (
                <div key={j.id} className="bg-card rounded-xl border border-border p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold text-foreground">{j.id.slice(0, 8)}</span>
                    <span className={`ml-auto text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${statusBadge(status)}`}>
                      {j.status || "—"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-sans">
                    {[j.type || j.kind, j.platform].filter(Boolean).join(" · ") || "—"} · {formatProgress(j.progress)}
                  </p>
                  {err && <p className="text-xs text-destructive mt-1.5 truncate">{err}</p>}
                  <p className="text-[11px] text-muted-foreground/70 mt-1 font-sans">
                    {(j.created_at || j.createdAt) ? new Date((j.created_at || j.createdAt) as string).toLocaleString() : "—"}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">ID</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Platform</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Progress</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Error</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((j) => {
                    const status = (j.status || "—").toLowerCase();
                    const err = j.error || j.error_message || "";
                    return (
                      <tr key={j.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-foreground" title={j.id}>
                          {j.id.slice(0, 8)}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">{j.type || j.kind || "—"}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground capitalize">{j.platform || "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusBadge(status)}`}>
                            {j.status || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground text-right font-mono">{formatProgress(j.progress)}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground max-w-[220px] truncate" title={err || undefined}>
                          {err || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                          {(j.created_at || j.createdAt) ? new Date((j.created_at || j.createdAt) as string).toLocaleString() : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
