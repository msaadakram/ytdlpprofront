"use client";

import { useState, useEffect, useRef } from "react";
import {
  AlertTriangle,
  Bitcoin,
  Check,
  Copy,
  Download,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Timer,
} from "lucide-react";
import {
  getPlan,
  listInvoices,
  setPlan,
  getBtcRate,
  getQuota,
  createBtcInvoice,
  getPendingBtcInvoice,
  getBtcInvoice,
  cancelBtcInvoice,
} from "@/lib/api-client";
import type { BillingPlan, Invoice, BtcRate, BtcInvoice, Quota } from "@/lib/api-client";

const PLAN_PRICES: Record<"starter" | "pro", number> = { starter: 3, pro: 9 };

const POLL_MS = 12_000;
const ACTIVE_STATUSES = ["pending", "confirming", "underpaid"];

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function formatCountdown(expiresAt: string, now: number): string {
  const ms = new Date(expiresAt).getTime() - now;
  if (ms <= 0) return "00:00";
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      return false;
    }
  }
}

export function BillingTab() {
  const [plan, setPlanState] = useState<BillingPlan | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [rate, setRate] = useState<BtcRate | null>(null);
  const [quota, setQuota] = useState<Quota | null>(null);
  const [btcInvoice, setBtcInvoice] = useState<BtcInvoice | null>(null);
  const [btcPlan, setBtcPlan] = useState<"starter" | "pro">("pro");
  const [btcPeriod, setBtcPeriod] = useState<"month" | "year">("month");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<"invoice" | "cancel" | "downgrade" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [copied, setCopied] = useState<"address" | "amount" | null>(null);
  const [qrFailed, setQrFailed] = useState(false);
  const prevStatus = useRef<string | null>(null);

  // Initial load: plan + quota + history + live BTC rate + resume any open invoice.
  useEffect(() => {
    let cancelled = false;
    Promise.all([getPlan(), listInvoices(), getBtcRate(), getQuota(), getPendingBtcInvoice()]).then(
      ([planRes, invRes, rateRes, quotaRes, pendingRes]) => {
        if (cancelled) return;
        if (planRes.success && planRes.data) setPlanState(planRes.data);
        if (invRes.success && invRes.data) setInvoices(invRes.data.invoices);
        if (rateRes.success && rateRes.data) setRate(rateRes.data);
        if (quotaRes.success && quotaRes.data) setQuota(quotaRes.data);
        if (pendingRes.success && pendingRes.data?.invoice) {
          setBtcInvoice(pendingRes.data.invoice);
          prevStatus.current = pendingRes.data.invoice.status;
        }
      },
    ).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // 1s ticker while an invoice counts down.
  useEffect(() => {
    if (!btcInvoice || !ACTIVE_STATUSES.includes(btcInvoice.status)) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [btcInvoice?.id, btcInvoice?.status]);

  // Poll chain status while the invoice is open. On confirmation, refresh plan + history.
  useEffect(() => {
    if (!btcInvoice || !ACTIVE_STATUSES.includes(btcInvoice.status) && btcInvoice.status !== "expired") return;
    if (btcInvoice.status === "confirmed" || btcInvoice.status === "cancelled") return;
    const id = setInterval(async () => {
      const res = await getBtcInvoice(btcInvoice.id);
      if (!res.success || !res.data) return;
      const fresh = res.data.invoice;
      setBtcInvoice(fresh);
      if (fresh.status === "confirmed" && prevStatus.current !== "confirmed") {
        const [planRes, invRes, quotaRes] = await Promise.all([getPlan(), listInvoices(), getQuota()]);
        if (planRes.success && planRes.data) setPlanState(planRes.data);
        if (invRes.success && invRes.data) setInvoices(invRes.data.invoices);
        if (quotaRes.success && quotaRes.data) setQuota(quotaRes.data);
      }
      prevStatus.current = fresh.status;
    }, POLL_MS);
    return () => clearInterval(id);
  }, [btcInvoice?.id, btcInvoice?.status]);

  async function refreshAll() {
    const [planRes, invRes, quotaRes] = await Promise.all([getPlan(), listInvoices(), getQuota()]);
    if (planRes.success && planRes.data) setPlanState(planRes.data);
    if (invRes.success && invRes.data) setInvoices(invRes.data.invoices);
    if (quotaRes.success && quotaRes.data) setQuota(quotaRes.data);
  }

  async function handleCreateInvoice() {
    setError(null);
    setBusy("invoice");
    const res = await createBtcInvoice(btcPeriod, btcPlan);
    setBusy(null);
    if (!res.success || !res.data) {
      setError(res.error?.message || "Failed to create BTC invoice.");
      return;
    }
    setQrFailed(false);
    setBtcInvoice(res.data.invoice);
    prevStatus.current = res.data.invoice.status;
    setNow(Date.now());
  }

  async function handleCancel() {
    if (!btcInvoice) return;
    setError(null);
    setBusy("cancel");
    const res = await cancelBtcInvoice(btcInvoice.id);
    setBusy(null);
    if (!res.success || !res.data) {
      setError(res.error?.message || "Failed to cancel invoice.");
      return;
    }
    setBtcInvoice(res.data.invoice);
    prevStatus.current = res.data.invoice.status;
  }

  async function handleDowngrade() {
    setError(null);
    setBusy("downgrade");
    const res = await setPlan("free");
    setBusy(null);
    if (!res.success || !res.data) {
      setError(res.error?.message || "Failed to downgrade.");
      return;
    }
    setPlanState(res.data);
  }

  async function handleCopy(text: string, which: "address" | "amount") {
    const ok = await copyText(text);
    if (ok) {
      setCopied(which);
      setTimeout(() => setCopied((c) => (c === which ? null : c)), 2000);
    }
  }

  if (loading) {
    return (
      <div className="space-y-5 sm:space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/70 p-4 sm:p-6 skeleton-shimmer shadow-[0_1px_2px_rgba(13,31,38,0.04)]"><div className="h-24" /></div>
        ))}
      </div>
    );
  }

  const isPro = plan?.plan === "pro";
  const monthlyUsd = PLAN_PRICES[btcPlan];
  const periodUsd = btcPeriod === "year" ? monthlyUsd * 10 : monthlyUsd;
  const approxBtc = rate && rate.usd_per_btc > 0
    ? (periodUsd / rate.usd_per_btc).toFixed(8).replace(/\.?0+$/, "")
    : null;
  const inv = btcInvoice;
  const invActive = inv && (ACTIVE_STATUSES.includes(inv.status) || inv.status === "expired");
  const bitcoinUri = inv ? `bitcoin:${inv.address}?amount=${inv.btc_amount}` : "";
  const qrUrl = inv && !qrFailed
    ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=10&data=${encodeURIComponent(bitcoinUri)}`
    : null;

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#F7931A] to-[#c56f0a] text-white flex items-center justify-center shadow-[0_10px_24px_-10px_rgba(247,147,26,0.8)] shrink-0">
          <Bitcoin className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-foreground font-heading tracking-tight">Billing</h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans">Manage your plan and pay with Bitcoin.</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-300 bg-red-500/[0.07] border border-red-500/20 rounded-xl px-3.5 py-2.5 font-sans">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </div>
      )}

      {/* Current plan */}
      <div className="relative overflow-hidden bg-card rounded-2xl border border-border/70 shadow-[0_1px_2px_rgba(13,31,38,0.04)]">
        <div aria-hidden className={`h-1.5 w-full ${isPro ? "bg-gradient-to-r from-[#F7931A] via-[#f7b955] to-[#c56f0a]" : "bg-gradient-to-r from-muted via-border to-muted"}`} />
        <div className="p-4 sm:p-6">
          <h3 className="text-sm font-bold text-foreground mb-4 font-heading">Current Plan</h3>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h4 className="text-2xl font-extrabold text-foreground font-heading tracking-tight">{plan?.name || "Free"}</h4>
                {isPro && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-500/10 dark:text-green-400 px-2.5 py-1 rounded-full font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground font-sans">
                {plan?.price ? `$${plan.price}/${plan.interval}` : "Free"}
                {isPro && plan?.renews_at && ` · Valid until ${formatDate(plan.renews_at)}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {isPro && (
                <button
                  onClick={handleDowngrade}
                  disabled={busy !== null}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground hover:underline font-sans disabled:opacity-60"
                >
                  {busy === "downgrade" ? "Downgrading…" : "Downgrade to Free"}
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {(plan?.features || []).map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-sm text-foreground font-sans bg-muted/50 rounded-xl px-3 py-2.5">
                <span className="w-5 h-5 rounded-full bg-[#5baab8]/15 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-[#5baab8]" />
                </span>
                <span className="truncate">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly usage vs plan quota */}
      {quota && (
        <div className="bg-card rounded-2xl border border-border/70 p-4 sm:p-6 shadow-[0_1px_2px_rgba(13,31,38,0.04)]">
          <div className="flex items-center justify-between gap-3 mb-2">
            <h3 className="text-sm font-bold text-foreground font-heading">Monthly usage</h3>
            <span className="text-xs text-muted-foreground font-sans">
              {quota.used_this_month.toLocaleString()} / {quota.monthly_quota.toLocaleString()} requests
            </span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#5baab8] to-[#F7931A] transition-all"
              style={{ width: `${Math.min(100, (quota.used_this_month / Math.max(1, quota.monthly_quota)) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground font-sans">
            {quota.remaining.toLocaleString()} left · resets {formatDate(quota.resets_at)} · {quota.per_minute}/min burst on {quota.name}
          </p>
        </div>
      )}

      {/* Bitcoin payment */}
      <div className="bg-card rounded-2xl border border-border/70 p-4 sm:p-6 shadow-[0_1px_2px_rgba(13,31,38,0.04)]">
        <div className="flex items-center gap-2.5 mb-1">
          <Bitcoin className="w-4 h-4 text-[#F7931A]" />
          <h3 className="text-sm font-bold text-foreground font-heading">
            {isPro ? "Extend with Bitcoin" : "Upgrade with Bitcoin"}
          </h3>
        </div>
        <p className="text-xs text-muted-foreground font-sans mb-4">
          Pay once, no card, no subscription. Pro activates automatically after 1 network confirmation (~10–30 min) and renews manually.
        </p>

        {!invActive && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1 bg-muted/60 border border-border/60 rounded-full p-1">
                {(["starter", "pro"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setBtcPlan(p)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${btcPlan === p ? "bg-[#F7931A] text-white shadow" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {p} · ${PLAN_PRICES[p]}
                  </button>
                ))}
              </div>
              <div className="inline-flex items-center gap-1 bg-muted/60 border border-border/60 rounded-full p-1">
                {(["month", "year"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setBtcPeriod(p)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${btcPeriod === p ? "bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] shadow" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    {p === "month" ? `Monthly · $${monthlyUsd}` : `Annual · $${monthlyUsd * 10}`}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                onClick={handleCreateInvoice}
                disabled={busy !== null}
                className="flex items-center justify-center gap-2 bg-gradient-to-br from-[#F7931A] to-[#c56f0a] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:shadow-[0_10px_24px_-10px_rgba(247,147,26,0.9)] active:scale-[0.98] transition-all font-sans disabled:opacity-60"
              >
                {busy === "invoice" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bitcoin className="w-4 h-4" />}
                {inv?.status === "confirmed" ? "Buy / Extend Again" : `Pay $${periodUsd} with Bitcoin`}
              </button>
              {approxBtc && (
                <p className="text-xs text-muted-foreground font-sans">
                  ≈ <span className="font-bold text-foreground">₿ {approxBtc}</span> at ${rate!.usd_per_btc.toLocaleString()}/BTC{rate!.cached ? " (cached)" : ""}
                </p>
              )}
            </div>
            {inv?.status === "confirmed" && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-sans flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Last payment confirmed{inv.confirmed_at ? ` on ${formatDate(inv.confirmed_at)}` : ""}. Pro is active.
              </p>
            )}
          </div>
        )}

        {invActive && (
          <div className="space-y-4">
            {/* Amount + countdown */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 rounded-2xl bg-[#F7931A]/[0.07] border border-[#F7931A]/25 p-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans">Send exactly</p>
                <div className="flex items-center gap-2">
                  <p className="text-xl sm:text-2xl font-black text-foreground font-heading">₿ {inv.btc_amount}</p>
                  <button
                    onClick={() => handleCopy(inv.btc_amount, "amount")}
                    className="p-1.5 rounded-lg hover:bg-background transition-colors text-muted-foreground hover:text-[#F7931A]"
                    aria-label="Copy amount"
                  >
                    {copied === "amount" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground font-sans mt-0.5">
                  {Number(inv.sats).toLocaleString()} sats · ${inv.usd_amount} · {inv.period === "year" ? "12 months" : "30 days"} {inv.plan === "starter" ? "Starter" : "Pro"}
                </p>
              </div>
              <div className="sm:ml-auto flex items-center gap-2 text-sm font-bold font-sans">
                <Timer className={`w-4 h-4 ${inv.status === "expired" ? "text-red-500" : "text-[#F7931A]"}`} />
                <span className={inv.status === "expired" ? "text-red-500" : "text-foreground"}>
                  {inv.status === "expired" ? "Expired" : formatCountdown(inv.expires_at, now)}
                </span>
              </div>
            </div>

            {/* QR + address */}
            <div className="flex flex-col sm:flex-row gap-4">
              {qrUrl && (
                <div className="mx-auto sm:mx-0 bg-white rounded-2xl border border-border/60 p-3 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrUrl} alt="Bitcoin payment QR code" width={180} height={180} className="w-[180px] h-[180px]" onError={() => setQrFailed(true)} />
                </div>
              )}
              <div className="flex-1 min-w-0 space-y-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground font-sans mb-1">To this address</p>
                  <div className="flex items-center gap-2 rounded-xl bg-muted/60 border border-border/60 px-3 py-2.5">
                    <p className="flex-1 min-w-0 text-xs sm:text-sm font-mono text-foreground break-all">{inv.address}</p>
                    <button
                      onClick={() => handleCopy(inv.address, "address")}
                      className="p-1.5 rounded-lg hover:bg-background transition-colors text-muted-foreground hover:text-[#F7931A] shrink-0"
                      aria-label="Copy address"
                    >
                      {copied === "address" ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-sans">
                  <span className={`inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-full ${
                    inv.status === "confirmed" ? "text-green-700 bg-green-500/10 dark:text-green-400"
                    : inv.status === "confirming" ? "text-sky-700 bg-sky-500/10 dark:text-sky-400"
                    : inv.status === "underpaid" ? "text-amber-700 bg-amber-500/10 dark:text-amber-400"
                    : inv.status === "expired" ? "text-red-600 bg-red-500/10 dark:text-red-400"
                    : "text-[#b26a00] bg-[#F7931A]/10 dark:text-[#f7b955]"
                  }`}>
                    {["pending", "confirming"].includes(inv.status) && <Loader2 className="w-3 h-3 animate-spin" />}
                    {inv.status === "pending" && "Waiting for payment…"}
                    {inv.status === "confirming" && `Detected · ${inv.confirmations}/${inv.required_confirmations} confirmations…`}
                    {inv.status === "underpaid" && `Underpaid · received ${Number(inv.received_sats).toLocaleString()} of ${Number(inv.sats).toLocaleString()} sats`}
                    {inv.status === "expired" && "Window expired"}
                  </span>
                  <span className="text-muted-foreground">Invoice {inv.number}</span>
                </div>
                {inv.status === "underpaid" && (
                  <p className="text-xs text-amber-700 dark:text-amber-300 font-sans">
                    The amount received was short. Contact support with invoice {inv.number}
                    {inv.txid ? ` (tx ${inv.txid.slice(0, 12)}…)` : ""} — we will credit or refund it manually.
                  </p>
                )}
                {inv.status === "expired" && (
                  <p className="text-xs text-muted-foreground font-sans">
                    Already sent? Create a new invoice — an on-time payment is still detected and credited automatically.
                  </p>
                )}
                <div className="flex items-center gap-2">
                  {inv.status === "pending" && (
                    <button
                      onClick={handleCancel}
                      disabled={busy !== null}
                      className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline font-sans disabled:opacity-60"
                    >
                      {busy === "cancel" ? "Cancelling…" : "Cancel invoice"}
                    </button>
                  )}
                  {(inv.status === "expired" || inv.status === "cancelled") && (
                    <button
                      onClick={handleCreateInvoice}
                      disabled={busy !== null}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F7931A] hover:underline font-sans disabled:opacity-60"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Create new invoice
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* How to pay */}
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground font-sans mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#5baab8]" /> How to pay
              </p>
              <ol className="space-y-1.5 text-xs text-muted-foreground font-sans list-decimal list-inside">
                <li>Open your Bitcoin wallet app and scan the QR, or copy the address and amount.</li>
                <li>Send <strong className="text-foreground">exactly ₿ {inv.btc_amount}</strong> on the <strong className="text-foreground">Bitcoin network</strong> (not Lightning, not another coin).</li>
                <li>Wait for {inv.required_confirmations} confirmation (~10–30 min) — this status updates automatically.</li>
                <li>{inv.plan === "starter" ? "Starter" : "Pro"} activates immediately on confirmation{inv.period === "year" ? " for 12 months" : " for 30 days"}.</li>
              </ol>
              <p className="mt-2.5 text-[11px] text-muted-foreground/80 font-sans">
                Each invoice has a unique exact amount — always create a fresh invoice per payment. Payments are final; there is no auto-renewal, renew manually before expiry.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Payment method */}
      <div className="bg-card rounded-2xl border border-border/70 p-4 sm:p-6 shadow-[0_1px_2px_rgba(13,31,38,0.04)]">
        <h3 className="text-sm font-bold text-foreground mb-4 font-heading">Payment Method</h3>
        <div className="flex items-center gap-4 p-4 bg-muted/60 rounded-xl">
          <Bitcoin className="w-8 h-8 text-[#F7931A] shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground font-sans">Bitcoin (BTC)</p>
            <p className="text-xs text-muted-foreground font-mono truncate">
              {(plan?.btc?.address || rate?.address || "bc1qfqmkdqa80fzhcadgt7ep58vwrphwahmjcm6t7a")}
            </p>
          </div>
        </div>
      </div>

      {/* Invoice history */}
      <div className="bg-card rounded-2xl border border-border/70 p-4 sm:p-6 shadow-[0_1px_2px_rgba(13,31,38,0.04)]">
        <h3 className="text-sm font-bold text-foreground mb-4 font-heading">Invoice History</h3>
        {invoices.length === 0 ? (
          <p className="text-sm text-muted-foreground font-sans py-6 text-center">No invoices yet.</p>
        ) : (
          <div className="space-y-2">
            {invoices.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 sm:p-4 bg-muted/50 rounded-xl border border-border/50 transition-colors hover:border-[#F7931A]/30">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground font-sans truncate">{item.number}</p>
                  <p className="text-xs text-muted-foreground font-sans">
                    {formatDate(item.created_at)}
                    {item.currency === "BTC" ? " · Bitcoin" : ""}
                    {item.txid ? ` · ${item.txid.slice(0, 10)}…` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <span className="text-sm font-bold text-foreground font-heading">
                    {item.currency === "BTC" && item.btc_amount ? `₿ ${item.btc_amount}` : `$${item.amount.toFixed(2)}`}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full font-sans capitalize ${item.status === "Paid" ? "text-green-700 bg-green-500/10 dark:text-green-400" : "text-amber-700 bg-amber-500/10 dark:text-amber-400"}`}>{item.status}</span>
                  {item.pdf_url && (
                    <a href={item.pdf_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-background transition-colors text-muted-foreground hover:text-[#F7931A]">
                      <Download className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
