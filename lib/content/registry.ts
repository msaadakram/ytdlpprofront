import type { PageContent, DownloadType } from "./types";
import { buildContent } from "./builders";
import { platformConfigs } from "@/lib/platform-config";
import { platformSeeds, youtubeDownloadSeed, youtubeVideoSeed } from "./seeds";

const contentCache = new Map<string, PageContent>();

function cacheKey(platform: string, type: string): string {
  return `${platform}:${type}`;
}

export function getContent(platform: string, type: DownloadType): PageContent | null {
  const key = cacheKey(platform, type);

  if (contentCache.has(key)) {
    return contentCache.get(key)!;
  }

  const config = platformConfigs[platform];
  if (!config) return null;

  // YouTube has dedicated seeds (youtubeDownloadSeed) but is not in platformSeeds map.
  // For /audio-downloader/youtube we must use youtubeDownloadSeed to render long-form SEO content.
  const seed = platformSeeds[platform] ?? (platform === "youtube" ? youtubeDownloadSeed : undefined);
  if (!seed) return null;

  const content = buildContent(config, seed, type);
  contentCache.set(key, content);
  return content;
}

export function getYouTubeDownloadContent(type: DownloadType): PageContent | null {
  const key = `youtube-download:${type}`;
  if (contentCache.has(key)) return contentCache.get(key)!;
  const config = platformConfigs.youtube;
  if (!config) return null;
  const content = buildContent(config, youtubeDownloadSeed, type);
  contentCache.set(key, content);
  return content;
}

export function getYouTubeVideoContent(type: DownloadType): PageContent | null {
  const key = `youtube-video:${type}`;
  if (contentCache.has(key)) return contentCache.get(key)!;
  const config = platformConfigs.youtube;
  if (!config) return null;
  const content = buildContent(config, youtubeVideoSeed, type);
  contentCache.set(key, content);
  return content;
}

export function getUniversalContent(platform: string): PageContent | null {
  // All-tools content for /download/{platform} — describe all 4 formats in one guide.
  // Use video type as base but buildUniversalContent will expand to cover audio/thumbnail/transcript.
  const key = `universal:${platform}`;
  if (contentCache.has(key)) return contentCache.get(key)!;
  const config = platformConfigs[platform];
  if (!config) return null;
  const seed = platformSeeds[platform] ?? (platform === "youtube" ? youtubeDownloadSeed : undefined);
  if (!seed) return null;
  // Defer to builders' universal builder (lazy import to avoid circular)
  // We use buildContent with video as base, then patch with universal helpers via dynamic require
  const { buildUniversalContent } = require("./builders") as typeof import("./builders");
  const content = buildUniversalContent(config, seed);
  contentCache.set(key, content);
  return content;
}

export function getYouTubeUniversalContent(): PageContent | null {
  const key = "youtube-universal";
  if (contentCache.has(key)) return contentCache.get(key)!;
  const config = platformConfigs.youtube;
  if (!config) return null;
  const { buildUniversalContent } = require("./builders") as typeof import("./builders");
  const content = buildUniversalContent(config, youtubeDownloadSeed);
  contentCache.set(key, content);
  return content;
}
