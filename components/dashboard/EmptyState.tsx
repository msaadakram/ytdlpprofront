"use client";

import { BarChart2 } from "lucide-react";

export function EmptyState({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-[#eef6f8] flex items-center justify-center mb-3">
        <BarChart2 className="w-5 h-5 text-[#5baab8]" />
      </div>
      <p className="text-sm text-muted-foreground font-sans">
        {message || "No data yet. Start downloading to see your stats here."}
      </p>
    </div>
  );
}
