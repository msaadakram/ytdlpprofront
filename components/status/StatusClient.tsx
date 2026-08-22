"use client";

import { useEffect, useState } from "react";
import { Activity, Clock, Zap } from "lucide-react";

export function StatusClient() {
  const [status, setStatus] = useState<"loading" | "operational" | "degraded">("loading");
  const [latency, setLatency] = useState<number | null>(null);
  const [lastChecked, setLastChecked] = useState<string>("");

  useEffect(() => {
    let cancelled = false;
    async function check() {
      const start = Date.now();
      try {
        const res = await fetch("/api/proxy/health", { cache: "no-store" });
        const dt = Date.now() - start;
        if (!cancelled) {
          setLatency(dt);
          setStatus(res.ok ? "operational" : "degraded");
          setLastChecked(new Date().toLocaleTimeString());
        }
      } catch {
        if (!cancelled) {
          setLatency(null);
          setStatus("degraded");
          setLastChecked(new Date().toLocaleTimeString());
        }
      }
    }
    check();
    const id = setInterval(check, 30000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs font-sans">
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold border ${status === "operational" ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300" : status === "degraded" ? "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300" : "bg-muted border-border text-muted-foreground"}`}>
        <span className={`w-2 h-2 rounded-full ${status === "operational" ? "bg-emerald-500 animate-pulse" : status === "degraded" ? "bg-amber-500" : "bg-muted-foreground"} `} />
        {status === "loading" ? "Checking…" : status === "operational" ? "Operational" : "Degraded"} {status !== "loading" && <span className="ml-1 hidden sm:inline">• Live</span>}
      </span>
      {latency !== null && (
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Zap className="w-3 h-3" /> {latency}ms
        </span>
      )}
      {lastChecked && (
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3 h-3" /> {lastChecked}
        </span>
      )}
      <span className="hidden sm:inline-flex items-center gap-1 text-muted-foreground">
        <Activity className="w-3 h-3" /> 30s poll
      </span>
    </div>
  );
}
