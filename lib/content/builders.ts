import type { PageContent, PlatformContentSeed, DownloadType, ContentSection, ContentStep, ContentTip, ContentTable } from "./types";
import type { PlatformConfig } from "@/lib/platform-config";
import enMessages from "@/messages/en.json" assert { type: "json" };

const formatTables: Record<string, (name: string) => ContentTable> = {
  video: (name) => ({
    headers: ["Format", "Resolution", "Best For"],
    rows: [
      ["MP4", "4K / 1080p / 720p / 480p", "Universal playback on all devices and platforms"],
      ["WebM", "720p", "Web-optimized with efficient compression"],
      ["MKV", "1080p", "Advanced features like multiple audio tracks"],
    ],
    caption: `Available video formats when downloading from ${name}. Most content is available in multiple resolutions.`,
  }),
  audio: (name) => ({
    headers: ["Format", "Quality", "Best For"],
    rows: [
      ["MP3", "128 / 192 / 320 kbps", "Universal playback — music, podcasts, audiobooks"],
      ["AAC", "256 kbps", "Better efficiency than MP3 at equivalent bitrate"],
      ["FLAC", "Lossless", "Archiving, audiophile listening, music production"],
      ["WAV", "Uncompressed", "Professional audio editing and post-production"],
      ["OGG", "192 kbps", "Open format with good compression efficiency"],
    ],
    caption: `Audio formats available when extracting from ${name}. FLAC is recommended for archival quality.`,
  }),
  thumbnail: (name) => ({
    headers: ["Format", "Resolution", "Best For"],
    rows: [
      ["JPG", "Max / High Quality", "Small file size with universal compatibility"],
      ["PNG", "Max Resolution", "Transparent backgrounds with highest fidelity"],
      ["WebP", "Max Resolution", "Modern format — best compression-to-quality ratio"],
    ],
    caption: `Thumbnail formats available when downloading from ${name}. PNG is best for maximum quality.`,
  }),
  transcript: (name) => ({
    headers: ["Format", "Description", "Best For"],
    rows: [
      ["SRT", "SubRip subtitle format", "Video players, editing software, broadcasting"],
      ["VTT", "WebVTT format", "HTML5 video players and web browsers"],
      ["TXT", "Plain text", "Quick reading, copying, note-taking, sharing"],
      ["JSON", "Structured JSON data", "Programmatic processing, apps, data analysis"],
    ],
    caption: `Transcript formats available for ${name} videos. SRT is the most widely supported subtitle format.`,
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

const typeAction: Record<string, string> = {
  video: "downloading",
  audio: "extracting",
  thumbnail: "downloading",
  transcript: "generating",
};

export function buildContent(config: PlatformConfig, seed: PlatformContentSeed, type: DownloadType): PageContent {
  const tName = typeNames[type];
  const verb = typeVerb[type];
  const noun = typeNoun[type];
  const action = typeAction[type];
  const typeSteps = seed.steps[type] ?? [];
  const formatIntro = seed.formatIntros[type] ?? `Here are the ${tName.toLowerCase()} formats available:`;
  const conclusion = seed.conclusions[type] ?? `Start ${action} ${tName.toLowerCase()} from ${config.name} right now — just paste your link above.`;

  return {
    type,
    platform: config.id,
    introduction: buildIntroduction(config, seed, type, tName, noun),
    whatIsPlatform: buildWhatIsPlatform(config, seed.platformSummary, tName),
    stepByStepGuide: buildStepByStep(config, typeSteps, type, tName, verb),
    formatGuide: buildFormatGuide(config, formatIntro, type, tName),
    whyDownForge: buildWhyDownForge(config, seed.whyDownForgeParagraphs, type, tName, noun),
    proTips: buildProTips(config, seed.tips),
    troubleshooting: buildTroubleshooting(config, seed.troubleshooting),
    conclusion: buildConclusion(config, conclusion, type, tName, verb, noun, action),
  };
}

function getFeatureTitles(platformId: string): string[] {
  const platformTranslations = (enMessages as any).Platform?.[platformId];
  if (!platformTranslations?.features) return [];
  return (platformTranslations.features as { title: string }[]).map((f) => f.title.toLowerCase());
}

function buildIntroduction(config: PlatformConfig, seed: PlatformContentSeed, type: DownloadType, tName: string, noun: string): ContentSection {
  return {
    heading: `Complete Guide to ${type === "audio" ? "Extracting Audio from" : `Downloading ${tName} from`} ${config.name}`,
    subheading: `Learn how to ${type === "audio" ? "extract" : "download"} ${noun} from ${config.name} using DownForge — the fastest, most reliable ${config.name} ${tName.toLowerCase()} downloader available online.`,
    paragraphs: [
      ...seed.introParagraphs,
      `DownForge's ${config.name} ${tName.toLowerCase()} downloader supports multiple formats and quality levels, giving you complete control over your downloads. You can ${type === "audio" ? "extract" : "download"} ${noun} in your preferred format with just a few clicks — no account creation or software installation needed. The entire process takes seconds and works entirely in your browser.`,
      `In this comprehensive guide, we'll cover everything you need to know about ${type === "audio" ? "extracting audio from" : `downloading ${noun} from`} ${config.name}. We'll walk through supported formats, provide step-by-step instructions for each device type, share expert tips to maximize quality, and troubleshoot common issues. Whether you're a first-time user or an experienced downloader, this guide has you covered.`,
      `By the end of this guide, you'll be able to ${type === "audio" ? "extract pristine audio tracks" : "download high-quality videos"} from ${config.name} with confidence. Let's get started.`,
    ],
  };
}

function buildWhatIsPlatform(config: PlatformConfig, summary: string, tName: string): ContentSection {
  return {
    heading: `What Is ${config.name}?`,
    paragraphs: [
      summary,
      `${config.name} has become one of the most popular platforms for ${getFeatureTitles(config.id).join(", ").replace(/, ([^,]*)$/, ", and $1")}. With millions of active users and ${config.name === "YouTube" ? "over 500 hours of content uploaded every minute" : "countless hours of content uploaded daily"}, the platform offers an incredible variety of ${tName.toLowerCase()} content across every category imaginable.`,
      `However, ${config.name} does not provide a built-in way to permanently ${tName.toLowerCase() === "audio" ? "extract audio from videos" : `download ${tName.toLowerCase()} files`} for offline use. This is where DownForge comes in — bridging the gap between streaming and ownership by giving you a simple, fast way to save ${config.name} content to your device.`,
    ],
  };
}

function buildStepByStep(config: PlatformConfig, steps: ContentStep[], type: string, tName: string, verb: string): ContentSection {
  const defaultSteps: ContentStep[] = [
    {
      title: `Locate Your ${config.name} Content`,
      body: `Open ${config.name} in your browser or app and navigate to the ${type === "audio" ? "video or track" : type === "transcript" ? "video" : "content"} you want to ${verb === "extract" ? "extract" : "download"}. Copy the full URL from your browser's address bar, or use the platform's share menu to copy the direct link. Make sure the complete URL is copied — shortened URLs sometimes work but full URLs are more reliable.`,
    },
    {
      title: "Paste the URL into DownForge",
      body: `Return to DownForge and paste the ${config.name} URL into the input field at the top of this page. Our tool automatically detects the platform and analyzes the content to determine available formats, quality options, and file sizes. You'll see all download options appear instantly — no waiting, no complicated settings.`,
    },
    {
      title: `Select Your Preferred ${tName} Format`,
      body: `Choose from the available ${tName.toLowerCase()} formats and quality levels. For ${tName.toLowerCase() === "video" ? "video" : tName.toLowerCase() === "audio" ? "audio" : "files"}, we offer multiple options ranging from high-quality to efficient compressed formats. Refer to the format comparison table below to understand which option best suits your needs. Consider your storage space, intended use, and device compatibility when making your selection.`,
    },
    {
      title: "Configure Quality Settings",
      body: `${type === "audio" ? "Select your preferred audio bitrate" : "Pick your desired resolution and quality level"}. Higher ${type === "audio" ? "bitrates (like 320 kbps)" : "resolutions (like 4K or 1080p)"} produce larger files but deliver significantly better quality. If you're unsure, choose the highest available option — you can always compress or convert the file later, but you can never recover quality that wasn't captured.`,
    },
    {
      title: `Process Your ${tName}`,
      body: `Click the ${verb === "extract" ? "Extract" : "Download"} button to begin processing. DownForge fetches your content directly from ${config.name}'s servers and prepares it in your chosen format. Processing typically completes within seconds for most files, though larger ${type === "video" ? "4K videos" : type === "audio" ? "files" : "files"} may take a bit longer. A progress indicator keeps you informed throughout the process.`,
    },
    {
      title: "Save and Enjoy Your File",
      body: `Once processing is complete, your file is ready for download. Click the download link to save it to your device. The file is yours to keep — watch it offline, transfer it to other devices, edit it, or organize it into your personal media library. DownForge does not store your downloaded files on our servers; they're processed in real-time and deleted immediately after your download completes.`,
    },
  ];

  return {
    heading: `How to ${verb === "extract" ? "Extract" : "Download"} ${tName} from ${config.name}: Step-by-Step Guide`,
    subheading: `Follow these ${steps.length >= 4 ? steps.length : 6} simple steps to ${verb} ${tName.toLowerCase()} from ${config.name} using DownForge. The entire process takes less than a minute.`,
    steps: steps.length >= 4 ? steps : defaultSteps,
    paragraphs: [],
  };
}

function buildFormatGuide(config: PlatformConfig, intro: string, type: string, tName: string): ContentSection {
  return {
    heading: `${config.name} ${tName} Formats and Quality Options — Complete Guide`,
    subheading: `Understanding available ${tName.toLowerCase()} formats helps you choose the right option for your specific needs. Here's everything you need to know about ${config.name} ${tName.toLowerCase()} quality and compatibility.`,
    paragraphs: [
      intro,
      `When choosing a ${tName.toLowerCase()} format, consider three factors: compatibility with your devices, file size vs. quality tradeoffs, and your intended use. For ${tName.toLowerCase() === "video" ? "video, MP4 is the safest choice as it plays on virtually every device" : tName.toLowerCase() === "audio" ? "audio, MP3 320kbps offers the best balance of quality and file size for most users" : "general use, the widely compatible format is usually the best choice"}. For archival purposes or professional work, always choose the highest quality option.`,
    ],
    table: formatTables[type](config.name),
  };
}

function buildWhyDownForge(config: PlatformConfig, paragraphs: string[], type: string, tName: string, noun: string): ContentSection {
  return {
    heading: `Why Use DownForge for ${config.name} ${tName} Downloads?`,
    subheading: `DownForge is the premier ${config.name} ${tName.toLowerCase()} downloader, trusted by thousands of users worldwide. Here's what sets us apart from other tools and methods.`,
    paragraphs: [
      ...paragraphs,
      `Unlike browser extensions or desktop software, DownForge works entirely online — no installation required. You can ${type === "audio" ? "extract" : "download"} ${noun} from ${config.name} on any device with a modern web browser, including Windows, Mac, Linux, iOS, and Android. Our service is free to start, with Pro plans available for users who need higher quality, batch processing, and unlimited downloads.`,
      `Security is a top priority at DownForge. We never store your ${config.name} URL or downloaded content on our servers. All processing happens in real-time, and files are deleted immediately after your download completes. Your privacy is protected — no tracking, no data collection, no account required for basic use.`,
    ],
  };
}

function buildProTips(config: PlatformConfig, tips: ContentTip[]): ContentSection {
  const defaultTips: ContentTip[] = [
    {
      title: "Always Choose the Highest Available Quality",
      body: `When downloading from ${config.name}, always select the highest quality option available. You can compress or convert files later using free tools like HandBrake or FFmpeg, but quality lost during the initial download cannot be recovered. Think of it like photography — you can always make a large image smaller, but you can't make a small image larger without losing quality.`,
    },
    {
      title: "Verify Content Accessibility Before Downloading",
      body: `Before attempting to download, make sure the ${config.name} content is publicly accessible. Private, friends-only, deleted, or region-restricted content cannot be processed by our service. If a download fails, first check whether you can view the content directly on ${config.name}'s website or app.`,
    },
    {
      title: "Use a Stable Internet Connection",
      body: "A stable, high-speed internet connection ensures faster processing and reduces the chance of download interruptions. For very large files (such as 4K videos or hour-long recordings), a wired Ethernet connection is recommended for the most reliable experience. If you're on Wi-Fi, try to stay close to your router.",
    },
    {
      title: "Organize Your Downloads Strategically",
      body: `Create a dedicated folder structure on your device for organizing downloaded content. Sort by platform (${config.name}), content type (video, audio, thumbnail, transcript), and date. Good organization makes it easy to find files later and prevents your downloads folder from becoming an unmanageable mess.`,
    },
    {
      title: "Download Content You Value Before It's Gone",
      body: "Online content can disappear at any time — creators delete videos, platforms remove content, licensing agreements expire, and accounts get suspended. If you come across content that is meaningful, useful, or important to you, download it promptly rather than assuming it will be available forever.",
    },
  ];

  return {
    heading: `Expert Tips for ${config.name} Downloads`,
    subheading: `Maximize your download quality and efficiency with these professional tips and best practices for ${config.name}.`,
    tips: tips.length >= 4 ? tips : defaultTips,
    paragraphs: [
      `Get the most out of your ${config.name} downloads with these expert tips gathered from years of experience with online video downloading:`,
    ],
  };
}

function buildTroubleshooting(config: PlatformConfig, items: Array<{ q: string; a: string }>): ContentSection {
  const defaultItems = [
    { q: `Why can't I download a particular ${config.name} video?`, a: `There are several reasons a download might fail. The content may be private, age-restricted, region-locked, or deleted. Only publicly accessible content can be downloaded through our service. If you're sure the content should be accessible, try copying the URL again — sometimes the issue is a truncated or incorrect link.` },
    { q: `Why is the downloaded quality lower than expected?`, a: `The available quality depends entirely on what the original uploader provided to ${config.name}. If someone uploaded a video in 720p, that's the maximum quality available regardless of what quality option you select. Additionally, some platforms compress uploaded content, which can further reduce quality. Always check the source content's quality before downloading.` },
    { q: `Is there a limit on how many ${config.name} videos I can download?`, a: `Free accounts can download a reasonable number of files per day for personal use. Pro and Team plans remove these limits entirely and offer additional benefits like higher download speeds, batch processing, and priority support. Check our pricing page for detailed plan comparisons.` },
    { q: `Can I download ${config.name} content on my phone or tablet?`, a: `Absolutely! DownForge works on any device with a modern web browser — smartphones, tablets, laptops, and desktops. The interface is fully responsive and adapts to your screen size. On iOS, downloads save to your Files app; on Android, they save to your Downloads folder.` },
    { q: `How long does processing typically take?`, a: `Most downloads complete within a few seconds. Processing time depends on file size, server load, and your internet connection speed. Larger files like 4K videos or hour-long recordings may take 30-60 seconds. Pro users get priority processing queues for faster downloads during peak times.` },
    { q: `What should I do if a download fails or gets stuck?`, a: `First, refresh the page and try again with the same URL. If the problem persists, check your internet connection and try a different browser. Ensure the URL is complete and correctly copied from ${config.name}. If none of these steps work, the content may be unavailable or restricted.` },
  ];

  return {
    heading: `Troubleshooting Common ${config.name} Download Issues`,
    subheading: `Encountering problems? Here are solutions to the most common issues users face when downloading from ${config.name}:`,
    paragraphs: [
      `Most download issues have simple solutions. Here are answers to the most frequently asked questions about ${config.name} downloads:`,
    ],
    tips: (items.length >= 4 ? items : defaultItems).map((item) => ({
      title: item.q,
      body: item.a,
    })),
  };
}

function buildConclusion(config: PlatformConfig, text: string, type: string, tName: string, verb: string, noun: string, action: string): ContentSection {
  return {
    heading: `Start ${action === "downloading" ? "Downloading" : action === "extracting" ? "Extracting" : "Generating"} ${tName} from ${config.name} Today`,
    subheading: `Ready to ${verb} your first ${tName.toLowerCase()} from ${config.name}? Here's a quick recap of what we covered and how to get started.`,
    paragraphs: [
      text,
      `${config.name} is an incredible source of ${tName.toLowerCase()} content, and with DownForge you can ${verb} ${noun} effortlessly. In this guide, we covered what ${config.name} is, how to use our ${config.name} ${tName.toLowerCase()} downloader step by step, the available formats and quality options, expert tips for the best results, and solutions to common issues.`,
      `With DownForge, ${action} ${noun} from ${config.name} is quick, free for basic use, and requires no registration. Whether you need a single file or regularly ${verb} content, our tool delivers the quality and convenience you need. We continuously update our platform to support the latest changes from ${config.name}, ensuring reliable performance at all times.`,
      `Ready to get started? Simply paste your ${config.name} link into the input field above and ${verb} your ${tName.toLowerCase()} in seconds. No sign-up, no software, no hassle.`,
    ],
  };
}
