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

export function usePlatformTranslations(platform: string): RichPlatformConfig {
  const config = platformConfigs[platform];
  const t = useTranslations(`Platform.${platform}`);

  // Prefer audio/all-tools keys with fallback (audio-downloader and download/* pages)
  const tryRaw = (key: string) => {
    try {
      return t.raw(key as any);
    } catch {
      return null;
    }
  };
  const tryGet = (key: string, fallback: string) => {
    try {
      return t(key as any);
    } catch {
      return t(fallback as any);
    }
  };

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
