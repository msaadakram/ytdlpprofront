"use client";

import { BarChart2 } from "lucide-react";

export function EmptyState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="relative mb-4">
        <div aria-hidden className="absolute inset-0 -m-3 rounded-full border border-[#5baab8]/15" />
        <div aria-hidden className="absolute inset-0 -m-1.5 rounded-full border border-[#5baab8]/25" />
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5baab8]/20 to-[#5baab8]/5 ring-1 ring-[#5baab8]/25 flex items-center justify-center">
          <BarChart2 className="w-5 h-5 text-[#5baab8]" />
        </div>
      </div>
      <p className="max-w-xs text-sm text-muted-foreground font-sans leading-relaxed">
        {message || "No data yet. Start downloading to see your stats here."}
      </p>
    </div>
  );
}
