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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground font-heading">API Key Created</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-xl p-3 mb-4">
          <p className="text-xs text-yellow-800 dark:text-yellow-200 font-sans">
            <strong>Important:</strong> Copy this key now. You won't be able to see it again.
          </p>
        </div>

        <div className="mb-2">
          <p className="text-xs text-muted-foreground font-sans mb-1">Name</p>
          <p className="text-sm font-medium text-foreground font-sans">{keyName}</p>
        </div>

        <div className="mb-4">
          <p className="text-xs text-muted-foreground font-sans mb-1">Key</p>
          <code className="block bg-muted/60 rounded-lg px-3 sm:px-4 py-2.5 text-xs font-mono text-foreground break-all">
            {plaintext}
          </code>
        </div>

        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 bg-[#0d1f26] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-[#1a3545] transition-colors font-sans"
        >
          {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy Key"}
        </button>
      </div>
    </div>
  );
}
