"use client";

import { Bell, Sparkles } from "lucide-react";
import Link from "next/link";

export function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6">
      <div>
        <h2 className="text-sm font-bold text-foreground font-heading">Dashboard</h2>
        <p className="text-xs text-muted-foreground font-sans">Manage your downloads and account</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive" />
        </button>
        <div className="flex items-center gap-2 text-sm font-sans">
          <div className="w-8 h-8 rounded-full bg-[#5baab8] flex items-center justify-center text-white text-xs font-bold">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
