"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, RefreshCw, Server, Trash2 } from "lucide-react";

function authHeaders(extra: Record<string, string> = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...extra };
}

function formatBytes(v: unknown): string {
  if (typeof v !== "number" || !Number.isFinite(v)) return "—";
  if (v < 1024) return `${v} B`;
  const units = ["B", "KB", "MB", "GB"];
  let n = v;
  let u = 0;
  while (n >= 1024 && u < units.length - 1) {
    n /= 1024;
    u += 1;
  }
  return `${n.toFixed(n >= 100 ? 0 : 1)} ${units[u]}`;
}

function formatUptime(v: unknown): string {
  if (typeof v === "string") return v;
  if (typeof v !== "number" || !Number.isFinite(v)) return "—";
  const s = Math.floor(v);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

function Flag({ on, onText = "On", offText = "Off" }: { on: boolean | null; onText?: string; offText?: string }) {
  if (on === null) return <span className="text-sm text-muted-foreground">—</span>;
  return on ? (
    <span className="text-xs font-medium text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full">{onText}</span>
  ) : (
    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{offText}</span>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm text-foreground text-right break-all min-w-0">{children}</span>
    </div>
  );
}

// Backend shape may evolve — every field is optional and render falls back to "—".
interface SystemData {
  binaries?: {
    ytdlp_version?: string | null;
    ytdlp_available?: boolean | null;
    ffmpeg?: boolean | string | null;
    ffmpeg_version?: string | null;
    ffmpeg_available?: boolean | null;
  };
  runtime?: {
    node?: string | null;
    uptime?: number | string | null;
    uptime_s?: number | null;
    uptimeSec?: number | null;
    rss?: number | null;
    heapUsed?: number | null;
    heapTotal?: number | null;
    memory?: { rss?: number | null; heapUsed?: number | null; heapTotal?: number | null } | null;
  };
  queue?: {
    waiting?: number | null;
    pending?: number | null;
    running?: number | null;
    active?: number | null;
    concurrency?: number | null;
  };
  jobs?: Record<string, number> | null;
  jobs_by_status?: Record<string, number> | null;
  jobsByStatus?: Record<string, number> | null;
  config?: {
    env?: string | null;
    node_env?: string | null;
    proxy?: boolean | string | null;
    proxy_enabled?: boolean | null;
    groq?: boolean | string | null;
    groq_configured?: boolean | null;
    stripe?: boolean | string | null;
    stripe_configured?: boolean | null;
    mail?: boolean | string | null;
    mail_configured?: boolean | null;
    btc_address?: string | null;
    btc_expiry_minutes?: number | null;
    btc_confirmations?: number | null;
    sleep?: number | string | null;
    sleep_ms?: number | null;
  };
  cookies?: { count?: number | null; platforms?: string[] | null } | null;
  mail?: { configured?: boolean | null; fromDomain?: string | null; testSender?: boolean | null } | null;
}

export default function AdminSystemPage() {
  const [data, setData] = useState<SystemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cleaning, setCleaning] = useState(false);
  const [cleanupMsg, setCleanupMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/proxy/system", { headers: authHeaders() });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success) {
        setData(json.data ?? null);
      } else {
        setError(json?.error?.message || `Failed to load system status (HTTP ${res.status}).`);
        setData(null);
      }
    } catch {
      setError("Network error — is the backend reachable?");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function runCleanup() {
    if (!window.confirm("Run cleanup now? Expired temp files and finished job records will be removed.")) return;
    setCleaning(true);
    setCleanupMsg(null);
    try {
      const res = await fetch("/api/admin/proxy/system/cleanup", {
        method: "POST",
        headers: authHeaders(),
      });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success) {
        const d = json.data ?? {};
        const parts: string[] = [];
        if (d.removed_files != null) parts.push(`${d.removed_files} files`);
        if (d.removed_jobs != null) parts.push(`${d.removed_jobs} jobs`);
        if (d.freed_bytes != null) parts.push(`${formatBytes(d.freed_bytes)} freed`);
        setCleanupMsg({
          type: "success",
          text: parts.length > 0 ? `Cleanup done — ${parts.join(" · ")}.` : json.data?.message || "Cleanup completed.",
        });
        load();
      } else {
        setCleanupMsg({ type: "error", text: json?.error?.message || "Cleanup failed." });
      }
    } catch {
      setCleanupMsg({ type: "error", text: "Network error — is the backend reachable?" });
    } finally {
      setCleaning(false);
    }
  }

  const binaries = data?.binaries ?? {};
  const runtime = data?.runtime ?? {};
  const queue = data?.queue ?? {};
  const jobsByStatus = data?.jobs_by_status ?? data?.jobsByStatus ?? data?.jobs ?? {};
  const config = data?.config ?? {};
  const cookies = data?.cookies ?? {};
  const mail = data?.mail ?? {};

  const ytdlpVersion = (binaries.ytdlp_version ?? null) as string | null;
  const ytdlpAvailable = binaries.ytdlp_available ?? (ytdlpVersion ? true : null);
  const ffmpegOk =
    binaries.ffmpeg_available ?? (typeof binaries.ffmpeg === "boolean" ? binaries.ffmpeg : binaries.ffmpeg ? true : null);
  const ffmpegVersion =
    binaries.ffmpeg_version ?? (typeof binaries.ffmpeg === "string" ? binaries.ffmpeg : null);

  const uptimeRaw = runtime.uptime ?? runtime.uptime_s ?? runtime.uptimeSec ?? null;
  const rss = runtime.rss ?? runtime.memory?.rss ?? null;
  const heapUsed = runtime.heapUsed ?? runtime.memory?.heapUsed ?? null;
  const heapTotal = runtime.heapTotal ?? runtime.memory?.heapTotal ?? null;

  const waiting = queue.waiting ?? queue.pending ?? null;
  const running = queue.running ?? queue.active ?? null;

  const toBool = (v: unknown): boolean | null =>
    typeof v === "boolean" ? v : typeof v === "string" ? v.length > 0 && v !== "false" && v !== "0" : v != null ? true : null;
  const proxyOn = config.proxy_enabled ?? (typeof config.proxy === "boolean" ? config.proxy : toBool(config.proxy));
  const groqOn = config.groq_configured ?? toBool(config.groq);
  const stripeOn = config.stripe_configured ?? toBool(config.stripe);
  const mailCfgOn = config.mail_configured ?? toBool(config.mail) ?? (mail.configured ?? null);
  const env = config.env ?? config.node_env ?? null;
  const sleep = config.sleep ?? config.sleep_ms ?? null;

  const cookiePlatforms = Array.isArray(cookies.platforms) ? cookies.platforms : [];

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-[#5baab8]/15 text-[#5baab8] flex items-center justify-center shrink-0">
          <Server className="w-5 h-5" />
        </span>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground font-heading">System</h1>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">
            Binaries, runtime, queue, config flags and mail health
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <button
            onClick={runCleanup}
            disabled={cleaning || loading}
            className="flex items-center gap-2 text-sm font-medium text-white bg-[#0d1f26] dark:bg-white dark:text-[#0d1f26] rounded-xl px-3.5 py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {cleaning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{cleaning ? "Cleaning…" : "Run cleanup now"}</span>
            <span className="sm:hidden">{cleaning ? "…" : "Cleanup"}</span>
          </button>
          <button
            onClick={load}
            className="flex items-center gap-2 text-sm font-medium text-foreground bg-card border border-border rounded-xl px-3.5 py-2 hover:bg-muted transition-colors"
            aria-label="Refresh system status"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {cleanupMsg && (
        <p
          className={`text-xs rounded-xl px-3.5 py-2.5 border font-sans ${
            cleanupMsg.type === "success"
              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
              : "bg-destructive/10 text-destructive border-destructive/20"
          }`}
        >
          {cleanupMsg.text}
        </p>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-36 rounded-xl bg-muted/60 animate-pulse" />
          ))}
        </div>
      ) : error || !data ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center text-sm text-muted-foreground font-sans">
          {error || "Failed to load system status. Check that the backend is reachable."}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4 items-start">
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="text-sm font-bold text-foreground font-heading mb-2">Binaries</h2>
            <div className="divide-y divide-border/60">
              <Row label="yt-dlp">
                {ytdlpVersion ? (
                  <span className="font-mono text-xs">{ytdlpVersion}</span>
                ) : ytdlpAvailable === false ? (
                  <span className="text-xs font-bold text-amber-700 bg-amber-500/15 px-2 py-0.5 rounded-full">
                    Missing — downloads will fail
                  </span>
                ) : (
                  <>—</>
                )}
              </Row>
              <Row label="ffmpeg">
                <span className="inline-flex items-center gap-2">
                  {ffmpegVersion && <span className="font-mono text-xs">{ffmpegVersion}</span>}
                  <Flag on={ffmpegOk} onText="OK" offText="Missing" />
                </span>
              </Row>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="text-sm font-bold text-foreground font-heading mb-2">Runtime</h2>
            <div className="divide-y divide-border/60">
              <Row label="Node">{runtime.node ? <span className="font-mono text-xs">{runtime.node}</span> : <>—</>}</Row>
              <Row label="Uptime">{formatUptime(uptimeRaw)}</Row>
              <Row label="RSS">{formatBytes(rss)}</Row>
              <Row label="Heap">
                {heapUsed != null || heapTotal != null
                  ? `${formatBytes(heapUsed)}${heapTotal != null ? ` / ${formatBytes(heapTotal)}` : ""}`
                  : "—"}
              </Row>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="text-sm font-bold text-foreground font-heading mb-2">Queue</h2>
            <div className="grid grid-cols-3 gap-2">
              {[
                ["Waiting", waiting],
                ["Running", running],
                ["Concurrency", queue.concurrency ?? null],
              ].map(([label, v]) => (
                <div key={label as string} className="rounded-xl bg-muted/40 border border-border/60 px-3 py-2.5 text-center">
                  <p className="text-lg font-bold text-foreground">{typeof v === "number" ? v : "—"}</p>
                  <p className="text-[11px] text-muted-foreground">{label as string}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="text-sm font-bold text-foreground font-heading mb-2">Jobs by status</h2>
            {Object.keys(jobsByStatus).length === 0 ? (
              <p className="text-sm text-muted-foreground">No job counts reported.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(jobsByStatus).map(([status, count]) => (
                  <span
                    key={status}
                    className="inline-flex items-center gap-1.5 text-xs bg-muted/60 border border-border/60 rounded-full px-2.5 py-1"
                  >
                    <span className="font-semibold text-foreground capitalize">{status}</span>
                    <span className="font-mono font-bold text-[#5baab8]">{count}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="text-sm font-bold text-foreground font-heading mb-2">Config flags</h2>
            <div className="divide-y divide-border/60">
              <Row label="Env">{env ? <span className="font-mono text-xs">{env}</span> : <>—</>}</Row>
              <Row label="Proxy">
                <Flag on={proxyOn} />
              </Row>
              <Row label="Groq">
                <Flag on={groqOn} onText="Configured" offText="Not set" />
              </Row>
              <Row label="Stripe">
                <Flag on={stripeOn} onText="Configured" offText="Not set" />
              </Row>
              <Row label="Mail">
                <Flag on={mailCfgOn} onText="Configured" offText="Not set" />
              </Row>
              <Row label="BTC address">
                {config.btc_address ? (
                  <span className="font-mono text-xs">{config.btc_address}</span>
                ) : (
                  <>—</>
                )}
              </Row>
              <Row label="BTC expiry">
                {config.btc_expiry_minutes != null ? `${config.btc_expiry_minutes} min` : "—"}
              </Row>
              <Row label="BTC confirmations">
                {config.btc_confirmations != null ? String(config.btc_confirmations) : "—"}
              </Row>
              <Row label="Sleep">{sleep != null && sleep !== "" ? <span className="font-mono text-xs">{String(sleep)}</span> : "—"}</Row>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="text-sm font-bold text-foreground font-heading mb-2">Cookies</h2>
            <p className="text-sm text-foreground mb-2">
              <span className="text-lg font-bold">{cookies.count ?? cookiePlatforms.length ?? "—"}</span>{" "}
              <span className="text-xs text-muted-foreground">platforms set</span>
            </p>
            {cookiePlatforms.length === 0 ? (
              <p className="text-xs text-muted-foreground">No platform cookies reported.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {cookiePlatforms.map((p) => (
                  <span key={p} className="text-[11px] font-semibold bg-muted/60 border border-border/60 rounded-full px-2.5 py-1 capitalize">
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-card rounded-xl border border-border p-5 sm:col-span-2">
            <h2 className="text-sm font-bold text-foreground font-heading mb-2">Mail status</h2>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="inline-flex items-center gap-2 text-sm">
                <span className="text-xs text-muted-foreground">Configured</span>
                <Flag on={mail.configured ?? null} onText="Yes" offText="No" />
              </span>
              <span className="text-sm">
                <span className="text-xs text-muted-foreground mr-2">From domain</span>
                <span className="font-mono text-xs">{mail.fromDomain || "—"}</span>
              </span>
              {mail.testSender ? (
                <span className="text-xs font-bold text-amber-700 bg-amber-500/15 px-2 py-0.5 rounded-full">
                  Using Resend test sender — verify a domain
                </span>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
