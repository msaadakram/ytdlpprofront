"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileNavOpen]);

  return (
    <div className="min-h-screen bg-[#eef6f8]">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border h-16 flex items-center px-4 sm:px-6 gap-3">
        <button
          onClick={() => setMobileNavOpen(true)}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted transition-colors text-foreground"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
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
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />

      <div className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <Topbar />
        <main className="p-4 sm:p-6">
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
