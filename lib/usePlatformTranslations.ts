import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { platformConfigs } from "@/lib/platform-config";
import type { ComponentType } from "react";

type Feature = {
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  desc: string;
};

type Faq = { q: string; a: string };

export type RichPlatformConfig = {
  id: string;
  name: string;
  slug: string;
  brandColor: string;
  fgColor: string;
  Logo: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  defaultType: "video" | "audio" | "thumbnail" | "transcript";
  inputIcon: ComponentType<{ className?: string }>;
  badge: string;
  heading: string;
  headingAccent: string;
  subheading: string;
  placeholder: string;
  features: Feature[];
  faqs: Faq[];
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
};

export function usePlatformTranslations(
  platform: string,
  variant: "all" | "video" = "all"
): RichPlatformConfig {
  const config = platformConfigs[platform];
  const t = useTranslations(`Platform.${platform}`);

  /**
   * Centralized safe getter: uses t.has() (this app's intl config renders
   * missing keys as the key path instead of throwing) with try/catch around
   * everything so a missing/broken key can never crash a page.
   */
  const safeGet = (key: string, fallback: string, fb = ""): string => {
    try {
      if (t.has(key as any)) return t(key as any) as unknown as string;
      if (fallback && t.has(fallback as any)) return t(fallback as any) as unknown as string;
      return fb;
    } catch {
      try {
        return fallback ? (t(fallback as any) as unknown as string) : fb;
      } catch {
        return fb;
      }
    }
  };
  // Prefer audio/all-tools keys with fallback (audio-downloader and download/* pages)
  const tryRaw = (key: string) => {
    try {
      return t.raw(key as any);
    } catch {
      return null;
    }
  };
  // Same observable behavior as before (missing key → fallback key path), but
  // routed through the centralized safeGet so nothing can throw.
  const tryGet = (key: string, fallback: string): string => {
    try {
      if (t.has(key as any)) return t(key as any) as unknown as string;
      return t(fallback as any) as unknown as string;
    } catch {
      return safeGet(fallback, "", fallback);
    }
  };

  // Video-only pages (video-downloader/*) must never pick up the all-tools
  // (headingAll) or audio (featuresAudio/faqsAudio) copy — they always use the
  // video-worded base keys so the page describes video downloading only.
  if (variant === "video") {
    // t.raw() may resolve missing keys to a non-array error marker, so every
    // raw lookup is validated before use.
    const asArray = <T,>(value: unknown): T[] | null =>
      Array.isArray(value) ? (value as T[]) : null;
    const ftVideo =
      asArray<{ title: string; desc: string }>(tryRaw("featuresVideo")) ??
      asArray<{ title: string; desc: string }>(tryRaw("features")) ??
      [];
    const faqsVideo =
      asArray<{ q: string; a: string }>(tryRaw("faqsVideo")) ??
      asArray<{ q: string; a: string }>(tryRaw("faqs")) ??
      [];
    const kwVideo =
      asArray<string>(tryRaw("keywordsVideo")) ??
      asArray<string>(tryRaw("keywords")) ??
      [];
    return {
      ...config,
      defaultType: config.defaultType,
      badge: tryGet("badgeVideo", "badge"),
      heading: tryGet("headingVideo", "heading"),
      headingAccent: tryGet("headingAccentVideo", "headingAccent"),
      subheading: tryGet("subheadingVideo", "subheading"),
      placeholder: t("placeholder"),
      features: config.features.map((f, i) => ({
        icon: f.icon,
        title: (ftVideo as any)?.[i]?.title ?? "",
        desc: (ftVideo as any)?.[i]?.desc ?? "",
      })),
      faqs: faqsVideo.map((f) => ({ q: f.q, a: f.a })),
      metaTitle: tryGet("metaTitleVideo", "metaTitle"),
      metaDescription: tryGet("metaDescriptionVideo", "metaDescription"),
      keywords: kwVideo,
    };
  }

  // Detect available key sets
  const hasAudio = tryRaw("featuresAudio") !== null;
  const hasAll = tryRaw("headingAll") !== null || tryRaw("metaTitleAll") !== null;

  const ft = (hasAudio ? tryRaw("featuresAudio") : hasAll ? tryRaw("features") : tryRaw("features")) as { title: string; desc: string }[] | null;
  const fqt = (hasAudio ? tryRaw("faqsAudio") : tryRaw("faqs")) as { q: string; a: string }[] | null;

  // For audio downloader pages, downstream components use DownloadOnlyHero's getAudioKey,
  // so we keep badge/heading as generic video ones for fallback; audio components will override via direct translations.
  // For download/* all-tools pages, prefer headingAll when present.
  const heading = hasAll ? tryGet("headingAll", "heading") : t("heading");
  const headingAccent = hasAll ? tryGet("headingAccentAll", "headingAccent") : t("headingAccent");
  const subheading = hasAll ? tryGet("subheadingAll", "subheading") : t("subheading");
  const badge = hasAll ? tryGet("badgeAll", "badge") : t("badge");

  return {
    ...config,
    defaultType: config.defaultType,
    badge,
    heading,
    headingAccent,
    subheading,
    placeholder: t("placeholder"),
    features: config.features.map((f, i) => ({
      icon: f.icon,
      title: (ft as any)?.[i]?.title ?? "",
      desc: (ft as any)?.[i]?.desc ?? "",
    })),
    faqs: ((fqt as any) ?? []).map((f: any) => ({ q: f.q, a: f.a })),
    metaTitle: hasAll ? tryGet("metaTitleAll", hasAudio ? "metaTitleAudio" : "metaTitle") : tryGet("metaTitleAudio", "metaTitle"),
    metaDescription: hasAll ? tryGet("metaDescriptionAll", hasAudio ? "metaDescriptionAudio" : "metaDescription") : tryGet("metaDescriptionAudio", "metaDescription"),
    keywords: (hasAll ? tryRaw("keywordsAll") : null) ?? (tryRaw("keywordsAudio") ?? tryRaw("keywords")) as string[],
  };
}
