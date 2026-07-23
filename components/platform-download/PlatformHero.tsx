"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  Download, CheckCircle2, Play, X, Sparkles, Music, Image, Loader2, FileText,
} from "lucide-react";
import type { DownloadType } from "@/lib/constants";
import { FormatGrid } from "@/components/youtube-download/FormatGrid";
import { VideoPreview } from "@/components/youtube-download/VideoPreview";
import { DownloadProgress } from "@/components/youtube-download/DownloadProgress";
import { useDownloader } from "@/lib/useDownloader";
import { usePlatformTranslations } from "@/lib/usePlatformTranslations";
import { useTranslations } from "next-intl";

function SkeletonPreview() {
  return (
    <div className="mt-4 animate-pulse" role="status" aria-label="Loading video information">
      <div className="h-px bg-border mb-4" />
      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-72 lg:w-80 aspect-video md:aspect-[4/3] bg-muted rounded-xl" />
        <div className="flex-1 space-y-3 py-2">
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-1/2" />
          <div className="h-3 bg-muted rounded w-2/3" />
          <div className="h-3 bg-muted rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}

export function PlatformHero({ platform }: { platform: string }) {
  const config = usePlatformTranslations(platform);
  const {
    url, activeType, selectedFormat, setSelectedFormat, setActiveType,
    mediaInfo, fetchingInfo, infoReady, infoError, processing, done,
    progress, statusText, downloadSpeed, downloadEta, downloadedBytes, totalBytes,
    error, formats, inputRef, handleUrlChange, handleDownloadClick,
  } = useDownloader();
  const st = useTranslations("PlatformShared");

  const typeConfig = {
    video: { icon: Play, label: st("typeVideo") },
    audio: { icon: Music, label: st("typeAudio") },
    thumbnail: { icon: Image, label: st("typeThumbnail") },
    transcript: { icon: FileText, label: st("typeTranscript") },
  };

  const InputIcon = config.inputIcon;
  const Logo = config.Logo;

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
        style={{ background: `radial-gradient(circle, ${config.brandColor} 0%, transparent 70%)` }}
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
        style={{ background: `radial-gradient(circle, ${config.brandColor} 0%, transparent 70%)` }}
        animate={{ x: ["0%", "-20%", "0%"], y: ["0%", "10%", "0%"], scale: [1, 1.25, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          className="hidden md:block absolute top-[-40px] right-[-60px] opacity-[0.04] pointer-events-none"
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ opacity: 0.04, scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
        >
          <Logo className="w-48 h-48" />
        </motion.div>

        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-border text-muted-foreground shadow-sm font-mono">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: config.brandColor, boxShadow: `0 0 4px ${config.brandColor}` }}
            />
            {config.badge}
          </span>
        </motion.div>

        <motion.h1
          className="text-center text-[2rem] leading-tight sm:text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 font-heading"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          {config.heading}
          <br />
          <span style={{ color: config.brandColor }}>{config.headingAccent}</span>
        </motion.h1>

        <motion.p
          className="text-center text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed font-sans"
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
          <div className="max-w-full overflow-x-auto px-3 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="inline-flex bg-white/80 backdrop-blur-sm border border-border rounded-full p-1 shadow-sm gap-0.5 sm:gap-1 relative">
              {(["video", "audio", "thumbnail", "transcript"] as DownloadType[]).map((type) => {
                const cfg = typeConfig[type];
                const Icon = cfg.icon;
                const active = activeType === type;
                return (
                  <button
                    key={type}
                    onClick={() => { setActiveType(type); setSelectedFormat(0); }}
                    className={`relative flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-colors font-sans whitespace-nowrap ${
                      active ? "text-white" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="platTypePill"
                        className="absolute inset-0 rounded-full shadow-md"
                        style={{ backgroundColor: config.brandColor }}
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <Icon className="w-3.5 h-3.5 relative z-10" />
                    <span className="relative z-10">{cfg.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
           className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/5 border border-border/60 p-4 sm:p-5 md:p-6 relative"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div
            className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl"
            style={{ background: `linear-gradient(90deg, ${config.brandColor}, #5baab8, ${config.brandColor})` }}
          />

          <div className="flex flex-col md:flex-row gap-3">
            <div
              className="flex-1 flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 transition-all duration-300"
              style={{ boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)" }}
              onFocus={(e) => {
                const parent = e.currentTarget;
                parent.style.boxShadow = `inset 0 1px 2px rgba(0,0,0,0.04), 0 0 0 2px ${config.brandColor}40`;
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
                style={{ color: config.brandColor }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.15)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <InputIcon className="w-4 h-4" />
              </span>
              <div className="flex-1 min-w-0">
                <input
                  ref={inputRef}
                  type="url"
                  value={url}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDownloadClick()}
                  placeholder={config.placeholder}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans"
                />
              </div>
              {url && (
                <button onClick={() => handleUrlChange("")} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <motion.button
              onClick={handleDownloadClick}
              disabled={processing || fetchingInfo}
              whileHover={{ scale: processing || fetchingInfo ? 1 : 1.03 }}
              whileTap={{ scale: processing || fetchingInfo ? 1 : 0.97 }}
               className="flex items-center justify-center gap-2 text-white font-semibold text-sm px-7 py-3 rounded-xl transition-all duration-300 disabled:opacity-70 w-full md:min-w-[150px] font-sans relative overflow-hidden group"
              style={{
                background: `linear-gradient(135deg, #0d1f26, ${config.brandColor}DD)`,
              }}
            >
              <motion.span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${config.brandColor}DD, #0d1f26)`,
                }}
              />
              <span className="relative z-10 flex items-center gap-2">
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
                      <CheckCircle2 className="w-4 h-4" />
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
              </span>
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {fetchingInfo && !mediaInfo && (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <SkeletonPreview />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {mediaInfo && !processing && !done && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
              >
                <div className="h-px bg-border/60 my-4" />
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
                  <Sparkles className="w-3.5 h-3.5" style={{ color: config.brandColor }} />
                  <span className="text-xs font-semibold text-foreground font-sans">
                    {activeType === "video" ? st("chooseVideoQuality") : activeType === "audio" ? st("chooseAudioQuality") : activeType === "transcript" ? st("chooseTranscriptFormat") : st("chooseThumbnailFormat")}
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
          {st("disclaimer")}
        </motion.p>
      </div>
    </section>
  );
}
