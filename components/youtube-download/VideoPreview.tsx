"use client";

import { motion } from "motion/react";
import { Play, Eye, ThumbsUp, Clock, Calendar, User } from "lucide-react";
import type { UniversalMediaInfo } from "@/lib/api-client";

type VideoPreviewProps = {
  info: UniversalMediaInfo;
};

function formatCount(n: number): string {
  if (!n) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays < 1) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function VideoPreview({ info }: VideoPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.21, 0.6, 0.35, 1] }}
      className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm group"
    >
      <div className="flex flex-col md:flex-row" itemScope itemType="https://schema.org/VideoObject">
        <figure className="relative md:w-72 lg:w-80 shrink-0 bg-[#0d1f26] overflow-hidden">
          {info.thumbnail ? (
            <>
              <motion.img
                src={info.thumbnail}
                alt={`Thumbnail for ${info.title}`}
                className="w-full aspect-video md:aspect-[4/3] object-cover opacity-90"
                loading="lazy"
                itemProp="thumbnail"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
              <figcaption className="sr-only">{info.title}</figcaption>
              <motion.div
                className="absolute inset-0"
                style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.5) 0%, transparent 50%, rgba(0,0,0,0.2) 100%)" }}
                animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/80 backdrop-blur-sm text-white text-[11px] font-mono px-2 py-1 rounded-lg shadow-lg"
                itemProp="duration"
                whileHover={{ scale: 1.05 }}
              >
                <Play className="w-3 h-3 fill-white" />
                <span>{info.duration_str || ""}</span>
              </motion.div>
            </>
          ) : (
            <div className="w-full aspect-video md:aspect-[4/3] flex items-center justify-center bg-[#eef6f8]">
              <Play className="w-10 h-10 text-[#5baab8]/40" />
            </div>
          )}
        </figure>

        <div className="flex-1 p-4 md:p-5 space-y-3">
          <motion.h3
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-sm md:text-base font-bold text-foreground leading-snug line-clamp-2 font-heading"
            itemProp="name"
          >
            {info.title}
          </motion.h3>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <div className="w-5 h-5 rounded-full bg-[#eef6f8] flex items-center justify-center">
              <User className="w-3 h-3 text-[#5baab8]" />
            </div>
            <span className="font-medium" itemProp="author">{info.uploader || info.channel || "Unknown"}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eef6f8] px-2.5 py-1 text-[11px] font-medium text-muted-foreground font-mono" itemProp="interactionStatistic" itemScope itemType="https://schema.org/InteractionCounter">
              <Eye className="w-3 h-3 text-[#5baab8]" />
              <meta itemProp="interactionType" content="https://schema.org/WatchAction" />
              <motion.span
                itemProp="userInteractionCount"
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.35 }}
              >
                {formatCount(info.view_count)}
              </motion.span>
              <span className="text-muted-foreground/60">views</span>
            </span>
            {info.like_count > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#eef6f8] px-2.5 py-1 text-[11px] font-medium text-muted-foreground font-mono">
                <ThumbsUp className="w-3 h-3 text-[#5baab8]" />
                <span>{formatCount(info.like_count)}</span>
              </span>
            )}
            {info.duration_str && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#eef6f8] px-2.5 py-1 text-[11px] font-medium text-muted-foreground font-mono">
                <Clock className="w-3 h-3 text-[#5baab8]" />
                <span>{info.duration_str}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-[#eef6f8] px-2.5 py-1 text-[11px] font-medium text-muted-foreground font-mono">
              <Calendar className="w-3 h-3 text-[#5baab8]" />
              <span>{formatDate(info.upload_date)}</span>
            </span>
          </motion.div>

          {info.filesize_str && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-[11px] text-muted-foreground font-mono"
            >
              File size: {info.filesize_str}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
