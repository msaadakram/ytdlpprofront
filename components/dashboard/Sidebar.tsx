"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Download, BarChart2, Key, CreditCard, Settings, LogOut, ChevronLeft,
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
}: {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-border flex flex-col transition-all duration-300 z-30 ${
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
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
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
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all font-sans">
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
