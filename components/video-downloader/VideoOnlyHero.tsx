"use client";

import { motion, AnimatePresence } from "motion/react";
import { Download, CheckCircle2, X, Sparkles, Loader2 } from "lucide-react";
import { platformConfigs } from "@/lib/platform-config";
import { FormatGrid } from "@/components/youtube-download/FormatGrid";
import { VideoPreview } from "@/components/youtube-download/VideoPreview";
import { DownloadProgress } from "@/components/youtube-download/DownloadProgress";
import { useDownloader } from "@/lib/useDownloader";

export function VideoOnlyHero({ platform }: { platform: string }) {
  const config = platformConfigs[platform];
  const brandColor = config?.brandColor || "#5baab8";
  const Logo = config?.Logo;
  const InputIcon = config?.inputIcon;
  const darkerShade = brandColor === "#010101" || brandColor === "#14171A" || brandColor === "#000000"
    ? "#333333"
    : brandColor;

  const {
    url, selectedFormat, setSelectedFormat,
    mediaInfo, fetchingInfo, infoReady, infoError, processing, done,
    progress, statusText, downloadSpeed, downloadEta, downloadedBytes, totalBytes,
    error, formats, inputRef, handleUrlChange, handleDownloadClick,
  } = useDownloader();

  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
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
        style={{ background: `radial-gradient(circle, #5baab8 0%, transparent 70%)` }}
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
            {config?.name || ""} Video Downloader
          </span>
        </motion.div>

        <motion.h1
          className="text-center text-5xl md:text-7xl font-extrabold leading-[1.08] tracking-tight text-foreground mb-6 font-heading"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          {config?.heading || "Download Videos"}
          <br />
          <span style={{ color: brandColor }}>{config?.headingAccent || "in HD"}</span>
        </motion.h1>

        <motion.p
          className="text-center text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed font-sans"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
          {config?.subheading || "Paste any video link and download instantly in your preferred quality."}
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
                  onKeyDown={(e) => e.key === "Enter" && handleDownloadClick()}
                  placeholder={config?.placeholder || "Paste your video URL here..."}
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
                    Fetching...
                  </motion.span>
                ) : processing ? (
                  <motion.span key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {statusText || "Processing..."}
                  </motion.span>
                ) : done ? (
                  <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" style={{ color: brandColor }} />
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
              Could not fetch video info. Check the URL and try again.
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
                    Choose video quality
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
          Free to use · No sign-up required · Files deleted instantly after download · Works with all {config?.name || ""} URLs
        </motion.p>
      </div>
    </section>
  );
}
