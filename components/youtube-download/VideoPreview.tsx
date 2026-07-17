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
      className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm"
    >
      <div className="flex flex-col md:flex-row">
        <div className="relative md:w-72 lg:w-80 shrink-0 bg-[#0d1f26]">
          {info.thumbnail ? (
            <>
              <img
                src={info.thumbnail}
                alt={info.title}
                className="w-full aspect-video md:aspect-[4/3] object-cover opacity-90"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
              <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                <Play className="w-2.5 h-2.5 fill-white" />
                <span>{info.duration_str || ""}</span>
              </div>
            </>
          ) : (
            <div className="w-full aspect-video md:aspect-[4/3] flex items-center justify-center bg-[#eef6f8]">
              <Play className="w-10 h-10 text-[#5baab8]/40" />
            </div>
          )}
        </div>

        <div className="flex-1 p-4 md:p-5 space-y-2.5">
          <motion.h3
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-sm md:text-base font-bold text-foreground leading-snug line-clamp-2 font-heading"
          >
            {info.title}
          </motion.h3>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <User className="w-3 h-3" />
            <span className="font-medium">{info.uploader || info.channel || "Unknown"}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground font-mono"
          >
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" /> {formatCount(info.view_count)} views
            </span>
            {info.like_count > 0 && (
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-3 h-3" /> {formatCount(info.like_count)}
              </span>
            )}
            {info.duration_str && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {info.duration_str}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {formatDate(info.upload_date)}
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
