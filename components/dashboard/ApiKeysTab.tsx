"use client";

import { useState } from "react";
import { Copy, Plus, Eye, EyeOff, Trash2, CheckCircle2 } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
}

const defaultKeys: ApiKey[] = [
  { id: "1", name: "Production", key: "fw_live_2xK8m9pQ4rL7vN3wR6tY1bH5", created: "Feb 12, 2025", lastUsed: "2 min ago" },
  { id: "2", name: "Development", key: "fw_test_9aB3cD5eF7gH1iJ2kL4mN6oP", created: "Jan 28, 2025", lastUsed: "3 hours ago" },
];

export function ApiKeysTab() {
  const [keys, setKeys] = useState<ApiKey[]>(defaultKeys);
  const [showKeys, setShowKeys] = useState<Set<string>>(new Set(["1"]));
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function toggleKeyVisibility(id: string) {
    setShowKeys((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function copyKey(id: string, key: string) {
    await navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function deleteKey(id: string) {
    setKeys((prev) => prev.filter((k) => k.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-foreground font-heading">API Keys</h3>
          <p className="text-xs text-muted-foreground font-sans">Manage your API keys for programmatic access</p>
        </div>
        <button className="flex items-center gap-2 bg-[#0d1f26] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1a3545] transition-colors font-sans">
          <Plus className="w-4 h-4" /> Create Key
        </button>
      </div>

      <div className="space-y-3">
        {keys.map((k) => (
          <div key={k.id} className="bg-white rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-foreground font-heading">{k.name}</h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleKeyVisibility(k.id)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                >
                  {showKeys.has(k.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => copyKey(k.id, k.key)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
                >
                  {copiedId === k.id ? <CheckCircle2 className="w-4 h-4 text-[#5baab8]" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => deleteKey(k.id)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <code className="block bg-[#eef6f8] rounded-lg px-4 py-2.5 text-xs font-mono text-foreground">
              {showKeys.has(k.id) ? k.key : `${k.key.slice(0, 12)}${"•".repeat(20)}`}
            </code>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground font-sans">
              <span>Created: {k.created}</span>
              <span>Last used: {k.lastUsed}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
