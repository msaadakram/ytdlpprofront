"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Download, Music, Image, Video, ChevronDown, CheckCircle2, Play, X, FileText, Loader2,
} from "lucide-react";
import type { DownloadType } from "@/lib/constants";
import { useDownloader } from "@/lib/useDownloader";

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

export function Hero() {
  const {
    url, activeType, selectedFormat, setSelectedFormat, setActiveType,
    mediaInfo, fetchingInfo, infoReady, infoError, processing, done,
    progress, statusText, downloadSpeed, downloadEta, downloadedBytes, totalBytes,
    error, formats, inputRef, handleUrlChange, handleDownloadClick,
  } = useDownloader();

  const [showFormats, setShowFormats] = useState(false);

  const typeConfig = {
    video: { icon: Video, label: "Video" },
    audio: { icon: Music, label: "Audio" },
    thumbnail: { icon: Image, label: "Thumbnail" },
    transcript: { icon: FileText, label: "Transcript" },
  };

  const selectedFmt = formats[selectedFormat];

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-20 px-6 relative overflow-hidden">
      <motion.div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #5baab8 0%, transparent 70%)" }}
        animate={{ x: ["30%", "20%", "30%"], y: ["-30%", "-20%", "-30%"], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #a8d4dc 0%, transparent 70%)" }}
        animate={{ x: ["-40%", "-30%", "-40%"], y: ["40%", "30%", "40%"], scale: [1, 1.15, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-4xl mx-auto relative">
        <motion.div className="flex justify-center mb-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full bg-white border border-border text-muted-foreground shadow-sm font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5baab8] animate-pulse" />
            200+ platforms supported
          </span>
        </motion.div>

        <motion.h1
          className="text-center text-[2rem] leading-tight sm:text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 font-heading"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          Download any video,
          <br />
          <span className="text-[#5baab8]">audio</span>, thumbnail or transcript.
        </motion.h1>

        <motion.p
          className="text-center text-lg text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed font-sans"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
           Paste a link from YouTube, Facebook, TikTok, Instagram and 200+ more. Download video, audio, thumbnails, or AI transcripts — no account required.
        </motion.p>

        <motion.div className="flex justify-center mb-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="inline-flex bg-white border border-border rounded-full p-1 shadow-sm gap-1 relative">
              {(["video", "audio", "thumbnail", "transcript"] as DownloadType[]).map((type) => {
              const cfg = typeConfig[type];
              const Icon = cfg.icon;
              const active = activeType === type;
              return (
                <button
                  key={type}
                  onClick={() => { setActiveType(type); setSelectedFormat(0); setShowFormats(false); }}
                  className={`relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-colors font-sans ${
                    active ? "text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.span layoutId="typePill" className="absolute inset-0 bg-[#0d1f26] rounded-full shadow-md" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-border p-3 md:p-4"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 bg-[#eef6f8] rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#5baab8]/40 transition-all">
              <Play className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDownloadClick()}
                  placeholder="Paste your video URL here..."
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans"
                />
                {fetchingInfo && (
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5 font-sans">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" /> Fetching video info...
                  </p>
                )}
                {mediaInfo?.title && !fetchingInfo && (
                  <p className="text-[10px] text-muted-foreground truncate mt-0.5 font-sans">{mediaInfo.title}</p>
                )}
              </div>
              {url && (
                <button onClick={() => handleUrlChange("")} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {activeType !== "thumbnail" && infoReady && (
              <div className="relative">
                <button
                  onClick={() => setShowFormats(!showFormats)}
                  className="flex items-center gap-2 bg-[#eef6f8] hover:bg-[#d4ecf0] rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors whitespace-nowrap w-full md:w-auto font-sans"
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-[#5baab8] font-mono">
                    {selectedFmt?.ext?.toUpperCase()}
                  </span>
                  <span className="text-muted-foreground">{selectedFmt?.quality_label || selectedFmt?.ext?.toUpperCase() || ""}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showFormats ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {showFormats && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute top-full left-0 right-0 md:left-auto md:right-0 mt-2 bg-white rounded-xl border border-border shadow-xl z-20 overflow-hidden min-w-[220px]"
                    >
                      {formats.map((fmt, i) => (
                        <button
                          key={i}
                          onClick={() => { setSelectedFormat(i); setShowFormats(false); }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-muted transition-colors text-left font-sans ${
                            i === selectedFormat ? "bg-[#eef6f8] font-semibold" : ""
                          }`}
                        >
                          <span>{fmt.quality_label || fmt.ext?.toUpperCase()}</span>
                          {i === selectedFormat && <CheckCircle2 className="w-4 h-4 text-[#5baab8]" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <motion.button
              onClick={handleDownloadClick}
              disabled={processing || fetchingInfo}
              whileHover={{ scale: processing || fetchingInfo ? 1 : 1.03 }}
              whileTap={{ scale: processing || fetchingInfo ? 1 : 0.97 }}
              className="flex items-center justify-center gap-2 bg-[#0d1f26] hover:bg-[#1a3545] text-white font-semibold text-sm px-7 py-3 rounded-xl transition-colors disabled:opacity-70 whitespace-nowrap min-w-[150px] font-sans"
            >
              <AnimatePresence mode="wait">
                {fetchingInfo ? (
                  <motion.span key="fetch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Fetching...
                  </motion.span>
                ) : processing ? (
                  <motion.span key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {statusText || "Processing..."}
                  </motion.span>
                ) : done ? (
                  <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5baab8]" />
                    Ready!
                  </motion.span>
                ) : infoReady ? (
                  <motion.span key="now" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Now
                  </motion.span>
                ) : (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {infoError && !mediaInfo && !fetchingInfo && url.trim() && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-destructive mt-3 font-sans"
            >
              Could not fetch media info. Check the URL and try again.
            </motion.p>
          )}

          {/* Progress bar */}
          {processing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-4"
            >
              <div className="flex items-center gap-4 mb-2">
                <span className="text-2xl font-bold tabular-nums text-[#0d1f26] font-mono">
                  {Math.round(progress)}%
                </span>
                <div className="flex-1">
                  <div className="w-full bg-[#eef6f8] rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, #5baab8 ${Math.max(progress, 5)}%, #3d8896 ${Math.max(progress, 5)}%)`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(progress, 5)}%` }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
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
                  <span className="tabular-nums">{downloadSpeed}</span>
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
          )}

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-xs text-destructive mt-2 font-sans"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.p
          className="text-center text-xs text-muted-foreground mt-5 font-sans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Free to use · No sign-up required · Files deleted instantly after download
        </motion.p>
      </div>
    </section>
  );
}
