"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

const platformNames: Record<string, string> = {
  youtube: "YouTube", tiktok: "TikTok", instagram: "Instagram",
  facebook: "Facebook", vimeo: "Vimeo", twitch: "Twitch",
  dailymotion: "Dailymotion", reddit: "Reddit", soundcloud: "SoundCloud",
  kick: "Kick", snapchat: "Snapchat", linkedin: "LinkedIn",
  pinterest: "Pinterest", niconico: "Niconico",
};

export default function CookieEditorPage() {
  const params = useParams();
  const router = useRouter();
  const platform = params.platform as string;
  const [cookieData, setCookieData] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (!platform) return;
    const token = localStorage.getItem("admin_token");
    fetch(`/api/admin/proxy/cookies/${platform}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setCookieData(res.data.cookie_data || "");
          setNotes(res.data.notes || "");
        }
      })
      .catch(() => {});
  }, [platform]);

  const handleSave = async () => {
    setLoading(true);
    setStatus(null);
    const token = localStorage.getItem("admin_token");
    const res = await fetch("/api/admin/proxy/cookies", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ platform, cookie_data: cookieData, notes: notes || undefined }),
    });
    const json = await res.json();
    setLoading(false);
    setStatus({
      type: json.success ? "success" : "error",
      message: json.success ? "Cookie saved successfully" : json.error?.message || "Failed to save",
    });
  };

  const handleTest = async () => {
    setTestLoading(true);
    setTestResult(null);
    const token = localStorage.getItem("admin_token");
    const res = await fetch(`/api/admin/proxy/cookies/${platform}/test`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json = await res.json();
    setTestLoading(false);
    setTestResult({
      success: json.success,
      message: json.success
        ? `Working — fetched: "${json.data.title}"`
        : json.error?.message || "Test failed",
    });
  };

  const name = platformNames[platform] || platform;

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => router.push("/admin/cookies")}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Cookies
      </button>

      <h1 className="text-xl sm:text-2xl font-bold text-foreground font-heading mb-1">{name} Cookie</h1>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        Paste a Netscape-format cookies.txt file for {name}. This cookie will be used when downloading {name} content.
      </p>

      {status && (
        <div
          className={`flex items-center gap-2 p-3 rounded-xl text-sm mb-4 border ${
            status.type === "success"
              ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
              : "bg-destructive/10 text-destructive border-destructive/20"
          }`}
        >
          {status.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {status.message}
        </div>
      )}

      <div className="bg-card rounded-xl border border-border p-4 sm:p-6 space-y-5">
        <div>
          <label htmlFor="cookie-data" className="block text-sm font-medium text-foreground mb-2">
            Cookies.txt Content
          </label>
          <textarea
            id="cookie-data"
            value={cookieData}
            onChange={(e) => setCookieData(e.target.value)}
            rows={12}
            className="w-full bg-input-background border border-border rounded-xl p-3 text-xs sm:text-sm font-mono text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-[#5baab8]/50 focus:border-[#5baab8]/50 transition-all"
            placeholder={`Paste your ${name} cookies.txt here...

Example:
.youtube.com	TRUE	/	FALSE	1728000000	CONSENT	YES+...
`}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Export from browser extensions like &quot;Get cookies.txt&quot; or &quot;cookies.txt export&quot;
          </p>
        </div>

        <div>
          <label htmlFor="cookie-notes" className="block text-sm font-medium text-foreground mb-2">
            Notes <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          <input
            id="cookie-notes"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-input-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-[#5baab8]/50 focus:border-[#5baab8]/50 transition-all"
            placeholder="e.g. Premium account cookies, expires Aug 2026"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1 border-t border-border/60">
          <div className="flex flex-col sm:flex-row gap-3 flex-1 pt-4 sm:pt-1">
            <button
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-[#5baab8] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4a99a7] transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? "Saving..." : "Save Cookie"}
            </button>
            <button
              onClick={handleTest}
              disabled={testLoading || !cookieData}
              className="inline-flex items-center justify-center gap-2 bg-card border border-border text-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-muted transition-colors disabled:opacity-50"
            >
              {testLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {testLoading ? "Testing..." : "Test Cookie"}
            </button>
          </div>
        </div>

        {testResult && (
          <div
            className={`flex items-start gap-2 p-3 rounded-xl text-sm border ${
              testResult.success
                ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20"
                : "bg-destructive/10 text-destructive border-destructive/20"
            }`}
          >
            {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            <span className="break-words min-w-0">{testResult.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
