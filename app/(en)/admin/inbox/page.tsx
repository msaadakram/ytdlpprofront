"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Inbox,
  RefreshCw,
  Loader2,
  Trash2,
  Reply,
  ChevronLeft,
  MailOpen,
  Users,
  CheckCheck,
} from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  replied: boolean;
  created_at: string;
}

interface Subscriber {
  email: string;
  source: string;
  subscribed_at: string | null;
}

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : "";
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

/** Only well-formed emails become mailto: links (sender input is untrusted). */
function safeMailto(email: string): string | null {
  const v = email.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? `mailto:${v}` : null;
}

function formatDate(iso: string | null): string {  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminInboxPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [unread, setUnread] = useState(0);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subTotal, setSubTotal] = useState(0);

  const loadMessages = useCallback(async (f: "all" | "unread") => {
    setLoading(true);
    try {
      const qs = f === "unread" ? "?read=false" : "";
      const res = await fetch(`/api/admin/proxy/contact/messages${qs}`, { headers: authHeaders() });
      const json = await res.json();
      if (json.success) {
        setMessages(json.data.messages || []);
        setUnread(json.data.unread || 0);
      }
    } catch {
      /* network error — list stays as-is */
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSubscribers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/proxy/contact/newsletter/subscribers?limit=20", {
        headers: authHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        setSubscribers(json.data.subscribers || []);
        setSubTotal(json.data.total || 0);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    loadMessages(filter);
  }, [filter, loadMessages]);

  useEffect(() => {
    loadSubscribers();
  }, [loadSubscribers]);

  async function openMessage(id: string) {
    setBusy(`open-${id}`);
    try {
      const res = await fetch(`/api/admin/proxy/contact/messages/${id}`, { headers: authHeaders() });
      const json = await res.json();
      if (json.success) {
        const msg = json.data.message as ContactMessage;
        setSelected(msg);
        setMessages((ms) => ms.map((m) => (m.id === msg.id ? { ...m, read: true } : m)));
        setUnread((u) => Math.max(0, u - 1));
      }
    } finally {
      setBusy(null);
    }
  }

  async function toggleReplied() {
    if (!selected) return;
    setBusy("replied");
    try {
      const res = await fetch(`/api/admin/proxy/contact/messages/${selected.id}/replied`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ replied: !selected.replied }),
      });
      const json = await res.json();
      if (json.success) {
        const msg = json.data.message as ContactMessage;
        setSelected(msg);
        setMessages((ms) => ms.map((m) => (m.id === msg.id ? msg : m)));
      }
    } finally {
      setBusy(null);
    }
  }

  async function deleteMessage() {
    if (!selected) return;
    if (!window.confirm("Delete this message permanently?")) return;
    setBusy("delete");
    try {
      const res = await fetch(`/api/admin/proxy/contact/messages/${selected.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const json = await res.json();
      if (json.success) {
        setMessages((ms) => ms.filter((m) => m.id !== selected.id));
        setSelected(null);
        if (filter === "unread") loadMessages(filter);
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-[#5baab8]/15 text-[#5baab8] flex items-center justify-center shrink-0">
            <Inbox className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-base font-bold text-foreground font-heading">
              Inbox
              {unread > 0 && (
                <span className="ml-2 text-[11px] font-bold bg-[#5baab8] text-white px-2 py-0.5 rounded-full">
                  {unread} new
                </span>
              )}
            </h1>
            <p className="text-xs text-muted-foreground">Messages from the contact page.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1 bg-muted/60 border border-border/60 rounded-full p-1">
            {(["all", "unread"] as const).map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setSelected(null); }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${filter === f ? "bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] shadow" : "text-muted-foreground hover:text-foreground"}`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={() => loadMessages(filter)}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-muted/60 border border-border/60 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Refresh inbox"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 items-start">
        {/* List */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading messages…
            </div>
          ) : messages.length === 0 ? (
            <div className="p-8 text-center">
              <MailOpen className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                {filter === "unread" ? "No unread messages." : "No messages yet — new contact form submissions appear here."}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border/60 max-h-[560px] overflow-y-auto">
              {messages.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => openMessage(m.id)}
                    className={`w-full text-left px-4 py-3.5 hover:bg-muted/40 transition-colors ${selected?.id === m.id ? "bg-[#5baab8]/10" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      {!m.read && <span className="w-2 h-2 rounded-full bg-[#5baab8] shrink-0" />}
                      <span className={`text-sm truncate ${m.read ? "font-medium text-foreground" : "font-bold text-foreground"}`}>
                        {m.name}
                      </span>
                      {m.replied && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                          <CheckCheck className="w-3 h-3" /> Replied
                        </span>
                      )}
                      <span className="ml-auto text-[11px] text-muted-foreground shrink-0">{formatDate(m.created_at)}</span>
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground mt-0.5 truncate">{m.subject}</p>
                    <p className="text-xs text-muted-foreground/70 truncate">{m.email}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Detail */}
        <div className="bg-card rounded-xl border border-border p-5 sm:p-6 lg:sticky lg:top-4">
          {!selected ? (
            <div className="py-10 text-center">
              <Inbox className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Select a message to read it.</p>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setSelected(null)}
                className="lg:hidden inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground mb-3"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back to list
              </button>
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#5baab8]">{selected.subject}</p>
              <h2 className="text-lg font-bold text-foreground font-heading mt-1">{selected.name}</h2>
              {safeMailto(selected.email) ? (
                <a href={safeMailto(selected.email) as string} className="text-sm text-[#5baab8] hover:underline break-all">
                  {selected.email}
                </a>
              ) : (
                <span className="text-sm text-muted-foreground break-all">{selected.email}</span>
              )}
              <p className="text-[11px] text-muted-foreground mt-1">{formatDate(selected.created_at)}</p>
              <div className="mt-4 rounded-xl bg-muted/40 border border-border/60 p-4 text-sm text-foreground whitespace-pre-wrap break-words">
                {selected.message}
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  onClick={toggleReplied}
                  disabled={busy === "replied"}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-colors disabled:opacity-60 ${selected.replied ? "bg-emerald-500/15 text-emerald-700 border border-emerald-500/25" : "bg-[#5baab8] text-white hover:bg-[#4a99a7]"}`}
                >
                  {busy === "replied" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Reply className="w-3.5 h-3.5" />}
                  {selected.replied ? "Marked replied" : "Mark as replied"}
                </button>
                {safeMailto(selected.email) && (
                  <a
                    href={`${safeMailto(selected.email)}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-border text-foreground hover:bg-muted/50 transition-colors"
                  >
                    Reply by email
                  </a>
                )}
                <button
                  onClick={deleteMessage}
                  disabled={busy === "delete"}
                  className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-60"
                >
                  {busy === "delete" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Newsletter subscribers */}
      <div className="bg-card rounded-xl border border-border p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-4">
          <Users className="w-4 h-4 text-[#5baab8]" />
          <h2 className="text-sm font-bold text-foreground font-heading">
            Newsletter subscribers
            <span className="ml-2 text-[11px] font-bold bg-muted text-muted-foreground px-2 py-0.5 rounded-full">{subTotal}</span>
          </h2>
        </div>
        {subscribers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No subscribers yet — footer signups appear here.</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {subscribers.map((s) => (
              <li key={s.email} className="py-2 flex items-center gap-3 text-sm">
                <span className="text-foreground break-all">{s.email}</span>
                <span className="ml-auto text-[11px] text-muted-foreground shrink-0">
                  {s.source} · {formatDate(s.subscribed_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
