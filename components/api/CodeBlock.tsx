"use client";

import { useState, useMemo } from "react";
import { Copy, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { highlightCode } from "@/lib/syntax-highlight";

interface CodeBlockProps {
  code: string;
  /** Language label shown as a badge in the top-left (e.g. "python", "bash"). */
  language?: string;
  /** Optional filename shown next to the language badge (e.g. "example.py"). */
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, language, filename, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const highlighted = useMemo(() => highlightCode(code, language), [code, language]);

  async function handleCopy() {
    // Modern clipboard only — the legacy execCommand textarea fallback is
    // removed (deprecated, flaky on mobile, and unnecessary on HTTPS).
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
      return;
    }
    setTimeout(() => setCopied(false), 2000);
  }

  const hasHeader = Boolean(language || filename);

  return (
    <div className={cn("relative group rounded-xl overflow-hidden bg-[#0d1f26]", className)}>
      {hasHeader && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-white/[0.03]">
          <span className="flex gap-1.5" aria-hidden>
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
          </span>
          {filename && (
            <span className="ml-1 text-xs font-mono text-white/70 truncate">{filename}</span>
          )}
          {language && !filename && (
            <span className="ml-1 text-[10px] font-bold uppercase tracking-wider font-mono text-white/50">
              {language}
            </span>
          )}
        </div>
      )}
      <pre className="text-white/90 text-xs leading-relaxed p-4 overflow-x-auto font-mono">
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
      <button
        onClick={handleCopy}
        aria-label="Copy code"
        className={cn(
          "absolute right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all md:opacity-0 md:group-hover:opacity-100",
          hasHeader ? "top-[2.6rem]" : "top-3",
        )}
      >
        {copied ? <CheckCircle2 className="w-4 h-4 text-[#5baab8]" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}
