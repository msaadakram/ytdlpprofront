import {
  YoutubeLogo, FacebookLogo, InstagramLogo, TikTokLogo, XLogo,
  VimeoLogo, DailymotionLogo, TwitchLogo, RedditLogo, PinterestLogo,
  LinkedInLogo, SnapchatLogo, SoundCloudLogo, KickLogo, NiconicoLogo,
} from "@/components/shared/brand-logos";
import {
  Globe, Zap, Shield, MonitorPlay, Clock, Star, Copy, Sparkles,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";

export type DownloadType = "video" | "audio" | "thumbnail" | "transcript";
export type Format = { label: string; ext: string; quality?: string };
export type PricingPlan = {
  name: string; price: string; period: string;
  features: string[]; cta: string; highlight: boolean;
};

type BrandLogoProps = { className?: string; style?: React.CSSProperties };
type BrandPlatform = {
  name: string; bg: string; fg: string;
  Logo: ComponentType<BrandLogoProps>;
};

export const platforms: BrandPlatform[] = [
  { name: "YouTube",     bg: "#FF0000", fg: "#ffffff", Logo: YoutubeLogo },
  { name: "Facebook",    bg: "#1877F2", fg: "#ffffff", Logo: FacebookLogo },
  { name: "Instagram",   bg: "#E1306C", fg: "#ffffff", Logo: InstagramLogo },
  { name: "TikTok",      bg: "#010101", fg: "#ffffff", Logo: TikTokLogo },
  { name: "Twitter / X", bg: "#14171A", fg: "#ffffff", Logo: XLogo },
  { name: "Vimeo",       bg: "#1AB7EA", fg: "#ffffff", Logo: VimeoLogo },
  { name: "Dailymotion", bg: "#0066DC", fg: "#ffffff", Logo: DailymotionLogo },
  { name: "Twitch",      bg: "#9146FF", fg: "#ffffff", Logo: TwitchLogo },
  { name: "Reddit",      bg: "#FF4500", fg: "#ffffff", Logo: RedditLogo },
  { name: "Pinterest",   bg: "#E60023", fg: "#ffffff", Logo: PinterestLogo },
  { name: "LinkedIn",    bg: "#0A66C2", fg: "#ffffff", Logo: LinkedInLogo },
  { name: "Snapchat",    bg: "#FFFC00", fg: "#000000", Logo: SnapchatLogo },
  { name: "SoundCloud",  bg: "#FF5500", fg: "#ffffff", Logo: SoundCloudLogo },
  { name: "Kick",        bg: "#53FC18", fg: "#000000", Logo: KickLogo },
  { name: "Niconico",    bg: "#FF69B3", fg: "#ffffff", Logo: NiconicoLogo },
];

export const videoFormats: Format[] = [
  { label: "MP4 • 4K Ultra HD", ext: "mp4", quality: "2160p" },
  { label: "MP4 • Full HD", ext: "mp4", quality: "1080p" },
  { label: "MP4 • HD", ext: "mp4", quality: "720p" },
  { label: "MP4 • Standard", ext: "mp4", quality: "480p" },
  { label: "WebM • HD", ext: "webm", quality: "720p" },
  { label: "MKV • Full HD", ext: "mkv", quality: "1080p" },
];

export const audioFormats: Format[] = [
  { label: "MP3 • 320 kbps", ext: "mp3" },
  { label: "MP3 • 192 kbps", ext: "mp3" },
  { label: "AAC • 256 kbps", ext: "aac" },
  { label: "FLAC • Lossless", ext: "flac" },
  { label: "WAV • Uncompressed", ext: "wav" },
  { label: "OGG • 192 kbps", ext: "ogg" },
];

export const thumbnailFormats: Format[] = [
  { label: "JPG • Maximum", ext: "jpg", quality: "maxresdefault" },
  { label: "JPG • HQ", ext: "jpg", quality: "hqdefault" },
  { label: "PNG • Maximum", ext: "png", quality: "maxresdefault" },
  { label: "WebP • Optimized", ext: "webp", quality: "maxresdefault" },
];

export const transcriptFormats: Format[] = [
  { label: "SRT • Timestamps", ext: "srt" },
  { label: "VTT • WebVTT", ext: "vtt" },
  { label: "TXT • Plain Text", ext: "txt" },
  { label: "JSON • Structured", ext: "json" },
];

export const steps = [
  {
    number: "01", title: "Paste the URL",
    desc: "Copy any video link from YouTube, Facebook, TikTok or 200+ other platforms and paste it into the input above.",
    icon: Copy,
  },
  {
    number: "02", title: "Choose format & quality",
    desc: "Select your preferred format — MP4, MP3, FLAC, WebP — and the quality level that suits your needs.",
    icon: Sparkles,
  },
  {
    number: "03", title: "Download instantly",
    desc: "Click Download and your file is processed and delivered in seconds. No account required.",
    icon: Zap,
  },
];

export const features = [
  { icon: Globe, title: "200+ Supported Platforms", desc: "From YouTube to niche platforms. If there's a video, we can fetch it." },
  { icon: Zap, title: "Blazing Fast Processing", desc: "Server-side conversion with CDN delivery. Your download starts in under 3 seconds." },
  { icon: Shield, title: "Private & Secure", desc: "We don't store your URLs or files. Everything is processed ephemerally and deleted immediately." },
  { icon: MonitorPlay, title: "Any Quality, Any Format", desc: "4K, 1080p, 720p video. Lossless FLAC and 320 kbps MP3 audio. PNG and WebP thumbnails." },
  { icon: Clock, title: "No Queue, No Wait", desc: "Pro plans process in parallel. No waiting in line — start the next download immediately." },
  { icon: Star, title: "Batch Downloads", desc: "Download entire playlists or channels in one click with our Pro and Team plans." },
];

export const plans: PricingPlan[] = [
  {
    name: "Free", price: "$0", period: "forever",
    features: ["10 downloads / day", "Up to 1080p video", "MP3 & MP4 formats", "Standard processing speed", "50+ platforms supported"],
    cta: "Get Started Free", highlight: false,
  },
  {
    name: "Pro", price: "$9", period: "per month",
    features: ["Unlimited downloads", "4K Ultra HD video", "All formats incl. FLAC & WebP", "Priority processing", "200+ platforms supported", "Batch playlist downloads", "No ads"],
    cta: "Start Pro Trial", highlight: true,
  },
  {
    name: "Team", price: "$29", period: "per month",
    features: ["Everything in Pro", "5 team seats", "API access", "Webhook notifications", "Priority email support", "Custom retention (30 days)"],
    cta: "Contact Sales", highlight: false,
  },
];

export const testimonials = [
  {
    name: "Alex Chen", role: "Content Creator",
    text: "This tool saves me hours every week. The 4K downloads are pristine and the batch processing is a game-changer.",
    rating: 5,
  },
  {
    name: "Sarah Miller", role: "Social Media Manager",
    text: "I manage 12 brand accounts and Fetchwave handles all my video needs. The FLAC audio quality is incredible.",
    rating: 5,
  },
  {
    name: "Marcus Johnson", role: "Video Editor",
    text: "The range of formats and resolutions is unmatched. Being able to pull lossless audio from any platform is essential for my workflow.",
    rating: 5,
  },
];

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}
