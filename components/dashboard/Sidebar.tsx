"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  Download, BarChart2, Key, CreditCard, Settings, LogOut, ChevronLeft, X,
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
      <nav className="flex-1 p-3 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all font-sans ${
                active
                  ? "bg-[#eef6f8] text-[#0d1f26]"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? "text-[#5baab8]" : ""}`} />
              {!collapsed && <span>{tab.label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all font-sans"
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
        className={`hidden lg:flex fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-border flex-col transition-all duration-300 z-30 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!collapsed && (
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono">Menu</span>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
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
              className="fixed left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-white border-r border-border flex flex-col z-50 lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border h-16">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono">Menu</span>
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
