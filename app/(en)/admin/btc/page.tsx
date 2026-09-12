"use client";

import { useState, useEffect, useCallback } from "react";
import { Bitcoin, RefreshCw, Loader2, CheckCircle2, ExternalLink } from "lucide-react";

interface BtcRow {
  id: string;
  number: string;
  usd_amount: number;
  btc_amount: string;
  sats: number;
  address: string;
  status: string;
  txid: string | null;
  received_sats: number;
  confirmations: number;
  required_confirmations: number;
  expires_at: string;
  created_at: string;
  confirmed_at: string | null;
}

function authHeaders(extra: Record<string, string> = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...extra };
}

export default function AdminBtcPage() {
  const [rows, setRows] = useState<BtcRow[]>([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const load = useCallback(async (status: string) => {
    setLoading(true);
    try {
      const qs = status === "all" ? "" : `?status=${status}`;
      const res = await fetch(`/api/admin/proxy/btc/invoices${qs}`, { headers: authHeaders() });
      const json = await res.json();
      if (json.success) setRows(json.data.invoices || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(filter); }, [filter, load]);

  async function confirm(id: string) {
    if (!window.confirm("Manually approve this invoice and activate the plan? Only do this after verifying the payment on a block explorer.")) return;
    setBusy(id);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/proxy/btc/invoices/${id}/confirm`, {
        method: "POST",
        headers: authHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        setRows((rs) => rs.map((r) => (r.id === id ? json.data.invoice : r)));
        setNotice({ type: "success", text: `Invoice ${json.data.invoice.number} confirmed — plan activated.` });
      } else {
        setNotice({ type: "error", text: json.error?.message || "Confirm failed." });
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="max-w-5xl space-y-5">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-[#F7931A]/15 text-[#F7931A] flex items-center justify-center shrink-0">
          <Bitcoin className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-base font-bold text-foreground font-heading">BTC payments</h1>
          <p className="text-xs text-muted-foreground">Review pending/underpaid invoices, verify on-chain, approve manually.</p>
        </div>
        <button onClick={() => load(filter)} className="ml-auto w-9 h-9 rounded-xl flex items-center justify-center bg-muted/60 border border-border/60 text-muted-foreground hover:text-foreground" aria-label="Refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="inline-flex items-center gap-1 bg-muted/60 border border-border/60 rounded-full p-1">
        {(["pending", "underpaid", "confirmed", "all"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${filter === f ? "bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] shadow" : "text-muted-foreground hover:text-foreground"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {notice && (
        <p className={`text-xs rounded-xl px-3.5 py-2.5 border ${notice.type === "success" ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>
          {notice.text}
        </p>
      )}

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading invoices…
          </div>
        ) : rows.length === 0 ? (
          <p className="p-8 text-sm text-muted-foreground text-center">No invoices in this state.</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {rows.map((r) => (
              <li key={r.id} className="px-4 py-3.5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-mono text-xs font-bold text-foreground">{r.number}</span>
                  <span className="font-bold text-sm text-foreground">₿ {r.btc_amount}</span>
                  <span className="text-xs text-muted-foreground">${r.usd_amount}</span>
                  <span className="text-xs text-muted-foreground">{r.received_sats > 0 ? `received ${r.received_sats.toLocaleString()} sats` : "nothing received"} · {r.confirmations}/{r.required_confirmations} conf</span>
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-wide bg-amber-500/15 text-amber-700 px-2 py-0.5 rounded-full">{r.status}</span>
                </div>
                {r.txid && (
                  <a
                    href={`https://mempool.space/tx/${r.txid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-mono text-[#5baab8] hover:underline break-all"
                  >
                    {r.txid.slice(0, 24)}… <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                )}
                {(r.status === "pending" || r.status === "confirming" || r.status === "underpaid") && (
                  <div className="mt-2">
                    <button
                      onClick={() => confirm(r.id)}
                      disabled={busy === r.id}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {busy === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      Approve manually
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
