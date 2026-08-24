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

  // Prefer audio-specific keys with fallback (audio-downloader pages)
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

  // Detect if audio keys exist for this platform/locale
  const hasAudio = tryRaw("featuresAudio") !== null;

  const ft = (hasAudio ? tryRaw("featuresAudio") : tryRaw("features")) as { title: string; desc: string }[] | null;
  const fqt = (hasAudio ? tryRaw("faqsAudio") : tryRaw("faqs")) as { q: string; a: string }[] | null;

  // For audio downloader pages, downstream components use DownloadOnlyHero's getAudioKey,
  // so we keep badge/heading as generic video ones for fallback; audio components will override via direct translations.
  return {
    ...config,
    defaultType: config.defaultType,
    badge: t("badge"),
    heading: t("heading"),
    headingAccent: t("headingAccent"),
    subheading: t("subheading"),
    placeholder: t("placeholder"),
    features: config.features.map((f, i) => ({
      icon: f.icon,
      title: (ft as any)?.[i]?.title ?? "",
      desc: (ft as any)?.[i]?.desc ?? "",
    })),
    faqs: ((fqt as any) ?? []).map((f: any) => ({ q: f.q, a: f.a })),
    metaTitle: tryGet("metaTitleAudio", "metaTitle"),
    metaDescription: tryGet("metaDescriptionAudio", "metaDescription"),
    keywords: (tryRaw("keywordsAudio") ?? tryRaw("keywords")) as string[],
  };
}
