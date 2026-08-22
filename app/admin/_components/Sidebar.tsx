"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Cookie, Home, LogOut, Settings, Shield, X, ChevronLeft } from "lucide-react";

interface AdminUser {
  id: number;
  email: string;
  name: string;
}

const navItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/cookies", label: "Platform Cookies", icon: Cookie },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

export function AdminSidebar({
  admin,
  mobileOpen,
  onClose,
  collapsed,
  onToggle,
}: {
  admin: AdminUser;
  mobileOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    onClose();
    const token = localStorage.getItem("admin_token");
    if (token) {
      fetch("/api/admin/proxy/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    router.push("/admin/login");
  };

  const navContent = (showLabels: boolean) => (
    <>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              title={showLabels ? undefined : item.label}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                showLabels ? "" : "lg:justify-center lg:px-2"
              } ${
                active
                  ? "bg-[#5baab8]/20 text-[#5baab8] font-medium"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {showLabels && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1">
        {showLabels && (
          <div className="flex items-center gap-2 px-3 pb-1 pt-2">
            <span className="w-7 h-7 rounded-full bg-[#5baab8]/20 text-[#5baab8] flex items-center justify-center shrink-0">
              <Shield className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs text-white/40 truncate" title={admin.email}>
              {admin.email}
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={showLabels ? undefined : "Sign Out"}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 hover:text-white hover:bg-white/5 w-full transition-colors ${
            showLabels ? "" : "lg:justify-center lg:px-2"
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {showLabels && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop: persistent collapsible sidebar */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 bottom-0 flex-col z-40 bg-[#0d1f26] text-white border-r border-white/5 transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div
          className={`flex items-center gap-2 border-b border-white/10 ${
            collapsed ? "justify-center p-4" : "justify-between p-5"
          }`}
        >
          <Link href="/admin" className="flex items-center gap-2 min-w-0" title="DownForge Admin">
            <span className="w-7 h-7 rounded-lg bg-[#5baab8] text-[#06272d] flex items-center justify-center shrink-0">
              <Shield className="w-4 h-4" />
            </span>
            {!collapsed && (
              <span className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-base truncate">DownForge</span>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-[#5baab8] text-[#06272d] px-2 py-0.5 rounded-full shrink-0">
                  Admin
                </span>
              </span>
            )}
          </Link>
          {!collapsed && (
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
        {navContent(!collapsed)}
      </aside>

      {/* Collapsed desktop: floating expand button */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="hidden lg:flex fixed left-16 top-5 z-40 p-1.5 rounded-lg bg-[#0d1f26] border border-white/10 text-white/50 hover:text-white transition-colors"
          aria-label="Expand sidebar"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
        </button>
      )}

      {/* Mobile: off-canvas drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 32 }}
              className="fixed left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-[#0d1f26] text-white border-r border-white/10 flex flex-col z-50 lg:hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <span className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-[#5baab8] text-[#06272d] flex items-center justify-center">
                    <Shield className="w-4 h-4" />
                  </span>
                  <span className="font-bold text-base">DownForge</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase bg-[#5baab8] text-[#06272d] px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                </span>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {navContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
