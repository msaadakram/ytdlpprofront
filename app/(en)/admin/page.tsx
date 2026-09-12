"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Download,
  Bitcoin,
  Inbox,
  Activity,
  MailWarning,
  ArrowRight,
  Loader2,
} from "lucide-react";

interface Overview {
  users: { total: number; by_plan: Record<string, number>; new_7d: number; unverified: number; disabled: number };
  downloads: { total: number; last_24h: number };
  usage_today: number;
  revenue_btc: { usd_total: number; invoices_paid: number; pending_invoices: number };
  inbox_unread: number;
  newsletter_total: number;
  cookies_set: number;
  cookie_platforms: number;
  mail: { configured: boolean; fromDomain: string | null; testSender: boolean };
  recent_users: Array<{ id: string; email: string; name: string; plan: string; created_at: string | null }>;
  pending_btc: Array<{ id: string; number: string; usd_amount: number; btc_amount: string; status: string; created_at: string }>;
  recent_activity: Array<{ action: string; target: string | null; admin_email: string | null; created_at: string }>;
}

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  return { Authorization: `Bearer ${token}` };
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/proxy/overview", { headers: authHeaders() })
      .then((r) => r.json())
      .then((res) => { if (res.success) setData(res.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-muted/60 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-card rounded-xl border border-border p-8 text-center text-sm text-muted-foreground">
        Failed to load overview. Check that the backend is reachable.
      </div>
    );
  }

  const stats = [
    { label: "Users", value: data.users.total, sub: `+${data.users.new_7d} this week`, icon: Users, color: "text-sky-600", bg: "bg-sky-500/10", href: "/admin/users" },
    { label: "BTC revenue", value: `$${data.revenue_btc.usd_total.toLocaleString()}`, sub: `${data.revenue_btc.invoices_paid} paid`, icon: Bitcoin, color: "text-amber-600", bg: "bg-amber-500/10", href: "/admin/btc" },
    { label: "Downloads 24h", value: data.downloads.last_24h, sub: `${data.downloads.total.toLocaleString()} total`, icon: Download, color: "text-emerald-600", bg: "bg-emerald-500/10", href: null },
    { label: "Requests today", value: data.usage_today.toLocaleString(), sub: "metered API calls", icon: Activity, color: "text-violet-600", bg: "bg-violet-500/10", href: null },
    { label: "Pending BTC", value: data.revenue_btc.pending_invoices, sub: "need attention", icon: Bitcoin, color: "text-orange-600", bg: "bg-orange-500/10", href: "/admin/btc" },
    { label: "Unread inbox", value: data.inbox_unread, sub: `${data.newsletter_total} subscribers`, icon: Inbox, color: "text-rose-600", bg: "bg-rose-500/10", href: "/admin/inbox" },
    { label: "Pro / Starter", value: `${data.users.by_plan.pro || 0} / ${data.users.by_plan.starter || 0}`, sub: `${data.users.by_plan.free || 0} free`, icon: Users, color: "text-teal-600", bg: "bg-teal-500/10", href: "/admin/users" },
    { label: "Unverified", value: data.users.unverified, sub: `${data.users.disabled} disabled`, icon: MailWarning, color: "text-slate-600", bg: "bg-slate-500/10", href: "/admin/users" },
  ];

  const mailBad = !data.mail.configured || data.mail.testSender;

  return (
    <div className="space-y-6">
      {mailBad && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-300/60 bg-amber-50 dark:bg-amber-950/20 px-4 py-3.5 text-sm">
          <MailWarning className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="font-bold text-amber-900 dark:text-amber-100">Signup emails are down</p>
            <p className="text-amber-800 dark:text-amber-200/80">
              {!data.mail.configured
                ? "RESEND_API_KEY is missing — no verification email can be sent."
                : "EMAIL_FROM uses the Resend test sender — only your own address receives mail."}{" "}
              Fix it in Railway variables, then re-check <Link href="/admin/settings" className="underline underline-offset-2">Settings → Test Email</Link>.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const card = (
            <div className="bg-card rounded-xl border border-border p-4 sm:p-5 h-full hover:border-[#5baab8]/40 transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-xl sm:text-2xl font-bold text-foreground truncate">{s.value}</div>
                  <div className="text-xs text-muted-foreground truncate">{s.label} · {s.sub}</div>
                </div>
              </div>
            </div>
          );
          return s.href ? <Link key={s.label} href={s.href}>{card}</Link> : <div key={s.label}>{card}</div>;
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-start">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-foreground font-heading">Newest users</h2>
            <Link href="/admin/users" className="inline-flex items-center gap-1 text-xs font-semibold text-[#5baab8] hover:underline">
              All users <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ul className="space-y-2">
            {data.recent_users.map((u) => (
              <li key={u.id} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-muted/30 border border-border/50 text-sm">
                <span className="min-w-0 flex-1 truncate font-medium text-foreground">{u.email}</span>
                <span className="text-[10px] font-bold uppercase tracking-wide bg-muted px-2 py-0.5 rounded-full shrink-0">{u.plan}</span>
              </li>
            ))}
            {data.recent_users.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No users yet.</p>}
          </ul>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-foreground font-heading">Pending BTC invoices</h2>
            <Link href="/admin/btc" className="inline-flex items-center gap-1 text-xs font-semibold text-[#5baab8] hover:underline">
              Review <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ul className="space-y-2">
            {data.pending_btc.map((inv) => (
              <li key={inv.id} className="flex items-center gap-3 py-2 px-3 rounded-lg bg-muted/30 border border-border/50 text-sm">
                <span className="font-mono text-xs text-foreground shrink-0">{inv.number}</span>
                <span className="font-bold text-foreground">₿ {inv.btc_amount}</span>
                <span className="ml-auto text-[10px] font-bold uppercase tracking-wide bg-amber-500/15 text-amber-700 px-2 py-0.5 rounded-full shrink-0">{inv.status}</span>
              </li>
            ))}
            {data.pending_btc.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Nothing awaiting payment.</p>}
          </ul>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-5">
        <h2 className="text-sm font-bold text-foreground font-heading mb-4">Recent admin activity</h2>
        {data.recent_activity.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No admin actions recorded yet.</p>
        ) : (
          <ul className="space-y-1.5">
            {data.recent_activity.map((a, i) => (
              <li key={i} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs py-1.5 px-3 rounded-lg bg-muted/30 border border-border/50">
                <span className="font-mono font-bold text-[#5baab8]">{a.action}</span>
                {a.target && <span className="text-foreground break-all">{a.target}</span>}
                <span className="ml-auto text-muted-foreground shrink-0">
                  {a.admin_email || "—"} · {a.created_at ? new Date(a.created_at).toLocaleString() : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
