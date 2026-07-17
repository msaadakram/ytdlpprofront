"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Download, Music, Image, Video, ChevronDown, CheckCircle2, Play, X,
} from "lucide-react";
import { videoFormats, audioFormats, thumbnailFormats } from "@/lib/constants";
import type { DownloadType } from "@/lib/constants";

export function Hero() {
  const [url, setUrl] = useState("");
  const [activeType, setActiveType] = useState<DownloadType>("video");
  const [selectedFormat, setSelectedFormat] = useState(0);
  const [showFormats, setShowFormats] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const formats = activeType === "video" ? videoFormats : activeType === "audio" ? audioFormats : thumbnailFormats;
  const typeConfig = {
    video: { icon: Video, label: "Video" },
    audio: { icon: Music, label: "Audio" },
    thumbnail: { icon: Image, label: "Thumbnail" },
  };

  function handleDownload() {
    if (!url.trim()) {
      inputRef.current?.focus();
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    }, 2200);
  }

  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      <motion.div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #5baab8 0%, transparent 70%)" }}
        animate={{ x: ["30%", "20%", "30%"], y: ["-30%", "-20%", "-30%"], scale: [1, 1.1, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #a8d4dc 0%, transparent 70%)" }}
        animate={{ x: ["-40%", "-30%", "-40%"], y: ["40%", "30%", "40%"], scale: [1, 1.15, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="max-w-4xl mx-auto relative">
        <motion.div className="flex justify-center mb-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full bg-white border border-border text-muted-foreground shadow-sm font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5baab8] animate-pulse" />
            200+ platforms supported
          </span>
        </motion.div>

        <motion.h1
          className="text-center text-5xl md:text-7xl font-extrabold leading-[1.08] tracking-tight text-foreground mb-6 font-heading"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
        >
          Download any video,
          <br />
          <span className="text-[#5baab8]">audio</span> or thumbnail.
        </motion.h1>

        <motion.p
          className="text-center text-lg text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed font-sans"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
        >
          Paste a link from YouTube, Facebook, TikTok, Instagram and 200+ more. Get your file in seconds — no account required.
        </motion.p>

        <motion.div className="flex justify-center mb-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="inline-flex bg-white border border-border rounded-full p-1 shadow-sm gap-1 relative">
            {(["video", "audio", "thumbnail"] as DownloadType[]).map((type) => {
              const cfg = typeConfig[type];
              const Icon = cfg.icon;
              const active = activeType === type;
              return (
                <button
                  key={type}
                  onClick={() => { setActiveType(type); setSelectedFormat(0); }}
                  className={`relative flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-colors font-sans ${
                    active ? "text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.span layoutId="typePill" className="absolute inset-0 bg-[#0d1f26] rounded-full shadow-md" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                  )}
                  <Icon className="w-3.5 h-3.5 relative z-10" />
                  <span className="relative z-10">{cfg.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-border p-3 md:p-4"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-3 bg-[#eef6f8] rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#5baab8]/40 transition-all">
              <Play className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleDownload()}
                placeholder="Paste your video URL here..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none font-sans"
              />
              {url && (
                <button onClick={() => setUrl("")} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowFormats(!showFormats)}
                className="flex items-center gap-2 bg-[#eef6f8] hover:bg-[#d4ecf0] rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors whitespace-nowrap w-full md:w-auto font-sans"
              >
                <span className="text-xs font-bold uppercase tracking-widest text-[#5baab8] font-mono">
                  {formats[selectedFormat].ext.toUpperCase()}
                </span>
                <span className="text-muted-foreground">{formats[selectedFormat].quality || formats[selectedFormat].label.split("•")[1]?.trim()}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showFormats ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showFormats && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 right-0 md:left-auto md:right-0 mt-2 bg-white rounded-xl border border-border shadow-xl z-20 overflow-hidden min-w-[220px]"
                  >
                    {formats.map((fmt, i) => (
                      <button
                        key={i}
                        onClick={() => { setSelectedFormat(i); setShowFormats(false); }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-muted transition-colors text-left font-sans ${
                          i === selectedFormat ? "bg-[#eef6f8] font-semibold" : ""
                        }`}
                      >
                        <span>{fmt.label}</span>
                        {i === selectedFormat && <CheckCircle2 className="w-4 h-4 text-[#5baab8]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={handleDownload}
              disabled={processing}
              whileHover={{ scale: processing ? 1 : 1.03 }}
              whileTap={{ scale: processing ? 1 : 0.97 }}
              className="flex items-center justify-center gap-2 bg-[#0d1f26] hover:bg-[#1a3545] text-white font-semibold text-sm px-7 py-3 rounded-xl transition-colors disabled:opacity-70 whitespace-nowrap min-w-[150px] font-sans"
            >
              <AnimatePresence mode="wait">
                {processing ? (
                  <motion.span key="proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </motion.span>
                ) : done ? (
                  <motion.span key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5baab8]" />
                    Ready!
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
        </motion.div>

        <motion.p
          className="text-center text-xs text-muted-foreground mt-5 font-sans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Free to use · No sign-up required · Files deleted instantly after download
        </motion.p>
      </div>
    </section>
  );
}
