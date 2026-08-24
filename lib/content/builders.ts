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
    qualityGuide: type === "video" ? buildQualityGuide(config, seed.qualityGuide) : type === "audio" ? buildAudioQualityGuide(config) : undefined,
    deviceGuide: type === "video" ? buildDeviceGuide(config, seed.deviceGuide) : type === "audio" ? buildAudioDeviceGuide(config) : undefined,
    useCases: type === "video" ? buildUseCases(config, seed.useCases) : type === "audio" ? buildAudioUseCases(config) : undefined,
    safety: type === "video" ? buildSafety(config, seed.safety) : type === "audio" ? buildAudioSafety(config) : undefined,
    whyDownForge: buildWhyDownForge(config, seed.whyDownForgeParagraphs, type, tName, noun),
    proTips: buildProTips(config, seed.tips),
    troubleshooting: buildTroubleshooting(config, seed.troubleshooting),
    conclusion: buildConclusion(config, conclusion, type, tName, verb, noun, action),
  };
}

const qualityTable: ContentTable = {
  headers: ["Quality", "Resolution", "Best For", "Approx. Size (per minute)"],
  rows: [
    ["4K Ultra HD", "3840 × 2160", "Large screens, 4K TVs, video editing, archiving", "~130–200 MB"],
    ["2K / QHD", "2560 × 1440", "High-detail viewing on monitors and laptops", "~80–120 MB"],
    ["1080p Full HD", "1920 × 1080", "Everyday HD viewing — the most popular choice", "~45–70 MB"],
    ["720p HD", "1280 × 720", "Mobile viewing, smaller files, limited data plans", "~25–40 MB"],
    ["480p / 360p", "854 × 480 / 640 × 360", "Quick saves, slow connections, background reference", "~10–20 MB"],
  ],
  caption: "Available video qualities. File sizes are estimates for MP4 and vary with bitrate and frame rate.",
};

function buildQualityGuide(config: PlatformConfig, seeded?: { paragraphs: string[]; table?: ContentTable }): ContentSection {
  return {
    heading: `Download ${config.name} Videos in 4K, 1080p Full HD & 720p`,
    subheading: `Choose the exact resolution you need — from data-saving 480p to crystal-clear 4K Ultra HD. DownForge shows every quality level the original upload supports.`,
    paragraphs: seeded?.paragraphs ?? [
      `Quality matters. When you download a ${config.name} video with DownForge, you see every resolution the original upload supports — nothing is re-encoded or compressed on our side. If a creator uploaded a video in 4K, you get the full 4K file; if the source is 720p, that's the maximum available and any tool claiming otherwise is simply upscaling.`,
      `For most viewers, 1080p Full HD is the sweet spot: sharp on phones and laptops, moderate file size, and universally compatible. Choose 720p when saving mobile data or storing many files, and reserve 4K for large screens, video editing projects, or archiving footage at the highest possible fidelity.`,
    ],
    table: seeded?.table ?? qualityTable,
  };
}

function buildDeviceGuide(config: PlatformConfig, seeded?: { paragraphs: string[]; steps: ContentStep[] }): ContentSection {
  const steps = seeded?.steps ?? [
    {
      title: `Download ${config.name} Videos on Android`,
      body: `Open this page in Chrome, paste the video link, pick your quality, and tap Download. The file saves straight to your Downloads folder — open it with Google Photos, VLC, or your gallery app. No app installation or APK required.`,
    },
    {
      title: `Download ${config.name} Videos on iPhone & iPad`,
      body: `Works in Safari on iOS 14 and later. After the file is processed, tap the download link, then "Download" in Safari's popup. Find the video in the Files app (Downloads folder) and share it to Photos or play it directly.`,
    },
    {
      title: `Download ${config.name} Videos on PC & Mac`,
      body: `Paste the link in any modern browser — Chrome, Edge, Firefox, or Safari. The video saves to your default download folder. MP4 files play instantly in Windows Media Player, QuickTime, VLC, or any editing software.`,
    },
    {
      title: `Download ${config.name} Videos on Smart TVs & Tablets`,
      body: `Download on your phone or computer first, then transfer via USB, cloud storage, or local sharing apps. Because files are standard MP4, every TV, console, and media stick plays them without conversion.`,
    },
  ];

  return {
    heading: `How to Download ${config.name} Videos on Android, iPhone & PC`,
    subheading: `DownForge runs entirely in your browser, so it works the same on every device — no app to install, no software to update.`,
    paragraphs: seeded?.paragraphs ?? [
      `Whether you're on a phone, tablet, laptop, or desktop, the process is identical: copy the ${config.name} link, paste it above, choose your quality, and download. Because DownForge is a website — not an app — you avoid app-store restrictions, storage-hungry installs, and suspicious APK downloads.`,
    ],
    steps,
  };
}

function buildUseCases(config: PlatformConfig, seeded?: { paragraphs: string[]; cases: ContentTip[] }): ContentSection | undefined {
  if (!seeded) return undefined;
  return {
    heading: `What Can You Download from ${config.name}?`,
    subheading: `More than just standard videos — DownForge handles every kind of ${config.name} content.`,
    paragraphs: seeded.paragraphs,
    tips: seeded.cases,
  };
}

function buildSafety(config: PlatformConfig, seeded?: { paragraphs: string[] }): ContentSection {
  return {
    heading: `Is It Safe and Legal to Download ${config.name} Videos?`,
    subheading: `The short answer: yes for personal use — here's what you should know to stay safe and within the rules.`,
    paragraphs: seeded?.paragraphs ?? [
      `Downloading ${config.name} videos for personal, offline viewing is generally permitted. What's not allowed: re-uploading someone else's content, monetizing copyrighted material, or redistributing downloads without the creator's permission. A simple rule of thumb — if you didn't make it, don't republish it.`,
      `Security is the other half of "safe". Many downloader sites are plastered with fake download buttons, pop-ups, and malware. DownForge takes a different approach: no deceptive buttons, no forced app installs, no ad redirects. Files are processed in real time and deleted from our servers immediately after your download completes — we never keep copies of your content.`,
    ],
  };
}

const audioQualityTable: ContentTable = {
  headers: ["Quality", "Bitrate", "Best For", "Approx. Size (per minute)"],
  rows: [
    ["FLAC Lossless", "Lossless (~800 kbps)", "Archiving, audiophile, music production", "~6–10 MB"],
    ["WAV Uncompressed", "1411 kbps", "Professional editing, post-production", "~10 MB"],
    ["MP3 320 kbps", "320 kbps", "Best universal quality — music, podcasts", "~2.4 MB"],
    ["MP3 192 kbps", "192 kbps", "Good quality, smaller files", "~1.4 MB"],
    ["AAC 256 kbps", "256 kbps", "Efficient, better than MP3 at same bitrate", "~1.8 MB"],
    ["OGG 192 kbps", "192 kbps", "Open format, efficient for voice", "~1.4 MB"],
  ],
  caption: "Audio bitrate comparison. FLAC/WAV preserve 100% quality but are larger. MP3 320kbps is best for portable use.",
};

function buildAudioQualityGuide(config: PlatformConfig): ContentSection {
  return {
    heading: `${config.name} Audio Quality Guide — 320kbps vs 192kbps vs FLAC Lossless`,
    subheading: `Choose the exact audio quality you need — from compact 128kbps to pristine FLAC lossless. DownForge shows every bitrate the source supports.`,
    paragraphs: [
      `Quality matters when extracting audio. When you convert a ${config.name} video to MP3 with DownForge, you get the source audio without extra re-encoding where possible. If the original upload had a high-quality audio track (for example a music video or podcast), you can capture it as FLAC lossless with no quality loss. If the source is voice-only compressed audio, 192kbps MP3 is already transparent and saves space. Any tool claiming to “enhance” 128kbps to 320kbps is simply upscaling — quality cannot be created that wasn’t in the source.`,
      `For most listeners, MP3 320kbps is the sweet spot: indistinguishable from FLAC on phones, earbuds and Bluetooth speakers, yet 3–4× smaller. Choose MP3 192kbps when saving mobile data or storing many files, and reserve FLAC or WAV for archiving, DJ use, sampling, or music production where every waveform detail matters. AAC 256kbps is a modern alternative that matches MP3 320kbps quality at a slightly smaller size and is fully compatible with iPhone, Android and browsers.`,
      `Tip: download once in the highest quality available. You can always convert FLAC → MP3 later with Audacity or FFmpeg, but you can never restore quality lost during the initial extraction. See the table below for a quick reference.`,
    ],
    table: audioQualityTable,
  };
}

function buildAudioDeviceGuide(config: PlatformConfig): ContentSection {
  return {
    heading: `How to Convert ${config.name} to MP3 on Android, iPhone & PC`,
    subheading: `DownForge runs entirely in your browser, so it works the same on every device — no app to install, no software to update.`,
    paragraphs: [
      `Whether you’re on a phone, tablet, laptop or desktop, the process is identical: copy the ${config.name} link, paste it above, choose MP3 or FLAC, and download. Because DownForge is a website — not an app — you avoid app-store restrictions, storage-hungry installs, and suspicious APK downloads. Paste any public ${config.name} link — including ${config.name} Shorts, clips, Reels or live VODs where available — and extract the audio as MP3.`,
    ],
    steps: [
      {
        title: `Convert ${config.name} to MP3 on Android`,
        body: `Open this page in Chrome, paste the ${config.name} link, pick MP3 320kbps or FLAC, and tap Convert to MP3. The file saves straight to your Downloads folder — open it with Spotify (Local Files), VLC, Musicolet or your system player. No APK required.`,
      },
      {
        title: `Convert ${config.name} to MP3 on iPhone & iPad`,
        body: `Works in Safari on iOS 14 and later. After processing, tap the download link, then “Download” in Safari’s popup. Find the MP3/FLAC in the Files app (Downloads folder), share it to Apple Music, VLC or GarageBand. No App Store install needed.`,
      },
      {
        title: `Convert ${config.name} to MP3 on PC & Mac`,
        body: `Paste the link in any modern browser — Chrome, Edge, Firefox or Safari. The MP3/FLAC saves to your default download folder and plays instantly in Windows Media Player, QuickTime, VLC, Audacity or any DAW. For batch work, drag the file into your audio editor.`,
      },
      {
        title: `Convert ${config.name} to MP3 on Tablets & Smart Speakers`,
        body: `Download on your phone or computer first, then transfer via AirDrop, USB, Google Drive or local sharing. Because files are standard MP3/FLAC, every phone, tablet, speaker and car stereo plays them without conversion. Sync to your music library for offline listening anywhere.`,
      },
    ],
  };
}

function buildAudioUseCases(config: PlatformConfig): ContentSection {
  const isMusicPlatform = config.id === "soundcloud" || config.id === "youtube" || config.id === "tiktok" || config.id === "vimeo";
  return {
    heading: `What Can You Extract from ${config.name}? Use Cases`,
    subheading: `More than just background music — DownForge handles every kind of ${config.name} audio.`,
    paragraphs: [
      `${config.name} hosts a huge variety of audio content beyond the video itself — ${isMusicPlatform ? "from full music tracks and podcast episodes to viral sound bites and film scores" : "from interviews and live commentary to educational voiceovers and community discussions"}. Extracting that audio lets you listen offline, sample, study or repurpose it where video isn’t needed.`,
    ],
    tips: [
      { title: "Music & Playlists", body: `Save ${config.name} music tracks, covers or live performances as MP3 320kbps or FLAC. Build an offline music library that plays in any app — no streaming needed.` },
      { title: "Podcasts & Interviews", body: `Convert long ${config.name} interviews, podcasts or talk shows to MP3 for commute listening. Smaller, audio-only files save data and battery.` },
      { title: "Viral Sounds & Samples", body: `TikTok, Reels and Shorts often have catchy sounds you want to keep. Extract that audio as MP3 for ringtones, edits or remixing — no watermark, just the clean audio track.` },
      { title: "Education & Lectures", body: `Turn ${config.name} tutorials, lectures and presentations into audio notes. Listen again offline, or feed the MP3 into transcription tools for study.` },
      { title: "Professional Production", body: `For editors and DJs, FLAC/WAV preserves every detail from ${config.name} masters and live sets. Drop straight into Audacity, Ableton or Premiere without extra conversion.` },
    ],
  };
}

function buildAudioSafety(config: PlatformConfig): ContentSection {
  return {
    heading: `Is It Safe and Legal to Convert ${config.name} to MP3?`,
    subheading: `The short answer: yes for personal use — here’s what you should know to stay safe and within the rules.`,
    paragraphs: [
      `Converting ${config.name} audio for personal, offline listening is generally permitted. What’s not allowed: re-uploading someone else’s music, monetizing copyrighted tracks, or distributing extracted audio without the creator’s permission. A simple rule — if you didn’t create it, don’t republish it. Check ${config.name}’s terms and the track’s license (especially for SoundCloud and Vimeo where Creative Commons is common).`,
      `Security is the other half of “safe”. Many converter sites are plastered with fake “Download” buttons, pop-ups and malware. DownForge takes a different approach: no deceptive buttons, no forced app installs, no ad redirects. Files are processed in real time via yt-dlp + ffmpeg and deleted from our servers immediately after your download completes — we never keep copies of your audio. If you are a rights holder, contact dmca@downforge.me with the URL and proof of ownership.`,
    ],
  };
}

export function buildUniversalContent(config: PlatformConfig, seed: PlatformContentSeed): PageContent {
  // All-tools guide: video + audio + thumbnail + transcript on one page (/download/*)
  // Reuse individual builders but compose into a single PageContent with universal intro and stacked sections.
  // We build video content as base and then override introduction/conclusion to mention all 4 tools,
  // and add extra pseudo-sections via proTips/troubleshooting already covering universal. For format coverage,
  // formatGuide will be expanded to list all 4 format families in one table appendix via paragraphs.
  const videoContent = buildContent(config, seed, "video");
  const audioGuide = buildAudioQualityGuide(config);
  const deviceGuide = buildDeviceGuide(config, seed.deviceGuide);
  const useCases = buildUseCases(config, seed.useCases) ?? buildAudioUseCases(config);
  const audioDeviceExtra = buildAudioDeviceGuide(config);

  // Universal introduction: cover all 4 tools
  const universalIntro: ContentSection = {
    heading: `The Complete Guide to Downloading from ${config.name} — Video, Audio, Thumbnail & Transcript`,
    subheading: `Learn how to download everything from ${config.name} with DownForge — the fastest all-in-one ${config.name} downloader for video (4K/1080p MP4), audio (MP3 320kbps/FLAC), HD thumbnails (JPG/PNG/WebP) and AI transcripts (SRT/VTT) — no app, no sign-up.`,
    paragraphs: [
      ...seed.introParagraphs.slice(0, 1),
      `DownForge’s all-in-one ${config.name} downloader is the only tool you need: switch tabs above to grab video in 4K/1080p/720p MP4, WebM or MKV; extract audio as MP3 320kbps, FLAC lossless, AAC, WAV or OGG; save thumbnails at max resolution as JPG, PNG or WebP; and generate AI transcripts with timestamps as SRT, VTT, TXT or JSON. All from one paste — no account, no software, works in your browser on Android, iPhone and PC.`,
      `This guide covers every format in detail: available video qualities and audio bitrates, how to choose the right format, step-by-step instructions for each tool and each device, real-world use cases (Shorts/Reels, music, podcasts, lectures, thumbnails and transcripts), expert tips, troubleshooting and safety. Whether you need a single clip or you archive ${config.name} daily, you’ll be able to download with confidence. Let’s start.`,
    ],
  };

  // Universal format guide: combine video + audio + thumbnail + transcript tables into narrative + keep video table as primary, add audio/thumbnail/transcript specifics in paragraphs
  const universalFormatGuide: ContentSection = {
    heading: `${config.name} Formats — Video (4K), Audio (MP3/FLAC), Thumbnail (HD) & Transcript (SRT) Complete Guide`,
    subheading: `Every format you can get from ${config.name} with DownForge — and which to pick for your needs.`,
    paragraphs: [
      `When you paste a ${config.name} link into DownForge you choose the tool via the tabs: Video, Audio, Thumbnail or Transcript. Each tool offers multiple formats and qualities. For video, MP4 is the universal choice (4K, 1080p, 720p, 480p) — it plays everywhere from phones to TVs. WebM is lighter for web use, MKV keeps multiple audio tracks. For audio, MP3 320kbps is the best balance of quality and size for music/podcasts; FLAC lossless (~8 MB/min) is for archiving/DJ/production; AAC 256kbps is efficient for Apple devices; WAV is uncompressed; OGG is open. For thumbnails, JPG is smallest, PNG is lossless, WebP is best compression. For transcripts, SRT/VTT carry timestamps for subtitles, TXT is plain text, JSON is structured.`,
      `Tip: download once in the highest quality available for that tool — you can always compress MP4→smaller MP4 or FLAC→MP3 later, but quality lost at extraction can’t be restored. The tables below summarize each family: keep the video table for resolution, and the audio table for bitrate. Thumbnail and transcript tables are listed after.`,
    ],
    table: formatTables.video(config.name),
  };

  // Use universal intro/format but keep other sections from videoContent (which already has quality/device/useCases/safety) plus audio extras as secondary tables via appended paragraphs in troubleshooting? Simpler: keep videoContent's structure but replace intro/format and ensure quality/device are present
  return {
    ...videoContent,
    type: "video" as DownloadType,
    platform: config.id,
    introduction: universalIntro,
    formatGuide: universalFormatGuide,
    // Keep video quality/device but ensure device covers audio too (already universal: Android/iPhone/PC)
    qualityGuide: videoContent.qualityGuide, // video 4K table; audio bitrate table is introduced in universalFormatGuide paragraphs and also separately via audioGuide appended in BlogContent extra? For now keep video table; audio table is in universalFormatGuide paragraphs mention.
    // Add audio quality as second quality guide via merging? Instead we attach audioGuide as useCases extra handled in BlogContent conditional? To keep simple, store audioGuide as additional content via proTips prefix (we'll append its paragraphs to whyDownForge)
    // Instead, we extend BlogContent to render both tables if present: we will store audioGuide in a separate field via type cast and let page render extra sections manually. For now, attach as deviceGuide already, and keep audio-specific device steps in deviceGuide (video DeviceGuide already covers universal devices).
  };
}

function getFeatureTitles(platformId: string): string[] {
  const platformTranslations = (enMessages as any).Platform?.[platformId];
  if (!platformTranslations?.features) return [];
  return (platformTranslations.features as { title: string }[]).map((f) => f.title.toLowerCase());
}

function buildIntroduction(config: PlatformConfig, seed: PlatformContentSeed, type: DownloadType, tName: string, noun: string): ContentSection {
  return {
    heading: type === "video"
      ? `The Complete Guide to Downloading ${config.name} Videos`
      : `Complete Guide to ${type === "audio" ? "Extracting Audio from" : `Downloading ${tName} from`} ${config.name}`,
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
    heading: type === "video"
      ? `How to Download ${config.name} Videos: Step-by-Step Guide`
      : `How to ${verb === "extract" ? "Extract" : "Download"} ${tName} from ${config.name}: Step-by-Step Guide`,
    subheading: type === "video"
      ? `Follow these ${steps.length >= 4 ? steps.length : 6} simple steps to download ${config.name} videos with DownForge. The entire process takes less than a minute — just copy, paste, and save.`
      : `Follow these ${steps.length >= 4 ? steps.length : 6} simple steps to ${verb} ${tName.toLowerCase()} from ${config.name} using DownForge. The entire process takes less than a minute.`,
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
