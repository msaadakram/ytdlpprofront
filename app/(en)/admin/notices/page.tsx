"use client";

import { useState, useEffect } from "react";
import { Megaphone, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface Broadcast {
  id: string;
  title: string;
  body: string;
  audience: string;
  count: number;
  by: string | null;
  created_at: string;
}

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export default function AdminNoticesPage() {
  const [audience, setAudience] = useState("all");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [history, setHistory] = useState<Broadcast[]>([]);

  async function loadHistory() {
    try {
      const res = await fetch("/api/admin/proxy/notifications/broadcasts", { headers: authHeaders() });
      const json = await res.json();
      if (json.success) setHistory(json.data.broadcasts || []);
    } catch {
      /* ignore */
    }
  }

  useEffect(() => { loadHistory(); }, []);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (!title.trim() || !body.trim()) {
      setStatus({ type: "error", text: "Title and body are required." });
      return;
    }
    if (!window.confirm(`Send this notice to ${audience === "all" ? "ALL users" : `all ${audience} users`}? This cannot be undone.`)) return;
    setSending(true);
    try {
      const res = await fetch("/api/admin/proxy/notifications/broadcast", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ title: title.trim(), body: body.trim(), audience }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus({ type: "success", text: `Sent to ${json.data.count} user${json.data.count === 1 ? "" : "s"}.` });
        setTitle("");
        setBody("");
        loadHistory();
      } else {
        setStatus({ type: "error", text: json.error?.message || "Broadcast failed." });
      }
    } finally {
      setSending(false);
    }
  }

  const inputClass =
    "w-full bg-input-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-[#5baab8]/50 focus:border-[#5baab8]/50 transition-all";

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-[#5baab8]/15 text-[#5baab8] flex items-center justify-center shrink-0">
          <Megaphone className="w-5 h-5" />
        </span>
        <div>
          <h1 className="text-base font-bold text-foreground font-heading">Notices</h1>
          <p className="text-xs text-muted-foreground">Broadcast an in-app notice to users. They see it under the dashboard bell.</p>
        </div>
      </div>

      <form onSubmit={handleSend} className="bg-card rounded-xl border border-border p-5 sm:p-6 space-y-4">
        <div>
          <label htmlFor="notice-audience" className="block text-sm font-medium text-foreground mb-1.5">Audience</label>
          <select id="notice-audience" value={audience} onChange={(e) => setAudience(e.target.value)} className={inputClass}>
            <option value="all">All users</option>
            <option value="free">Free only</option>
            <option value="starter">Starter only</option>
            <option value="pro">Pro only</option>
          </select>
        </div>
        <div>
          <label htmlFor="notice-title" className="block text-sm font-medium text-foreground mb-1.5">Title</label>
          <input id="notice-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Scheduled maintenance tonight" maxLength={120} className={inputClass} required />
        </div>
        <div>
          <label htmlFor="notice-body" className="block text-sm font-medium text-foreground mb-1.5">Message</label>
          <textarea id="notice-body" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Downloads will be paused 02:00–02:30 UTC…" rows={4} maxLength={500} className={`${inputClass} resize-none`} required />
          <p className="text-right text-[11px] text-muted-foreground font-mono mt-1">{body.length}/500</p>
        </div>

        {status && (
          <div className={`flex items-center gap-2 p-3 rounded-xl text-sm border ${status.type === "success" ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>
            {status.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {status.text}
          </div>
        )}

        <button type="submit" disabled={sending} className="inline-flex items-center justify-center gap-2 bg-[#5baab8] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4a99a7] transition-colors disabled:opacity-50">
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {sending ? "Sending…" : "Broadcast notice"}
        </button>
      </form>

      <div className="bg-card rounded-xl border border-border p-5 sm:p-6">
        <h2 className="text-sm font-bold text-foreground font-heading mb-4">Recent broadcasts</h2>
        {history.length === 0 ? (
          <p className="text-sm text-muted-foreground">No broadcasts yet.</p>
        ) : (
          <ul className="space-y-2">
            {history.map((b) => (
              <li key={b.id} className="rounded-xl bg-muted/40 border border-border/60 px-4 py-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-foreground truncate">{b.title}</p>
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-wide bg-muted px-2 py-0.5 rounded-full shrink-0">{b.audience} · {b.count}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 break-words">{b.body}</p>
                <p className="text-[11px] text-muted-foreground/70 mt-1">
                  {b.by || "—"} · {b.created_at ? new Date(b.created_at).toLocaleString() : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
