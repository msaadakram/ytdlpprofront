"use client";

import { motion } from "motion/react";
import { Music, Video, Image, Layers, FileText } from "lucide-react";

const tips = [
  {
    icon: Video,
    title: "Download in 4K Ultra HD",
    desc: "Get YouTube videos in up to 4K resolution. Perfect for offline viewing, editing, or archiving your favorite content in the highest quality available.",
  },
  {
    icon: Music,
    title: "Extract Audio as MP3 or FLAC",
    desc: "Convert YouTube videos to high-quality audio files. Choose from MP3 up to 320 kbps or lossless FLAC for music production and offline listening.",
  },
  {
    icon: FileText,
    title: "AI Transcripts in Any Format",
    desc: "Generate accurate AI transcripts from any video. Download as SRT subtitles, VTT web captions, plain TXT, or structured JSON with timestamps.",
  },
  {
    icon: Image,
    title: "Save Thumbnails in Full HD",
    desc: "Download video thumbnails in maximum resolution. Great for thumbnails, covers, or reference images — available in JPG, PNG, and WebP formats.",
  },
  {
    icon: Layers,
    title: "Batch & Playlist Downloads",
    desc: "With a Pro plan, download entire playlists or channels in one click. No need to process each video individually — just paste and go.",
  },
];

export function RelatedTips() {
  return (
    <section className="py-14 md:py-20 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-bold tracking-widest uppercase text-[#5baab8] font-mono">
            Tips & Tricks
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground mt-3 mb-4 font-heading">
            Get the Most from YouTube Downloads
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto font-sans">
            Whether you need video for editing, audio for podcasts, thumbnails for projects, or AI transcripts for accessibility — we have you covered.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {tips.map((tip, i) => {
            const Icon = tip.icon;
            return (
                <motion.article
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={{ visible: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="bg-[#eef6f8] rounded-2xl p-5 border border-border hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#5baab8]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#5baab8]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground mb-1.5 font-heading">{tip.title}</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed font-sans">{tip.desc}</p>
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
