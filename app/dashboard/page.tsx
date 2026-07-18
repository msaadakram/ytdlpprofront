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
        <Link href="/" className="flex items-center gap-2" aria-label="DownForge home">
          <img
            src="/logo.png"
            alt="DownForge"
            className="w-8 h-8 object-contain"
          />
          <span className="font-bold text-lg tracking-tight text-foreground font-heading">DownForge</span>
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
