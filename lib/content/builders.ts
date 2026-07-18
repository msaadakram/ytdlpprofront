import type { PageContent, PlatformContentSeed, DownloadType, ContentSection, ContentStep, ContentTip, ContentTable } from "./types";
import type { PlatformConfig } from "@/lib/platform-config";

const formatTables: Record<string, (name: string) => ContentTable> = {
  video: (name) => ({
    headers: ["Format", "Resolution", "Best For"],
    rows: [
      ["MP4", "4K / 1080p / 720p / 480p", "Universal playback on all devices"],
      ["WebM", "720p", "Web-optimized, smaller file size"],
      ["MKV", "1080p", "Advanced features, multiple audio tracks"],
    ],
    caption: `Available video formats when downloading from ${name}.`,
  }),
  audio: (name) => ({
    headers: ["Format", "Quality", "Best For"],
    rows: [
      ["MP3", "128 / 192 / 320 kbps", "Universal playback, music, podcasts"],
      ["AAC", "256 kbps", "Better efficiency than MP3 at same bitrate"],
      ["FLAC", "Lossless", "Archiving, audiophile listening, production"],
      ["WAV", "Uncompressed", "Professional audio editing"],
      ["OGG", "192 kbps", "Open format, good compression"],
    ],
    caption: `Audio formats available when extracting from ${name}.`,
  }),
  thumbnail: (name) => ({
    headers: ["Format", "Resolution", "Best For"],
    rows: [
      ["JPG", "Max / High Quality", "Small files, universal compatibility"],
      ["PNG", "Max Resolution", "Transparent backgrounds, highest quality"],
      ["WebP", "Max Resolution", "Modern format, efficient compression"],
    ],
    caption: `Thumbnail formats available when downloading from ${name}.`,
  }),
  transcript: (name) => ({
    headers: ["Format", "Description", "Best For"],
    rows: [
      ["SRT", "SubRip subtitle format", "Video players and editing software"],
      ["VTT", "WebVTT format", "HTML5 video and web browsers"],
      ["TXT", "Plain text", "Quick reading, copying, and sharing"],
      ["JSON", "Structured JSON data", "Programmatic processing and apps"],
    ],
    caption: `Transcript formats available for ${name} videos.`,
  }),
};

const typeNames: Record<string, string> = {
  video: "Video",
  audio: "Audio",
  thumbnail: "Thumbnail",
  transcript: "Transcript",
};

const typeVerb: Record<string, string> = {
  video: "download",
  audio: "extract",
  thumbnail: "download",
  transcript: "generate",
};

const typeNoun: Record<string, string> = {
  video: "videos",
  audio: "audio",
  thumbnail: "thumbnails",
  transcript: "transcripts",
};

export function buildContent(config: PlatformConfig, seed: PlatformContentSeed, type: DownloadType): PageContent {
  const tName = typeNames[type];
  const verb = typeVerb[type];
  const noun = typeNoun[type];
  const typeSteps = seed.steps[type] ?? [];
  const formatIntro = seed.formatIntros[type] ?? `Here are the ${tName.toLowerCase()} formats available:`;
  const conclusion = seed.conclusions[type] ?? `Start downloading ${tName.toLowerCase()} from ${config.name} right now — just paste your link above.`;

  return {
    type,
    introduction: buildIntroduction(config, seed, type),
    stepByStepGuide: buildStepByStep(config, typeSteps, type, tName),
    formatGuide: buildFormatGuide(config, formatIntro, type),
    proTips: buildProTips(config, seed.tips),
    troubleshooting: buildTroubleshooting(config, seed.troubleshooting),
    conclusion: buildConclusion(config, conclusion, type, tName, verb, noun),
  };
}

function buildIntroduction(config: PlatformConfig, seed: PlatformContentSeed, type: DownloadType): ContentSection {
  const tName = typeNames[type];
  const noun = typeNoun[type];
  return {
    heading: `About ${config.name} ${tName} Downloader`,
    paragraphs: [
      ...seed.introParagraphs,
      `DownForge's ${config.name} ${tName.toLowerCase()} downloader supports multiple formats and quality levels. You can ${type === "audio" ? "extract" : "download"} ${noun} in your preferred format with just a few clicks — no account creation or software installation needed.`,
      `In this guide, we'll cover everything you need to know about downloading ${type === "audio" ? "audio from" : `${noun} from`} ${config.name}, including supported formats, step-by-step instructions, and expert tips to get the best results.`,
    ],
  };
}

function buildStepByStep(config: PlatformConfig, steps: ContentStep[], type: string, tName: string): ContentSection {
  const defaultSteps: ContentStep[] = [
    {
      title: `Find Your ${config.name} Content`,
      body: `Open ${config.name} and navigate to the ${type === "audio" ? "video or track" : type === "transcript" ? "video" : "content"} you want to ${type === "audio" ? "extract" : "download"}. Copy the full URL from your browser's address bar.`,
    },
    {
      title: "Paste the Link",
      body: `Return to DownForge and paste the ${config.name} URL into the input field above. The tool will automatically detect the platform and prepare your ${type === "audio" ? "file for extraction" : "download"}.`,
    },
    {
      title: `Choose Your ${tName} Format`,
      body: `Select your preferred ${tName.toLowerCase()} format and quality. Refer to the format table below to pick the best option for your needs.`,
    },
    {
      title: "Start Processing",
      body: `Click the ${type === "audio" ? "Extract" : "Download"} button to begin processing. DownForge will fetch your content from ${config.name} and prepare it in your chosen format.`,
    },
    {
      title: "Save Your File",
      body: `Once processing is complete, your file will be ready. Click the download link to save it to your device. The file is yours to keep and use offline.`,
    },
  ];

  return {
    heading: `How to ${type === "audio" ? "Extract" : "Download"} ${tName} from ${config.name}`,
    steps: steps.length >= 3 ? steps : defaultSteps,
    paragraphs: steps.length >= 3 ? [] : [
      `Follow these simple steps to ${type === "audio" ? "extract" : "download"} ${tName.toLowerCase()} from ${config.name}:`,
    ],
  };
}

function buildFormatGuide(config: PlatformConfig, intro: string, type: string): ContentSection {
  return {
    heading: `${config.name} ${typeNames[type]} Formats & Quality`,
    paragraphs: [intro],
    table: formatTables[type](config.name),
  };
}

function buildProTips(config: PlatformConfig, tips: ContentTip[]): ContentSection {
  const defaultTips: ContentTip[] = [
    {
      title: `Use the Highest Available Quality`,
      body: `Always start with the highest quality option when downloading. You can always compress or convert later, but you can't recreate quality that wasn't captured.`,
    },
    {
      title: "Check Content Availability",
      body: `Make sure the ${config.name} content you're trying to download is publicly accessible. Private, deleted, or region-restricted content cannot be processed.`,
    },
    {
      title: "Use Stable Internet Connection",
      body: `A stable internet connection ensures faster processing and prevents interruptions during download. For large files, a wired connection is recommended.`,
    },
    {
      title: "Organize Your Downloads",
      body: `Create a dedicated folder structure for your downloaded content. This makes it easier to find files later and keeps your device organized.`,
    },
  ];
  return {
    heading: `Tips for Downloading from ${config.name}`,
    tips: tips.length >= 3 ? tips : defaultTips,
    paragraphs: [
      `Get the most out of your ${config.name} downloads with these expert tips:`,
    ],
  };
}

function buildTroubleshooting(config: PlatformConfig, items: Array<{ q: string; a: string }>): ContentSection {
  const defaultItems = [
    { q: `Why can't I download a particular ${config.name} video?`, a: `The content may be private, age-restricted, or region-locked. Only publicly accessible content can be downloaded through our service.` },
    { q: `Why is the download quality lower than expected?`, a: `The available quality depends on what the original uploader provided. Some ${config.name} videos are uploaded in lower resolutions.` },
    { q: `Is there a limit on how many ${config.name} videos I can download?`, a: `Free accounts have a daily download limit. Pro and Team plans offer unlimited downloads with higher processing priority.` },
    { q: `Can I download ${config.name} content on mobile?`, a: `Yes, DownForge works on any device with a modern web browser, including smartphones and tablets.` },
    { q: `How long does processing take?`, a: `Most downloads complete within seconds. Larger files or high-traffic periods may take longer. Pro users get priority processing.` },
  ];

  return {
    heading: `Troubleshooting ${config.name} Downloads`,
    paragraphs: [
      `Encountering issues? Here are solutions to common problems when downloading from ${config.name}:`,
    ],
    tips: (items.length >= 3 ? items : defaultItems).map((item) => ({
      title: item.q,
      body: item.a,
    })),
  };
}

function buildConclusion(config: PlatformConfig, text: string, type: string, tName: string, verb: string, noun: string): ContentSection {
  return {
    heading: `Start ${verb === "download" ? "Downloading" : "Extracting"} ${tName} from ${config.name} Today`,
    paragraphs: [
      text,
      `With DownForge, ${verb === "download" ? "downloading" : "extracting"} ${noun} from ${config.name} is quick, free, and requires no registration. Whether you need a single file or regularly ${verb} content, our tool delivers the quality and convenience you need.`,
      `Paste your ${config.name} link above to get started instantly.`,
    ],
  };
}
