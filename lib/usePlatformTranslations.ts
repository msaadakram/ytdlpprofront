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
  const ft = t.raw("features") as { title: string; desc: string }[];
  const fqt = t.raw("faqs") as { q: string; a: string }[];

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
      title: ft[i]?.title ?? "",
      desc: ft[i]?.desc ?? "",
    })),
    faqs: fqt.map((f) => ({ q: f.q, a: f.a })),
    metaTitle: t("metaTitle"),
    metaDescription: t("metaDescription"),
    keywords: t.raw("keywords") as string[],
  };
}
