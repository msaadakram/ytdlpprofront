import { Video, Music, Image as ImageIcon, ScrollText, Layers, Sparkles, Download } from "lucide-react";
import type { ComponentType } from "react";
import { platformConfigs, platformSlugs } from "@/lib/platform-config";

export type ToolType = "all" | "video" | "audio" | "thumbnail" | "transcript";
export type ToolDef = {
  id: ToolType;
  label: string;
  shortLabel: string;
  desc: string;
  hrefFor: (platform: string) => string;
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accent: string;
};

export const toolDefs: ToolDef[] = [
  {
    id: "all",
    label: "All-in-One Downloader",
    shortLabel: "All Tools",
    desc: "Video, Audio, Thumbnail & Transcript",
    hrefFor: (platform) => (platform === "youtube" ? "/youtube-download" : `/download/${platform}`),
    icon: Layers,
    accent: "#0d1f26",
  },
  {
    id: "video",
    label: "Video Downloader",
    shortLabel: "Video",
    desc: "MP4 · 4K / 1080p / 720p",
    hrefFor: (platform) => (platform === "youtube" ? "/youtube-video-downloader" : `/video-downloader/${platform}`),
    icon: Video,
    accent: "#FF0000",
  },
  {
    id: "audio",
    label: "Audio Downloader",
    shortLabel: "Audio",
    desc: "MP3 320kbps · FLAC · AAC",
    hrefFor: (platform) => `/audio-downloader/${platform}`,
    icon: Music,
    accent: "#5baab8",
  },
  {
    id: "thumbnail",
    label: "Thumbnail Downloader",
    shortLabel: "Thumbnail",
    desc: "JPG · PNG · WebP HD",
    hrefFor: (platform) => `/thumbnail-downloader/${platform}`,
    icon: ImageIcon,
    accent: "#9146FF",
  },
  {
    id: "transcript",
    label: "Transcript Downloader",
    shortLabel: "Transcript",
    desc: "SRT · VTT · TXT · JSON AI",
    hrefFor: (platform) => `/transcript-downloader/${platform}`,
    icon: ScrollText,
    accent: "#FF4500",
  },
];

export function getToolHref(platform: string, tool: ToolType): string {
  const def = toolDefs.find((t) => t.id === tool);
  return def ? def.hrefFor(platform) : `/download/${platform}`;
}

export function otherToolsForPlatform(platform: string, current: ToolType): Array<ToolDef & { href: string; current: boolean }> {
  return toolDefs.map((def) => ({
    ...def,
    href: def.hrefFor(platform),
    current: def.id === current,
  }));
}

// For "same tool, other platforms" row — returns 8 popular platforms excluding current one
const POPULAR_SLUGS = ["youtube", "tiktok", "instagram", "facebook", "twitter", "soundcloud", "twitch", "reddit"] as const;

export function sameToolOtherPlatforms(currentPlatform: string, tool: ToolType, limit = 8) {
  const def = toolDefs.find((t) => t.id === tool);
  if (!def) return [];
  // Build list: popular first, then fill with remaining slugs alphabetically
  const ordered = [
    ...POPULAR_SLUGS.filter((s) => s !== currentPlatform),
    ...platformSlugs.filter((s) => !(POPULAR_SLUGS as readonly string[]).includes(s) && s !== currentPlatform),
  ];
  return ordered.slice(0, limit).map((slug) => {
    const cfg = platformConfigs[slug];
    return {
      slug,
      name: cfg?.name ?? slug,
      href: def.hrefFor(slug),
      brandColor: cfg?.brandColor ?? "#0d1f26",
      fgColor: cfg?.fgColor ?? "#ffffff",
      Logo: cfg?.Logo,
    };
  });
}

// Popular cross-links for SEO — static popular combos
export const popularCrossLinks = [
  { title: "YouTube Video Downloader — 4K & HD", desc: "Shorts, long videos and clips in up to 4K.", href: "/video-downloader/youtube" as const },
  { title: "TikTok Video Downloader — No Watermark", desc: "Save TikTok videos in HD without watermark.", href: "/video-downloader/tiktok" as const },
  { title: "Instagram Video Downloader", desc: "Reels, Stories and IGTV posts in original quality.", href: "/video-downloader/instagram" as const },
  { title: "Facebook to MP3", desc: "Extract MP3 320kbps and FLAC from Facebook videos.", href: "/audio-downloader/facebook" as const },
  { title: "SoundCloud to MP3", desc: "Download SoundCloud tracks as MP3 or FLAC.", href: "/audio-downloader/soundcloud" as const },
  { title: "YouTube Thumbnail HD", desc: "Grab max-resolution JPG/PNG/WebP thumbnails.", href: "/thumbnail-downloader/youtube" as const },
  { title: "YouTube Transcript AI", desc: "SRT, VTT, TXT & JSON transcripts with timestamps.", href: "/transcript-downloader/youtube" as const },
  { title: "Twitter / X Video Downloader", desc: "Save X videos and GIFs in HD.", href: "/video-downloader/twitter" as const },
];
