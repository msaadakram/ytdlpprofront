"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Check, CreditCard, Download, ExternalLink, Loader2 } from "lucide-react";
import { getPlan, listInvoices, createCheckout, createPortal } from "@/lib/api-client";
import type { BillingPlan, Invoice } from "@/lib/api-client";

export function BillingTab() {
  const [plan, setPlan] = useState<BillingPlan | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<"checkout" | "portal" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getPlan(), listInvoices()]).then(([planRes, invRes]) => {
      if (cancelled) return;
      if (planRes.success && planRes.data) setPlan(planRes.data);
      if (invRes.success && invRes.data) setInvoices(invRes.data.invoices);
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function handleCheckout() {
    setError(null);
    setBusy("checkout");
    const res = await createCheckout();
    setBusy(null);
    if (!res.success || !res.data) {
      setError(res.error?.message || "Failed to start checkout.");
      return;
    }
    if (res.data.url) {
      window.location.href = res.data.url;
    } else {
      // Fallback mode — plan was toggled directly. Refresh state.
      const fresh = await getPlan();
      if (fresh.success && fresh.data) setPlan(fresh.data);
    }
  }

  async function handlePortal() {
    setError(null);
    setBusy("portal");
    const res = await createPortal();
    setBusy(null);
    if (!res.success || !res.data) {
      setError(res.error?.message || "Failed to open billing portal.");
      return;
    }
    if (res.data.url) {
      window.location.href = res.data.url;
    }
  }

  function formatDate(iso: string | null): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#5baab8] to-[#3d8896] text-white flex items-center justify-center shadow-[0_10px_24px_-10px_rgba(91,170,184,0.8)] shrink-0">
          <CreditCard className="w-5 h-5" />
        </span>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-foreground font-heading tracking-tight">Billing</h2>
          <p className="text-xs sm:text-sm text-muted-foreground font-sans">Manage your plan, payment method and invoices.</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-300 bg-red-500/[0.07] border border-red-500/20 rounded-xl px-3.5 py-2.5 font-sans">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </div>
      )}

      <div className="relative overflow-hidden bg-card rounded-2xl border border-border/70 shadow-[0_1px_2px_rgba(13,31,38,0.04)]">
        {/* Gradient banner strip */}
        <div aria-hidden className={`h-1.5 w-full ${isPro ? "bg-gradient-to-r from-[#5baab8] via-[#8fd3df] to-[#3d8896]" : "bg-gradient-to-r from-muted via-border to-muted"}`} />
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
              {isPro && plan?.renews_at && ` · Renews on ${formatDate(plan.renews_at)}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isPro ? (
              <button
                onClick={handlePortal}
                disabled={busy !== null}
                className="flex items-center gap-2 text-sm font-medium text-[#5baab8] hover:underline font-sans disabled:opacity-60"
              >
                {busy === "portal" ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                Manage Billing
              </button>
            ) : (
              <button
                onClick={handleCheckout}
                disabled={busy !== null}
                className="flex items-center gap-2 bg-gradient-to-br from-[#5baab8] to-[#3d8896] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:shadow-[0_10px_24px_-10px_rgba(91,170,184,0.9)] active:scale-[0.98] transition-all font-sans disabled:opacity-60"
              >
                {busy === "checkout" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Upgrade to Pro
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

      {isPro && (
        <div className="bg-card rounded-2xl border border-border/70 p-4 sm:p-6 shadow-[0_1px_2px_rgba(13,31,38,0.04)]">
          <h3 className="text-sm font-bold text-foreground mb-4 font-heading">Payment Method</h3>
          <div className="flex items-center gap-4 p-4 bg-muted/60 rounded-xl">
            <CreditCard className="w-8 h-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground font-sans">
                {plan?.stripe_enabled ? "Managed via Stripe" : "Demo mode — no card on file"}
              </p>
              <p className="text-xs text-muted-foreground font-sans">
                {plan?.stripe_enabled ? "Update your card in the Stripe portal" : "Set STRIPE_SECRET_KEY to enable real payments"}
              </p>
            </div>
            {plan?.stripe_enabled && (
              <button onClick={handlePortal} className="ml-auto text-sm font-medium text-[#5baab8] hover:underline font-sans">
                Update
              </button>
            )}
          </div>
        </div>
      )}

      <div className="bg-card rounded-2xl border border-border/70 p-4 sm:p-6 shadow-[0_1px_2px_rgba(13,31,38,0.04)]">
        <h3 className="text-sm font-bold text-foreground mb-4 font-heading">Invoice History</h3>
        {invoices.length === 0 ? (
          <p className="text-sm text-muted-foreground font-sans py-6 text-center">No invoices yet.</p>
        ) : (
          <div className="space-y-2">
            {invoices.map((inv) => (
                   <div key={inv.id} className="flex items-center justify-between p-3 sm:p-4 bg-muted/50 rounded-xl border border-border/50 transition-colors hover:border-[#5baab8]/30">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground font-sans truncate">{inv.number}</p>
                  <p className="text-xs text-muted-foreground font-sans">{formatDate(inv.created_at)}</p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <span className="text-sm font-bold text-foreground font-heading">
                    ${inv.amount.toFixed(2)}
                  </span>
                  <span className="text-xs font-semibold text-green-700 bg-green-500/10 dark:text-green-400 px-2 py-0.5 rounded-full font-sans capitalize">{inv.status}</span>
                  {inv.pdf_url && (
                    <a href={inv.pdf_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-background transition-colors text-muted-foreground hover:text-[#5baab8]">
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
