import type { RelatedLink } from "./types";

// Locale-relative hrefs — Link from lib/i18n/navigation adds the /{locale} prefix.
type RelatedPage =
  | "youtube-download"
  | "youtube-video-downloader"
  | "download"
  | "video-downloader"
  | "audio-downloader"
  | "thumbnail-downloader"
  | "transcript-downloader";

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

const toolPopularLinks: Record<RelatedPage, RelatedLink[]> = {
  "audio-downloader": [
    { title: "YouTube to MP3 — 320kbps", desc: "Convert YouTube videos to MP3, FLAC or AAC instantly.", href: "/audio-downloader/youtube" },
    { title: "SoundCloud to MP3", desc: "Download SoundCloud tracks as MP3 or FLAC lossless.", href: "/audio-downloader/soundcloud" },
    { title: "TikTok to MP3", desc: "Extract audio from TikTok videos in high quality.", href: "/audio-downloader/tiktok" },
  ],
  "thumbnail-downloader": [
    { title: "YouTube Thumbnail HD", desc: "Save YouTube thumbnails in max resolution JPG/PNG/WebP.", href: "/thumbnail-downloader/youtube" },
    { title: "Instagram Thumbnail", desc: "Download Instagram post thumbnails in HD.", href: "/thumbnail-downloader/instagram" },
    { title: "TikTok Thumbnail", desc: "Save TikTok video covers in full quality.", href: "/thumbnail-downloader/tiktok" },
  ],
  "transcript-downloader": [
    { title: "YouTube Transcript AI", desc: "SRT, VTT, TXT & JSON transcripts from any YouTube video.", href: "/transcript-downloader/youtube" },
    { title: "Vimeo Transcript", desc: "Generate accurate AI transcripts for Vimeo videos.", href: "/transcript-downloader/vimeo" },
    { title: "Twitch Transcript", desc: "Transcribe Twitch streams with timestamps.", href: "/transcript-downloader/twitch" },
  ],
  "video-downloader": popularPlatformLinks,
  "download": popularPlatformLinks,
  "youtube-download": popularPlatformLinks,
  "youtube-video-downloader": popularPlatformLinks,
};

const platformToolVariants = (name: string, slug: string): RelatedLink[] => [
  { title: `${name} Video Downloader`, desc: `Download ${name} videos in 4K, 1080p & 720p MP4.`, href: `/video-downloader/${slug}` },
  { title: `${name} to MP3 — Audio`, desc: `Extract ${name} audio as MP3 320kbps, FLAC or AAC.`, href: `/audio-downloader/${slug}` },
  { title: `${name} Thumbnail Downloader`, desc: `Save ${name} thumbnails in JPG, PNG & WebP HD.`, href: `/thumbnail-downloader/${slug}` },
  { title: `${name} Transcript AI`, desc: `Generate ${name} transcripts as SRT, VTT & TXT with AI.`, href: `/transcript-downloader/${slug}` },
];

export function relatedLinksFor(page: RelatedPage, platform?: string): RelatedLink[] {
  const name = platform ? platformNames[platform] ?? platform : undefined;
  const slug = platform ?? "";

  if (page === "youtube-download") {
    return [
      {
        title: "YouTube Video Downloader — 4K & HD",
        desc: "The dedicated video-only downloader for YouTube. Shorts, long videos and clips in up to 4K.",
        href: "/youtube-video-downloader",
      },
      { title: "YouTube to MP3 — Audio", desc: "Convert YouTube to MP3 320kbps, FLAC & AAC — paste a link.", href: "/audio-downloader/youtube" },
      { title: "YouTube Thumbnail HD", desc: "Save YouTube thumbnails in max resolution.", href: "/thumbnail-downloader/youtube" },
      { title: "YouTube Transcript AI", desc: "SRT, VTT, TXT & JSON transcripts with timestamps.", href: "/transcript-downloader/youtube" },
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
      { title: "YouTube to MP3 — Audio", desc: "Convert YouTube to MP3 320kbps, FLAC & AAC.", href: "/audio-downloader/youtube" },
      { title: "YouTube Thumbnail HD", desc: "Save YouTube thumbnails in max resolution.", href: "/thumbnail-downloader/youtube" },
      { title: "YouTube Transcript AI", desc: "SRT & VTT transcripts with AI.", href: "/transcript-downloader/youtube" },
      ...popularPlatformLinks,
    ];
  }

  if (platform === "youtube") {
    // Should not happen for non-youtube pages, but keep youtubeFamily + tool variants
    const ytLinks: RelatedLink[] = [
      { title: "YouTube Video Downloader — 4K & HD", desc: "Shorts, long videos and clips in up to 4K.", href: "/youtube-video-downloader" },
      { title: "All-in-One YouTube Downloader", desc: "Video, MP3, thumbnails & transcripts from one page.", href: "/youtube-download" },
    ];
    return [...ytLinks, ...(toolPopularLinks[page] ?? popularPlatformLinks)];
  }

  // Tool-specific pages for non-youtube platforms: show cross-tool variants for same platform + popular for same tool
  if (page === "audio-downloader" || page === "thumbnail-downloader" || page === "transcript-downloader" || page === "video-downloader") {
    const variants = platformToolVariants(name!, slug).filter((l) => l.href !== `/${page}/${slug}`);
    const popularForTool = (toolPopularLinks[page] ?? popularPlatformLinks).filter((l) => l.href !== `/${page}/${slug}`);
    return [
      {
        title: `${name} Downloader — Video, Audio & More`,
        desc: `The all-in-one ${name} page: video, audio, thumbnails and AI transcripts.`,
        href: `/download/${slug}`,
      },
      ...variants.slice(0, 2),
      ...popularForTool.slice(0, 2),
      ...youtubeFamily,
    ];
  }

  // Other platforms: cross-link the all-in-one page of the same platform + tool variants + YouTube family + popular platforms
  return [
    {
      title: `${name} Downloader — Video, Audio & More`,
      desc: `The all-in-one ${name} page: video, audio, thumbnails and AI transcripts.`,
      href: `/download/${platform}`,
    },
    ...platformToolVariants(name!, slug!).slice(0, 2),
    ...youtubeFamily,
    ...popularPlatformLinks.filter((l) => !platform || l.href !== `/video-downloader/${platform}`),
  ];
}
