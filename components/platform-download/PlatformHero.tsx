"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Download, CheckCircle2, Play, X, Sparkles, Music, Image,
} from "lucide-react";
import { videoFormats, audioFormats, thumbnailFormats } from "@/lib/constants";
import type { DownloadType, Format } from "@/lib/constants";
import {
  universalGetInfo,
  universalDownloadVideo,
  universalDownloadAudio,
  getJobStatus,
  getJobResult,
  triggerDownload,
} from "@/lib/api-client";
import type { UniversalMediaInfo } from "@/lib/api-client";
import { FormatGrid } from "@/components/youtube-download/FormatGrid";
import { VideoPreview } from "@/components/youtube-download/VideoPreview";
import { DownloadProgress } from "@/components/youtube-download/DownloadProgress";
import { platformConfigs } from "@/lib/platform-config";

function parseBitrate(fmt: Format): string {
  const m = fmt.label.match(/(\d+)\s*kbps/i);
  return m ? m[1] : "320";
}

const CONTAINER_MAP: Record<string, string> = {
  mp4: "mp4", mkv: "mkv", webm: "webm",
};

export function PlatformHero({ platform }: { platform: string }) {
  const config = platformConfigs[platform];
  const [url, setUrl] = useState("");
  const [activeType, setActiveType] = useState<DownloadType>(config.defaultType);
  const [selectedFormat, setSelectedFormat] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [downloadSpeed, setDownloadSpeed] = useState("");
  const [downloadEta, setDownloadEta] = useState<string | number | null>(null);
  const [downloadedBytes, setDownloadedBytes] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [error, setError] = useState("");
  const cancelPoll = useRef<(() => void) | null>(null);

  const [mediaInfo, setMediaInfo] = useState<UniversalMediaInfo | null>(null);
  const [fetchingInfo, setFetchingInfo] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [infoError, setInfoError] = useState(false);

  const handleUrlChange = useCallback((value: string) => {
    setUrl(value);
    setMediaInfo(null);
    setInfoError(false);
    setError("");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value.trim()) return;
    setFetchingInfo(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await universalGetInfo(value);
        if (res.success && res.data) {
          setMediaInfo(res.data);
          setInfoError(false);
        } else {
          setInfoError(true);
        }
      } catch {
        setInfoError(true);
      }
      setFetchingInfo(false);
    }, 600);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      cancelPoll.current?.();
    };
  }, []);

  const formats = activeType === "video" ? videoFormats
    : activeType === "audio" ? audioFormats
    : thumbnailFormats;

  const typeConfig = {
    video: { icon: Play, label: "Video" },
    audio: { icon: Music, label: "Audio" },
    thumbnail: { icon: Image, label: "Thumbnail" },
  };

  async function handleDownload() {
    if (!url.trim()) {
      inputRef.current?.focus();
      return;
    }
    setError("");
    setProcessing(true);
    setProgress(0);
    setStatusText("Starting...");
    setDownloadSpeed("");
    setDownloadEta(null);
    setDownloadedBytes(0);
    setTotalBytes(0);
    setDone(false);

    try {
      if (activeType === "video") {
        const fmt = formats[selectedFormat];
        const quality = fmt.quality;
        const container = CONTAINER_MAP[fmt.ext] || "mp4";
        const res = await universalDownloadVideo(url, undefined, quality, container);
        if (!res.success || !res.data) {
          throw new Error(res.error?.message || "Download failed to start");
        }
        setStatusText("Processing...");
        await pollUntilDone(res.data.job_id);
      } else if (activeType === "audio") {
        const fmt = formats[selectedFormat];
        const bitrate = parseBitrate(fmt);
        const ext = fmt.ext;
        const res = await universalDownloadAudio(url, ext, parseInt(bitrate, 10));
        if (!res.success || !res.data) {
          throw new Error(res.error?.message || "Download failed to start");
        }
        setStatusText("Processing...");
        await pollUntilDone(res.data.job_id);
      } else {
        const info = await universalGetInfo(url);
        if (!info.success || !info.data) {
          throw new Error(info.error?.message || "Could not fetch media info");
        }
        const thumbUrl = info.data.thumbnail;
        if (thumbUrl) {
          const a = document.createElement("a");
          a.href = thumbUrl;
          a.download = `${info.data.title || "thumbnail"}.jpg`;
          a.target = "_blank";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
        setProcessing(false);
        setDone(true);
        setTimeout(() => setDone(false), 3000);
        return;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed");
      setProcessing(false);
      setTimeout(() => setError(""), 5000);
    }
  }

  async function pollUntilDone(jobId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      let retries = 0;
      const maxRetries = 180;

      const poll = async () => {
        if (retries >= maxRetries) {
          reject(new Error("Download timed out"));
          return;
        }
        retries++;

        try {
          const res = await getJobStatus(jobId);
          if (!res.success || !res.data) {
            reject(new Error(res.error?.message || "Failed to check status"));
            return;
          }

          const job = res.data;
          setProgress(job.progress ?? 0);
          setDownloadSpeed(job.speed ?? "");
          setDownloadEta(job.eta ?? null);
          setDownloadedBytes(job.downloaded ?? 0);
          setTotalBytes(job.total ?? 0);

          if (job.status === "downloading") {
            setStatusText("Downloading...");
          } else if (job.status === "processing") {
            setStatusText("Processing...");
          } else if (job.status === "queued") {
            setStatusText("Queued...");
          }

          if (job.status === "completed") {
            setProgress(100);
            setStatusText("Complete!");

            const finalRes = await getJobResult(jobId);
            if (finalRes.success && finalRes.data?.downloadUrl) {
              triggerDownload(finalRes.data.downloadUrl, finalRes.data.filename);
            }
            setProcessing(false);
            setDone(true);
            setTimeout(() => setDone(false), 3000);
            resolve();
            return;
          }

          if (job.status === "failed") {
            reject(new Error(job.error || "Download failed"));
            return;
          }

          setTimeout(poll, 1000);
        } catch (err) {
          reject(err);
        }
      };

      poll();
    });
  }

  const InputIcon = config.inputIcon;

  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      <motion.div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${config.brandColor}33 0%, transparent 70%)` }}
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
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full bg-white border border-border text-muted-foreground shadow-sm font-mono">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: config.brandColor }}
            />
            {config.badge}
          </span>
        </motion.div>

        <motion.h1
          className="text-center text-5xl md:text-7xl font-extrabold leading-[1.08] tracking-tight text-foreground mb-6 font-heading"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          {config.heading}
          <br />
          <span style={{ color: config.brandColor }}>{config.headingAccent}</span>
        </motion.h1>

        <motion.p
          className="text-center text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed font-sans"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
          {config.subheading}
        </motion.p>

        <motion.div
          className="flex justify-center mb-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="inline-flex bg-white border border-border rounded-full p-1 shadow-sm gap-1 relative">
            {(["video", "audio", "thumbnail"] as DownloadType[]).map((type) => {
              const cfg = typeConfig[type];
              const Icon = cfg.icon;
              const active = activeType === type;
              return (
                <button
                  key={type}
                  onClick={() => { setActiveType(type); setSelectedFormat(0); setError(""); }}
                  className={`relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-colors font-sans ${
                    active ? "text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="platTypePill"
                      className="absolute inset-0 bg-[#0d1f26] rounded-full shadow-md"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-border p-4 md:p-5"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 bg-[#eef6f8] rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#5baab8]/40 transition-all">
              <InputIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDownload()}
                  placeholder={config.placeholder}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans"
                />
                {fetchingInfo && (
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5 font-sans">
                    <span className="w-2 h-2 border border-[#5baab8] border-t-transparent rounded-full animate-spin" />
                    Fetching media info...
                  </p>
                )}
              </div>
              {url && (
                <button onClick={() => { setUrl(""); setMediaInfo(null); setInfoError(false); }} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <motion.button
              onClick={handleDownload}
              disabled={processing}
              whileHover={{ scale: processing ? 1 : 1.03 }}
              whileTap={{ scale: processing ? 1 : 0.97 }}
              className="flex items-center justify-center gap-2 bg-[#0d1f26] hover:bg-[#1a3545] text-white font-semibold text-sm px-7 py-3 rounded-xl transition-colors disabled:opacity-70 whitespace-nowrap min-w-[150px] font-sans"
            >
              <AnimatePresence mode="wait">
                {processing ? (
                  <motion.span key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {statusText || "Processing..."}
                  </motion.span>
                ) : done ? (
                  <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5baab8]" />
                    Ready!
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

          <AnimatePresence mode="wait">
            {mediaInfo && !processing && !done && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <div className="h-px bg-border my-4" />
                <VideoPreview info={mediaInfo} />
              </motion.div>
            )}
          </AnimatePresence>

          {infoError && !mediaInfo && !fetchingInfo && url.trim() && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-destructive mt-3 font-sans"
            >
              Could not fetch media info. Check the URL and try again.
            </motion.p>
          )}

          <AnimatePresence>
            {!processing && !done && mediaInfo && (
              <motion.div
                key="formatGrid"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#5baab8]" />
                  <span className="text-xs font-semibold text-foreground font-sans">
                    Choose {activeType === "video" ? "video quality" : activeType === "audio" ? "audio quality" : "thumbnail format"}
                  </span>
                </div>
                <FormatGrid
                  formats={formats}
                  selectedIndex={selectedFormat}
                  onSelect={setSelectedFormat}
                  type={activeType}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {processing && (
              <DownloadProgress
                progress={progress}
                statusText={statusText}
                downloadSpeed={downloadSpeed}
                downloadEta={downloadEta}
                downloadedBytes={downloadedBytes}
                totalBytes={totalBytes}
              />
            )}
          </AnimatePresence>

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
