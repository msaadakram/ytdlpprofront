"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Bell, LogOut, Settings, CreditCard, User, ChevronDown, Key, LayoutDashboard, CheckCheck, Sparkles, Download, AlertCircle, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  clearNotifications,
  type AppNotification,
} from "@/lib/api-client";
import type { DashboardTab } from "@/components/dashboard/Sidebar";

function getInitials(user: { name?: string; email?: string } | null) {
  if (!user) return "?";
  const source = (user.name?.trim() || user.email || "?").trim();
  if (!source || source === "?") return "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  // For single word / email: use first 2 chars if email, else first char
  if (parts[0].includes("@")) return parts[0][0].toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
}

type TopbarProps = {
  onNavigate?: (tab: DashboardTab) => void;
};

type NotifTone = "success" | "info" | "update" | "error";

function timeAgo(iso: string | null): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const s = Math.floor((Date.now() - then) / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function toneFor(type: string): NotifTone {
  switch (type) {
    case "download_completed": return "success";
    case "download_failed": return "error";
    case "plan_changed": return "update";
    default: return "info";
  }
}

function ToneIcon({ type }: { type: string }) {
  switch (type) {
    case "download_completed": return <Download className="w-4 h-4" />;
    case "download_failed": return <AlertCircle className="w-4 h-4" />;
    case "api_key_created":
    case "api_key_revoked": return <Key className="w-4 h-4" />;
    case "plan_changed": return <Sparkles className="w-4 h-4" />;
    default: return <Bell className="w-4 h-4" />;
  }
}

const toneChipClass: Record<NotifTone, string> = {
  success: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  error: "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
  info: "bg-[#5baab8]/10 border-[#5baab8]/20 text-[#5baab8]",
  update: "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
};

export function Topbar({ onNavigate }: TopbarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const initials = getInitials(user);
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifs, setLoadingNotifs] = useState(true);
  const [notifsError, setNotifsError] = useState(false);
  const [imgError, setImgError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const hasUnread = unreadCount > 0;

  const fetchNotifications = useCallback(async () => {
    const res = await getNotifications(20);
    if (res.success && res.data) {
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unread_count);
      setNotifsError(false);
    } else {
      // Keep whatever we already have; just flag the failure.
      setNotifsError(true);
    }
    setLoadingNotifs(false);
  }, []);

  // Load once on mount and keep the bell fresh with a light poll.
  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, 30_000);
    return () => clearInterval(id);
  }, [fetchNotifications]);

  // Reset image error when user changes
  useEffect(() => {
    setImgError(false);
  }, [user?.avatar_url]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleMarkOneRead(id: string) {
    const target = notifications.find((n) => n.id === id);
    if (!target || target.read) return;
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    const res = await markNotificationRead(id);
    if (!res.success) fetchNotifications(); // resync with server state
  }

  async function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    const res = await markAllNotificationsRead();
    if (!res.success) {
      toast.error(res.error?.message || "Failed to mark notifications as read.");
      fetchNotifications();
    }
  }

  async function handleDeleteOne(id: string) {
    const target = notifications.find((n) => n.id === id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (target && !target.read) setUnreadCount((c) => Math.max(0, c - 1));
    const res = await deleteNotification(id);
    if (!res.success) {
      toast.error(res.error?.message || "Failed to delete notification.");
      fetchNotifications();
    }
  }

  async function handleClearAll() {
    const res = await clearNotifications();
    if (res.success) {
      setNotifications([]);
      setUnreadCount(0);
    } else {
      toast.error(res.error?.message || "Failed to clear notifications.");
      fetchNotifications();
    }
  }

  async function handleLogout() {
    setOpen(false);
    await logout();
    router.replace("/");
  }

  function handleNavigate(tab: DashboardTab) {
    setOpen(false);
    if (onNavigate) {
      onNavigate(tab);
    } else {
      // Fallback: dispatch event for DashboardClient to listen, or just stay on dashboard
      window.dispatchEvent(new CustomEvent("dashboard:navigate", { detail: tab }));
    }
  }

  const showAvatarImage = Boolean(user?.avatar_url && !imgError);

  return (
    <header className="h-16 bg-card/95 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 sm:px-6 gap-3 sticky top-16 z-40">
      <div className="min-w-0">
        <h2 className="text-sm font-bold text-foreground font-heading truncate">Dashboard</h2>
        <p className="text-xs text-muted-foreground font-sans truncate">Manage your downloads and account</p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div ref={notifRef} className="relative">
          <button
            className={`p-2 rounded-xl border transition-all relative ${notifOpen ? "bg-[#0d1f26] text-white border-[#0d1f26] shadow-md dark:bg-white dark:text-[#0d1f26] dark:border-white" : "hover:bg-muted text-muted-foreground border-transparent hover:border-border/50"}`}
            aria-label={`Notifications${hasUnread ? `, ${unreadCount} unread` : ""}`}
            aria-expanded={notifOpen}
            aria-haspopup="dialog"
            title="Notifications"
            onClick={() => {
              setNotifOpen((v) => !v);
              setOpen(false);
              fetchNotifications();
            }}
          >
            <Bell className="w-4 h-4" />
            {hasUnread && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-destructive ring-2 ring-card animate-pulse" />}
            {hasUnread && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive/15 animate-ping pointer-events-none" />}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -8 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                role="dialog"
                aria-label="Notifications"
                className="absolute top-full right-0 mt-3 w-[92vw] max-w-[360px] sm:w-[380px] bg-white dark:bg-[#0f1e26] border border-border/60 dark:border-white/10 rounded-2xl shadow-[0_16px_40px_-12px_rgba(13,31,38,0.2)] overflow-hidden z-50 origin-top-right"
              >
                <div className="px-4 py-3 border-b border-border/50 dark:border-white/5 bg-gradient-to-br from-[#5baab8]/10 via-[#5baab8]/5 to-transparent dark:from-white/[0.04] dark:via-white/[0.02] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-[#0d1f26] dark:bg-white text-white dark:text-[#0d1f26] flex items-center justify-center">
                      <Bell className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-foreground font-sans leading-none">Notifications</p>
                      <p className="text-xs text-muted-foreground font-sans">{hasUnread ? `${unreadCount} unread` : "All caught up"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {hasUnread ? (
                      <button onClick={handleMarkAllRead} className="inline-flex items-center gap-1 text-xs font-semibold text-[#5baab8] hover:text-[#0d1f26] dark:hover:text-white transition-colors">
                        <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCheck className="w-3.5 h-3.5" /> Up to date
                      </span>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={handleClearAll}
                        title="Clear all notifications"
                        aria-label="Clear all notifications"
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-[320px] overflow-y-auto overscroll-contain divide-y divide-border/50 dark:divide-white/5">
                  {loadingNotifs ? (
                    [1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-3 px-4 py-3 animate-pulse">
                        <div className="w-8 h-8 rounded-xl bg-muted shrink-0 mt-0.5" />
                        <div className="flex-1 space-y-2 pt-0.5">
                          <div className="h-3 w-2/5 rounded bg-muted" />
                          <div className="h-2.5 w-4/5 rounded bg-muted/70" />
                        </div>
                      </div>
                    ))
                  ) : notifsError && notifications.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-foreground font-sans">Couldn&apos;t load notifications</p>
                      <button onClick={() => fetchNotifications()} className="mt-2 text-xs font-bold text-[#5baab8] hover:text-[#0d1f26] dark:hover:text-white transition-colors">
                        Try again
                      </button>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="px-4 py-10 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-muted dark:bg-white/5 border border-border/50 dark:border-white/5 flex items-center justify-center mx-auto">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-foreground font-sans">No notifications</p>
                      <p className="text-xs text-muted-foreground font-sans">We&apos;ll notify you when something happens.</p>
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const tone = toneFor(n.type);
                      return (
                        <div
                          key={n.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => handleMarkOneRead(n.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleMarkOneRead(n.id);
                            }
                          }}
                          className={`group w-full flex items-start gap-3 px-4 py-3 text-left cursor-pointer hover:bg-muted/50 dark:hover:bg-white/[0.04] transition-colors ${!n.read ? "bg-[#5baab8]/[0.04] dark:bg-white/[0.02]" : ""}`}
                        >
                          <span className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border shadow-sm mt-0.5 ${toneChipClass[tone]}`}>
                            <ToneIcon type={n.type} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground font-sans truncate">{n.title}</span>
                              {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#5baab8] animate-pulse shrink-0" />}
                            </span>
                            <span className="block text-xs text-muted-foreground font-sans leading-relaxed line-clamp-2">{n.body}</span>
                            <span className="block text-[11px] font-mono text-muted-foreground/70 mt-1">{timeAgo(n.created_at)}</span>
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteOne(n.id);
                            }}
                            aria-label="Delete notification"
                            title="Delete notification"
                            className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-all opacity-60 group-hover:opacity-100 focus-visible:opacity-100 shrink-0 mt-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="px-3 py-2.5 bg-muted/30 dark:bg-white/[0.03] border-t border-border/50 dark:border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setNotifOpen(false);
                      handleNavigate("settings");
                    }}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Notification settings
                  </button>
                  <button onClick={() => setNotifOpen(false)} className="text-xs font-bold text-[#0d1f26] dark:text-white hover:text-[#5baab8] transition-colors">
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Functional Avatar */}
        <div ref={containerRef} className="relative flex items-center gap-2 text-sm font-sans">
          <button
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label={user ? `Account menu for ${user.name || user.email}` : "Account menu"}
            className="group flex items-center gap-1.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5baab8] focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          >
            <div className="w-8 h-8 rounded-full bg-[#5baab8] flex items-center justify-center text-white text-xs font-bold ring-2 ring-transparent group-hover:ring-[#5baab8]/20 group-[[aria-expanded=true]]:ring-[#5baab8]/30 transition-all overflow-hidden shrink-0">
              {showAvatarImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user!.avatar_url!}
                  alt={user?.name || user?.email || "User avatar"}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span aria-hidden>{initials}</span>
              )}
            </div>
            <ChevronDown
              className={`hidden sm:block w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -8 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                role="menu"
                className="absolute top-full right-0 mt-3 w-72 sm:w-80 bg-white dark:bg-[#0f1e26] border border-border/60 dark:border-white/10 rounded-2xl shadow-[0_16px_40px_-12px_rgba(13,31,38,0.2)] overflow-hidden z-50 origin-top-right"
              >
                {/* User header */}
                <div className="p-4 bg-gradient-to-br from-[#5baab8]/10 via-[#5baab8]/5 to-transparent dark:from-white/[0.06] dark:via-white/[0.03] border-b border-border/50 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#5baab8] flex items-center justify-center text-white text-sm font-bold shrink-0 overflow-hidden shadow-sm">
                      {showAvatarImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={user!.avatar_url!}
                          alt={user?.name || user?.email || "User avatar"}
                          className="w-full h-full object-cover"
                          onError={() => setImgError(true)}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        initials
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate font-sans">
                        {user?.name || user?.email || "Guest"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate font-sans" title={user?.email}>
                        {user?.email || "Not signed in"}
                      </p>
                    </div>
                    {user?.plan && (
                      <span
                        className={`shrink-0 text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full border ${
                          user.plan === "pro"
                            ? "bg-[#5baab8] text-white border-[#5baab8] shadow-sm"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {user.plan}
                      </span>
                    )}
                  </div>
                </div>

                {/* Menu items */}
                <div className="p-2 space-y-0.5">
                  <button
                    role="menuitem"
                    onClick={() => handleNavigate("overview")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 dark:hover:bg-white/5 transition-colors text-left font-sans"
                  >
                    <span className="w-8 h-8 rounded-lg bg-muted dark:bg-white/5 border border-border/50 dark:border-white/5 flex items-center justify-center shrink-0">
                      <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                    </span>
                    <span className="flex-1">Overview</span>
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => handleNavigate("settings")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 dark:hover:bg-white/5 transition-colors text-left font-sans"
                  >
                    <span className="w-8 h-8 rounded-lg bg-muted dark:bg-white/5 border border-border/50 dark:border-white/5 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </span>
                    <span className="flex-1">Profile & Settings</span>
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => handleNavigate("billing")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 dark:hover:bg-white/5 transition-colors text-left font-sans"
                  >
                    <span className="w-8 h-8 rounded-lg bg-muted dark:bg-white/5 border border-border/50 dark:border-white/5 flex items-center justify-center shrink-0">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                    </span>
                    <span className="flex-1">Billing</span>
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => handleNavigate("api-keys")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 dark:hover:bg-white/5 transition-colors text-left font-sans"
                  >
                    <span className="w-8 h-8 rounded-lg bg-muted dark:bg-white/5 border border-border/50 dark:border-white/5 flex items-center justify-center shrink-0">
                      <Key className="w-4 h-4 text-muted-foreground" />
                    </span>
                    <span className="flex-1">API Keys</span>
                  </button>

                  <button
                    role="menuitem"
                    onClick={() => handleNavigate("settings")}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-muted/70 dark:hover:bg-white/5 transition-colors text-left font-sans"
                  >
                    <span className="w-8 h-8 rounded-lg bg-muted dark:bg-white/5 border border-border/50 dark:border-white/5 flex items-center justify-center shrink-0">
                      <Settings className="w-4 h-4 text-muted-foreground" />
                    </span>
                    <span className="flex-1">Settings</span>
                  </button>
                </div>

                <div className="h-px bg-border/50 dark:bg-white/5 mx-2" />

                <div className="p-2">
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/15 transition-colors text-left font-sans"
                  >
                    <span className="w-8 h-8 rounded-lg bg-destructive/10 dark:bg-destructive/15 border border-destructive/20 flex items-center justify-center shrink-0">
                      <LogOut className="w-4 h-4 text-destructive" />
                    </span>
                    <span className="flex-1">Log Out</span>
                  </button>
                </div>

                <div className="px-4 py-2.5 bg-muted/30 dark:bg-white/[0.03] border-t border-border/50 dark:border-white/5 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground font-sans truncate">
                    {user?.email_verified ? "✓ Verified" : "Manage account"}
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground/70">{user?.id ? `#${user.id.slice(0, 8)}` : ""}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
