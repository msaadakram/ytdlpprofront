import type { RelatedLink } from "./types";

// Locale-relative hrefs — Link from lib/i18n/navigation adds the /{locale} prefix.
type RelatedPage = "youtube-download" | "youtube-video-downloader" | "download" | "video-downloader";

const youtubeFamily: RelatedLink[] = [
  {
    title: "YouTube Video Downloader",
    desc: "Paste any YouTube link and save videos in 4K, 1080p or 720p — free, no sign-up.",
    href: "/youtube-video-downloader",
  },
  {
    title: "All-in-One YouTube Downloader",
    desc: "Video, MP3 audio, HD thumbnails and AI transcripts from a single page.",
    href: "/youtube-download",
  },
];

const popularPlatformLinks: RelatedLink[] = [
  {
    title: "Facebook Video Downloader",
    desc: "Save Facebook videos, Reels and live streams in HD.",
    href: "/video-downloader/facebook",
  },
  {
    title: "Instagram Video Downloader",
    desc: "Download Reels, Stories and IGTV posts in original quality.",
    href: "/video-downloader/instagram",
  },
  {
    title: "TikTok Video Downloader",
    desc: "Save TikTok videos in HD without the watermark.",
    href: "/video-downloader/tiktok",
  },
];

const platformNames: Record<string, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  twitter: "Twitter / X",
  vimeo: "Vimeo",
  dailymotion: "Dailymotion",
  twitch: "Twitch",
  reddit: "Reddit",
  pinterest: "Pinterest",
  linkedin: "LinkedIn",
  snapchat: "Snapchat",
  soundcloud: "SoundCloud",
  kick: "Kick",
  youtube: "YouTube",
  niconico: "Niconico",
};

export function relatedLinksFor(page: RelatedPage, platform?: string): RelatedLink[] {
  const name = platform ? platformNames[platform] ?? platform : undefined;

  if (page === "youtube-download") {
    return [
      {
        title: "YouTube Video Downloader — 4K & HD",
        desc: "The dedicated video-only downloader for YouTube. Shorts, long videos and clips in up to 4K.",
        href: "/youtube-video-downloader",
      },
      ...popularPlatformLinks,
    ];
  }

  if (page === "youtube-video-downloader") {
    return [
      {
        title: "All-in-One YouTube Downloader",
        desc: "Need MP3, thumbnails or transcripts too? The full toolbox for YouTube.",
        href: "/youtube-download",
      },
      ...popularPlatformLinks,
    ];
  }

  if (platform === "youtube") {
    return [...youtubeFamily, ...popularPlatformLinks];
  }

  // Other platforms: cross-link the all-in-one page of the same platform + YouTube family + popular platforms
  return [
    {
      title: `${name} Downloader — Video, Audio & More`,
      desc: `The all-in-one ${name} page: video, audio, thumbnails and AI transcripts.`,
      href: `/download/${platform}`,
    },
    ...youtubeFamily,
    ...popularPlatformLinks.filter((l) => !platform || l.href !== `/video-downloader/${platform}`),
  ];
}
