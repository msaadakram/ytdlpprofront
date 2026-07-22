"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, Plus, Trash2, CheckCircle2, Loader2 } from "lucide-react";
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
    <div className="space-y-6">
      <CreateApiKeyDialog
        open={Boolean(dialogState)}
        onClose={() => setDialogState(null)}
        keyName={dialogState?.name || ""}
        plaintext={dialogState?.plaintext || ""}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-foreground font-heading">API Keys</h3>
          <p className="text-xs text-muted-foreground font-sans">Manage your API keys for programmatic access</p>
        </div>
        {!showCreateInput ? (
          <button
            onClick={() => setShowCreateInput(true)}
            className="flex items-center justify-center gap-2 bg-[#0d1f26] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1a3545] transition-colors font-sans w-full sm:w-auto"
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
                className="bg-[#0d1f26] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#1a3545] transition-colors font-sans disabled:opacity-60"
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
        <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 font-sans">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-4 sm:p-5 animate-pulse"><div className="h-16" /></div>
          ))}
        </div>
      ) : keys.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 sm:p-10 text-center">
          <p className="text-sm text-muted-foreground font-sans">No API keys yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map((k) => (
            <div key={k.id} className="bg-card rounded-xl border border-border p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-foreground font-heading truncate">{k.name}</h4>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => copyMasked(k.id, k.masked)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                    title="Copy masked key"
                  >
                    {copiedId === k.id ? <CheckCircle2 className="w-4 h-4 text-[#5baab8]" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(k.id)}
                    className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
                    title="Revoke key"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <code className="block bg-muted/60 rounded-lg px-3 sm:px-4 py-2.5 text-xs font-mono text-foreground break-all">
                {k.masked}
              </code>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground font-sans">
                <span>Created: {formatDate(k.created_at)}</span>
                <span>Last used: {k.last_used_at ? formatDate(k.last_used_at) : "Never"}</span>
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
