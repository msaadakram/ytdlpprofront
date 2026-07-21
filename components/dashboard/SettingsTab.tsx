"use client";

import { useState } from "react";
import { User, Lock, Bell, Eye, EyeOff } from "lucide-react";

export function SettingsTab() {
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="text-sm font-bold text-foreground mb-4 font-heading flex items-center gap-2">
          <User className="w-4 h-4 text-[#5baab8]" /> Profile
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5 font-sans">First Name</label>
              <input
                defaultValue="John"
                className="w-full bg-[#eef6f8] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-[#5baab8]/40 transition-all font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5 font-sans">Last Name</label>
              <input
                defaultValue="Doe"
                className="w-full bg-[#eef6f8] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-[#5baab8]/40 transition-all font-sans"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5 font-sans">Email</label>
            <input
              defaultValue="john@example.com"
              className="w-full bg-[#eef6f8] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-[#5baab8]/40 transition-all font-sans"
            />
          </div>
          <button className="bg-[#0d1f26] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1a3545] transition-colors font-sans">
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="text-sm font-bold text-foreground mb-4 font-heading flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#5baab8]" /> Security
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5 font-sans">Current Password</label>
            <div className="flex items-center gap-3 bg-[#eef6f8] rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#5baab8]/40 transition-all">
              <input
                type={showCurrentPw ? "text" : "password"}
                placeholder="Enter current password"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans"
              />
              <button onClick={() => setShowCurrentPw(!showCurrentPw)} className="text-muted-foreground">
                {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5 font-sans">New Password</label>
            <div className="flex items-center gap-3 bg-[#eef6f8] rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#5baab8]/40 transition-all">
              <input
                type={showNewPw ? "text" : "password"}
                placeholder="Enter new password"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans"
              />
              <button onClick={() => setShowNewPw(!showNewPw)} className="text-muted-foreground">
                {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button className="bg-[#0d1f26] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1a3545] transition-colors font-sans">
            Update Password
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6">
        <h3 className="text-sm font-bold text-foreground mb-4 font-heading flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#5baab8]" /> Notifications
        </h3>
        <div className="space-y-4">
          {[
            { label: "Email notifications for completed downloads", defaultChecked: true },
            { label: "Weekly usage summary", defaultChecked: true },
            { label: "Product updates and new features", defaultChecked: false },
            { label: "Billing and payment reminders", defaultChecked: true },
          ].map((item) => (
            <label key={item.label} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-foreground font-sans">{item.label}</span>
              <div className="relative">
                <input type="checkbox" defaultChecked={item.defaultChecked} className="sr-only peer" />
                <div className="w-10 h-5 bg-[#a8d4dc] rounded-full peer-checked:bg-[#5baab8] transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5" />
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
