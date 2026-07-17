"use client";

import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import type { DownloadType, Format } from "@/lib/constants";

type FormatGridProps = {
  formats: Format[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  type: DownloadType;
};

function qualityBars(format: Format, type: DownloadType): number {
  if (type === "video") {
    const q = format.quality || "";
    if (q.includes("2160") || q.includes("4K")) return 4;
    if (q.includes("1080")) return 3;
    if (q.includes("720")) return 2;
    if (q.includes("480") || q.includes("360")) return 1;
    return 2;
  }
  if (type === "audio") {
    const l = format.label;
    if (l.includes("Lossless") || l.includes("Uncompressed") || l.includes("320")) return 3;
    if (l.includes("256")) return 2;
    if (l.includes("192")) return 1;
    return 2;
  }
  return 2;
}

function resolutionLabel(format: Format, type: DownloadType): string {
  if (type === "video") return format.quality || "";
  if (type === "audio") {
    const m = format.label.match(/•\s*(.+)/);
    return m ? m[1].trim() : "";
  }
  return format.quality ? format.quality.replace("maxresdefault", "1920×1080").replace("hqdefault", "480×360") : "";
}

export function FormatGrid({ formats, selectedIndex, onSelect, type }: FormatGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {formats.map((fmt, i) => {
        const selected = i === selectedIndex;
        const bars = qualityBars(fmt, type);
        return (
          <motion.button
            key={i}
            onClick={() => onSelect(i)}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className={`relative flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all ${
              selected
                ? "border-[#5baab8] ring-2 ring-[#5baab8]/20 bg-[#eef6f8]"
                : "border-border bg-white hover:border-[#5baab8]/40 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-[#eef6f8] text-[#5baab8] font-mono">
                {fmt.ext}
              </span>
              {selected && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5baab8]" />
                </motion.span>
              )}
            </div>

            <span className="text-sm font-semibold text-foreground font-sans leading-tight mt-0.5">
              {fmt.label.split("•")[0]?.trim()}
              <span className="text-muted-foreground font-normal">
                {" "}
                {fmt.label.includes("•") ? `• ${fmt.label.split("•")[1]?.trim()}` : ""}
              </span>
            </span>

            {type !== "thumbnail" && (
              <div className="flex items-center gap-0.5 mt-1">
                {Array.from({ length: bars }).map((_, b) => (
                  <span
                    key={b}
                    className={`h-1 rounded-full transition-all ${
                      selected ? "bg-[#5baab8]" : "bg-[#d4ecf0]"
                    } ${b === 0 ? "w-3" : b === 1 ? "w-5" : b === 2 ? "w-7" : "w-9"}`}
                  />
                ))}
              </div>
            )}

            <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
              {resolutionLabel(fmt, type)}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
