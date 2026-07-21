import type { ComponentType } from "react";
import {
  Youtube, Music, Image, Layers, Download, Globe, Video, Film,
  Headphones, Radio, MessageSquare, Hash, Play, Camera, Monitor, FileText,
} from "lucide-react";
import {
  YoutubeLogo, FacebookLogo, InstagramLogo, TikTokLogo, XLogo,
  VimeoLogo, DailymotionLogo, TwitchLogo, RedditLogo, PinterestLogo,
  LinkedInLogo, SnapchatLogo, SoundCloudLogo, KickLogo, NiconicoLogo,
} from "@/components/shared/brand-logos";
import type { DownloadType } from "@/lib/constants";

type BrandLogoProps = { className?: string; style?: React.CSSProperties };

export type PlatformConfig = {
  id: string;
  name: string;
  slug: string;
  brandColor: string;
  fgColor: string;
  Logo: ComponentType<BrandLogoProps>;
  defaultType: DownloadType;
  inputIcon: ComponentType<{ className?: string }>;
  features: Array<{ icon: ComponentType<{ className?: string; style?: React.CSSProperties }> }>;
};

export const platformConfigs: Record<string, PlatformConfig> = {
  facebook: {
    id: "facebook", name: "Facebook", slug: "facebook",
    brandColor: "#1877F2", fgColor: "#ffffff",
    Logo: FacebookLogo, defaultType: "video",
    inputIcon: Video,
    features: [{ icon: Video }, { icon: Music }, { icon: Image }, { icon: Globe }, { icon: FileText }],
  },
  instagram: {
    id: "instagram", name: "Instagram", slug: "instagram",
    brandColor: "#E1306C", fgColor: "#ffffff",
    Logo: InstagramLogo, defaultType: "video",
    inputIcon: Video,
    features: [{ icon: Film }, { icon: Music }, { icon: Image }, { icon: Layers }, { icon: FileText }],
  },
  tiktok: {
    id: "tiktok", name: "TikTok", slug: "tiktok",
    brandColor: "#010101", fgColor: "#ffffff",
    Logo: TikTokLogo, defaultType: "video",
    inputIcon: Music,
    features: [{ icon: Video }, { icon: Music }, { icon: Image }, { icon: Camera }, { icon: FileText }],
  },
  twitter: {
    id: "twitter", name: "Twitter / X", slug: "twitter",
    brandColor: "#14171A", fgColor: "#ffffff",
    Logo: XLogo, defaultType: "video",
    inputIcon: MessageSquare,
    features: [{ icon: Video }, { icon: Play }, { icon: Music }, { icon: Image }, { icon: FileText }],
  },
  vimeo: {
    id: "vimeo", name: "Vimeo", slug: "vimeo",
    brandColor: "#1AB7EA", fgColor: "#ffffff",
    Logo: VimeoLogo, defaultType: "video",
    inputIcon: Play,
    features: [{ icon: Monitor }, { icon: Headphones }, { icon: Image }, { icon: Film }, { icon: FileText }],
  },
  dailymotion: {
    id: "dailymotion", name: "Dailymotion", slug: "dailymotion",
    brandColor: "#0066DC", fgColor: "#ffffff",
    Logo: DailymotionLogo, defaultType: "video",
    inputIcon: Play,
    features: [{ icon: Monitor }, { icon: Headphones }, { icon: Image }, { icon: Globe }, { icon: FileText }],
  },
  twitch: {
    id: "twitch", name: "Twitch", slug: "twitch",
    brandColor: "#9146FF", fgColor: "#ffffff",
    Logo: TwitchLogo, defaultType: "video",
    inputIcon: Monitor,
    features: [{ icon: Film }, { icon: Headphones }, { icon: Image }, { icon: Radio }, { icon: FileText }],
  },
  reddit: {
    id: "reddit", name: "Reddit", slug: "reddit",
    brandColor: "#FF4500", fgColor: "#ffffff",
    Logo: RedditLogo, defaultType: "video",
    inputIcon: MessageSquare,
    features: [{ icon: Film }, { icon: Play }, { icon: Headphones }, { icon: Image }, { icon: FileText }],
  },
  pinterest: {
    id: "pinterest", name: "Pinterest", slug: "pinterest",
    brandColor: "#E60023", fgColor: "#ffffff",
    Logo: PinterestLogo, defaultType: "video",
    inputIcon: Image,
    features: [{ icon: Film }, { icon: Music }, { icon: Image }, { icon: Hash }, { icon: FileText }],
  },
  linkedin: {
    id: "linkedin", name: "LinkedIn", slug: "linkedin",
    brandColor: "#0A66C2", fgColor: "#ffffff",
    Logo: LinkedInLogo, defaultType: "video",
    inputIcon: Hash,
    features: [{ icon: Film }, { icon: Headphones }, { icon: Image }, { icon: Globe }, { icon: FileText }],
  },
  snapchat: {
    id: "snapchat", name: "Snapchat", slug: "snapchat",
    brandColor: "#FFB300", fgColor: "#1a1300",
    Logo: SnapchatLogo, defaultType: "video",
    inputIcon: Camera,
    features: [{ icon: Film }, { icon: Music }, { icon: Image }, { icon: Camera }, { icon: FileText }],
  },
  soundcloud: {
    id: "soundcloud", name: "SoundCloud", slug: "soundcloud",
    brandColor: "#FF5500", fgColor: "#ffffff",
    Logo: SoundCloudLogo, defaultType: "audio",
    inputIcon: Headphones,
    features: [{ icon: Headphones }, { icon: Radio }, { icon: Layers }, { icon: Globe }, { icon: FileText }],
  },
  kick: {
    id: "kick", name: "Kick", slug: "kick",
    brandColor: "#53FC18", fgColor: "#000000",
    Logo: KickLogo, defaultType: "video",
    inputIcon: Monitor,
    features: [{ icon: Film }, { icon: Headphones }, { icon: Image }, { icon: Radio }, { icon: FileText }],
  },
  youtube: {
    id: "youtube", name: "YouTube", slug: "youtube",
    brandColor: "#FF0000", fgColor: "#ffffff",
    Logo: YoutubeLogo, defaultType: "video",
    inputIcon: Youtube,
    features: [{ icon: Video }, { icon: Music }, { icon: Image }, { icon: Globe }, { icon: FileText }],
  },
  niconico: {
    id: "niconico", name: "Niconico", slug: "niconico",
    brandColor: "#FF69B3", fgColor: "#ffffff",
    Logo: NiconicoLogo, defaultType: "video",
    inputIcon: Play,
    features: [{ icon: Film }, { icon: Headphones }, { icon: Image }, { icon: Globe }, { icon: FileText }],
  },
};

export const platformSlugs = Object.keys(platformConfigs);
