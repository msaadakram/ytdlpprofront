"use client";

import { useState } from "react";
import { Copy, CheckCircle2 } from "lucide-react";

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative group">
      <pre className="bg-[#0d1f26] text-white/90 text-xs leading-relaxed p-4 rounded-xl overflow-x-auto font-mono">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all opacity-0 group-hover:opacity-100"
      >
        {copied ? <CheckCircle2 className="w-4 h-4 text-[#5baab8]" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
}
