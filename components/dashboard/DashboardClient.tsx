"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth-context";
import { DashboardLoader } from "@/components/dashboard/DashboardLoader";
import { Sidebar, type DashboardTab } from "@/components/dashboard/Sidebar";
import { HeaderActions } from "@/components/dashboard/Topbar";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { ApiKeysTab } from "@/components/dashboard/ApiKeysTab";
import { DownloadsTab } from "@/components/dashboard/DownloadsTab";
import { BillingTab } from "@/components/dashboard/BillingTab";
import { SettingsTab } from "@/components/dashboard/SettingsTab";

export function DashboardClient() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { isAuthenticated, loading, logout } = useAuth();
  const dt = useTranslations("Dashboard");
  const router = useRouter();

  // Auth guard: redirect to sign-in if not authenticated (after initial load completes).
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [loading, isAuthenticated, router]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  // Allow Topbar (or any component) to navigate via custom event when no direct prop is wired.
  useEffect(() => {
    function handleDashboardNavigate(e: Event) {
      const detail = (e as CustomEvent<DashboardTab>).detail;
      if (detail) setActiveTab(detail);
    }
    window.addEventListener("dashboard:navigate" as any, handleDashboardNavigate);
    return () => window.removeEventListener("dashboard:navigate" as any, handleDashboardNavigate);
  }, []);

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  if (loading) {
    return <DashboardLoader message={dt("loading")} />;
  }

  if (!isAuthenticated) {
    return (
      <DashboardLoader message={dt("redirecting")}>
        <Link href="/sign-in" className="text-sm font-semibold text-[#5baab8] hover:underline">
          Go to Sign In
        </Link>
      </DashboardLoader>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f9fa] via-background to-background dark:from-[#0a161c] dark:via-[#081218] dark:to-[#060c10]">
      {/* Ambient accent glows */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[420px] rounded-full bg-[#5baab8]/10 dark:bg-[#5baab8]/[0.07] blur-[110px]" />
        <div className="absolute top-1/3 -left-40 w-[380px] h-[380px] rounded-full bg-[#5baab8]/[0.06] blur-[100px]" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/70 dark:bg-[#0b141a]/80 backdrop-blur-xl border-b border-border/70 flex items-center px-4 sm:px-6 gap-3 shadow-[0_1px_0_rgba(13,31,38,0.03)]">
        <button
          onClick={() => setMobileNavOpen(true)}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-border/70 bg-card/80 hover:bg-muted transition-colors text-foreground"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="DownForge home">
          <span className="w-9 h-9 rounded-xl bg-white dark:bg-white/95 shadow-[0_6px_16px_-8px_rgba(91,170,184,0.55)] ring-1 ring-border/60 flex items-center justify-center group-hover:shadow-[0_8px_20px_-8px_rgba(91,170,184,0.7)] transition-shadow">
            <img src="/logo.png" alt="" className="w-7 h-7 object-contain scale-110" />
          </span>
          <span className="font-extrabold text-lg tracking-tight text-foreground font-heading">DownForge</span>
        </Link>
        <HeaderActions onNavigate={setActiveTab} />
      </header>

      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        onLogout={handleLogout}
      />

      <div className={`relative pt-16 transition-all duration-300 ${sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
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
