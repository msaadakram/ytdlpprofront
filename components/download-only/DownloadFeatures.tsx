"use client";

import { motion } from "motion/react";
import { Music, Radio, Waves, Disc, Zap, Shield, Image, Camera, Film, MonitorPlay, Download, Star, FileText, Copy, Globe, Sparkles } from "lucide-react";
import { platformConfigs } from "@/lib/platform-config";
import { useTranslations } from "next-intl";

type DownloadType = "audio" | "thumbnail" | "transcript";

const iconMap: Record<DownloadType, any[]> = {
  audio: [Music, Radio, Waves, Disc, Music, Zap],
  thumbnail: [Image, Camera, Film, MonitorPlay, Download, Shield],
  transcript: [FileText, Copy, Globe, FileText, Sparkles, Zap],
};

const fallbackFeatures: Record<DownloadType, Array<{ label: string; value: string; desc: string }>> = {
  audio: [
    { label: "MP3 320 kbps", value: "High Quality", desc: "Download audio in pristine MP3 format at the highest bitrate for superior listening on any device." },
    { label: "FLAC Lossless", value: "Archive Quality", desc: "Perfect for music archivists. FLAC preserves every detail of the original audio with no quality loss." },
    { label: "AAC 256 kbps", value: "Efficient", desc: "Advanced Audio Coding delivers excellent quality at smaller file sizes. Ideal for Apple devices." },
    { label: "WAV Uncompressed", value: "Studio Grade", desc: "Uncompressed audio for professional editing, production, and mastering workflows." },
    { label: "OGG 192 kbps", value: "Open Format", desc: "Free and open audio format with efficient compression and broad compatibility across platforms." },
    { label: "Fast Processing", value: "< 3 Seconds", desc: "Server-side conversion delivers your audio file in seconds, not minutes." },
  ],
  thumbnail: [
    { label: "Maximum Resolution", value: "Full HD", desc: "Download thumbnails at their original resolution, up to 1920×1080 pixels or higher." },
    { label: "JPG Format", value: "Compact", desc: "Universal image format with great compression. Ideal for most use cases and sharing." },
    { label: "PNG Format", value: "Lossless", desc: "Perfect for screenshots and images requiring transparency and lossless quality." },
    { label: "WebP Format", value: "Optimized", desc: "Modern image format with superior compression and quality. Best for web use." },
    { label: "Instant Download", value: "No Waiting", desc: "Thumbnails are downloaded instantly — no processing or queue time needed." },
    { label: "Zero Storage", value: "Private", desc: "We don't store any files. Thumbnails are served directly from the source." },
  ],
  transcript: [
    { label: "SRT Subtitles", value: "Timestamps", desc: "Industry-standard subtitle format with precise timestamps. Works with all video players." },
    { label: "VTT WebVTT", value: "Web Format", desc: "Native web subtitle format. Perfect for HTML5 video players and online platforms." },
    { label: "TXT Plain Text", value: "Simple", desc: "Clean, readable text output without timestamps. Great for notes and reference." },
    { label: "JSON Structured", value: "Data Ready", desc: "Structured data with timestamps. Ideal for developers, analysis, and API integration." },
    { label: "AI Accuracy", value: "99%+", desc: "Powered by advanced AI speech recognition for highly accurate, human-quality transcripts." },
    { label: "Batch Process", value: "Playlists", desc: "Generate transcripts for entire playlists and channels in one click with a Pro plan." },
  ],
};

export function DownloadFeatures({ platform, type }: { platform: string; type: DownloadType }) {
  const config = platformConfigs[platform];
  const brandColor = config?.brandColor || "#5baab8";
  const t = useTranslations("DownloadOnly");

  const getLabel = () => {
    try {
      const key = type === "audio" ? "featuresAudioLabel" : type === "thumbnail" ? "featuresThumbnailLabel" : "featuresTranscriptLabel";
      return t(key as any);
    } catch {
      return type === "audio" ? "Audio Formats" : type === "thumbnail" ? "Image Formats" : "Transcript Formats";
    }
  };
  const getTitle = () => {
    try {
      const key = type === "audio" ? "featuresAudioTitle" : type === "thumbnail" ? "featuresThumbnailTitle" : "featuresTranscriptTitle";
      return t(key as any);
    } catch {
      return type === "audio" ? "The Best Audio Extraction Tool" : type === "thumbnail" ? "The Best Thumbnail Download Tool" : "The Best Transcript Generator";
    }
  };
  const getSubtitle = () => {
    try {
      const key = type === "audio" ? "featuresAudioSubtitle" : type === "thumbnail" ? "featuresThumbnailSubtitle" : "featuresTranscriptSubtitle";
      return t(key as any, { platform: config?.name || "" } as any);
    } catch {
      return type === "audio"
        ? `Extract high-quality audio from ${config?.name || ""} videos in every format you need.`
        : type === "thumbnail"
        ? `Save ${config?.name || ""} video thumbnails in every format and resolution.`
        : `Generate accurate ${config?.name || ""} transcripts with AI in every format.`;
    }
  };
  const getFeatures = () => {
    try {
      const key = type === "audio" ? "featuresAudioItems" : type === "thumbnail" ? "featuresThumbnailItems" : "featuresTranscriptItems";
      const raw = t.raw(key as any) as Array<{ label: string; value: string; desc: string }>;
      if (Array.isArray(raw) && raw.length >= 6) return raw;
    } catch {}
    return fallbackFeatures[type];
  };

  const label = getLabel();
  const title = getTitle();
  const subtitle = getSubtitle();
  const rawFeatures = getFeatures();
  const icons = iconMap[type];
  const features = rawFeatures.map((f, i) => ({ ...f, icon: icons[i] }));

  return (
    <section className="py-14 md:py-20 px-4 sm:px-6 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(180deg, ${brandColor}03 0%, white 50%, ${brandColor}03 100%)`,
        }}
      />
      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span
            className="text-xs font-bold tracking-widest uppercase font-mono"
            style={{ color: brandColor }}
          >
            {label}
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mt-3 mb-4 font-heading">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto font-sans">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{ visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.21, 0.6, 0.35, 1] }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-border p-5 transition-all duration-200"
                style={{ boxShadow: `0 1px 3px rgba(0,0,0,0.04)` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 12px ${brandColor}15`;
                  e.currentTarget.style.borderColor = `${brandColor}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)";
                  e.currentTarget.style.borderColor = "";
                }}
              >
                <div className="flex items-start gap-3.5">
                  <motion.div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${brandColor}12` }}
                    whileHover={{ scale: 1.12 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <Icon className="w-5 h-5" style={{ color: brandColor }} />
                  </motion.div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-foreground font-heading">{feature.label}</h3>
                      <span
                        className="text-[11px] font-bold font-mono px-1.5 py-0.5 rounded-md"
                        style={{
                          backgroundColor: `${brandColor}12`,
                          color: brandColor,
                        }}
                      >
                        {feature.value}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 font-sans leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
