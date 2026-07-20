"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Cookie, Home, LogOut, Settings } from "lucide-react";

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

export function AdminSidebar({ admin }: { admin: AdminUser }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
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

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-[#0d1f26] text-white flex flex-col z-50">
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-bold text-lg">DownForge</span>
          <span className="text-xs bg-[#5baab8] px-2 py-0.5 rounded-full">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-[#5baab8]/20 text-[#5baab8] font-medium"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-3">
        <div className="text-xs text-white/40 px-3 truncate">{admin.email}</div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/5 w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
