"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, Plus, Trash2, CheckCircle2, Loader2, KeyRound, Key, AlertTriangle } from "lucide-react";
import { listApiKeys, createApiKey, deleteApiKey } from "@/lib/api-client";
import type { ApiKey } from "@/lib/api-client";
import { CreateApiKeyDialog } from "./CreateApiKeyDialog";
import { ApiKeyGuide } from "./ApiKeyGuide";

export function ApiKeysTab() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [showCreateInput, setShowCreateInput] = useState(false);
  const [dialogState, setDialogState] = useState<{ name: string; plaintext: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    const res = await listApiKeys();
    if (res.success && res.data) setKeys(res.data.keys);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  async function handleCreate() {
    const name = newKeyName.trim();
    if (!name) return;
    setError(null);
    setCreating(true);
    const res = await createApiKey(name);
    setCreating(false);
    if (res.success && res.data) {
      setNewKeyName("");
      setShowCreateInput(false);
      setDialogState({ name: res.data.key.name, plaintext: res.data.plaintext });
      await fetchKeys();
    } else {
      setError(res.error?.message || "Failed to create key.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Revoke this API key? This cannot be undone.")) return;
    const res = await deleteApiKey(id);
    if (res.success) {
      await fetchKeys();
    } else {
      setError(res.error?.message || "Failed to revoke key.");
    }
  }

  async function copyMasked(id: string, masked: string) {
    await navigator.clipboard.writeText(masked);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function formatDate(iso: string | null): string {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <CreateApiKeyDialog
        open={Boolean(dialogState)}
        onClose={() => setDialogState(null)}
        keyName={dialogState?.name || ""}
        plaintext={dialogState?.plaintext || ""}
      />

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#5baab8] to-[#3d8896] text-white flex items-center justify-center shadow-[0_10px_24px_-10px_rgba(91,170,184,0.8)] shrink-0">
            <KeyRound className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-foreground font-heading tracking-tight">API Keys</h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-sans">Manage your keys for programmatic access.</p>
          </div>
        </div>
        {!showCreateInput ? (
          <button
            onClick={() => setShowCreateInput(true)}
            className="flex items-center justify-center gap-2 bg-gradient-to-br from-[#5baab8] to-[#3d8896] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:shadow-[0_10px_24px_-10px_rgba(91,170,184,0.9)] active:scale-[0.98] transition-all font-sans w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" /> Create Key
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              autoFocus
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="Key name (e.g. Production)"
              className="bg-muted/60 rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#5baab8]/40 font-sans flex-1 sm:w-48"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={handleCreate}
                disabled={creating}
                className="bg-[#0d1f26] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1a3545] dark:bg-white dark:text-[#0d1f26] dark:hover:bg-white/90 transition-colors font-sans disabled:opacity-60"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </button>
              <button
                onClick={() => { setShowCreateInput(false); setNewKeyName(""); }}
                className="text-sm text-muted-foreground hover:text-foreground font-sans px-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-300 bg-red-500/[0.07] border border-red-500/20 rounded-xl px-3.5 py-2.5 font-sans">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/70 p-4 sm:p-5 skeleton-shimmer shadow-[0_1px_2px_rgba(13,31,38,0.04)]"><div className="h-16" /></div>
          ))}
        </div>
      ) : keys.length === 0 ? (
        <div className="bg-card rounded-2xl border border-dashed border-border p-8 sm:p-10 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-[#5baab8]/20 to-[#5baab8]/5 ring-1 ring-[#5baab8]/25 flex items-center justify-center mb-3">
            <Key className="w-5 h-5 text-[#5baab8]" />
          </div>
          <p className="text-sm font-semibold text-foreground font-sans">No API keys yet</p>
          <p className="text-xs text-muted-foreground font-sans mt-1">Create your first key to start making API calls.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map((k) => (
            <div key={k.id} className="group bg-card rounded-2xl border border-border/70 p-4 sm:p-5 shadow-[0_1px_2px_rgba(13,31,38,0.04)] transition-all duration-300 hover:border-[#5baab8]/30 hover:shadow-[0_16px_36px_-20px_rgba(13,31,38,0.28)]">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5baab8]/20 to-[#5baab8]/5 ring-1 ring-[#5baab8]/25 flex items-center justify-center shrink-0">
                    <KeyRound className="w-4 h-4 text-[#5baab8]" />
                  </span>
                  <h4 className="text-sm font-bold text-foreground font-heading truncate">{k.name}</h4>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => copyMasked(k.id, k.masked)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-[#5baab8]"
                    title="Copy masked key"
                  >
                    {copiedId === k.id ? <CheckCircle2 className="w-4 h-4 text-[#5baab8]" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(k.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
                    title="Revoke key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="relative">
                <code className="block bg-muted/60 ring-1 ring-border/60 rounded-xl px-3 sm:px-4 py-2.5 pr-11 text-xs font-mono text-foreground break-all">
                  {k.masked}
                </code>
                <button
                  onClick={() => copyMasked(k.id, k.masked)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-background/80 transition-colors text-muted-foreground sm:hidden"
                  title="Copy masked key"
                >
                  {copiedId === k.id ? <CheckCircle2 className="w-4 h-4 text-[#5baab8]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-sans">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/70 text-muted-foreground">
                  <span className="font-semibold text-foreground/80">Created</span> {formatDate(k.created_at)}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/70 text-muted-foreground">
                  <span className="font-semibold text-foreground/80">Last used</span> {k.last_used_at ? formatDate(k.last_used_at) : "Never"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* How-to-use guide — always shown so users can learn the flow */}
      <ApiKeyGuide />
    </div>
  );
}
