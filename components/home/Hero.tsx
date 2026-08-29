"use client";

import { useState, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import {
  Download, Music, Image, Video, ChevronDown, CheckCircle2, Play, X, FileText, Loader2,
  ClipboardPaste,
} from "lucide-react";
import type { DownloadType } from "@/lib/constants";
import { platforms } from "@/lib/constants";
import { useDownloader } from "@/lib/useDownloader";
import { VideoPreview } from "@/components/youtube-download/VideoPreview";

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}

const easeOutExpo: [number, number, number, number] = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOutExpo } },
};

const lineReveal = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.85, ease: easeOutExpo } },
};

export function Hero() {
  const t = useTranslations("HomePage");
  const st = useTranslations("PlatformShared");
  const {
    url, activeType, selectedFormat, setSelectedFormat, setActiveType,
    mediaInfo, fetchingInfo, infoReady, infoError, processing, done,
    progress, statusText, downloadSpeed, downloadEta, downloadedBytes, totalBytes,
    error, formats, inputRef, handleUrlChange, handleDownloadClick,
  } = useDownloader();

  const [showFormats, setShowFormats] = useState(false);

  const typeConfig = {
    video: { icon: Video, label: st("typeVideo") },
    audio: { icon: Music, label: st("typeAudio") },
    thumbnail: { icon: Image, label: st("typeThumbnail") },
    transcript: { icon: FileText, label: st("typeTranscript") },
  };

  const selectedFmt = formats[selectedFormat];

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText();
      if (text) handleUrlChange(text.trim());
    } catch {
      inputRef.current?.focus();
    }
  }

  const marqueePlatforms = platforms.slice(0, 10);

  return (
    <section className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6">
      {/* Layered background: blueprint grid + drifting aurora glows */}
      <div className="absolute inset-0 bg-grid bg-grid-fade pointer-events-none" aria-hidden />
      <motion.div
        className="absolute -top-32 right-[-10%] w-[560px] h-[560px] rounded-full opacity-30 pointer-events-none blur-3xl"
        style={{ background: "radial-gradient(circle, #5baab8 0%, transparent 70%)" }}
        animate={{ x: ["6%", "-6%", "6%"], y: ["-4%", "6%", "-4%"], scale: [1, 1.12, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-20%] left-[-8%] w-[440px] h-[440px] rounded-full opacity-20 pointer-events-none blur-3xl"
        style={{ background: "radial-gradient(circle, #a8d4dc 0%, transparent 70%)" }}
        animate={{ x: ["-5%", "5%", "-5%"], y: ["5%", "-5%", "5%"], scale: [1, 1.15, 1] }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="max-w-4xl mx-auto relative"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Badge */}
        <motion.div className="flex justify-center mb-6" variants={fadeUp}>
          <span className="glass inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.16em] uppercase px-4 py-2 rounded-full border border-border/70 text-muted-foreground shadow-[0_8px_30px_-12px_rgba(13,31,38,0.15)] font-mono">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-[#5baab8] opacity-60 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-[#5baab8]" />
            </span>
            {t("badge")}
          </span>
        </motion.div>

        {/* Headline — masked line reveal with shimmering accent */}
        <h1 className="text-center font-heading font-bold tracking-[-0.03em] text-foreground mb-6 text-[clamp(2.15rem,5.2vw+1rem,4.6rem)] leading-[1.06]">
          <span className="block overflow-hidden pb-1">
            <motion.span className="block will-change-transform" variants={lineReveal}>
              {t("heading")}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-2">
            <motion.span className="block will-change-transform" variants={lineReveal}>
              <span className="text-shimmer">{t("headingAccent")}</span>
              <span className="text-foreground">{t("headingRest")}</span>
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="text-center text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed [text-wrap:pretty]"
          variants={fadeUp}
        >
          {t("subheading")}
        </motion.p>

        {/* Segmented type switcher */}
        <motion.div className="flex justify-center mb-5" variants={fadeUp}>
          <div className="max-w-full overflow-x-auto px-3 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="glass inline-flex border border-border/70 rounded-full p-1 gap-0.5 sm:gap-1 shadow-[0_10px_36px_-14px_rgba(13,31,38,0.18)]">
              {(["video", "audio", "thumbnail", "transcript"] as DownloadType[]).map((type) => {
                const cfg = typeConfig[type];
                const Icon = cfg.icon;
                const active = activeType === type;
                return (
                  <button
                    key={type}
                    onClick={() => { setActiveType(type); setSelectedFormat(0); setShowFormats(false); }}
                    className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-colors font-sans whitespace-nowrap ${
                      active ? "text-white" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="typePill"
                        className="absolute inset-0 bg-gradient-to-r from-[#0d1f26] to-[#143d4a] rounded-full shadow-[0_8px_20px_-6px_rgba(13,31,38,0.5)]"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <Icon className={`w-3.5 h-3.5 relative z-10 transition-colors ${active ? "text-[#8fd3df]" : ""}`} />
                    <span className="relative z-10">{cfg.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Downloader card with gradient border */}
        <motion.div variants={fadeUp}>
          <div className="relative rounded-[26px] p-px bg-gradient-to-b from-[#5baab8]/45 via-border/50 to-[#5baab8]/15 shadow-[0_30px_80px_-30px_rgba(13,31,38,0.3)]">
            <div className="glass rounded-[25px] p-3 sm:p-4 md:p-5">
              <div className="flex flex-col md:flex-row gap-3">
                {/* URL input */}
                <div className="flex-1 flex items-center gap-3 bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl px-4 min-h-[54px] shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_8px_30px_rgba(0,0,0,0.05)] transition-all duration-300 focus-within:border-[#5baab8]/40 focus-within:ring-[3px] focus-within:ring-[#5baab8]/20 focus-within:shadow-[0_8px_34px_rgba(91,170,184,0.18)]">
                  <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#5baab8] to-[#3d8896] flex items-center justify-center shadow-md shadow-[#5baab8]/25 flex-shrink-0 animate-float-soft">
                    <Play className="w-3.5 h-3.5 text-white fill-white" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <input
                      ref={inputRef}
                      type="url"
                      inputMode="url"
                      value={url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleDownloadClick()}
                      placeholder={t("placeholder", { defaultValue: "Paste your video URL here..." })}
                      className="w-full bg-transparent text-base sm:text-[15px] text-foreground placeholder:text-muted-foreground/60 outline-none font-sans tracking-wide"
                    />
                    {fetchingInfo && (
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5 font-sans">
                        <Loader2 className="w-2.5 h-2.5 animate-spin" /> {st("fetchingInfo")}
                      </p>
                    )}
                    {mediaInfo?.title && !fetchingInfo && (
                      <p className="text-[10px] text-muted-foreground truncate mt-0.5 font-sans">{mediaInfo.title}</p>
                    )}
                  </div>
                  <button
                    onClick={handlePaste}
                    aria-label={t("pasteFromClipboardAria", { defaultValue: "Paste from clipboard" })}
                    title={t("pasteFromClipboardAria", { defaultValue: "Paste from clipboard" })}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-[#5baab8] border border-border/60 hover:border-[#5baab8]/40 rounded-full px-2.5 py-1.5 transition-colors flex-shrink-0"
                  >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{st("paste", { defaultValue: "Paste" })}</span>
                  </button>
                  {url && (
                    <button onClick={() => handleUrlChange("")} aria-label={t("clearUrlAria", { defaultValue: "Clear URL" })} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 p-1">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Format picker */}
                {activeType !== "thumbnail" && infoReady && (
                  <div className="relative">
                    <button
                      onClick={() => setShowFormats(!showFormats)}
                      className="flex items-center gap-2 bg-[#eef6f8] dark:bg-white/10 hover:bg-[#d4ecf0] dark:hover:bg-white/15 rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors whitespace-nowrap w-full md:w-auto font-sans min-h-[54px] justify-center"
                    >
                      <span className="text-xs font-bold uppercase tracking-widest text-[#5baab8] font-mono">
                        {selectedFmt?.ext?.toUpperCase()}
                      </span>
                      <span className="text-muted-foreground">{selectedFmt?.quality_label || selectedFmt?.ext?.toUpperCase() || ""}</span>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${showFormats ? "rotate-180" : ""}`} />
                    </button>

                    <AnimatePresence>
                      {showFormats && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.96 }}
                          transition={{ duration: 0.18 }}
                          className="absolute top-full left-0 right-0 md:left-auto md:right-0 mt-2 bg-popover/95 backdrop-blur-xl rounded-xl border border-border shadow-2xl z-20 overflow-hidden min-w-[220px]"
                        >
                          {formats.map((fmt, i) => (
                            <button
                              key={i}
                              onClick={() => { setSelectedFormat(i); setShowFormats(false); }}
                              className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-muted/70 transition-colors text-left font-sans ${
                                i === selectedFormat ? "bg-[#eef6f8] dark:bg-white/10 font-semibold" : ""
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

                {/* Download button */}
                <motion.button
                  onClick={handleDownloadClick}
                  disabled={processing || fetchingInfo}
                  whileHover={{ scale: processing || fetchingInfo ? 1 : 1.04, y: processing || fetchingInfo ? 0 : -2 }}
                  whileTap={{ scale: processing || fetchingInfo ? 1 : 0.96 }}
                  className="brand-glow group flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#0d1f26] via-[#143d4a] to-[#0d1f26] bg-[length:200%_auto] animate-gradient-shift text-white font-bold text-sm px-7 rounded-2xl transition-all duration-300 disabled:opacity-60 w-full md:w-auto md:min-w-[170px] min-h-[54px] relative overflow-hidden font-sans tracking-wide"
                  style={{ "--brand-glow": "rgba(13, 31, 38, 0.5)" } as CSSProperties}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-[1.2s] ease-in-out pointer-events-none" />
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
                        <CheckCircle2 className="w-4 h-4 text-[#8fd3df]" />
                        {st("ready")}
                      </motion.span>
                    ) : infoReady ? (
                      <motion.span key="now" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        {st("downloadNow")}
                      </motion.span>
                    ) : (
                      <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                        <Download className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                        {st("download")}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Link details — video card (thumbnail, title, channel, stats) */}
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
                  {st("errorFetchInfo")}
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
                    <span className="text-2xl font-bold tabular-nums text-[#0d1f26] dark:text-foreground font-mono">
                      {Math.round(progress)}%
                    </span>
                    <div className="flex-1">
                      <div className="w-full bg-[#eef6f8] dark:bg-white/10 rounded-full h-2.5 overflow-hidden shadow-inner">
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
            </div>
          </div>

          <motion.p
            className="text-center text-xs text-muted-foreground mt-5 font-sans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {t("disclaimer")}
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Platform marquee */}
      <motion.div
        className="max-w-5xl mx-auto relative mt-12 md:mt-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.7, ease: easeOutExpo }}
      >
        <p className="text-center text-[10px] font-semibold tracking-[0.22em] uppercase text-muted-foreground/70 font-mono mb-4">
          {t("worksWith", { defaultValue: "Works with" })}
        </p>
        <div
          className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
          dir="ltr"
        >
          <div className="flex w-max gap-3 animate-marquee">
            {[...marqueePlatforms, ...marqueePlatforms].map((p, i) => {
              const Logo = p.Logo;
              return (
                <div
                  key={`${p.name}-${i}`}
                  className="glass flex items-center gap-2.5 rounded-full border border-border/60 px-4 py-2 shadow-sm shrink-0"
                >
                  <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: p.bg }}>
                    <Logo className="w-3.5 h-3.5" style={{ color: p.fg }} />
                  </span>
                  <span className="text-xs font-semibold text-muted-foreground font-sans whitespace-nowrap">{p.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
