"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

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
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Cookies
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">{name} Cookie</h1>
      <p className="text-sm text-gray-500 mb-6">
        Paste a Netscape-format cookies.txt file for {name}. This cookie will be used when downloading {name} content.
      </p>

      {status && (
        <div
          className={`flex items-center gap-2 p-3 rounded-lg text-sm mb-4 ${
            status.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {status.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          {status.message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cookes.txt Content
          </label>
          <textarea
            value={cookieData}
            onChange={(e) => setCookieData(e.target.value)}
            rows={16}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#5baab8]"
            placeholder={`Paste your ${name} cookies.txt here...

Example:
.youtube.com	TRUE	/	FALSE	1728000000	CONSENT	YES+...
`}
          />
          <p className="text-xs text-gray-400 mt-1">
            Export from browser extensions like "Get cookies.txt" or "cookies.txt export"
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5baab8]"
            placeholder="e.g. Premium account cookies, expires Aug 2026"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#5baab8] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#4a99a7] transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Cookie"}
          </button>
          <button
            onClick={handleTest}
            disabled={testLoading || !cookieData}
            className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {testLoading ? "Testing..." : "Test Cookie"}
          </button>
        </div>

        {testResult && (
          <div
            className={`flex items-start gap-2 p-3 rounded-lg text-sm ${
              testResult.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
          >
            {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            <span>{testResult.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
