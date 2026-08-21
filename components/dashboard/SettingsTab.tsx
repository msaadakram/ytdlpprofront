"use client";

import { useState, useEffect } from "react";
import { User, Lock, Bell, Eye, EyeOff, Loader2, ShieldCheck, Mail } from "lucide-react";
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

  const isGoogleUser = profile?.provider === "google" || profile?.provider === "both";
  const hasPassword = profile?.has_password ?? true;

  async function handleUpdatePassword() {
    if (!newPw) {
      toast.error("Please enter a new password.");
      return;
    }
    if (newPw.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    if (hasPassword && !currentPw) {
      toast.error("Please enter your current password.");
      return;
    }
    setSavingPw(true);
    // For Google-only users without password, backend ignores currentPassword
    const currentToSend = hasPassword ? currentPw : (currentPw || "google-oauth-no-password");
    const res = await changePassword(currentToSend, newPw);
    setSavingPw(false);
    if (res.success) {
      setCurrentPw("");
      setNewPw("");
      toast.success(hasPassword ? "Password changed." : "Password set. You can now sign in with email + password as well.");
      // Refresh profile to reflect has_password
      getProfile().then((r) => {
        if (r.success && r.data) setProfile(r.data.user);
      });
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
      {/* Connected Accounts — shows Google linkage status */}
      {profile && (
        <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
          <h3 className="text-sm font-bold text-foreground mb-4 font-heading flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#5baab8]" /> Connected Accounts
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl border bg-muted/30 border-border">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center">
                  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
                    <path fill="#FBBC05" d="M5.84 14.09A6.97 6.97 0 0 1 5.47 12c0-.72.13-1.43.37-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84Z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
                  </svg>
                </span>
                <div>
                  <div className="text-sm font-semibold text-foreground font-sans flex items-center gap-2">
                    Google
                    {profile.provider === "google" || profile.provider === "both" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">Connected</span>
                    ) : (
                      <span className="inline-flex text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border">Not connected</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-sans">
                    {profile.provider === "google" || profile.provider === "both"
                      ? `Linked as ${profile.email}`
                      : "Sign in faster with Google"}
                  </p>
                </div>
              </div>
              {(profile.provider === "google" || profile.provider === "both") && profile.avatar_url && (
                <img src={profile.avatar_url} alt="Google avatar" className="w-8 h-8 rounded-full object-cover border border-border" />
              )}
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/30 border-border">
              <span className="w-9 h-9 rounded-full bg-[#0d1f26] text-white flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </span>
              <div>
                <div className="text-sm font-semibold text-foreground font-sans flex items-center gap-2">
                  Email & Password
                  {hasPassword ? (
                    <span className="inline-flex text-[10px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">Active</span>
                  ) : (
                    <span className="inline-flex text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">No password</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-sans">
                  {hasPassword ? "You can sign in with email and password" : "Set a password to enable email sign-in"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border border-border p-4 sm:p-6">
        <h3 className="text-sm font-bold text-foreground mb-4 font-heading flex items-center gap-2">
          <User className="w-4 h-4 text-[#5baab8]" /> Profile
        </h3>
        <div className="space-y-4">
          {profile?.avatar_url && (
            <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl border border-border">
              <img src={profile.avatar_url} alt={profile.name || "Avatar"} className="w-12 h-12 rounded-full object-cover border border-border" />
              <div>
                <div className="text-sm font-semibold text-foreground font-sans">{profile.name}</div>
                <div className="text-xs text-muted-foreground font-sans">{profile.email}</div>
              </div>
            </div>
          )}
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
        {!hasPassword && (
          <div className="mb-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 px-4 py-3 text-sm text-amber-800 dark:text-amber-200 font-sans">
            You&apos;re signed in with Google and haven&apos;t set a password yet. Set one below to also sign in with email and password. Your Google sign-in will keep working.
          </div>
        )}
        <div className="space-y-4">
          {hasPassword ? (
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
          ) : (
            <p className="text-xs text-muted-foreground font-sans">No current password required — you&apos;ll be setting your first password.</p>
          )}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1.5 font-sans">{hasPassword ? "New Password" : "Set Password"}</label>
            <div className="flex items-center gap-3 bg-muted/60 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-[#5baab8]/40 transition-all">
              <input
                type={showNewPw ? "text" : "password"}
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder={hasPassword ? "Enter new password" : "Create a password (min 6 chars)"}
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
            {hasPassword ? "Update Password" : "Set Password"}
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
