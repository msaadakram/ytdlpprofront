"use client";

import { Bell } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

function getInitials(user: { name?: string; email?: string } | null) {
  if (!user) return "?";
  const parts = (user.name || user.email || "?").split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
}

export function Topbar() {
  const { user } = useAuth();
  const initials = getInitials(user);

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 gap-3">
      <div className="min-w-0">
        <h2 className="text-sm font-bold text-foreground font-heading truncate">Dashboard</h2>
        <p className="text-xs text-muted-foreground font-sans truncate">Manage your downloads and account</p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
        </button>
        <div className="flex items-center gap-2 text-sm font-sans">
          <div className="w-8 h-8 rounded-full bg-[#5baab8] flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
