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
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            layout
            className={`relative flex flex-col items-start gap-1 rounded-xl border p-3 text-left transition-all duration-200 ${
              selected
                ? "bg-white/90 backdrop-blur-sm border-[#5baab8] ring-2 ring-[#5baab8]/20 shadow-md"
                : "bg-white/70 backdrop-blur-sm border-border hover:border-[#5baab8]/40 hover:shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-[#eef6f8] text-[#5baab8] font-mono">
                {fmt.ext}
              </span>
              {selected && (
                <motion.span
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 14 }}
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
                  <motion.span
                    key={b}
                    initial={{ width: 0 }}
                    animate={{ width: b === 0 ? "0.75rem" : b === 1 ? "1.25rem" : b === 2 ? "1.75rem" : "2.25rem" }}
                    transition={{ duration: 0.4, delay: i * 0.05 + b * 0.08, ease: "easeOut" }}
                    className={`h-1 rounded-full ${
                      selected ? "bg-[#5baab8]" : "bg-[#d4ecf0]"
                    }`}
                  />
                ))}
              </div>
            )}

            <motion.span
              className="text-[10px] text-muted-foreground font-mono mt-0.5"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 + 0.15 }}
            >
              {resolutionLabel(fmt, type)}
            </motion.span>
          </motion.button>
        );
      })}
    </div>
  );
}
