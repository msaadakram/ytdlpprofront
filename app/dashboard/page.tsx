"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar, type DashboardTab } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { ApiKeysTab } from "@/components/dashboard/ApiKeysTab";
import { DownloadsTab } from "@/components/dashboard/DownloadsTab";
import { BillingTab } from "@/components/dashboard/BillingTab";
import { SettingsTab } from "@/components/dashboard/SettingsTab";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#eef6f8]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="fetchwave home">
          <div className="w-8 h-8 rounded-lg bg-[#0d1f26] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#5baab8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span className="font-bold text-lg tracking-tight text-foreground font-heading">fetchwave</span>
        </Link>
      </header>

      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-64"}`}>
        <Topbar />
        <main className="p-6">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "api-keys" && <ApiKeysTab />}
          {activeTab === "downloads" && <DownloadsTab />}
          {activeTab === "billing" && <BillingTab />}
          {activeTab === "settings" && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}
