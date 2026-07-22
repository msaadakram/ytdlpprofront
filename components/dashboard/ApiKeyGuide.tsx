"use client";

import Link from "next/link";
import { ExternalLink, Info, Terminal } from "lucide-react";
import { CodeTabs } from "@/components/api/CodeTabs";
import { buildAuthSnippets, buildQuickStartSnippets } from "@/lib/api-examples";

/**
 * "How to use your API key" panel, shown inside the dashboard API Keys tab.
 * Walks the user through authentication and a full end-to-end flow using
 * copy-paste examples in 6 languages.
 */
export function ApiKeyGuide() {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#5baab8]/15 flex items-center justify-center shrink-0">
          <Terminal className="w-4 h-4 text-[#5baab8]" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground font-heading">
            How to use your API key
          </h3>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">
            Your key authenticates every request. Send it as a <code className="font-mono text-[11px] bg-muted px-1 py-0.5 rounded">Bearer</code> token.
          </p>
        </div>
      </div>

      {/* Warning: replace placeholder with your real key */}
      <div className="flex items-start gap-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-xl p-3.5">
        <Info className="w-4 h-4 text-yellow-700 dark:text-yellow-400 mt-0.5 shrink-0" />
        <p className="text-xs text-yellow-800 dark:text-yellow-200 font-sans leading-relaxed">
          Replace <code className="font-mono bg-yellow-100 dark:bg-yellow-900/50 px-1 py-0.5 rounded">df_live_YOUR_API_KEY</code> below
          with the key you created above. The full key was shown only once at creation — copy it from the dialog before closing it.
        </p>
      </div>

      {/* Auth header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono mb-2">
          1. Authenticate
        </p>
        <CodeTabs snippets={buildAuthSnippets()} />
      </div>

      {/* End-to-end flow */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground font-mono mb-2">
          2. Full download flow
        </p>
        <p className="text-xs text-muted-foreground font-sans mb-3">
          Get formats → start download → poll until done → fetch the result URL. Copy-paste and run.
        </p>
        <CodeTabs snippets={buildQuickStartSnippets()} />
      </div>

      <div className="pt-2 border-t border-border">
        <Link
          href="/api-docs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-[#5baab8] transition-colors font-sans"
        >
          Full API documentation
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
