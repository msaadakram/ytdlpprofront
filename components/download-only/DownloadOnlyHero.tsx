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

  const [selectedLanguage, setSelectedLanguage] = useState<string>("en");
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
        res = await universalDownloadTranscript(url, fmt.ext, selectedLanguage);
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
           className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/5 border border-border/60 p-4 sm:p-5 md:p-6 relative"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div
            className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl"
            style={{ background: `linear-gradient(90deg, ${brandColor}, ${darkerShade}, ${brandColor})` }}
          />

          <div className="flex flex-col md:flex-row gap-3">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="language" className="text-xs font-semibold text-muted-foreground whitespace-nowrap">Language:</label>
              <select
                id="language"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white border border-border rounded-lg px-2 py-2 text-xs text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5baab8]/30"
              >
                <option value="auto">🔍 Auto-Detect → English Roman</option>
                <optgroup label="English">
                  <option value="en">English</option>
                </optgroup>
                <optgroup label="South Asian">
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="ur">Urdu (اردو)</option>
                  <option value="bn">Bengali (বাংলা)</option>
                  <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
                  <option value="ta">Tamil (தமிழ்)</option>
                  <option value="te">Telugu (తెలుగు)</option>
                  <option value="ml">Malayalam (മലയാളം)</option>
                  <option value="kn">Kannada (ಕನ್ನಡ)</option>
                  <option value="gu">Gujarati (ગુજરાતી)</option>
                  <option value="mr">Marathi (मराठी)</option>
                  <option value="sa">Sanskrit (संस्कृतम्)</option>
                  <option value="ne">Nepali (नेपाली)</option>
                  <option value="si">Sinhala (සිංහල)</option>
                </optgroup>
                <optgroup label="East Asian">
                  <option value="zh">Chinese (中文)</option>
                  <option value="ja">Japanese (日本語)</option>
                  <option value="ko">Korean (한국어)</option>
                  <option value="my">Burmese (မြန်မာ)</option>
                </optgroup>
                <optgroup label="Southeast Asian">
                  <option value="th">Thai (ไทย)</option>
                  <option value="vi">Vietnamese (Tiếng Việt)</option>
                  <option value="id">Indonesian (Bahasa)</option>
                  <option value="ms">Malay (Bahasa Melayu)</option>
                  <option value="tl">Filipino/Tagalog</option>
                </optgroup>
                <optgroup label="European">
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="pt">Portuguese</option>
                  <option value="it">Italian</option>
                  <option value="nl">Dutch</option>
                  <option value="pl">Polish</option>
                  <option value="cs">Czech</option>
                  <option value="sk">Slovak</option>
                  <option value="hu">Hungarian</option>
                  <option value="ro">Romanian</option>
                  <option value="bg">Bulgarian</option>
                  <option value="hr">Croatian</option>
                  <option value="sr">Serbian</option>
                  <option value="sl">Slovenian</option>
                  <option value="el">Greek</option>
                  <option value="sv">Swedish</option>
                  <option value="no">Norwegian</option>
                  <option value="da">Danish</option>
                  <option value="fi">Finnish</option>
                  <option value="is">Icelandic</option>
                  <option value="et">Estonian</option>
                  <option value="lv">Latvian</option>
                  <option value="lt">Lithuanian</option>
                </optgroup>
                <optgroup label="Middle Eastern">
                  <option value="ar">Arabic (العربية)</option>
                  <option value="he">Hebrew (עברית)</option>
                  <option value="fa">Persian/Farsi (فارسی)</option>
                  <option value="tr">Turkish (Türkçe)</option>
                </optgroup>
                <optgroup label="African">
                  <option value="sw">Swahili</option>
                  <option value="am">Amharic (አማርኛ)</option>
                  <option value="yo">Yoruba</option>
                  <option value="ig">Igbo</option>
                  <option value="ha">Hausa</option>
                  <option value="zu">Zulu</option>
                </optgroup>
                <optgroup label="Other">
                  <option value="ru">Russian (Русский)</option>
                  <option value="af">Afrikaans</option>
                </optgroup>
              </select>
            </div>

            <div
              className="flex-1 flex items-center gap-3 bg-white/80 backdrop-blur-md border border-white/30 rounded-2xl px-4 py-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5)] transition-all duration-300 focus-within:shadow-[0_8px_30px_rgba(91,170,184,0.2),inset_0_1px_0_rgba(255,255,255,0.6)] focus-within:bg-white focus-within:border-[#5baab8]/40 focus-within:ring-[3px] focus-within:ring-[#5baab8]/25"
              style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)" }}
              onFocus={(e) => {
                const parent = e.currentTarget;
                parent.style.boxShadow = `inset 0 1px 2px rgba(0,0,0,0.04), 0 0 0 2px ${brandColor}40`;
                parent.style.backgroundColor = "rgba(255,255,255,0.9)";
              }}
              onBlur={(e) => {
                const parent = e.currentTarget;
                parent.style.boxShadow = "inset 0 1px 2px rgba(0,0,0,0.04)";
                parent.style.backgroundColor = "rgba(255,255,255,0.6)";
              }}
            >
              <span
                className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5baab8] to-[#3d8896] flex items-center justify-center shadow-lg shadow-[#5baab8]/25 flex-shrink-0 transition-transform duration-300 hover:scale-110"
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                {InputIcon ? <InputIcon className="w-4 h-4 text-white" /> : <Download className="w-4 h-4 text-white" />}
              </span>
              <div className="flex-1 min-w-0">
                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDownload()}
                  placeholder={config.placeholder}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none font-sans tracking-wide"
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
              whileHover={{ scale: processing || fetchingInfo ? 1 : 1.05, y: processing || fetchingInfo ? 0 : -2 }}
              whileTap={{ scale: processing || fetchingInfo ? 1 : 0.95, y: processing || fetchingInfo ? 0 : 1 }}
               className="flex items-center justify-center gap-2.5 text-white font-bold text-sm px-7 py-3.5 rounded-2xl shadow-[0_10px_30px_-10px_rgba(13,31,38,0.5)] hover:shadow-[0_20px_40px_-15px_rgba(13,31,38,0.6)] transition-all duration-300 disabled:opacity-60 disabled:shadow-none disabled:hover:scale-100 w-full md:min-w-[170px] relative overflow-hidden font-sans tracking-wide bg-gradient-to-r from-[#0d1f26] via-[#143d4a] to-[#0d1f26] bg-[length:200%_auto] animate-gradient-shift hover:animate-gradient-shift-fast"
              style={{
                boxShadow: `0 10px 25px -5px ${brandColor}33`,
              }}
              onMouseEnter={(e) => {
                if (!processing && !fetchingInfo) {
                  e.currentTarget.style.filter = "brightness(1.15)";
                  e.currentTarget.style.boxShadow = `0 20px 40px -15px ${brandColor}55`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "none";
                e.currentTarget.style.boxShadow = `0 10px 25px -5px ${brandColor}33`;
              }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-[1.2s] ease-in-out pointer-events-none shimmer-overlay" />
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
