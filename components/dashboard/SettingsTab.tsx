"use client";

import { useState, useEffect } from "react";
import { User, Lock, Bell, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import {
  getProfile, updateProfile, updateNotifications, changePassword,
} from "@/lib/api-client";
import type { UserProfile } from "@/lib/api-client";

type NotificationKey = "email_completed" | "weekly_summary" | "product_updates" | "billing_reminders";

export function SettingsTab() {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form state
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [savingPw, setSavingPw] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>({
    email_completed: true,
    weekly_summary: true,
    product_updates: false,
    billing_reminders: true,
  });
  const [savingNotifs, setSavingNotifs] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getProfile().then((res) => {
      if (cancelled) return;
      if (res.success && res.data) {
        const u = res.data.user;
        setProfile(u);
        setFirstName(u.first_name || "");
        setLastName(u.last_name || "");
        setEmail(u.email || "");
        if (u.notifications) setNotifications(u.notifications);
      }
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function handleSaveProfile() {
    setSavingProfile(true);
    const res = await updateProfile({ first_name: firstName, last_name: lastName, email });
    setSavingProfile(false);
    if (res.success && res.data) {
      setProfile(res.data.user);
      setUser(res.data.user);
      toast.success("Profile updated.");
    } else {
      toast.error(res.error?.message || "Failed to update profile.");
    }
  }

  async function handleUpdatePassword() {
    if (!currentPw || !newPw) {
      toast.error("Please fill in both password fields.");
      return;
    }
    if (newPw.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    setSavingPw(true);
    const res = await changePassword(currentPw, newPw);
    setSavingPw(false);
    if (res.success) {
      setCurrentPw("");
      setNewPw("");
      toast.success("Password changed.");
    } else {
      toast.error(res.error?.message || "Failed to change password.");
    }
  }

  async function handleNotificationToggle(key: NotificationKey) {
    const next = { ...notifications, [key]: !notifications[key] };
    setNotifications(next);
    setSavingNotifs(true);
    const res = await updateNotifications({ [key]: next[key] });
    setSavingNotifs(false);
    if (!res.success) {
      // Revert on failure
      setNotifications(notifications);
      toast.error(res.error?.message || "Failed to update notifications.");
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4 sm:p-6 animate-pulse"><div className="h-32" /></div>
        ))}
      </div>
    );
  }

  const notificationItems: { key: NotificationKey; label: string }[] = [
    { key: "email_completed", label: "Email notifications for completed downloads" },
    { key: "weekly_summary", label: "Weekly usage summary" },
    { key: "product_updates", label: "Product updates and new features" },
    { key: "billing_reminders", label: "Billing and payment reminders" },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
        <h3 className="text-sm font-bold text-foreground mb-4 font-heading flex items-center gap-2">
          <User className="w-4 h-4 text-[#5baab8]" /> Profile
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5 font-sans">First Name</label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-muted/60 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-[#5baab8]/40 transition-all font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5 font-sans">Last Name</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-muted/60 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-[#5baab8]/40 transition-all font-sans"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5 font-sans">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-muted/60 rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-[#5baab8]/40 transition-all font-sans"
            />
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="flex items-center gap-2 bg-[#0d1f26] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1a3545] transition-colors font-sans disabled:opacity-60"
          >
            {savingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
        <h3 className="text-sm font-bold text-foreground mb-4 font-heading flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#5baab8]" /> Security
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5 font-sans">Current Password</label>
            <div className="flex items-center gap-3 bg-muted/60 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#5baab8]/40 transition-all">
              <input
                type={showCurrentPw ? "text" : "password"}
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
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
            <div className="flex items-center gap-3 bg-muted/60 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#5baab8]/40 transition-all">
              <input
                type={showNewPw ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="Enter new password"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans"
              />
              <button onClick={() => setShowNewPw(!showNewPw)} className="text-muted-foreground">
                {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button
            onClick={handleUpdatePassword}
            disabled={savingPw}
            className="flex items-center gap-2 bg-[#0d1f26] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#1a3545] transition-colors font-sans disabled:opacity-60"
          >
            {savingPw && <Loader2 className="w-4 h-4 animate-spin" />}
            Update Password
          </button>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
        <h3 className="text-sm font-bold text-foreground mb-4 font-heading flex items-center gap-2">
          <Bell className="w-4 h-4 text-[#5baab8]" /> Notifications
        </h3>
        <div className="space-y-4">
          {notificationItems.map((item) => (
            <label key={item.key} className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-foreground font-sans">{item.label}</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={() => handleNotificationToggle(item.key)}
                  disabled={savingNotifs}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-[#a8d4dc] rounded-full peer-checked:bg-[#5baab8] transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all peer-checked:after:translate-x-5" />
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
