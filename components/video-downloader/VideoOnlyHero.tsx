"use client";

import type { CSSProperties } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Download, CheckCircle2, X, Sparkles, Loader2, ShieldCheck, Gift, MonitorPlay, Lock } from "lucide-react";
import { usePlatformTranslations } from "@/lib/usePlatformTranslations";
import { FormatGrid } from "@/components/youtube-download/FormatGrid";
import { VideoPreview } from "@/components/youtube-download/VideoPreview";
import { DownloadProgress } from "@/components/youtube-download/DownloadProgress";
import { useDownloader } from "@/lib/useDownloader";
import { useTranslations } from "next-intl";

export function VideoOnlyHero({ platform = "youtube" }: { platform?: string }) {
  const config = usePlatformTranslations(platform);
  const brandColor = config.brandColor;
  const Logo = config.Logo;
  const InputIcon = config.inputIcon;
  const t = useTranslations("VideoOnly");
  const st = useTranslations("PlatformShared");
  const reduceMotion = useReducedMotion();

  const darkerShade = brandColor === "#010101" || brandColor === "#14171A" || brandColor === "#000000"
    ? "#333333"
    : brandColor;

  const {
    url, selectedFormat, setSelectedFormat,
    mediaInfo, fetchingInfo, infoReady, infoError, processing, done,
    progress, statusText, downloadSpeed, downloadEta, downloadedBytes, totalBytes,
    error, formats, inputRef, handleUrlChange, handleDownloadClick,
  } = useDownloader();

  const blobAnim = reduceMotion
    ? {}
    : {
        animate: { x: ["0%", "15%", "0%"], y: ["0%", "-10%", "0%"], scale: [1, 1.2, 1] },
        transition: { duration: 10, repeat: Infinity, ease: "easeInOut" as const },
      };
  const blobAnim2 = reduceMotion
    ? {}
    : {
        animate: { x: ["0%", "-10%", "0%"], y: ["0%", "15%", "0%"], scale: [1, 1.15, 1] },
        transition: { duration: 13, repeat: Infinity, ease: "easeInOut" as const },
      };
  const blobAnim3 = reduceMotion
    ? {}
    : {
        animate: { x: ["0%", "-20%", "0%"], y: ["0%", "10%", "0%"], scale: [1, 1.25, 1] },
        transition: { duration: 15, repeat: Infinity, ease: "easeInOut" as const },
      };

  const trustChips = [
    { icon: Gift, label: t("trustFree") },
    { icon: ShieldCheck, label: t("trustNoSignup") },
    { icon: MonitorPlay, label: t("trustQuality") },
    { icon: Lock, label: t("trustPrivate") },
  ];

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-dot-grid" />

      <motion.div
        className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${brandColor} 0%, transparent 70%)` }}
        {...blobAnim}
      />
      <motion.div
        className="absolute top-[20%] left-[-8%] w-[350px] h-[350px] rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #5baab8 0%, transparent 70%)" }}
        {...blobAnim2}
      />
      <motion.div
        className="absolute bottom-[-5%] right-[10%] w-[300px] h-[300px] rounded-full opacity-10 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${brandColor} 0%, transparent 70%)` }}
        {...blobAnim3}
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
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border text-muted-foreground shadow-sm font-mono">
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: brandColor, boxShadow: `0 0 4px ${brandColor}` }} />
            {config.name} {t("badge")}
          </span>
        </motion.div>

        <motion.h1
          className="text-center text-fluid-hero leading-[1.08] font-extrabold tracking-tight text-foreground mb-6 font-heading text-balance hyphens-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          {config.heading}{" "}
          <span className="block sm:inline" style={{ color: brandColor }}>{config.headingAccent}</span>
        </motion.h1>

        <motion.p
          className="text-center text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed font-sans text-pretty"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
          {config.subheading}
        </motion.p>

        <motion.div
           className="glass rounded-2xl shadow-2xl shadow-black/5 dark:shadow-black/30 border border-border/60 p-4 sm:p-5 md:p-6 relative"
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
              className="brand-input flex-1 flex items-center gap-3 bg-input-background/60 backdrop-blur-md border border-border/60 rounded-2xl px-4 py-3.5"
              style={{ "--brand": brandColor } as CSSProperties}
            >
              <span
                className="w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg flex-shrink-0 transition-transform duration-300 hover:scale-110"
                style={{ background: `linear-gradient(135deg, ${brandColor}, ${darkerShade})`, boxShadow: `0 4px 12px -2px ${brandColor}40` }}
              >
                {InputIcon ? <InputIcon className="w-4 h-4 text-white" /> : <Download className="w-4 h-4 text-white" />}
              </span>
              <div className="flex-1 min-w-0">
                <input
                  ref={inputRef}
                  type="url"
                  inputMode="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDownloadClick()}
                  placeholder={config.placeholder}
                  aria-label={config.placeholder}
                  className="w-full bg-transparent text-base sm:text-sm text-foreground placeholder:text-muted-foreground/60 outline-none font-sans tracking-wide"
                />
              </div>
              {url && (
                <button onClick={() => handleUrlChange("")} aria-label="Clear URL" className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <motion.button
              onClick={handleDownloadClick}
              disabled={processing || fetchingInfo}
              whileHover={reduceMotion || processing || fetchingInfo ? undefined : { scale: 1.05, y: -2 }}
              whileTap={reduceMotion || processing || fetchingInfo ? undefined : { scale: 0.95, y: 1 }}
              className="brand-btn group flex items-center justify-center gap-2.5 text-white font-bold text-sm px-7 py-3.5 rounded-2xl transition-all duration-300 disabled:opacity-60 w-full md:w-auto md:min-w-[170px] relative overflow-hidden font-sans tracking-wide"
              style={{
                "--brand": brandColor,
                "--brand-dark": darkerShade,
                "--brand-glow": `${brandColor}55`,
              } as CSSProperties}
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
                    <CheckCircle2 className="w-4 h-4" style={{ color: brandColor }} />
                    {st("ready")}
                  </motion.span>
                ) : infoReady ? (
                  <motion.span key="now" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    {st("downloadNow")}
                  </motion.span>
                ) : (
                  <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    {st("download")}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 mt-4" aria-label="Key benefits">
            {trustChips.map(({ icon: Icon, label }) => (
              <li key={label} className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-muted-foreground font-sans">
                <Icon className="w-3.5 h-3.5" style={{ color: brandColor }} aria-hidden />
                {label}
              </li>
            ))}
          </ul>

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
                  <Sparkles className="w-3.5 h-3.5" style={{ color: brandColor }} />
                  <span className="text-xs font-semibold text-foreground font-sans">
                    {st("chooseVideoQuality")}
                  </span>
                </div>
                <FormatGrid
                  formats={formats}
                  selectedIndex={selectedFormat}
                  onSelect={setSelectedFormat}
                  type="video"
                  brandColor={brandColor}
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
          {t("disclaimer", { platform: config.name })}
        </motion.p>
      </div>
    </section>
  );
}
