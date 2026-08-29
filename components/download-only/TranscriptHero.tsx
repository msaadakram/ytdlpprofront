"use client";

import { useState, useRef, useCallback, useEffect, type CSSProperties } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, CheckCircle2, X, Sparkles, Loader2, Globe, FileText } from "lucide-react";
import { usePlatformTranslations } from "@/lib/usePlatformTranslations";
import {
  universalGetInfo,
  universalDownloadTranscript,
  getJobStatus,
  getJobResult,
  triggerDownload,
  downloadTextFile,
} from "@/lib/api-client";
import type { ApiFormatInfo, UniversalMediaInfo, TranscriptSegment } from "@/lib/api-client";
import { FormatGrid } from "@/components/youtube-download/FormatGrid";
import { VideoPreview } from "@/components/youtube-download/VideoPreview";
import { DownloadProgress } from "@/components/youtube-download/DownloadProgress";
import { TranscriptViewer } from "@/components/transcription/TranscriptViewer";
import { resolveFormats } from "@/lib/formats";
import { useTranslations } from "next-intl";

const TRANSCRIPT_LANGUAGES = [
  { code: "auto", label: "Auto-Detect → English Roman" },
  { code: "en", label: "English" },
  { code: "es", label: "Spanish (Español)" },
  { code: "fr", label: "French (Français)" },
  { code: "de", label: "German (Deutsch)" },
  { code: "pt", label: "Portuguese (Português)" },
  { code: "ja", label: "Japanese (日本語)" },
  { code: "ar", label: "Arabic (العربية)" },
  { code: "ru", label: "Russian (Русский)" },
  { code: "zh", label: "Chinese (中文)" },
  { code: "hi", label: "Hindi (हिन्दी)" },
  { code: "ur", label: "Urdu (اردو)" },
  { code: "bn", label: "Bengali (বাংলা)" },
  { code: "pa", label: "Punjabi (ਪੰਜਾਬੀ)" },
  { code: "ta", label: "Tamil (தமிழ்)" },
  { code: "te", label: "Telugu (తెలుగు)" },
  { code: "ml", label: "Malayalam (മലയാളം)" },
  { code: "kn", label: "Kannada (ಕನ್ನಡ)" },
  { code: "gu", label: "Gujarati (ગુજરાતી)" },
  { code: "mr", label: "Marathi (मराठी)" },
  { code: "sa", label: "Sanskrit (संस्कृतम्)" },
  { code: "ne", label: "Nepali (नेपाली)" },
  { code: "si", label: "Sinhala (සිංහල)" },
  { code: "my", label: "Burmese (မြန်မာ)" },
  { code: "th", label: "Thai (ไทย)" },
  { code: "vi", label: "Vietnamese (Tiếng Việt)" },
  { code: "id", label: "Indonesian (Bahasa)" },
  { code: "ms", label: "Malay (Bahasa Melayu)" },
  { code: "tl", label: "Filipino/Tagalog" },
  { code: "ko", label: "Korean (한국어)" },
  { code: "tr", label: "Turkish (Türkçe)" },
  { code: "it", label: "Italian (Italiano)" },
  { code: "nl", label: "Dutch (Nederlands)" },
  { code: "pl", label: "Polish (Polski)" },
  { code: "cs", label: "Czech (Čeština)" },
  { code: "sk", label: "Slovak (Slovenčina)" },
  { code: "hu", label: "Hungarian (Magyar)" },
  { code: "ro", label: "Romanian (Română)" },
  { code: "bg", label: "Bulgarian (Български)" },
  { code: "hr", label: "Croatian (Hrvatski)" },
  { code: "sr", label: "Serbian (Српски)" },
  { code: "sl", label: "Slovenian (Slovenščina)" },
  { code: "el", label: "Greek (Ελληνικά)" },
  { code: "he", label: "Hebrew (עברית)" },
  { code: "fa", label: "Persian/Farsi (فارسی)" },
  { code: "sw", label: "Swahili" },
  { code: "am", label: "Amharic (አማርኛ)" },
  { code: "yo", label: "Yoruba" },
  { code: "ig", label: "Igbo" },
  { code: "ha", label: "Hausa" },
  { code: "zu", label: "Zulu" },
  { code: "af", label: "Afrikaans" },
  { code: "sv", label: "Swedish (Svenska)" },
  { code: "no", label: "Norwegian (Norsk)" },
  { code: "da", label: "Danish (Dansk)" },
  { code: "fi", label: "Finnish (Suomi)" },
  { code: "is", label: "Icelandic (Íslenska)" },
  { code: "et", label: "Estonian (Eesti)" },
  { code: "lv", label: "Latvian (Latviešu)" },
  { code: "lt", label: "Lithuanian (Lietuvių)" },
];

export function TranscriptHero({ platform }: { platform: string }) {
  const config = usePlatformTranslations(platform);
  const brandColor = config.brandColor;
  const Logo = config.Logo;
  const InputIcon = config.inputIcon;
  const t = useTranslations("DownloadOnly");
  const rt = useTranslations();
  const st = useTranslations("PlatformShared");

  const [selectedLanguage, setSelectedLanguage] = useState<string>("auto");
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

  const [transcript, setTranscript] = useState<string | null>(null);
  const [transcriptSegments, setTranscriptSegments] = useState<TranscriptSegment[] | null>(null);
  const [transcriptFilename, setTranscriptFilename] = useState<string | null>(null);
  const [transcriptJsonUrl, setTranscriptJsonUrl] = useState<string | null>(null);
  const [transcriptJsonFilename, setTranscriptJsonFilename] = useState<string | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Bring the finished transcript into view, especially on small screens
  useEffect(() => {
    if (transcript && transcriptRef.current) {
      const id = window.setTimeout(
        () => transcriptRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        350,
      );
      return () => window.clearTimeout(id);
    }
  }, [transcript]);

  const formats: ApiFormatInfo[] = resolveFormats(mediaInfo, "transcript");

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

  // Clear transcript when language changes so user knows to re-transcribe
  useEffect(() => {
    setTranscript(null);
    setTranscriptSegments(null);
    setTranscriptFilename(null);
    setTranscriptJsonUrl(null);
    setTranscriptJsonFilename(null);
  }, [selectedLanguage]);

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
      const fmt = formats[selectedFormat];
      const res = await universalDownloadTranscript(url, fmt.ext, selectedLanguage);
      if (!res.success || !res.data) {
        throw new Error(res.error?.message || st("errorDownloadFailed"));
      }
      setStatusText(st("transcribing", { defaultValue: "Transcribing..." }));
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

              if (data.transcript || data.downloadUrl) {
                // Trigger the actual transcript file download
                if (data.downloadUrl) {
                  triggerDownload(data.downloadUrl, data.filename || undefined);
                } else if (data.transcript) {
                  const fmt = formats[selectedFormat];
                  const ext = fmt?.ext || "srt";
                  const safeTitle = (mediaInfo?.title || "transcript").replace(/[^\w\s.-]+/g, "").trim() || "transcript";
                  downloadTextFile(data.transcript, data.filename || `${safeTitle}.${ext}`);
                }
                // Keep content for the in-page viewer (copy / search / format switch)
                setTranscript(data.transcript ?? null);
                setTranscriptSegments(data.segments || null);
                setTranscriptFilename(data.filename || null);
                setTranscriptJsonUrl(data.jsonDownloadUrl || null);
                setTranscriptJsonFilename(data.jsonFilename || null);
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

  const getBrandGradient = () => `linear-gradient(135deg, ${brandColor} 0%, ${darkerShade} 50%, ${brandColor} 100%)`;

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-28 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <motion.div
        className="absolute top-[-15%] right-[-8%] w-[600px] h-[600px] rounded-full opacity-15 pointer-events-none blur-3xl"
        style={{ background: `radial-gradient(circle, ${brandColor} 0%, transparent 70%)` }}
        animate={{ x: ["0%", "20%", "0%"], y: ["0%", "-15%", "0%"], scale: [1, 1.3, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[15%] left-[-10%] w-[400px] h-[400px] rounded-full opacity-12 pointer-events-none blur-3xl"
        style={{ background: "radial-gradient(circle, #5baab8 0%, transparent 70%)" }}
        animate={{ x: ["0%", "-15%", "0%"], y: ["0%", "20%", "0%"], scale: [1, 1.2, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-8%] right-[5%] w-[350px] h-[350px] rounded-full opacity-10 pointer-events-none blur-3xl"
        style={{ background: `radial-gradient(circle, ${brandColor} 0%, transparent 70%)` }}
        animate={{ x: ["0%", "-25%", "0%"], y: ["0%", "15%", "0%"], scale: [1, 1.3, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-5xl mx-auto relative">
        {Logo && (
          <motion.div
            className="hidden lg:block absolute top-[-60px] right-[-80px] opacity-[0.03] pointer-events-none"
            initial={{ opacity: 0, scale: 0.4, rotate: -15 }}
            animate={{ opacity: 0.03, scale: 1, rotate: 0 }}
            transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
          >
            <Logo className="w-64 h-64" />
          </motion.div>
        )}

        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full bg-white/90 dark:bg-[#0d1f26]/90 backdrop-blur-sm border border-border/80 dark:border-white/10 text-muted-foreground shadow-lg shadow-black/5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: brandColor, boxShadow: `0 0 8px ${brandColor}` }} />
            {config.name} {t("transcriptBadge")}
          </span>
        </motion.div>

        <motion.h1
          className="text-center text-[clamp(1.9rem,6vw,3rem)] leading-[1.08] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-foreground mb-6 font-heading"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: "easeOut" }}
        >
          {(() => {
            try {
              return t("transcriptHeading", { platform: config.name } as any);
            } catch {
              return `Generate ${config.name} Transcripts`;
            }
          })()}
          <br />
          <span style={{ background: getBrandGradient(), WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {t("transcriptHeadingSuffix")}
          </span>
        </motion.h1>

        <motion.p
          className="text-center text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 md:mb-12 lg:mb-14 leading-relaxed font-sans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: "easeOut" }}
        >
          {t("transcriptSubheading")}
        </motion.p>

        <motion.div
          className="bg-white/80 dark:bg-[#0a1018]/80 backdrop-blur-2xl rounded-3xl shadow-[0_25px_80px_-20px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.6),inset_0_-1px_0_rgba(0,0,0,0.02)] border border-border/60 dark:border-white/10 p-4 sm:p-6 md:p-7 lg:p-8 relative"
          initial={{ opacity: 0, y: 32, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
        >
          <div
            className="absolute inset-x-0 top-0 h-0.5 rounded-t-3xl"
            style={{ background: getBrandGradient() }}
          />

          <div className="flex flex-col gap-3 lg:gap-3.5">
            {/* Language selector: full-width bar on mobile, compact row from tablet up, joins the main row on laptop */}
            <div className="flex items-center gap-2.5 lg:w-auto flex-shrink-0">
              <label htmlFor="language" className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground dark:text-white/60 whitespace-nowrap">
                <Globe className="w-3.5 h-3.5" />
                {(() => {
                  try {
                    return t("transcriptLanguageLabel");
                  } catch {
                    return "Language:";
                  }
                })()}
              </label>
              <select
                id="language"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white dark:bg-[#141a2a] border border-border dark:border-white/10 rounded-xl px-3 py-3 md:py-2.5 text-sm text-foreground dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5baab8]/40 focus:border-transparent w-full md:w-auto md:min-w-[240px] lg:min-w-[210px] lg:max-w-[240px] appearance-none cursor-pointer transition-all duration-200"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                  paddingRight: "2.5rem",
                }}
              >
                {TRANSCRIPT_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {rt(`TranscriptLanguage.${lang.code}`, { defaultValue: lang.label })}
                  </option>
                ))}
              </select>
            </div>

            {/* URL input + action button share a row from tablet up */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-3.5 lg:gap-4">
            <div
              className="brand-input flex-1 flex items-center gap-3 bg-white/60 dark:bg-[#0d1f26]/60 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl px-4 py-3.5"
              style={{ "--brand": brandColor } as CSSProperties}
            >
              <span
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shadow-lg shadow-[#5baab8]/30 flex-shrink-0 transition-transform duration-300 hover:scale-110"
                style={{ background: `linear-gradient(135deg, #5baab8 0%, #3d8896 100%)` }}
              >
                {InputIcon ? <InputIcon className="w-4.5 h-4.5 text-white" /> : <Download className="w-4.5 h-4.5 text-white" />}
              </span>
              <div className="flex-1 min-w-0">
                <input
                  ref={inputRef}
                  type="url"
                  inputMode="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDownload()}
                  placeholder={config.placeholder}
                  className="w-full bg-transparent text-base sm:text-lg text-foreground dark:text-white placeholder:text-muted-foreground/50 dark:placeholder:text-white/30 outline-none font-sans tracking-wide"
                  autoComplete="off"
                  spellCheck={false}
                />
                {fetchingInfo && (
                  <p className="text-[11px] text-muted-foreground dark:text-white/50 flex items-center gap-1.5 mt-1 font-sans">
                    <Loader2 className="w-3 h-3 animate-spin" style={{ color: brandColor }} />
                    {st("fetchingInfo")}
                  </p>
                )}
              </div>
              {url && (
                <button
                  onClick={() => { setUrl(""); setMediaInfo(null); setInfoReady(false); setInfoError(false); inputRef.current?.focus(); }}
                  className="text-muted-foreground hover:text-foreground dark:hover:text-white transition-all duration-200 shrink-0 p-2 -m-1 rounded-lg hover:bg-white/50 dark:hover:bg-white/10"
                  aria-label="Clear URL"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <motion.button
              onClick={handleDownload}
              disabled={processing || fetchingInfo}
              whileHover={{ scale: processing || fetchingInfo ? 1 : 1.04, y: processing || fetchingInfo ? 0 : -3 }}
              whileTap={{ scale: processing || fetchingInfo ? 1 : 0.96, y: processing || fetchingInfo ? 0 : 1 }}
              className="brand-glow group flex items-center justify-center gap-2.5 text-white font-bold text-sm sm:text-base px-7 py-3.5 md:px-8 md:py-4 rounded-2xl transition-all duration-300 disabled:opacity-50 w-full md:w-auto md:min-w-[180px] lg:min-w-[200px] relative overflow-hidden font-sans tracking-wide bg-gradient-to-r from-[#0d1f26] via-[#143d4a] to-[#0d1f26] bg-[length:200%_auto] animate-gradient-shift"
              style={{ "--brand-glow": `${brandColor}55` } as CSSProperties}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.5s] ease-in-out pointer-events-none" />
              <AnimatePresence mode="wait">
                {fetchingInfo ? (
                  <motion.span key="fetch" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 relative z-10">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {st("fetching")}
                  </motion.span>
                ) : processing ? (
                  <motion.span key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 relative z-10">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {statusText || st("processing")}
                  </motion.span>
                ) : done ? (
                  <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 relative z-10">
                    <CheckCircle2 className="w-4 h-4" style={{ color: brandColor }} />
                    {st("ready")}
                  </motion.span>
                ) : infoReady ? (
                  <motion.span key="now" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 relative z-10">
                    <FileText className="w-4 h-4" />
                    {st("transcribeBtn", { defaultValue: "Transcribe" })}
                  </motion.span>
                ) : (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 relative z-10">
                    <FileText className="w-4 h-4" />
                    {st("transcribeBtn", { defaultValue: "Transcribe" })}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {mediaInfo && !processing && !done && !transcript && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div className="h-px bg-border/50 my-5 md:my-6" />
                <VideoPreview info={mediaInfo} />
              </motion.div>
            )}
          </AnimatePresence>

          {infoError && !mediaInfo && !fetchingInfo && url.trim() && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-destructive mt-4 flex items-center gap-2 font-sans"
            >
              <FileText className="w-3.5 h-3.5" />
              {st("errorFetchInfo")}
            </motion.p>
          )}

          <AnimatePresence>
            {!processing && !done && mediaInfo && !transcript && (
              <motion.div
                key="formatGrid"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="mt-5 md:mt-6"
              >
                <div className="flex items-center gap-2.5 mb-4">
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${brandColor} 0%, ${darkerShade} 100%)` }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </span>
                  <span className="text-sm font-semibold text-foreground font-sans">
                    {t("chooseTranscriptFormat")}
                  </span>
                </div>
                <FormatGrid
                  formats={formats}
                  selectedIndex={selectedFormat}
                  onSelect={setSelectedFormat}
                  type="transcript"
                  brandColor={brandColor}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {processing && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="mt-5 md:mt-6"
              >
                <DownloadProgress
                  progress={progress}
                  statusText={statusText}
                  downloadSpeed={downloadSpeed}
                  downloadEta={downloadEta}
                  downloadedBytes={downloadedBytes}
                  totalBytes={totalBytes}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-destructive mt-4 flex items-center gap-2 font-sans"
              >
                <FileText className="w-3.5 h-3.5" />
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {transcript && (
              <motion.div
                key="transcriptViewer"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, delay: 0.15 }}
                className="mt-5 md:mt-6 scroll-mt-24"
                ref={transcriptRef}
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
          className="text-center text-xs sm:text-sm text-muted-foreground mt-6 md:mt-8 font-sans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {t("disclaimer", { platform: config.name })}
        </motion.p>
      </div>
    </section>
  );
}