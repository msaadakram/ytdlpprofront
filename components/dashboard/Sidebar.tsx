"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  Download, BarChart2, Key, CreditCard, Settings, LogOut, ChevronLeft, X, Sparkles,
} from "lucide-react";

export type DashboardTab = "overview" | "api-keys" | "downloads" | "billing" | "settings";

const tabs: { id: DashboardTab; label: string; icon: typeof BarChart2 }[] = [
  { id: "overview", label: "Overview", icon: BarChart2 },
  { id: "api-keys", label: "API Keys", icon: Key },
  { id: "downloads", label: "Downloads", icon: Download },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  activeTab,
  onTabChange,
  collapsed,
  onToggle,
  mobileOpen,
  onClose,
  onLogout,
}: {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  function handleTabClick(tab: DashboardTab) {
    onTabChange(tab);
    onClose();
  }

  const navContent = (
    <>
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70 font-mono">
            Menu
          </p>
        )}
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              title={collapsed ? tab.label : undefined}
              className={`group relative w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all font-sans ${
                collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"
              } ${
                active
                  ? "bg-gradient-to-r from-[#5baab8]/15 to-[#5baab8]/[0.04] text-foreground shadow-[inset_0_0_0_1px_rgba(91,170,184,0.22)]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
              }`}
            >
              {/* Active accent bar */}
              <span
                aria-hidden
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-full bg-gradient-to-b from-[#5baab8] to-[#3d8896] transition-all duration-300 ${
                  active ? "opacity-100" : "opacity-0"
                } ${collapsed ? "-left-3" : ""}`}
              />
              <span
                className={`flex items-center justify-center rounded-lg shrink-0 transition-all ${
                  collapsed ? "w-8 h-8" : "w-7 h-7"
                } ${
                  active
                    ? "bg-gradient-to-br from-[#5baab8] to-[#3d8896] text-white shadow-[0_6px_14px_-6px_rgba(91,170,184,0.7)]"
                    : "bg-muted/70 text-muted-foreground group-hover:text-[#5baab8]"
                }`}
              >
                <Icon className="w-4 h-4" />
              </span>
              {!collapsed && <span className="truncate">{tab.label}</span>}
            </button>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="px-3 pb-3">
          <a
            href="/#pricing"
            className="group relative block overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1f26] to-[#123040] dark:from-[#123040] dark:to-[#0d1f26] p-4 text-white shadow-[0_12px_28px_-14px_rgba(13,31,38,0.6)]"
          >
            <div aria-hidden className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-[#5baab8]/25 blur-2xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-[#8fd3df] font-mono">
                <Sparkles className="w-3 h-3" /> Pro
              </span>
              <p className="mt-1 text-[13px] font-bold leading-snug font-heading">
                Unlock 4K &amp; batch downloads
              </p>
              <p className="mt-1 text-[11px] text-white/60 leading-relaxed">
                Unlimited conversions and API access.
              </p>
              <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-white/90 group-hover:translate-x-0.5 transition-transform">
                Upgrade →
              </span>
            </div>
          </a>
        </div>
      )}

      <div className="p-3 border-t border-border/70">
        <button
          onClick={onLogout}
          title={collapsed ? "Log Out" : undefined}
          className={`w-full flex items-center gap-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/[0.07] transition-all font-sans ${
            collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop: persistent collapsible sidebar */}
      <aside
        className={`hidden lg:flex fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white/60 dark:bg-[#0b141a]/70 backdrop-blur-xl border-r border-border/70 flex-col transition-all duration-300 z-30 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between p-3 border-b border-border/60 min-h-[3.25rem]">
          {!collapsed && (
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground/70 font-mono pl-1">
              Dashboard
            </span>
          )}
          <button
            onClick={onToggle}
            className={`p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground ${collapsed ? "mx-auto" : ""}`}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>
        {navContent}
      </aside>

      {/* Mobile: off-canvas drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              className="fixed left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-white dark:bg-[#0b141a] border-r border-border flex flex-col z-50 lg:hidden shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-border/70 h-16">
                <span className="flex items-center gap-2">
                  <img src="/logo.png" alt="" className="w-7 h-7 object-contain" />
                  <span className="font-extrabold text-foreground font-heading">DownForge</span>
                </span>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {navContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
