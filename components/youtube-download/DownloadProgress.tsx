"use client";

import { motion } from "motion/react";

type DownloadProgressProps = {
  progress: number;
  statusText: string;
  downloadSpeed: string;
  downloadEta: string | number | null;
  downloadedBytes: number;
  totalBytes: number;
};

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function DownloadProgress({
  progress, statusText, downloadSpeed, downloadEta, downloadedBytes, totalBytes,
}: DownloadProgressProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-5"
    >
      <div className="flex items-center gap-4 mb-2">
        <span className="text-2xl font-bold tabular-nums text-[#0d1f26] font-mono">
          {Math.round(progress)}%
        </span>
        <div className="flex-1">
          <div className="w-full bg-[#eef6f8] rounded-full h-2.5 overflow-hidden">
            <motion.div
              className="h-full rounded-full relative overflow-hidden"
              style={{
                background: `linear-gradient(90deg, #5baab8, #3d8896)`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(progress, 4)}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  transform: "skewX(-20deg)",
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-muted-foreground">
        {downloadedBytes > 0 && totalBytes > 0 && (
          <span className="tabular-nums">
            {formatBytes(downloadedBytes)} / {formatBytes(totalBytes)}
          </span>
        )}
        {downloadSpeed && (
          <span className="tabular-nums flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5baab8] animate-pulse" />
            {downloadSpeed}
          </span>
        )}
        {downloadEta != null && downloadEta !== "" && (
          <span className="tabular-nums">
            ETA {typeof downloadEta === "number" ? `${Math.round(downloadEta)}s` : String(downloadEta)}
          </span>
        )}
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-sans">
          {statusText}
        </span>
      </div>
    </motion.div>
  );
}
