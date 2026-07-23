"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Copy, Download, Search, Clock, FileText, CheckCircle2, X } from "lucide-react";
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

  const wordCount = countWords(transcript);
  const readingTime = estimateReadingTime(transcript);

  // Handle search highlighting
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

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
    if (segments && segments.length > 0) {
      segments.forEach((seg, i) => {
        srtContent += `${i + 1}\n`;
        srtContent += `${formatDuration(seg.start)} --> ${formatDuration(seg.end)}\n`;
        srtContent += `${seg.text.trim()}\n\n`;
      });
    } else {
      // No segments, just output plain text as a single SRT block
      srtContent = `1\n00:00:00 --> 00:00:00\n${transcript.trim()}\n`;
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

  // Highlight search matches in text
  const highlightText = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800/60 px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.21, 0.6, 0.35, 1] }}
      className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm mt-4"
    >
      {/* Header */}
      <div className="p-4 md:p-5 border-b border-border bg-[#f8fafc]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4" style={{ color: brandColor }} />
            <h3 className="text-sm font-semibold text-foreground font-sans">
              {t("transcriptTitle", { defaultValue: "Transcript" })}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-mono">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readingTime} {t("minRead", { defaultValue: "min read" })}
            </span>
            <span>•</span>
            <span>{wordCount} {t("words", { defaultValue: "words" })}</span>
            {segments && segments.length > 0 && (
              <>
                <span>•</span>
                <span>{segments.length} {t("segments", { defaultValue: "segments" })}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="p-3 md:p-4 border-b border-border bg-white flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t("searchTranscript", { defaultValue: "Search transcript..." })}
            className="w-full pl-9 pr-3 py-2 text-sm bg-[#f1f5f7] rounded-lg outline-none focus:ring-2 focus:ring-blue-100 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleCopy}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-foreground bg-[#f1f5f7] hover:bg-[#e2e8f0] rounded-lg transition-colors"
          >
            {copied ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            {copied ? t("copied", { defaultValue: "Copied!" }) : t("copyTranscript", { defaultValue: "Copy" })}
          </motion.button>

          <div className="flex items-center gap-1">
            <motion.button
              onClick={handleDownloadTxt}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground bg-[#f1f5f7] hover:bg-[#e2e8f0] rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">TXT</span>
            </motion.button>

            <motion.button
              onClick={handleDownloadSrt}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground bg-[#f1f5f7] hover:bg-[#e2e8f0] rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SRT</span>
            </motion.button>

            {jsonDownloadUrl && jsonFilename && (
              <motion.button
                onClick={handleDownloadJson}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground bg-[#f1f5f7] hover:bg-[#e2e8f0] rounded-lg transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">JSON</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 overflow-hidden">
        <AnimatePresence mode="wait">
          {segments && segments.length > 0 && showSegments ? (
            /* Segments view */
            <motion.div
              key="segments"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2 max-h-[500px] overflow-y-auto pr-2"
            >
              {segments.map((seg, i) => {
                const isMatch = searchQuery && seg.text.toLowerCase().includes(searchQuery.toLowerCase());
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className={`p-2 rounded-lg transition-colors ${
                      isMatch ? "bg-yellow-50 dark:bg-yellow-900/20" : "hover:bg-[#f8fafc]"
                    }`}
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="text-xs font-mono text-muted-foreground whitespace-nowrap">
                        {formatDuration(seg.start)}
                      </span>
                      <p className="text-sm text-foreground leading-relaxed font-sans flex-1">
                        {highlightText(seg.text, searchQuery)}
                      </p>
                    </div>
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
              className="prose prose-sm max-w-none"
            >
              <p className="text-sm text-foreground leading-relaxed font-sans whitespace-pre-wrap">
                {highlightText(transcript, searchQuery)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle between views (only if segments exist) */}
        {segments && segments.length > 0 && (
          <motion.div
            className="mt-4 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => setShowSegments(!showSegments)}
              className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-[#f1f5f7] hover:bg-[#e2e8f0] rounded-full transition-colors"
            >
              {showSegments
                ? t("showFullText", { defaultValue: "Show full text" })
                : t("showSegments", { defaultValue: "Show segments" })}
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
