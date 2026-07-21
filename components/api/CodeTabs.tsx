"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./CodeBlock";

export type Snippet = {
  /** Stable id used as React key + tab state. */
  id: string;
  /** Short label for the tab (e.g. "Python", "cURL"). */
  label: string;
  /** Optional filename shown inside the code panel header (e.g. "info.py"). */
  filename?: string;
  /** Language badge text shown when no filename is present (e.g. "bash"). */
  language?: string;
  /** The code string. */
  code: string;
};

interface CodeTabsProps {
  snippets: Snippet[];
  /** Optional id used to persist the active tab in a parent-driven way. */
  defaultId?: string;
  className?: string;
}

/**
 * Multi-language code switcher. Renders a horizontally-scrollable pill bar
 * (mobile-friendly) above a single CodeBlock showing the active snippet.
 */
export function CodeTabs({ snippets, defaultId, className }: CodeTabsProps) {
  const [activeId, setActiveId] = useState<string>(defaultId || snippets[0]?.id || "");
  const active = snippets.find((s) => s.id === activeId) || snippets[0];

  if (!active) return null;

  return (
    <div className={cn("w-full", className)}>
      {/* Tab bar — horizontally scrollable on small screens */}
      <div
        role="tablist"
        aria-label="Code language"
        className="flex items-center gap-1.5 overflow-x-auto p-1 bg-muted/60 rounded-t-xl border border-b-0 border-border scrollbar-thin"
      >
        {snippets.map((s) => {
          const isActive = s.id === active.id;
          return (
            <button
              key={s.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveId(s.id)}
              className={cn(
                "shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors font-sans whitespace-nowrap",
                isActive
                  ? "bg-[#0d1f26] text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      {/* Active code block — square top corners to sit under the tab bar */}
      <CodeBlock
        code={active.code}
        language={active.language}
        filename={active.filename}
        className="rounded-t-none"
      />
    </div>
  );
}
