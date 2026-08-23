"use client";

import { VideoOnlyHero as SharedVideoOnlyHero } from "@/components/video-downloader/VideoOnlyHero";

// The YouTube-specific video page shares the modern platform hero —
// Platform.youtube messages provide the YouTube-red branding and copy.
export function VideoOnlyHero() {
  return <SharedVideoOnlyHero platform="youtube" />;
}
