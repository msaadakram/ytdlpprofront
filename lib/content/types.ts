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
  introduction: ContentSection;
  stepByStepGuide: ContentSection;
  formatGuide: ContentSection;
  proTips: ContentSection;
  troubleshooting: ContentSection;
  conclusion: ContentSection;
};

export type PlatformContentSeed = {
  introParagraphs: string[];
  tips: ContentTip[];
  troubleshooting: Array<{ q: string; a: string }>;
  steps: Record<string, ContentStep[]>;
  formatIntros: Record<string, string>;
  conclusions: Record<string, string>;
};
