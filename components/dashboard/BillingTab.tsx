"use client";

import { useState, useEffect } from "react";
import { Check, CreditCard, Download, ExternalLink, Loader2 } from "lucide-react";
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
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4 sm:p-6 animate-pulse"><div className="h-24" /></div>
        ))}
      </div>
    );
  }

  const isPro = plan?.plan === "pro";

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 font-sans">
          {error}
        </div>
      )}

      <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
        <h3 className="text-sm font-bold text-foreground mb-4 font-heading">Current Plan</h3>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h4 className="text-xl font-extrabold text-foreground font-heading">{plan?.name || "Free"}</h4>
              {isPro && (
                <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-400 px-2.5 py-0.5 rounded-full font-sans">Active</span>
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
                className="flex items-center gap-2 bg-[#0d1f26] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1a3545] transition-colors font-sans disabled:opacity-60"
              >
                {busy === "checkout" ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {(plan?.features || []).map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm text-foreground font-sans">
              <Check className="w-4 h-4 text-[#5baab8]" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {isPro && (
        <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
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

      <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
        <h3 className="text-sm font-bold text-foreground mb-4 font-heading">Invoice History</h3>
        {invoices.length === 0 ? (
          <p className="text-sm text-muted-foreground font-sans py-6 text-center">No invoices yet.</p>
        ) : (
          <div className="space-y-2">
            {invoices.map((inv) => (
                   <div key={inv.id} className="flex items-center justify-between p-3 sm:p-4 bg-muted/60 rounded-xl">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground font-sans truncate">{inv.number}</p>
                  <p className="text-xs text-muted-foreground font-sans">{formatDate(inv.created_at)}</p>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <span className="text-sm font-medium text-foreground font-sans">
                    ${inv.amount.toFixed(2)}
                  </span>
                  <span className="text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-400 px-2 py-0.5 rounded-full font-sans capitalize">{inv.status}</span>
                  {inv.pdf_url && (
                    <a href={inv.pdf_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-background transition-colors text-muted-foreground">
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
