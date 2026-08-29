export type DownloadType = "video" | "audio" | "thumbnail" | "transcript";

export type ContentStep = {
  title: string;
  body: string;
};

export type ContentTable = {
  headers: string[];
  rows: string[][];
  caption?: string;
};

export type ContentTip = {
  title: string;
  body: string;
};

export type ContentSection = {
  heading: string;
  subheading?: string;
  paragraphs: string[];
  steps?: ContentStep[];
  table?: ContentTable;
  tips?: ContentTip[];
};

export type PageContent = {
  type: DownloadType;
  platform: string;
  introduction: ContentSection;
  whatIsPlatform: ContentSection;
  stepByStepGuide: ContentSection;
  formatGuide: ContentSection;
  qualityGuide?: ContentSection;
  deviceGuide?: ContentSection;
  useCases?: ContentSection;
  safety?: ContentSection;
  whyDownForge: ContentSection;
  proTips: ContentSection;
  troubleshooting: ContentSection;
  conclusion: ContentSection;
};

export type RelatedLink = {
  /** Stable id used to resolve the localized title/desc from messages
   *  (`RelatedLinks.{id}Title` / `RelatedLinks.{id}Desc`). The English
   *  `title`/`desc` fields act as the fallback copy. */
  id?: string;
  /** ICU parameters (e.g. {platform}) passed to the translated string. */
  params?: Record<string, string>;
  title: string;
  href: string;
  desc: string;
};

export type PlatformContentSeed = {
  introParagraphs: string[];
  platformSummary: string;
  whyDownForgeParagraphs: string[];
  tips: ContentTip[];
  troubleshooting: Array<{ q: string; a: string }>;
  steps: Record<string, ContentStep[]>;
  formatIntros: Record<string, string>;
  conclusions: Record<string, string>;
  qualityGuide?: { paragraphs: string[]; table?: ContentTable };
  deviceGuide?: { paragraphs: string[]; steps: ContentStep[] };
  useCases?: { paragraphs: string[]; cases: ContentTip[] };
  safety?: { paragraphs: string[] };
};
