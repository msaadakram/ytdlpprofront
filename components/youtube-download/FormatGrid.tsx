"use client";

import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import type { DownloadType, Format } from "@/lib/constants";
import type { ApiFormatInfo } from "@/lib/api-client";

type GridFormat = ApiFormatInfo | Format;

type FormatGridProps = {
  formats: GridFormat[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  type: DownloadType;
  brandColor?: string;
};

/** Normalise either static (Format) or backend (ApiFormatInfo) into display fields. */
function normalize(fmt: GridFormat, type: DownloadType) {
  const isApi = "format_id" in fmt;
  const api = fmt as ApiFormatInfo;
  const ext = fmt.ext;
  const height = isApi ? api.height : undefined;
  const fps = isApi ? api.fps : undefined;
  const abr = isApi ? api.abr : undefined;
  const tbr = isApi ? api.tbr : undefined;
  const filesizeStr = isApi ? api.filesize_str : "";
  const qualityLabel = isApi ? api.quality_label ?? null : (fmt as Format).quality ?? null;

  let label: string;
  if (type === "video") {
    if (qualityLabel) {
      label = qualityLabel;
    } else if (height) {
      label = `${height}p${fps && fps !== 30 ? ` ${fps}` : ""}`;
    } else {
      label = "Video";
    }
  } else if (type === "audio") {
    label = `${ext.toUpperCase()} Audio`;
  } else {
    label = ext.toUpperCase();
  }

  let sub: string;
  if (type === "video") {
    const parts: string[] = [];
    if (fps && fps !== 30) parts.push(`${fps}fps`);
    if (height) parts.push(`${height}p`);
    if (filesizeStr && filesizeStr !== "0 B") parts.push(`~${filesizeStr}`);
    sub = parts.join(" · ");
  } else if (type === "audio") {
    const parts: string[] = [];
    const rate = abr ?? tbr;
    if (rate) parts.push(`${Math.round(rate)} kbps`);
    if (filesizeStr && filesizeStr !== "0 B") parts.push(`~${filesizeStr}`);
    sub = parts.join(" · ");
  } else {
    sub = filesizeStr && filesizeStr !== "0 B" ? `~${filesizeStr}` : "";
  }

  return { ext, label, sub, key: isApi ? api.format_id || ext : ext };
}

function videoQualityBars(height?: number): number {
  if (!height) return 1;
  if (height >= 2160) return 4;
  if (height >= 1440) return 3;
  if (height >= 720) return 2;
  return 1;
}

function audioQualityBars(abr?: number, tbr?: number): number {
  const rate = abr ?? tbr ?? 0;
  if (rate >= 256) return 3;
  if (rate >= 128) return 2;
  return 1;
}

function qualityBars(fmt: GridFormat, type: DownloadType): number {
  const isApi = "format_id" in fmt;
  if (type === "video") return videoQualityBars(isApi ? (fmt as ApiFormatInfo).height : undefined);
  if (type === "audio") return audioQualityBars(isApi ? (fmt as ApiFormatInfo).abr : undefined, isApi ? (fmt as ApiFormatInfo).tbr : undefined);
  return 2;
}

export function FormatGrid({ formats, selectedIndex, onSelect, type, brandColor = "#5baab8" }: FormatGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
      {formats.map((fmt, i) => {
        const selected = i === selectedIndex;
        const bars = qualityBars(fmt, type);
        const { ext, label, sub, key } = normalize(fmt, type);
        return (
          <motion.button
            key={`${key}-${i}`}
            onClick={() => onSelect(i)}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            layout
             className="relative flex flex-col items-start gap-1 rounded-xl border p-2.5 sm:p-3 text-left transition-all duration-200"
            style={{
              backgroundColor: selected ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)",
              borderColor: selected ? brandColor : undefined,
              boxShadow: selected ? `0 0 0 2px ${brandColor}33` : undefined,
            }}
            onMouseEnter={(e) => {
              if (!selected) {
                e.currentTarget.style.borderColor = `${brandColor}66`;
              }
            }}
            onMouseLeave={(e) => {
              if (!selected) {
                e.currentTarget.style.borderColor = "";
              }
            }}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-md bg-[#eef6f8] font-mono"
                style={{ color: brandColor }}>
                {ext}
              </span>
              {selected && (
                <motion.span
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 14 }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: brandColor }} />
                </motion.span>
              )}
            </div>

            <span className="text-sm font-semibold text-foreground font-sans leading-tight mt-0.5">
              {label}
            </span>

            {type !== "thumbnail" && type !== "transcript" && (
              <div className="flex items-center gap-0.5 mt-1">
                {Array.from({ length: bars }).map((_, b) => (
                  <motion.span
                    key={b}
                    initial={{ width: 0 }}
                    animate={{ width: b === 0 ? "0.75rem" : b === 1 ? "1.25rem" : b === 2 ? "1.75rem" : "2.25rem" }}
                    transition={{ duration: 0.4, delay: i * 0.05 + b * 0.08, ease: "easeOut" }}
                    className="h-1 rounded-full"
                    style={{ backgroundColor: selected ? brandColor : "#d4ecf0" }}
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
              {sub}
            </motion.span>
          </motion.button>
        );
      })}
    </div>
  );
}

