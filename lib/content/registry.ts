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
