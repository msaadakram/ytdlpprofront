"use client";

import { useState } from "react";
import { X, Copy, CheckCircle2 } from "lucide-react";

interface CreateApiKeyDialogProps {
  open: boolean;
  onClose: () => void;
  keyName: string;
  plaintext: string;
}

export function CreateApiKeyDialog({ open, onClose, keyName, plaintext }: CreateApiKeyDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  async function handleCopy() {
    await navigator.clipboard.writeText(plaintext);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-[#0d1a22] rounded-3xl shadow-[0_32px_80px_-24px_rgba(13,31,38,0.55)] max-w-md w-full p-5 sm:p-6 ring-1 ring-black/5 dark:ring-white/10">
        <div aria-hidden className="absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-gradient-to-r from-[#5baab8] via-[#8fd3df] to-[#3d8896]" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-foreground font-heading flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5baab8]/20 to-[#5baab8]/5 ring-1 ring-[#5baab8]/25 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#5baab8]" />
            </span>
            API Key Created
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-start gap-2.5 bg-amber-50 dark:bg-yellow-950/30 border border-amber-200/70 dark:border-yellow-900/60 rounded-xl p-3 mb-4">
          <span className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          </span>
          <p className="text-xs text-amber-800 dark:text-yellow-200 font-sans leading-relaxed">
            <strong>Important:</strong> Copy this key now. You won&apos;t be able to see it again.
          </p>
        </div>

        <div className="mb-3">
          <p className="text-xs font-semibold text-muted-foreground font-sans mb-1 uppercase tracking-wide">Name</p>
          <p className="text-sm font-medium text-foreground font-sans bg-muted/60 rounded-xl px-3 py-2">{keyName}</p>
        </div>

        <div className="mb-5">
          <p className="text-xs font-semibold text-muted-foreground font-sans mb-1 uppercase tracking-wide">Key</p>
          <code className="block bg-muted/60 ring-1 ring-border/60 rounded-xl px-3 sm:px-4 py-2.5 text-xs font-mono text-foreground break-all">
            {plaintext}
          </code>
        </div>

        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-[#5baab8] to-[#3d8896] text-white text-sm font-bold px-4 py-3 rounded-xl hover:shadow-[0_10px_24px_-10px_rgba(91,170,184,0.9)] active:scale-[0.98] transition-all font-sans"
        >
          {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy Key"}
        </button>
      </div>
    </div>
  );
}
