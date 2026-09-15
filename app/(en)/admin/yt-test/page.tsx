"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, FlaskConical, Loader2, RefreshCw, Search } from "lucide-react";

interface PickedUser {
  id: string;
  email: string;
  plan?: string;
}

interface TestResult {
  user: { id: string; email: string; plan: string; disabled: boolean; email_verified: boolean | null };
  quota: { plan: string; name: string; per_minute: number; monthly_quota: number; used_this_month: number; remaining: number; resets_at: string } | null;
  youtube: {
    ok: boolean;
    title?: string | null;
    id?: string | null;
    duration?: number | null;
    uploader?: string | null;
    formats_count?: number;
    extractor?: string | null;
    error?: string;
    code?: string | null;
    elapsed_ms: number;
    cookie_source: string;
    proxy: boolean;
  };
  note: string;
}

function authHeaders(extra: Record<string, string> = {}) {
  const token = localStorage.getItem("admin_token");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...extra };
}

export default function YoutubeTestPage() {
  const [query, setQuery] = useState("");
  const [ searching, setSearching ] = useState(false);
  const [ candidates, setCandidates ] = useState<PickedUser[]>([]);
  const [ user, setUser ] = useState<PickedUser | null>(null);
  const [ url, setUrl ] = useState("");
  const [ running, setRunning ] = useState(false);
  const [ result, setResult ] = useState<TestResult | null>(null);
  const [ error, setError ] = useState<string | null>(null);

  const searchUsers = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setCandidates([]);
    try {
      const res = await fetch(`/api/admin/proxy/users?search=${encodeURIComponent(query.trim())}&limit=10`, {
        headers: authHeaders(),
      });
      const json = await res.json();
      if (json.success) setCandidates(json.data.users || []);
      else setError(json.error?.message || "User search failed");
    } catch {
      setError("User search failed — could not reach backend");
    } finally {
      setSearching(false);
    }
  };

  const runTest = async () => {
    if (!user || !url.trim() || running) return;
    setRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/admin/proxy/test/youtube", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ user_id: user.id, url: url.trim() }),
      });
      const json = await res.json();
      if (json.success) setResult(json.data as TestResult);
      else setError(json.error?.message || "Test failed");
    } catch {
      setError("Test failed — could not reach backend (extraction can take up to ~45s, try again)");
    } finally {
      setRunning(false);
    }
  };

  const yt = result?.youtube;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground font-heading flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-[#5baab8]" /> YouTube Test-as-User
          </h1>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">
            Replay the exact YouTube extraction a user gets — same cookies, proxy &amp; player clients. Info-only: no job, quota untouched.
          </p>
        </div>
      </div>

      {/* 1. Pick user */}
      <div className="bg-card rounded-xl border border-border p-4 sm:p-6 mb-4">
        <h2 className="text-sm font-bold text-foreground font-heading mb-3">1. Pick the user to test as</h2>
        {user ? (
          <div className="flex items-center justify-between gap-2 rounded-xl bg-[#5baab8]/10 border border-[#5baab8]/25 px-3.5 py-2.5">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{user.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.plan || "free"} plan</p>
            </div>
            <button onClick={() => { setUser(null); setResult(null); }} className="text-xs font-semibold text-muted-foreground hover:text-foreground shrink-0">
              Change
            </button>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchUsers()}
                placeholder="Search by email or name…"
                className="flex-1 bg-input-background border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-[#5baab8]/50 focus:border-[#5baab8]/50 transition-all"
              />
              <button
                onClick={searchUsers}
                disabled={searching || !query.trim()}
                className="inline-flex items-center gap-2 bg-[#5baab8] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4a99a7] transition-colors disabled:opacity-50 shrink-0"
              >
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Search
              </button>
            </div>
            {candidates.length > 0 && (
              <div className="mt-3 space-y-2">
                {candidates.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { setUser(c); setCandidates([]); setQuery(""); }}
                    className="w-full flex items-center justify-between gap-2 rounded-xl border border-border px-3.5 py-2.5 text-left hover:border-[#5baab8]/50 hover:bg-[#5baab8]/5 transition-colors"
                  >
                    <span className="text-sm font-medium text-foreground truncate">{c.email}</span>
                    <span className="text-xs text-muted-foreground capitalize shrink-0">{c.plan || "free"}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* 2. URL + run */}
      <div className="bg-card rounded-xl border border-border p-4 sm:p-6 mb-4">
        <h2 className="text-sm font-bold text-foreground font-heading mb-3">2. YouTube URL &amp; run</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/shorts/…"
            spellCheck={false}
            className="flex-1 bg-input-background border border-border rounded-xl px-3.5 py-2.5 text-sm font-mono text-foreground placeholder:text-muted-foreground/70 placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-[#5baab8]/50 focus:border-[#5baab8]/50 transition-all"
          />
          <button
            onClick={runTest}
            disabled={running || !user || !url.trim()}
            className="inline-flex items-center justify-center gap-2 bg-[#5baab8] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#4a99a7] transition-colors disabled:opacity-50 shrink-0"
          >
            {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <FlaskConical className="w-4 h-4" />}
            {running ? "Testing… (up to ~45s)" : "Run test"}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl text-sm mb-4 border bg-destructive/10 text-destructive border-destructive/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="break-words min-w-0">{error}</span>
        </div>
      )}

      {result && yt && (
        <div className="space-y-4">
          <div className={`flex items-start gap-2 p-4 rounded-xl text-sm border ${yt.ok ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20"}`}>
            {yt.ok ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
            <div className="min-w-0">
              {yt.ok ? (
                <>
                  <p className="font-bold break-words">{yt.title}</p>
                  <p className="text-xs opacity-80 mt-1">
                    {yt.uploader || "unknown uploader"} · {yt.duration != null ? `${Math.floor(yt.duration / 60)}:${String(Math.floor((yt.duration || 0) % 60)).padStart(2, "0")}` : "live/unknown length"} · {yt.formats_count} formats · {(yt.elapsed_ms / 1000).toFixed(1)}s
                  </p>
                </>
              ) : (
                <>
                  <p className="font-bold">Extraction failed — this is what the user hits</p>
                  <p className="text-xs mt-1 break-words">{yt.error}</p>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans mb-2">Request path</h3>
              <dl className="space-y-1.5 text-sm font-sans">
                <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Cookies</dt><dd className="font-semibold text-foreground">{yt.cookie_source}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Proxy</dt><dd className="font-semibold text-foreground">{yt.proxy ? "on" : "off"}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Elapsed</dt><dd className="font-semibold text-foreground">{(yt.elapsed_ms / 1000).toFixed(1)}s</dd></div>
                {yt.extractor && <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Extractor</dt><dd className="font-semibold text-foreground">{yt.extractor}</dd></div>}
              </dl>
            </div>
            <div className="bg-card rounded-xl border border-border p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-sans mb-2">User context</h3>
              <dl className="space-y-1.5 text-sm font-sans">
                <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Plan</dt><dd className="font-semibold text-foreground capitalize">{result.user.plan}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Verified</dt><dd className="font-semibold text-foreground">{String(result.user.email_verified)}</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Disabled</dt><dd className="font-semibold text-foreground">{result.user.disabled ? "yes" : "no"}</dd></div>
                {result.quota && <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Quota used</dt><dd className="font-semibold text-foreground">{result.quota.used_this_month.toLocaleString()} / {result.quota.monthly_quota.toLocaleString()}</dd></div>}
              </dl>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground font-sans flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3 shrink-0" /> {result.note}
          </p>
        </div>
      )}
    </div>
  );
}
