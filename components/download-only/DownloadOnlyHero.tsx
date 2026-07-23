"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, CheckCircle2, X, Sparkles, Loader2 } from "lucide-react";
import { usePlatformTranslations } from "@/lib/usePlatformTranslations";
import {
  universalGetInfo,
  universalDownloadAudio,
  universalDownloadTranscript,
  getJobStatus,
  getJobResult,
  triggerDownload,
} from "@/lib/api-client";
import type { ApiFormatInfo, UniversalMediaInfo } from "@/lib/api-client";
import { FormatGrid } from "@/components/youtube-download/FormatGrid";
import { VideoPreview } from "@/components/youtube-download/VideoPreview";
import { DownloadProgress } from "@/components/youtube-download/DownloadProgress";
import { TranscriptViewer } from "@/components/transcription/TranscriptViewer";
import { resolveFormats, audioBitrate } from "@/lib/formats";
import { useTranslations } from "next-intl";

type DownloadOnlyType = "audio" | "thumbnail" | "transcript";

export function DownloadOnlyHero({ platform, type }: { platform: string; type: DownloadOnlyType }) {
  const config = usePlatformTranslations(platform);
  const brandColor = config.brandColor;
  const Logo = config.Logo;
  const InputIcon = config.inputIcon;
  const t = useTranslations("DownloadOnly");
  const st = useTranslations("PlatformShared");

  const typeBadgeKey = `${type}Badge` as const;
  const typeHeadingKey = `${type}HeadingSuffix` as const;
  const typeSubheadingKey = `${type}Subheading` as const;
  const chooseKey = type === "audio" ? "chooseAudioQuality" : type === "thumbnail" ? "chooseThumbnailFormat" : "chooseTranscriptFormat";

  const [url, setUrl] = useState("");
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
  const [infoReady, setInfoReady] = useState(false);
  const [infoError, setInfoError] = useState(false);

  // Transcript-specific state
  const [transcript, setTranscript] = useState<string | null>(null);
  const [transcriptSegments, setTranscriptSegments] = useState<import("@/lib/api-client").TranscriptSegment[] | null>(null);
  const [transcriptFilename, setTranscriptFilename] = useState<string | null>(null);
  const [transcriptJsonUrl, setTranscriptJsonUrl] = useState<string | null>(null);
  const [transcriptJsonFilename, setTranscriptJsonFilename] = useState<string | null>(null);

  const formats: ApiFormatInfo[] = resolveFormats(mediaInfo, type);

  const showPreview = type !== "thumbnail";
  const showProgress = type !== "thumbnail";

  const handleUrlChange = useCallback((value: string) => {
    setUrl(value);
    setMediaInfo(null);
    setInfoReady(false);
    setInfoError(false);
    setError("");
    setTranscript(null);
    setTranscriptSegments(null);
    setTranscriptFilename(null);
    setTranscriptJsonUrl(null);
    setTranscriptJsonFilename(null);
  }, []);

  useEffect(() => {
    return () => {
      cancelPoll.current?.();
    };
  }, []);

  async function handleDownload() {
    if (!url.trim()) {
      inputRef.current?.focus();
      return;
    }

    if (!infoReady) {
      setError("");
      setFetchingInfo(true);
      setInfoError(false);
      try {
        const res = await universalGetInfo(url);
        if (res.success && res.data) {
          setMediaInfo(res.data);
          setInfoReady(true);
          setInfoError(false);
        } else {
          setInfoError(true);
        }
      } catch {
        setInfoError(true);
      } finally {
        setFetchingInfo(false);
      }
      return;
    }

    setError("");
    setProcessing(true);
    setProgress(0);
    setStatusText(st("processing"));
    setDownloadSpeed("");
    setDownloadEta(null);
    setDownloadedBytes(0);
    setTotalBytes(0);
    setDone(false);

    try {
      if (type === "thumbnail") {
        if (!mediaInfo?.thumbnail) {
          throw new Error(st("errorDownloadFailed"));
        }
        const fmt = formats[selectedFormat];
        const a = document.createElement("a");
        a.href = mediaInfo.thumbnail;
        a.download = `${mediaInfo.title || "thumbnail"}.${fmt.ext}`;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setProcessing(false);
        setDone(true);
        setTimeout(() => setDone(false), 3000);
        return;
      }

      const fmt = formats[selectedFormat];
      let res;
      if (type === "audio") {
        const bitrate = audioBitrate(fmt as ApiFormatInfo);
        res = await universalDownloadAudio(url, fmt.ext, bitrate);
      } else {
        res = await universalDownloadTranscript(url, fmt.ext);
      }
      if (!res.success || !res.data) {
        throw new Error(res.error?.message || st("errorDownloadFailed"));
      }
      setStatusText(type === "transcript" ? st("transcribing", { defaultValue: "Transcribing..." }) : st("processing"));
      await pollUntilDone(res.data.job_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : st("errorDownloadFailed"));
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
          reject(new Error(st("errorDownloadFailed")));
          return;
        }
        retries++;

        try {
          const res = await getJobStatus(jobId);
          if (!res.success || !res.data) {
            reject(new Error(res.error?.message || st("errorDownloadFailed")));
            return;
          }

          const job = res.data;
          setProgress(job.progress ?? 0);
          setDownloadSpeed(job.speed ?? "");
          setDownloadEta(job.eta ?? null);
          setDownloadedBytes(job.downloaded ?? 0);
          setTotalBytes(job.total ?? 0);

          if (job.status === "downloading") {
            setStatusText(st("downloading"));
          } else if (job.status === "processing") {
            setStatusText(st("processing"));
          } else if (job.status === "queued") {
            setStatusText(st("queued"));
          }

          if (job.status === "completed") {
            setProgress(100);
            setStatusText(st("complete"));

            const finalRes = await getJobResult(jobId);
            if (finalRes.success && finalRes.data) {
              const data = finalRes.data;

              // For transcript type, store the transcript content for display
              if (type === "transcript" && data.transcript) {
                setTranscript(data.transcript);
                setTranscriptSegments(data.segments || null);
                setTranscriptFilename(data.filename || null);
                setTranscriptJsonUrl(data.jsonDownloadUrl || null);
                setTranscriptJsonFilename(data.jsonFilename || null);
              } else if (data.downloadUrl) {
                // For audio/thumbnail types, trigger download as before
                triggerDownload(data.downloadUrl, data.filename);
              }
            }
            setProcessing(false);
            setDone(true);
            setTimeout(() => setDone(false), 3000);
            resolve();
            return;
          }

          if (job.status === "failed") {
            reject(new Error(job.error || st("errorDownloadFailed")));
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

  const darkerShade = brandColor === "#010101" || brandColor === "#14171A" || brandColor === "#000000"
    ? "#333333"
    : brandColor;

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-20 px-4 sm:px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <motion.div
        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${brandColor} 0%, transparent 70%)` }}
        animate={{ x: ["0%", "15%", "0%"], y: ["0%", "-10%", "0%"], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[20%] left-[-8%] w-[350px] h-[350px] rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #5baab8 0%, transparent 70%)" }}
        animate={{ x: ["0%", "-10%", "0%"], y: ["0%", "15%", "0%"], scale: [1, 1.15, 1] }}
        transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-5%] right-[10%] w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${brandColor} 0%, transparent 70%)` }}
        animate={{ x: ["0%", "-20%", "0%"], y: ["0%", "10%", "0%"], scale: [1, 1.25, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-4xl mx-auto relative">
        {Logo && (
          <motion.div
            className="hidden md:block absolute top-[-40px] right-[-60px] opacity-[0.04] pointer-events-none"
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 0.04, scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
          >
            <Logo className="w-48 h-48" />
          </motion.div>
        )}

        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-border text-muted-foreground shadow-sm font-mono">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: brandColor, boxShadow: `0 0 4px ${brandColor}` }} />
            {config.name} {t(typeBadgeKey)}
          </span>
        </motion.div>

        <motion.h1
          className="text-center text-[2rem] leading-tight sm:text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 font-heading"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          {type === "audio"
            ? `Extract Audio from ${config.name} Videos`
            : type === "thumbnail"
            ? `Download ${config.name} Thumbnails`
            : `Generate ${config.name} Transcripts`}
          <br />
          <span style={{ color: brandColor }}>{t(typeHeadingKey)}</span>
        </motion.h1>

        <motion.p
          className="text-center text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed font-sans"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
          {t(typeSubheadingKey)}
        </motion.p>

        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/5 border border-border/60 p-4 md:p-5 relative"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div
            className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl"
            style={{ background: `linear-gradient(90deg, ${brandColor}, ${darkerShade}, ${brandColor})` }}
          />

          <div className="flex flex-col md:flex-row gap-3">
            <div
              className="flex-1 flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 transition-all duration-300"
              style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)" }}
              onFocus={(e) => {
                const parent = e.currentTarget;
                parent.style.boxShadow = `inset 0 1px 2px rgba(0,0,0,0.04), 0 0 0 2px ${brandColor}40`;
                parent.style.backgroundColor = "white";
              }}
              onBlur={(e) => {
                const parent = e.currentTarget;
                parent.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.04)";
                parent.style.backgroundColor = "rgba(255,255,255,0.7)";
              }}
            >
              <span
                className="flex-shrink-0 transition-transform duration-300"
                style={{ color: brandColor }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.15)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                {InputIcon ? <InputIcon className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              </span>
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
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    {st("fetchingInfo")}
                  </p>
                )}
              </div>
              {url && (
                <button onClick={() => { setUrl(""); setMediaInfo(null); setInfoReady(false); setInfoError(false); }} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <motion.button
              onClick={handleDownload}
              disabled={processing || fetchingInfo}
              whileHover={{ scale: processing || fetchingInfo ? 1 : 1.03 }}
              whileTap={{ scale: processing || fetchingInfo ? 1 : 0.97 }}
              className="flex items-center justify-center gap-2 text-white font-semibold text-sm px-7 py-3 rounded-xl transition-all disabled:opacity-70 whitespace-nowrap min-w-[150px] font-sans shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${brandColor}, ${darkerShade})`,
                boxShadow: `0 10px 25px -5px ${brandColor}33`,
              }}
              onMouseEnter={(e) => {
                if (!processing && !fetchingInfo) e.currentTarget.style.filter = "brightness(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "none";
              }}
            >
              <AnimatePresence mode="wait">
                {fetchingInfo ? (
                  <motion.span key="fetch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {st("fetching")}
                  </motion.span>
                ) : processing ? (
                  <motion.span key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {statusText || st("processing")}
                  </motion.span>
                ) : done ? (
                  <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" style={{ color: brandColor }} />
                    {st("ready")}
                  </motion.span>
                ) : infoReady ? (
                  <motion.span key="now" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    {type === "thumbnail" ? st("saveThumbnail") : type === "transcript" ? st("transcribeBtn", { defaultValue: "Transcribe" }) : st("downloadNow")}
                  </motion.span>
                ) : (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    {type === "thumbnail" ? st("getThumbnail") : type === "transcript" ? st("transcribeBtn", { defaultValue: "Transcribe" }) : st("download")}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {mediaInfo && !processing && !done && showPreview && !transcript && (
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

          {mediaInfo && !processing && !done && !showPreview && type === "thumbnail" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <div className="h-px bg-border mb-4" />
              <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                <figure className="relative bg-[#0d1f26] overflow-hidden">
                  {mediaInfo.thumbnail ? (
                    <motion.img
                      src={mediaInfo.thumbnail}
                      alt={`Thumbnail for ${mediaInfo.title}`}
                      className="w-full aspect-video object-cover"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                  ) : (
                    <div className="w-full aspect-video flex items-center justify-center bg-[#eef6f8]">
                      <span className="text-sm text-muted-foreground font-sans">{st("noThumbnail")}</span>
                    </div>
                  )}
                </figure>
              </div>
            </motion.div>
          )}

          {infoError && !mediaInfo && !fetchingInfo && url.trim() && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-destructive mt-3 font-sans"
            >
              {st("errorFetchInfo")}
            </motion.p>
          )}

          <AnimatePresence>
            {!processing && !done && mediaInfo && !transcript && (
              <motion.div
                key="formatGrid"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-4"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: brandColor }} />
                  <span className="text-xs font-semibold text-foreground font-sans">
                    {t(chooseKey)}
                  </span>
                </div>
                <FormatGrid
                  formats={formats}
                  selectedIndex={selectedFormat}
                  onSelect={setSelectedFormat}
                  type={type}
                  brandColor={brandColor}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {processing && showProgress && (
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

          {/* Transcript Viewer — shown when transcription completes */}
          <AnimatePresence>
            {type === "transcript" && transcript && (
              <motion.div
                key="transcriptViewer"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <TranscriptViewer
                  transcript={transcript}
                  segments={transcriptSegments}
                  title={mediaInfo?.title || "transcript"}
                  brandColor={brandColor}
                  downloadUrl={transcriptFilename ? `/download/${transcriptFilename}` : undefined}
                  filename={transcriptFilename || undefined}
                  jsonDownloadUrl={transcriptJsonUrl || undefined}
                  jsonFilename={transcriptJsonFilename || undefined}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.p
          className="text-center text-xs text-muted-foreground mt-5 font-sans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {t("disclaimer", { platform: config.name })}
        </motion.p>
      </div>
    </section>
  );
}
