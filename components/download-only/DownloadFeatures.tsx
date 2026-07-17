"use client";

import { motion } from "motion/react";
import { Music, Radio, Waves, Disc, Zap, Shield, Image, Camera, Film, MonitorPlay, Download, Star, FileText, Copy, Globe, Sparkles } from "lucide-react";
import { platformConfigs } from "@/lib/platform-config";

type DownloadType = "audio" | "thumbnail" | "transcript";

const audioFeatures = [
  { icon: Music, label: "MP3 320 kbps", value: "High Quality", desc: "Download audio in pristine MP3 format at the highest bitrate for superior listening on any device." },
  { icon: Radio, label: "FLAC Lossless", value: "Archive Quality", desc: "Perfect for music archivists. FLAC preserves every detail of the original audio with no quality loss." },
  { icon: Waves, label: "AAC 256 kbps", value: "Efficient", desc: "Advanced Audio Coding delivers excellent quality at smaller file sizes. Ideal for Apple devices." },
  { icon: Disc, label: "WAV Uncompressed", value: "Studio Grade", desc: "Uncompressed audio for professional editing, production, and mastering workflows." },
  { icon: Music, label: "OGG 192 kbps", value: "Open Format", desc: "Free and open audio format with efficient compression and broad compatibility across platforms." },
  { icon: Zap, label: "Fast Processing", value: "< 3 Seconds", desc: "Server-side conversion delivers your audio file in seconds, not minutes." },
];

const thumbnailFeatures = [
  { icon: Image, label: "Maximum Resolution", value: "Full HD", desc: "Download thumbnails at their original resolution, up to 1920×1080 pixels or higher." },
  { icon: Camera, label: "JPG Format", value: "Compact", desc: "Universal image format with great compression. Ideal for most use cases and sharing." },
  { icon: Film, label: "PNG Format", value: "Lossless", desc: "Perfect for screenshots and images requiring transparency and lossless quality." },
  { icon: MonitorPlay, label: "WebP Format", value: "Optimized", desc: "Modern image format with superior compression and quality. Best for web use." },
  { icon: Download, label: "Instant Download", value: "No Waiting", desc: "Thumbnails are downloaded instantly — no processing or queue time needed." },
  { icon: Shield, label: "Zero Storage", value: "Private", desc: "We don't store any files. Thumbnails are served directly from the source." },
];

const transcriptFeatures = [
  { icon: FileText, label: "SRT Subtitles", value: "Timestamps", desc: "Industry-standard subtitle format with precise timestamps. Works with all video players." },
  { icon: Copy, label: "VTT WebVTT", value: "Web Format", desc: "Native web subtitle format. Perfect for HTML5 video players and online platforms." },
  { icon: Globe, label: "TXT Plain Text", value: "Simple", desc: "Clean, readable text output without timestamps. Great for notes and reference." },
  { icon: FileText, label: "JSON Structured", value: "Data Ready", desc: "Structured data with timestamps. Ideal for developers, analysis, and API integration." },
  { icon: Sparkles, label: "AI Accuracy", value: "99%+", desc: "Powered by advanced AI speech recognition for highly accurate, human-quality transcripts." },
  { icon: Zap, label: "Batch Process", value: "Playlists", desc: "Generate transcripts for entire playlists and channels in one click with a Pro plan." },
];

const featuresMap: Record<DownloadType, typeof audioFeatures> = {
  audio: audioFeatures,
  thumbnail: thumbnailFeatures,
  transcript: transcriptFeatures,
};

export function DownloadFeatures({ platform, type }: { platform: string; type: DownloadType }) {
  const config = platformConfigs[platform];
  const brandColor = config?.brandColor || "#5baab8";
  const features = featuresMap[type];

  const titles: Record<DownloadType, string> = {
    audio: "The Best Audio Extraction Tool",
    thumbnail: "The Best Thumbnail Download Tool",
    transcript: "The Best Transcript Generator",
  };

  const subtitles: Record<DownloadType, string> = {
    audio: `Extract high-quality audio from ${config?.name || ""} videos in every format you need.`,
    thumbnail: `Save ${config?.name || ""} video thumbnails in every format and resolution.`,
    transcript: `Generate accurate ${config?.name || ""} transcripts with AI in every format.`,
  };

  const labels: Record<DownloadType, string> = {
    audio: "Audio Formats",
    thumbnail: "Image Formats",
    transcript: "Transcript Formats",
  };

  return (
    <section className="py-20 px-6 relative overflow-hidden">
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
            {labels[type]}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mt-3 mb-4 font-heading">
            {titles[type]}
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto font-sans">
            {subtitles[type]}
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
