"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Activity, AlertTriangle, CheckCircle2, Clock, Cpu, Globe, Layers,
  RefreshCw, Server, ShieldCheck, Timer, WifiOff, Zap,
} from "lucide-react";
import {
  getSystemStatus, getCapabilities,
  type SystemStatus, type Capabilities, type StatusEndpoint,
} from "@/lib/api-client";
import { platformConfigs } from "@/lib/platform-config";

const POLL_SECONDS = 30;

type OverallState = "loading" | "operational" | "degraded" | "outage";

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function StateDot({ state, className = "w-2 h-2" }: { state: OverallState | StatusEndpoint["state"]; className?: string }) {
  const color =
    state === "operational" ? "bg-emerald-500" :
    state === "degraded" ? "bg-amber-500" :
    state === "outage" ? "bg-red-500" : "bg-muted-foreground";
  return <span className={`${className} rounded-full ${color} ${state === "operational" ? "animate-pulse" : ""}`} />;
}

function StatePill({ state, label }: { state: OverallState | StatusEndpoint["state"]; label: string }) {
  const tone =
    state === "operational" ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300" :
    state === "degraded" ? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300" :
    state === "outage" ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300" :
    "bg-muted border-border text-muted-foreground";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${tone}`}>
      <StateDot state={state} />
      {label}
    </span>
  );
}

function StatTile({ icon: Icon, label, value, hint }: {
  icon: typeof Zap; label: string; value: string; hint?: string;
}) {
  return (
    <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-border/60 dark:border-white/10 p-4 sm:p-5 shadow-sm">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className="w-8 h-8 rounded-lg bg-[#5baab8]/15 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-[#5baab8]" />
        </span>
        <span className="text-[11px] font-bold tracking-wide uppercase font-mono">{label}</span>
      </div>
      <div className="mt-3 text-xl sm:text-2xl font-extrabold text-foreground font-heading truncate" title={value}>{value}</div>
      {hint && <div className="mt-0.5 text-xs text-muted-foreground font-sans truncate" title={hint}>{hint}</div>}
    </div>
  );
}

function EndpointCard({ ep, t }: { ep: StatusEndpoint; t: ReturnType<typeof useTranslations> }) {
  const label =
    ep.state === "operational" ? t("operational") :
    ep.state === "degraded" ? t("degraded") : t("noTrafficShort");

  return (
    <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-border/60 dark:border-white/10 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold tracking-wide uppercase bg-[#eef6f8] dark:bg-[#5baab8]/10 border border-[#5baab8]/20 text-[#0d1f26] dark:text-[#8fd3df] px-2 py-1 rounded-full font-mono">{ep.method}</span>
        <StatePill state={ep.state} label={label} />
      </div>
      <div className="mt-3 font-mono text-sm font-bold text-foreground break-all">{ep.path}</div>
      <div className="text-xs text-muted-foreground font-sans">{ep.desc}</div>

      <div className="mt-4 grid grid-cols-2 gap-3 pt-4 border-t border-border/50">
        <div>
          <div className="text-[11px] font-bold tracking-wide uppercase text-muted-foreground font-mono flex items-center gap-1">
            <Zap className="w-3 h-3" /> {t("avgLatency")}
          </div>
          <div className="text-sm font-bold text-foreground">
            {ep.avgLatencyMs !== null ? `${ep.avgLatencyMs}ms` : "—"}
          </div>
        </div>
        <div>
          <div className="text-[11px] font-bold tracking-wide uppercase text-muted-foreground font-mono flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> {t("successRate")}
          </div>
          <div className={`text-sm font-bold ${ep.successRate !== null && ep.successRate < 90 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
            {ep.successRate !== null ? `${ep.successRate}%` : "—"}
          </div>
        </div>
      </div>

      <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${ep.state === "degraded" ? "bg-amber-500" : "bg-emerald-500"}`}
          style={{ width: ep.state === "unknown" ? "100%" : `${Math.max(ep.successRate ?? 100, 2)}%`, opacity: ep.state === "unknown" ? 0.15 : 1 }}
        />
      </div>

      <div className="mt-2.5 text-[11px] text-muted-foreground font-mono">
        {ep.calls > 0
          ? `${ep.calls} ${t("calls")} · p95 ${ep.p95LatencyMs ?? "—"}ms · ${ep.windowMinutes ?? 15}min`
          : t("noTraffic")}
      </div>
    </div>
  );
}

export function StatusClient() {
  const t = useTranslations("ApiStatus");

  const [statusData, setStatusData] = useState<SystemStatus | null>(null);
  const [capabilities, setCapabilities] = useState<Capabilities | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [lastChecked, setLastChecked] = useState<string>("");
  const [unreachable, setUnreachable] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(POLL_SECONDS);
  const inFlight = useRef(false);

  const fetchData = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;
    setRefreshing(true);
    const start = performance.now();
    try {
      const [statusRes, capsRes] = await Promise.all([getSystemStatus(), getCapabilities()]);
      const dt = Math.round(performance.now() - start);
      if (statusRes.success && statusRes.data) {
        setStatusData(statusRes.data);
        setLatency(dt);
        setUnreachable(false);
      } else {
        setUnreachable(true);
      }
      if (capsRes.success && capsRes.data) setCapabilities(capsRes.data);
      setLastChecked(new Date().toLocaleTimeString());
    } catch {
      setUnreachable(true);
      setLastChecked(new Date().toLocaleTimeString());
    } finally {
      inFlight.current = false;
      setRefreshing(false);
      setSecondsLeft(POLL_SECONDS);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const poll = setInterval(() => {
      if (document.visibilityState === "visible") fetchData();
      else setSecondsLeft(POLL_SECONDS);
    }, POLL_SECONDS * 1000);
    const ticker = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => {
      clearInterval(poll);
      clearInterval(ticker);
    };
  }, [fetchData]);

  const overall: OverallState = unreachable && !statusData
    ? "outage"
    : !statusData
      ? "loading"
      : statusData.status === "degraded"
        ? "degraded"
        : "operational";

  const overallLabel =
    overall === "outage" ? t("outage")
    : overall === "degraded" ? t("degraded")
    : overall === "loading" ? t("checking")
    : t("allSystemsOperational");

  const platformIds = capabilities?.supportedPlatforms ?? statusData?.platforms.map((p) => p.id) ?? [];

  return (
    <div className="space-y-6">
      {/* Live health banner */}
      <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-border/60 dark:border-white/10 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-foreground font-heading flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#5baab8]" /> {t("liveHealth")}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2.5" aria-live="polite">
              <StatePill state={overall} label={overallLabel} />
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Zap className="w-3.5 h-3.5" />
                {latency !== null ? `${latency}ms ${t("latency").toLowerCase()}` : t("checking")}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" /> {t("lastChecked")}: {lastChecked || "…"}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Timer className="w-3.5 h-3.5" /> {t("nextCheck", { seconds: secondsLeft })}
              </span>
            </div>
            {statusData?.reasons?.length ? (
              <ul className="mt-2 space-y-1">
                {statusData.reasons.map((r) => (
                  <li key={r} className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {r}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => fetchData()}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0d1f26] text-white px-4 py-2 text-xs font-bold hover:opacity-90 disabled:opacity-60 transition-opacity shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? t("refreshing") : t("refresh")}
          </button>
        </div>

        {overall === "outage" && (
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-3.5">
            <WifiOff className="w-5 h-5 text-red-500 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-bold text-red-700 dark:text-red-300">{t("backendUnreachable")}</p>
              <p className="text-xs text-red-600/80 dark:text-red-400/80">{t("backendUnreachableDesc")}</p>
            </div>
          </div>
        )}
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatTile
          icon={Zap}
          label={t("latency")}
          value={latency !== null ? `${latency}ms` : "—"}
          hint={t("live")}
        />
        <StatTile
          icon={Clock}
          label={t("uptime")}
          value={statusData ? formatUptime(statusData.uptime) : "—"}
          hint={statusData ? t("since", { date: new Date(statusData.startedAt).toLocaleDateString() }) : undefined}
        />
        <StatTile
          icon={Server}
          label={t("server")}
          value={statusData ? `v${statusData.version}` : "—"}
          hint={statusData ? `Node ${statusData.process.node.replace("v", "")} · ${statusData.process.rssMb}MB RSS` : undefined}
        />
        <StatTile
          icon={Layers}
          label={t("queue")}
          value={statusData ? `${statusData.queue.running}/${statusData.queue.concurrency}` : "—"}
          hint={statusData ? t("queueWaiting", { waiting: statusData.queue.waiting }) : undefined}
        />
      </div>

      {/* Endpoints */}
      <div>
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <h3 className="text-sm font-bold text-foreground font-heading flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#5baab8]" /> {t("endpoints")}
          </h3>
          {statusData?.endpoints?.length ? (
            <p className="text-xs text-muted-foreground font-sans">{t("endpointsDesc", { minutes: statusData.endpoints[0]?.windowMinutes ?? 15 })}</p>
          ) : null}
        </div>
        <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {statusData?.endpoints?.length ? (
            statusData.endpoints.map((ep) => <EndpointCard key={`${ep.method} ${ep.path}`} ep={ep} t={t} />)
          ) : (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white dark:bg-white/[0.04] border border-border/60 dark:border-white/10 p-5 h-52 animate-pulse">
                <div className="h-5 w-16 rounded-full bg-muted" />
                <div className="mt-4 h-4 w-3/4 rounded bg-muted" />
                <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
                <div className="mt-8 h-1.5 rounded-full bg-muted" />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Platforms */}
      <div>
        <div className="flex items-baseline justify-between gap-3 flex-wrap">
          <h3 className="text-sm font-bold text-foreground font-heading flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#5baab8]" /> {t("platforms")}
          </h3>
          <p className="text-xs text-muted-foreground font-sans">{t("platformsDesc")}</p>
        </div>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-3">
          {platformIds.length === 0 &&
            Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-[74px] rounded-2xl bg-white dark:bg-white/[0.04] border border-border/60 dark:border-white/10 animate-pulse" />
            ))}
          {platformIds.map((id) => {
            const cfg = platformConfigs[id];
            const Logo = cfg?.Logo;
            return (
              <div
                key={id}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white dark:bg-white/[0.04] border border-border/60 dark:border-white/10 p-3.5 shadow-sm"
                title={cfg?.name ?? id}
              >
                {Logo ? (
                  <Logo className="w-7 h-7" />
                ) : (
                  <Globe className="w-7 h-7 text-muted-foreground" />
                )}
                <span className="text-[11px] font-bold text-foreground font-sans truncate max-w-full">{cfg?.name ?? id}</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  <StateDot state="operational" className="w-1.5 h-1.5" /> {t("operational")}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Jobs summary */}
      {statusData && (
        <div className="rounded-2xl bg-white dark:bg-white/[0.04] border border-border/60 dark:border-white/10 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground font-heading shrink-0">
            <Cpu className="w-4 h-4 text-[#5baab8]" /> {t("jobs")}
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-muted px-3 py-1.5 text-foreground">{t("jobsActive", { count: statusData.jobs.active })}</span>
            <span className="rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 text-emerald-700 dark:text-emerald-300">{t("jobsCompleted", { count: statusData.jobs.completed })}</span>
            <span className="rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-1.5 text-amber-700 dark:text-amber-300">{t("jobsFailed", { count: statusData.jobs.failed })}</span>
            <span className="rounded-full bg-muted px-3 py-1.5 text-muted-foreground">{t("jobsQueued", { count: statusData.jobs.queued })}</span>
          </div>
          <div className="sm:ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {t("monitoringNote")}
          </div>
        </div>
      )}
    </div>
  );
}
