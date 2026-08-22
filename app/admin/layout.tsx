"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AdminSidebar } from "./_components/Sidebar";
import { AdminTopbar } from "./_components/AdminTopbar";

interface AdminUser {
  id: number;
  email: string;
  name: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    fetch("/api/admin/proxy/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setAdmin(res.data);
        } else {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
          router.push("/admin/login");
        }
      })
      .catch(() => {
        router.push("/admin/login");
      })
      .finally(() => setLoading(false));
  }, [pathname, router]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#5baab8] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-sans">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        admin={admin!}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      <div className={`transition-all duration-300 ${collapsed ? "lg:ml-16" : "lg:ml-64"}`}>
        <AdminTopbar onMenu={() => setMobileOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
