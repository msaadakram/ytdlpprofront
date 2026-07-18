import type { ContentTable } from "./types";

export const formatTables = {
  video: (platformName: string): ContentTable => ({
    headers: ["Format", "Resolution", "Best For"],
    rows: [
      ["MP4", "4K / 1080p / 720p / 480p", "Universal compatibility, works on all devices"],
      ["WebM", "720p", "Web-optimized, smaller file size"],
      ["MKV", "1080p", "Advanced users, multiple audio tracks"],
    ],
    caption: `Common video formats available when downloading from ${platformName}.`,
  }),

  audio: (platformName: string): ContentTable => ({
    headers: ["Format", "Bitrate / Quality", "Best For"],
    rows: [
      ["MP3", "128 / 192 / 320 kbps", "Universal playback, music, podcasts"],
      ["AAC", "256 kbps", "Better quality at same bitrate as MP3"],
      ["FLAC", "Lossless", "Archiving, audiophile listening, production"],
      ["WAV", "Uncompressed", "Professional audio editing"],
      ["OGG", "192 kbps", "Open format, smaller files"],
    ],
    caption: `Audio formats available when extracting from ${platformName}.`,
  }),

  thumbnail: (platformName: string): ContentTable => ({
    headers: ["Format", "Resolution", "Best For"],
    rows: [
      ["JPG", "Max / High Quality", "Small file, universal compatibility"],
      ["PNG", "Max Resolution", "Transparent backgrounds, highest quality"],
      ["WebP", "Max Resolution", "Modern format, good compression"],
    ],
    caption: `Thumbnail formats available when downloading from ${platformName}.`,
  }),

  transcript: (platformName: string): ContentTable => ({
    headers: ["Format", "Description", "Best For"],
    rows: [
      ["SRT", "SubRip subtitle format", "Video players, editing software"],
      ["VTT", "WebVTT format", "HTML5 video, web browsers"],
      ["TXT", "Plain text", "Reading, copying, sharing"],
      ["JSON", "Structured data", "Programmatic processing, apps"],
    ],
    caption: `Transcript formats available for ${platformName} videos.`,
  }),
};

export const legalNote = "The downloaded content is intended for personal, offline use only. Always respect copyright laws and the content creator's rights. Redistributing copyrighted material without permission may violate platform terms of service and applicable laws.";
