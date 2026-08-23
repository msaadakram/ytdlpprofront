"use client";

import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Copy,
  Download,
  Search,
  Clock,
  FileText,
  CheckCircle2,
  X,
  AlignLeft,
  Captions,
  SearchX,
  Type,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import type { TranscriptSegment } from "@/lib/api-client";
import { triggerDownload } from "@/lib/api-client";

type TranscriptViewerProps = {
  transcript: string;
  segments?: TranscriptSegment[] | null;
  title: string;
  brandColor: string;
  downloadUrl?: string;
  filename?: string;
  jsonDownloadUrl?: string;
  jsonFilename?: string;
};

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** SRT requires strict HH:MM:SS,mmm timestamps. */
function toSrtTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds - Math.floor(seconds)) * 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / wordsPerMinute));
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function TranscriptViewer({
  transcript,
  segments,
  title,
  brandColor,
  downloadUrl,
  filename,
  jsonDownloadUrl,
  jsonFilename,
}: TranscriptViewerProps) {
  const t = useTranslations("PlatformShared");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSegments, setShowSegments] = useState(true);
  const [copied, setCopied] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const wordCount = useMemo(() => countWords(transcript), [transcript]);
  const readingTime = useMemo(() => estimateReadingTime(transcript), [transcript]);
  const hasSegments = !!segments && segments.length > 0;

  const matchCount = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return 0;
    if (hasSegments && segments) {
      return segments.filter((seg) => seg.text.toLowerCase().includes(q)).length;
    }
    return (transcript.toLowerCase().match(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;
  }, [searchQuery, transcript, segments, hasSegments]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript);
      setCopied(true);
      toast.success(t("copied", { defaultValue: "Copied to clipboard!" }));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("copyFailed", { defaultValue: "Failed to copy" }));
    }
  };

  const handleDownloadTxt = () => {
    if (downloadUrl && filename) {
      triggerDownload(downloadUrl, filename);
    } else {
      // Fallback: create a blob and download
      const blob = new Blob([transcript], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title || "transcript"}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadJson = () => {
    if (jsonDownloadUrl && jsonFilename) {
      triggerDownload(jsonDownloadUrl, jsonFilename);
    }
  };

  const handleDownloadSrt = () => {
    // Generate SRT from segments or plain text
    let srtContent = "";
    if (hasSegments && segments) {
      segments.forEach((seg, i) => {
        srtContent += `${i + 1}\n`;
        srtContent += `${toSrtTimestamp(seg.start)} --> ${toSrtTimestamp(seg.end)}\n`;
        srtContent += `${seg.text.trim()}\n\n`;
      });
    } else {
      // No segments, just output plain text as a single SRT block
      srtContent = `1\n00:00:00,000 --> 00:00:00,001\n${transcript.trim()}\n`;
    }
    const blob = new Blob([srtContent], { type: "application/x-subrip" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "transcript"}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Highlight search matches: the capture group makes odd indices the matches
  const highlightText = (text: string, query: string): React.ReactNode => {
    const q = query.trim();
    if (!q) return text;
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));
    return parts.map((part, i) =>
      i % 2 === 1 ? (
        <mark
          key={i}
          className="bg-yellow-200/80 dark:bg-yellow-400/25 dark:text-yellow-100 px-0.5 rounded"
          style={{ color: "inherit" }}
        >
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  const noMatches = searchQuery.trim().length > 0 && matchCount === 0;

  const actionBtn =
    "flex items-center justify-center gap-1.5 h-10 px-3.5 text-[13px] font-semibold text-foreground dark:text-white/90 bg-[#eef4f6] dark:bg-white/[0.06] hover:bg-[#e2e8f0] dark:hover:bg-white/[0.12] border border-transparent dark:border-white/[0.06] rounded-xl transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.6, 0.35, 1] }}
      className="relative bg-white dark:bg-[#0a1018]/80 rounded-2xl border border-border/80 dark:border-white/10 overflow-hidden shadow-[0_15px_50px_-20px_rgba(0,0,0,0.15)]"
    >
      <div
        className="absolute inset-x-0 top-0 h-0.5"
        style={{ background: `linear-gradient(90deg, ${brandColor}, ${brandColor}55)` }}
      />

      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-border/80 dark:border-white/[0.08] bg-[#f8fafc]/80 dark:bg-white/[0.02]">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <span
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
              style={{ background: `linear-gradient(135deg, ${brandColor} 0%, rgba(0,0,0,0.25) 130%)` }}
            >
              <FileText className="w-4 h-4 text-white" />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: brandColor }} />
                <h3 className="text-sm font-bold text-foreground dark:text-white font-sans">
                  {t("transcriptTitle", { defaultValue: "Transcript" })}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground dark:text-white/50 truncate mt-0.5 max-w-full sm:max-w-[34ch] lg:max-w-[52ch]">
                {title}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:justify-end text-[11px] text-muted-foreground dark:text-white/60 font-mono">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eef4f6] dark:bg-white/[0.06] px-2.5 py-1">
              <Type className="w-3 h-3" />
              {wordCount} {t("words", { defaultValue: "words" })}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eef4f6] dark:bg-white/[0.06] px-2.5 py-1">
              <Clock className="w-3 h-3" />
              {readingTime} {t("minRead", { defaultValue: "min read" })}
            </span>
            {hasSegments && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#eef4f6] dark:bg-white/[0.06] px-2.5 py-1">
                <Captions className="w-3 h-3" />
                {segments!.length} {t("segments", { defaultValue: "segments" })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="p-3 sm:p-4 border-b border-border/80 dark:border-white/[0.08] flex flex-col lg:flex-row lg:items-center gap-2.5 lg:gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground dark:text-white/40" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("searchTranscript", { defaultValue: "Search transcript..." })}
            className="w-full h-10 pl-9 pr-16 text-sm bg-[#eef4f6] dark:bg-white/[0.06] dark:text-white placeholder:text-muted-foreground/70 dark:placeholder:text-white/30 rounded-xl outline-none focus:ring-2 transition-all font-sans"
            style={{ "--tw-ring-color": `${brandColor}40` } as React.CSSProperties}
          />
          {searchQuery.trim() && (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-semibold text-muted-foreground dark:text-white/50 bg-white dark:bg-white/10 rounded-full px-2 py-0.5 tabular-nums">
                {matchCount}
              </span>
              <button
                onClick={() => setSearchQuery("")}
                className="text-muted-foreground hover:text-foreground dark:hover:text-white p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 justify-between lg:justify-end">
          {/* View toggle */}
          {hasSegments && (
            <div className="flex items-center gap-0.5 p-0.5 bg-[#eef4f6] dark:bg-white/[0.06] rounded-xl">
              <button
                onClick={() => setShowSegments(true)}
                className={`flex items-center gap-1.5 h-9 px-3 rounded-[10px] text-xs font-semibold transition-all ${
                  showSegments
                    ? "bg-white dark:bg-white/[0.14] text-foreground dark:text-white shadow-sm"
                    : "text-muted-foreground dark:text-white/50 hover:text-foreground dark:hover:text-white/80"
                }`}
                style={showSegments ? { color: brandColor } : undefined}
                aria-pressed={showSegments}
              >
                <Captions className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {t("showSegments", { defaultValue: "Timestamped" })}
                </span>
              </button>
              <button
                onClick={() => setShowSegments(false)}
                className={`flex items-center gap-1.5 h-9 px-3 rounded-[10px] text-xs font-semibold transition-all ${
                  !showSegments
                    ? "bg-white dark:bg-white/[0.14] text-foreground dark:text-white shadow-sm"
                    : "text-muted-foreground dark:text-white/50 hover:text-foreground dark:hover:text-white/80"
                }`}
                style={!showSegments ? { color: brandColor } : undefined}
                aria-pressed={!showSegments}
              >
                <AlignLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {t("showFullText", { defaultValue: "Full text" })}
                </span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5 flex-wrap">
            <motion.button
              onClick={handleCopy}
              whileTap={{ scale: 0.96 }}
              className={actionBtn}
              style={copied ? { backgroundColor: `${brandColor}18`, color: brandColor } : undefined}
            >
              {copied ? (
                <CheckCircle2 className="w-3.5 h-3.5" style={{ color: brandColor }} />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              {copied ? t("copied", { defaultValue: "Copied!" }) : t("copyTranscript", { defaultValue: "Copy" })}
            </motion.button>

            <motion.button onClick={handleDownloadTxt} whileTap={{ scale: 0.96 }} className={actionBtn}>
              <Download className="w-3.5 h-3.5" />
              TXT
            </motion.button>

            <motion.button onClick={handleDownloadSrt} whileTap={{ scale: 0.96 }} className={actionBtn}>
              <Download className="w-3.5 h-3.5" />
              SRT
            </motion.button>

            {jsonDownloadUrl && jsonFilename && (
              <motion.button onClick={handleDownloadJson} whileTap={{ scale: 0.96 }} className={actionBtn}>
                <Download className="w-3.5 h-3.5" />
                JSON
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-5 md:p-6">
        <AnimatePresence mode="wait">
          {noMatches ? (
            <motion.div
              key="nomatch"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <span className="w-11 h-11 rounded-2xl bg-[#eef4f6] dark:bg-white/[0.06] flex items-center justify-center mb-3">
                <SearchX className="w-5 h-5 text-muted-foreground dark:text-white/40" />
              </span>
              <p className="text-sm font-medium text-foreground dark:text-white/80">
                {t("noMatches", { defaultValue: "No matches found" })}
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-3 text-xs font-semibold text-muted-foreground dark:text-white/50 hover:text-foreground dark:hover:text-white underline underline-offset-4"
              >
                {t("clearSearch", { defaultValue: "Clear search" })}
              </button>
            </motion.div>
          ) : hasSegments && showSegments ? (
            /* Segments view */
            <motion.div
              key="segments"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-h-[55vh] sm:max-h-[440px] md:max-h-[520px] overflow-y-auto pr-1 sm:pr-2 space-y-0.5 -mx-1 px-1"
            >
              {segments!.map((seg, i) => {
                const isMatch =
                  !!searchQuery.trim() && seg.text.toLowerCase().includes(searchQuery.trim().toLowerCase());
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: searchQuery.trim() && !isMatch ? 0.35 : 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.015, 0.4), duration: 0.25 }}
                    className={`group flex items-start gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl transition-colors ${
                      isMatch
                        ? "bg-yellow-50 dark:bg-yellow-400/10"
                        : "hover:bg-[#f1f5f7] dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    <span
                      className="shrink-0 mt-0.5 inline-flex items-center text-[11px] font-mono font-medium tabular-nums px-2 py-1 rounded-lg bg-[#eef4f6] dark:bg-white/[0.07] text-muted-foreground dark:text-white/60"
                    >
                      {formatDuration(seg.start)}
                    </span>
                    <p className="text-sm sm:text-[15px] text-foreground dark:text-white/85 leading-relaxed font-sans flex-1 min-w-0">
                      {highlightText(seg.text, searchQuery)}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* Plain text view */
            <motion.div
              key="plaintext"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-h-[55vh] sm:max-h-[440px] md:max-h-[520px] overflow-y-auto"
            >
              <div className="prose prose-sm max-w-none">
                <p className="text-sm sm:text-[15px] text-foreground dark:text-white/85 leading-[1.85] font-sans whitespace-pre-wrap break-words">
                  {highlightText(transcript, searchQuery)}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
