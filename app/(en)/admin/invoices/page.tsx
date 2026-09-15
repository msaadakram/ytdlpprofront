"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Receipt, RefreshCw } from "lucide-react";

interface Invoice {
  id: string;
  number?: string | null;
  amount?: number | null;
  usd_amount?: number | null;
  currency?: string | null;
  status?: string | null;
  txid?: string | null;
  period?: string | null;
  period_start?: string | null;
  period_end?: string | null;
  created_at?: string | null;
  createdAt?: string | null;
}

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  return { Authorization: `Bearer ${token}` };
}

function statusBadge(status: string): string {
  switch (status.toLowerCase()) {
    case "paid":
    case "confirmed":
    case "complete":
    case "completed":
      return "text-emerald-700 bg-emerald-500/10";
    case "pending":
    case "confirming":
      return "text-amber-700 bg-amber-500/15";
    case "expired":
    case "failed":
    case "underpaid":
      return "text-red-700 bg-red-500/10";
    default:
      return "text-muted-foreground bg-muted";
  }
}

function formatAmount(inv: Invoice): string {
  const amount = inv.amount ?? inv.usd_amount;
  if (amount == null) return "—";
  const cur = (inv.currency || "USD").toUpperCase();
  const n = Number(amount);
  if (!Number.isFinite(n)) return `${String(amount)} ${cur}`;
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${cur}`;
}

function formatPeriod(inv: Invoice): string {
  if (inv.period) return inv.period;
  if (inv.period_start || inv.period_end) {
    const s = inv.period_start ? new Date(inv.period_start).toLocaleDateString() : "—";
    const e = inv.period_end ? new Date(inv.period_end).toLocaleDateString() : "—";
    return `${s} → ${e}`;
  }
  return "—";
}

export default function AdminInvoicesPage() {
  const [rows, setRows] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/proxy/invoices?limit=100", { headers: authHeaders() });
      const json = await res.json().catch(() => null);
      if (res.ok && json?.success) {
        setRows(json.data?.invoices || []);
      } else {
        setNotice(json?.error?.message || `Failed to load invoices (HTTP ${res.status}).`);
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
    load();
  }, [load]);

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-[#5baab8]/15 text-[#5baab8] flex items-center justify-center shrink-0">
          <Receipt className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground font-heading">Invoices</h1>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">Billing history across all users</p>
        </div>
        <button
          onClick={load}
          className="ml-auto flex items-center gap-2 text-sm font-medium text-foreground bg-card border border-border rounded-xl px-3.5 py-2 hover:bg-muted transition-colors shrink-0"
          aria-label="Refresh invoices"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {notice && (
        <p className="text-xs rounded-xl px-3.5 py-2.5 border bg-destructive/10 text-destructive border-destructive/20 font-sans">
          {notice}
        </p>
      )}

      {loading ? (
        <div className="bg-card rounded-xl border border-border p-8 flex items-center justify-center gap-2 text-sm text-muted-foreground font-sans">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading invoices…
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center text-sm text-muted-foreground font-sans">
          No invoices yet.
        </div>
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="space-y-3 md:hidden">
            {rows.map((inv) => (
              <div key={inv.id} className="bg-card rounded-xl border border-border p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold text-foreground">{inv.number || inv.id.slice(0, 8)}</span>
                  <span className={`ml-auto text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${statusBadge(inv.status || "")}`}>
                    {inv.status || "—"}
                  </span>
                </div>
                <p className="text-sm font-bold text-foreground">{formatAmount(inv)}</p>
                {inv.txid && (
                  <p className="font-mono text-[11px] text-muted-foreground mt-1 truncate" title={inv.txid}>
                    {inv.txid.slice(0, 16)}…
                  </p>
                )}
                <p className="text-[11px] text-muted-foreground mt-1 font-sans">
                  {formatPeriod(inv)} · {(inv.created_at || inv.createdAt) ? new Date((inv.created_at || inv.createdAt) as string).toLocaleDateString() : "—"}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Number</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Txid</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Period</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((inv) => (
                    <tr key={inv.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-foreground">{inv.number || inv.id.slice(0, 8)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-foreground whitespace-nowrap">{formatAmount(inv)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${statusBadge(inv.status || "")}`}>
                          {inv.status || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground" title={inv.txid || undefined}>
                        {inv.txid ? `${inv.txid.slice(0, 12)}…` : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">{formatPeriod(inv)}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
                        {(inv.created_at || inv.createdAt) ? new Date((inv.created_at || inv.createdAt) as string).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
