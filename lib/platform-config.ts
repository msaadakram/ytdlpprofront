import type { ComponentType } from "react";
import {
  Youtube, Music, Image, Layers, Download, Globe, Video, Film,
  Headphones, Radio, MessageSquare, Hash, Play, Camera, Monitor,
} from "lucide-react";
import {
  YoutubeLogo, FacebookLogo, InstagramLogo, TikTokLogo, XLogo,
  VimeoLogo, DailymotionLogo, TwitchLogo, RedditLogo, PinterestLogo,
  LinkedInLogo, SnapchatLogo, SoundCloudLogo, KickLogo, NiconicoLogo,
} from "@/components/shared/brand-logos";
import type { DownloadType } from "@/lib/constants";

type BrandLogoProps = { className?: string; style?: React.CSSProperties };

export type PlatformConfig = {
  id: string;
  name: string;
  slug: string;
  brandColor: string;
  fgColor: string;
  Logo: ComponentType<BrandLogoProps>;
  defaultType: DownloadType;
  badge: string;
  heading: string;
  headingAccent: string;
  subheading: string;
  placeholder: string;
  inputIcon: ComponentType<{ className?: string }>;
  features: Array<{ icon: ComponentType<{ className?: string; style?: React.CSSProperties }>; title: string; desc: string }>;
  faqs: Array<{ q: string; a: string }>;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
};

export const platformConfigs: Record<string, PlatformConfig> = {
  facebook: {
    id: "facebook", name: "Facebook", slug: "facebook",
    brandColor: "#1877F2", fgColor: "#ffffff",
    Logo: FacebookLogo, defaultType: "video",
    badge: "Facebook Downloader",
    heading: "Download Facebook Videos",
    headingAccent: "in HD",
    subheading: "Paste any Facebook video link and download in seconds. Save Facebook Watch videos, live streams, and Reels — no account required.",
    placeholder: "Paste your Facebook video URL here...",
    inputIcon: Video,
    features: [
      { icon: Video, title: "Download HD Videos", desc: "Save Facebook videos in up to 1080p HD quality. Perfect for offline viewing of Watch shows, live streams, and shared content." },
      { icon: Music, title: "Extract Audio", desc: "Convert Facebook videos to MP3 or FLAC audio. Great for saving audio from interviews, live sessions, and video podcasts." },
      { icon: Image, title: "Save Thumbnails", desc: "Download Facebook video thumbnails in high resolution. Available in JPG, PNG, and WebP formats." },
      { icon: Globe, title: "Works with All Facebook URLs", desc: "Supports public videos, Watch shows, page posts, group videos, and embedded clips across Facebook." },
    ],
    faqs: [
      { q: "Can I download private Facebook videos?", a: "Our service can only download publicly accessible Facebook videos. Private or friends-only videos cannot be accessed due to Facebook's privacy restrictions." },
      { q: "What video qualities are available?", a: "Facebook videos can be downloaded in various qualities including HD (720p/1080p) and standard definition (480p/360p), depending on what the uploader originally provided." },
      { q: "Can I download Facebook Reels?", a: "Yes, Facebook Reels can be downloaded just like regular videos. Paste the Reel URL and choose your preferred format and quality." },
      { q: "Does it work with Facebook Watch?", a: "Yes, Facebook Watch shows and episodes are supported. Simply copy the video URL from Watch and paste it into the downloader." },
      { q: "Is there a limit on video length?", a: "Free accounts can download videos up to 30 minutes. Pro accounts support longer videos and batch processing for entire playlists." },
    ],
    metaTitle: "Facebook Video Downloader — Download Facebook Videos in HD | fetchwave",
    metaDescription: "Free Facebook video downloader. Download Facebook videos, Watch shows, Reels, and live streams in HD. Extract audio as MP3. No sign-up required.",
    keywords: ["facebook video downloader", "download facebook videos", "fb video downloader", "facebook video saver", "facebook to mp4", "download facebook watch", "facebook reels downloader", "facebook hd downloader", "save facebook video", "facebook video download free"],
  },

  instagram: {
    id: "instagram", name: "Instagram", slug: "instagram",
    brandColor: "#E1306C", fgColor: "#ffffff",
    Logo: InstagramLogo, defaultType: "video",
    badge: "Instagram Downloader",
    heading: "Download Instagram Videos",
    headingAccent: "Reels & Stories",
    subheading: "Save Instagram Reels, Stories, IGTV, and posts in seconds. Download video, audio, or thumbnails — instantly, no account needed.",
    placeholder: "Paste your Instagram URL here...",
    inputIcon: Video,
    features: [
      { icon: Film, title: "Save Reels & Stories", desc: "Download Instagram Reels and Stories in original quality. Perfect for saving content before it disappears after 24 hours." },
      { icon: Music, title: "Extract Reels Audio", desc: "Convert Instagram Reels to high-quality MP3 or FLAC audio. Great for saving viral audio tracks and sound bites." },
      { icon: Image, title: "Download Profile Pictures", desc: "Save Instagram profile pictures and post thumbnails in full resolution. Available in JPG and PNG formats." },
      { icon: Layers, title: "Batch Instagram Downloads", desc: "With a Pro plan, download multiple Instagram posts or Reels at once. No need to process each URL individually." },
    ],
    faqs: [
      { q: "Can I download Instagram Stories?", a: "Yes, you can download Instagram Stories by pasting the story URL. This works for both regular stories and highlighted stories." },
      { q: "Do Reels download with sound?", a: "Yes, Instagram Reels are downloaded with both video and audio intact. If you want only the audio, use the Audio extraction mode." },
      { q: "What about private Instagram accounts?", a: "Only publicly accessible content can be downloaded. Content from private accounts cannot be accessed through our service." },
      { q: "What formats are available?", a: "Videos can be downloaded in MP4, WebM, and MKV formats. Audio supports MP3, AAC, FLAC, WAV, and OGG. Thumbnails in JPG, PNG, and WebP." },
      { q: "Can I download IGTV videos?", a: "Yes, IGTV videos are fully supported. Paste any IGTV URL and choose your preferred quality and format for download." },
    ],
    metaTitle: "Instagram Video Downloader — Download Reels, Stories & Posts | fetchwave",
    metaDescription: "Free Instagram downloader. Download Reels, Stories, IGTV, and posts in HD. Extract audio as MP3. Save profile pictures. No sign-up required.",
    keywords: ["instagram video downloader", "download instagram reels", "instagram reels downloader", "ig downloader", "instagram story saver", "instagram video saver", "download ig videos", "reels to mp4", "instagram mp3", "instagram profile picture downloader"],
  },

  tiktok: {
    id: "tiktok", name: "TikTok", slug: "tiktok",
    brandColor: "#010101", fgColor: "#ffffff",
    Logo: TikTokLogo, defaultType: "video",
    badge: "TikTok Downloader",
    heading: "Download TikTok Videos",
    headingAccent: "No Watermark",
    subheading: "Save TikTok videos without watermarks. Download in HD, extract audio as MP3, or save thumbnails. Quick, free, no sign-up needed.",
    placeholder: "Paste your TikTok video URL here...",
    inputIcon: Music,
    features: [
      { icon: Video, title: "Download Without Watermark", desc: "Save TikTok videos clean without the TikTok watermark. Get the original video in its full quality for offline viewing." },
      { icon: Music, title: "Extract Viral Audio", desc: "Convert TikTok videos to MP3 or FLAC audio. Perfect for saving trending sounds, music tracks, and voiceovers." },
      { icon: Image, title: "Save Video Thumbnails", desc: "Download TikTok video thumbnails in maximum resolution. Great for cover images and reference." },
      { icon: Camera, title: "Supports All TikTok Content", desc: "Works with regular posts, slideshows, and photo mode videos. Paste any public TikTok URL and download instantly." },
    ],
    faqs: [
      { q: "Do downloaded TikTok videos have watermarks?", a: "Videos downloaded through our platform are watermark-free. We use the original video source without the TikTok overlay." },
      { q: "Can I download TikTok audio separately?", a: "Yes, choose the Audio mode to extract only the audio track from any TikTok video. Available in MP3, AAC, FLAC, and more formats." },
      { q: "What video quality is available?", a: "TikTok videos can be downloaded in their original quality, typically 720p or 1080p depending on how the video was uploaded." },
      { q: "Does it work with TikTok slideshows?", a: "Yes, TikTok photo slideshows and multi-image posts are fully supported. You can download them as video compilations." },
      { q: "Is downloading without watermark legal?", a: "Downloading for personal offline use is generally acceptable. Redistributing content without the creator's permission may violate TikTok's terms." },
    ],
    metaTitle: "TikTok Video Downloader — Download Without Watermark | fetchwave",
    metaDescription: "Free TikTok downloader. Download TikTok videos without watermark in HD. Extract audio as MP3, FLAC. Save thumbnails. No sign-up required.",
    keywords: ["tiktok video downloader", "download tiktok without watermark", "tiktok no watermark", "tiktok video saver", "tiktok mp3", "tiktok downloader hd", "tik tok download", "save tiktok video", "tiktok audio extractor", "tiktok watermark remover"],
  },

  twitter: {
    id: "twitter", name: "Twitter / X", slug: "twitter",
    brandColor: "#14171A", fgColor: "#ffffff",
    Logo: XLogo, defaultType: "video",
    badge: "Twitter Downloader",
    heading: "Download Twitter Videos",
    headingAccent: "& GIFs",
    subheading: "Save Twitter videos, GIFs, and media from any tweet. Download in HD, extract audio, or grab thumbnails — fast and free.",
    placeholder: "Paste your tweet URL here...",
    inputIcon: MessageSquare,
    features: [
      { icon: Video, title: "Save Videos from Tweets", desc: "Download videos embedded in tweets at original quality. Perfect for saving news clips, sports highlights, and viral content." },
      { icon: Play, title: "Download GIFs as Video", desc: "Twitter GIFs can be saved as video files. Download animated GIFs in MP4 format for easy sharing and editing." },
      { icon: Music, title: "Extract Audio from Tweets", desc: "Convert Twitter video content to MP3 or FLAC audio. Great for saving audio from interviews and live broadcasts." },
      { icon: Image, title: "Save Tweet Thumbnails", desc: "Download video thumbnails from Twitter posts in high resolution. Available in JPG, PNG, and WebP formats." },
    ],
    faqs: [
      { q: "Can I download videos from any tweet?", a: "Yes, any publicly accessible tweet containing a video can be downloaded. Just paste the tweet URL into the input above." },
      { q: "What about age-restricted tweets?", a: "Age-restricted or sensitive content may require you to be logged in to Twitter. Our service can only access publicly visible media." },
      { q: "Are Twitter Spaces recordings supported?", a: "Twitter Spaces recordings that are publicly available as videos can be downloaded. Paste the Space recording URL to get started." },
      { q: "What video quality is available?", a: "Twitter videos can be downloaded in their original uploaded quality, typically up to 1080p HD depending on the source." },
      { q: "Can I download multiple videos from a thread?", a: "Yes, with a Pro subscription you can batch download videos from tweet threads and entire timelines efficiently." },
    ],
    metaTitle: "Twitter Video Downloader — Download X Videos & GIFs | fetchwave",
    metaDescription: "Free Twitter/X video downloader. Download videos, GIFs, and media from any tweet in HD. Extract audio as MP3. No sign-up required.",
    keywords: ["twitter video downloader", "x video downloader", "download twitter videos", "twitter video saver", "twitter gif download", "x video saver", "download from tweet", "twitter mp3", "tweet media downloader", "twitter hd video"],
  },

  vimeo: {
    id: "vimeo", name: "Vimeo", slug: "vimeo",
    brandColor: "#1AB7EA", fgColor: "#ffffff",
    Logo: VimeoLogo, defaultType: "video",
    badge: "Vimeo Downloader",
    heading: "Download Vimeo Videos",
    headingAccent: "in 4K",
    subheading: "Download Vimeo videos in up to 4K Ultra HD. Save professional content, extract audio as FLAC, or grab HD thumbnails.",
    placeholder: "Paste your Vimeo video URL here...",
    inputIcon: Play,
    features: [
      { icon: Monitor, title: "Download in 4K Ultra HD", desc: "Vimeo is known for high-quality video. Download in up to 4K resolution for professional editing and archival purposes." },
      { icon: Headphones, title: "Lossless Audio Extraction", desc: "Extract pristine audio from Vimeo videos. Get FLAC lossless or WAV uncompressed for professional audio production." },
      { icon: Image, title: "HD Thumbnail Downloads", desc: "Save Vimeo video thumbnails in full resolution. Perfect for portfolio references and project covers." },
      { icon: Film, title: "Supports All Vimeo Content", desc: "Works with public Vimeo videos, Staff Picks, and embedded content. Paste any Vimeo URL and download instantly." },
    ],
    faqs: [
      { q: "Can I download Vimeo staff picks?", a: "Yes, Vimeo Staff Picks and other publicly available videos can be downloaded if they are not password-protected by the uploader." },
      { q: "What video qualities are available?", a: "Vimeo supports up to 8K resolution, but most content is available in 4K, 1080p, and 720p. The available qualities depend on the uploader's settings." },
      { q: "Does it work with password-protected Vimeo videos?", a: "No, password-protected and private Vimeo videos cannot be accessed through our service due to Vimeo's security restrictions." },
      { q: "What audio formats can I extract?", a: "Vimeo audio can be extracted as MP3 up to 320kbps, AAC, FLAC lossless, WAV uncompressed, and OGG formats." },
      { q: "Is Vimeo downloading legal for professional use?", a: "Always respect the creator's license and copyright. Many Vimeo creators allow downloading for personal or portfolio use." },
    ],
    metaTitle: "Vimeo Video Downloader — Download Vimeo Videos in 4K | fetchwave",
    metaDescription: "Free Vimeo video downloader. Download Vimeo videos in 4K, 1080p, 720p. Extract audio as FLAC, MP3, AAC. Get HD thumbnails. No sign-up required.",
    keywords: ["vimeo video downloader", "download vimeo videos", "vimeo to mp4", "vimeo 4k download", "vimeo video saver", "vimeo to mp3", "vimeo hd downloader", "save vimeo video", "vimeo download free", "vimeo video extractor"],
  },

  dailymotion: {
    id: "dailymotion", name: "Dailymotion", slug: "dailymotion",
    brandColor: "#0066DC", fgColor: "#ffffff",
    Logo: DailymotionLogo, defaultType: "video",
    badge: "Dailymotion Downloader",
    heading: "Download Dailymotion Videos",
    headingAccent: "in HD",
    subheading: "Save Dailymotion videos, news clips, and user content. Download in HD, extract audio, or grab thumbnails — quick and free.",
    placeholder: "Paste your Dailymotion URL here...",
    inputIcon: Play,
    features: [
      { icon: Monitor, title: "HD Video Downloads", desc: "Download Dailymotion videos in up to 1080p Full HD. Perfect for offline viewing of news, sports, and entertainment content." },
      { icon: Headphones, title: "Audio Extraction", desc: "Convert Dailymotion videos to MP3 or AAC audio. Great for saving music videos, interviews, and podcast-style content." },
      { icon: Image, title: "Save Video Thumbnails", desc: "Download Dailymotion thumbnails in high quality. Available in multiple resolutions and formats including JPG and PNG." },
      { icon: Globe, title: "Works Worldwide", desc: "Access Dailymotion content from any region. Supports both regular Dailymotion and short url (dai.ly) links." },
    ],
    faqs: [
      { q: "Can I download Dailymotion news videos?", a: "Yes, Dailymotion news and user-uploaded content can be downloaded as long as they are publicly accessible on the platform." },
      { q: "What video quality is available?", a: "Dailymotion videos are available in various qualities including 1080p, 720p, 480p, and 360p depending on the original upload." },
      { q: "Does it support Dailymotion live streams?", a: "Currently, we support downloading on-demand Dailymotion videos. Live streams need to be completed and available as recordings." },
      { q: "Can I download multiple videos at once?", a: "Pro and Team subscribers can batch download multiple Dailymotion videos simultaneously with priority processing." },
      { q: "What's the maximum video length?", a: "Free accounts can download videos up to 30 minutes. Pro accounts have no length limit for individual videos." },
    ],
    metaTitle: "Dailymotion Video Downloader — Download Dailymotion Videos | fetchwave",
    metaDescription: "Free Dailymotion video downloader. Download Dailymotion videos in HD. Extract audio as MP3, AAC. Save thumbnails. No sign-up required.",
    keywords: ["dailymotion video downloader", "download dailymotion videos", "dailymotion to mp4", "dailymotion video saver", "dm downloader", "dailymotion to mp3", "save dailymotion video", "dailymotion hd downloader", "dailymotion download free"],
  },

  twitch: {
    id: "twitch", name: "Twitch", slug: "twitch",
    brandColor: "#9146FF", fgColor: "#ffffff",
    Logo: TwitchLogo, defaultType: "video",
    badge: "Twitch Downloader",
    heading: "Download Twitch Clips",
    headingAccent: "& VODs",
    subheading: "Save Twitch clips, VODs, and highlights. Download in HD, extract audio for podcasts, or grab thumbnails — no login required.",
    placeholder: "Paste your Twitch URL here...",
    inputIcon: Monitor,
    features: [
      { icon: Film, title: "Save Clips & VODs", desc: "Download Twitch clips and past broadcasts (VODs) in original quality. Archive your favorite streams and highlights." },
      { icon: Headphones, title: "Extract Stream Audio", desc: "Convert Twitch VODs to MP3 or AAC audio. Perfect for listening to streams as podcasts during commutes." },
      { icon: Image, title: "Download Thumbnails", desc: "Save Twitch clip and stream thumbnails in high resolution. Great for social media sharing and stream archiving." },
      { icon: Radio, title: "Supports All Twitch Content", desc: "Works with Twitch clips, VODs, highlights, and uploaded content. Paste any public Twitch URL and download instantly." },
    ],
    faqs: [
      { q: "Can I download live Twitch streams?", a: "Currently, we support downloading completed VODs and clips. Live streams must finish before they can be processed for download." },
      { q: "How long do Twitch VODs stay available?", a: "Twitch stores VODs for 7-60 days depending on your subscription tier. Download them before they expire to keep them permanently." },
      { q: "What quality are Twitch downloads?", a: "Twitch clips and VODs can be downloaded in their source quality, typically up to 1080p60 (Full HD at 60fps)." },
      { q: "Does it work with subscriber-only VODs?", a: "Subscriber-only VODs require Twitch authentication and cannot be accessed through our service due to access restrictions." },
      { q: "Can I extract just the audio from streams?", a: "Yes, use the Audio extraction mode to convert Twitch VODs to MP3 or AAC. Perfect for creating stream podcasts or saving music sets." },
    ],
    metaTitle: "Twitch Video Downloader — Download Twitch Clips & VODs | fetchwave",
    metaDescription: "Free Twitch downloader. Download Twitch clips, VODs, and highlights in HD. Extract audio as MP3. Save thumbnails. No sign-up required.",
    keywords: ["twitch video downloader", "download twitch clips", "twitch vod downloader", "twitch clip saver", "twitch to mp4", "download twitch streams", "twitch vod to mp3", "save twitch clips", "twitch downloader free", "twitch highlight downloader"],
  },

  reddit: {
    id: "reddit", name: "Reddit", slug: "reddit",
    brandColor: "#FF4500", fgColor: "#ffffff",
    Logo: RedditLogo, defaultType: "video",
    badge: "Reddit Downloader",
    heading: "Download Reddit Videos",
    headingAccent: "& GIFs",
    subheading: "Save videos, GIFs, and media from any Reddit post. Download in HD quality, extract audio, or grab thumbnails — quick and free.",
    placeholder: "Paste your Reddit post URL here...",
    inputIcon: MessageSquare,
    features: [
      { icon: Film, title: "Save Reddit Videos", desc: "Download videos shared on Reddit from any subreddit. Perfect for saving funny clips, tutorials, and community highlights." },
      { icon: Play, title: "Download Reddit GIFs", desc: "Reddit GIFs can be saved as MP4 video files. Download animated content for sharing and editing outside of Reddit." },
      { icon: Headphones, title: "Extract Audio from Posts", desc: "Convert Reddit video posts to MP3 or FLAC audio. Great for saving audio from music shares, podcasts, and interviews." },
      { icon: Image, title: "Save Post Thumbnails", desc: "Download Reddit post thumbnails in high resolution. Available in JPG, PNG, and WebP formats." },
    ],
    faqs: [
      { q: "Can I download videos from any subreddit?", a: "Yes, videos from any public subreddit can be downloaded as long as they are publicly accessible Reddit-hosted videos." },
      { q: "Does it work with Reddit-hosted or external videos?", a: "We support both Reddit-hosted (v.redd.it) videos and many external sources shared on Reddit, including Gfycat, Imgur, and Streamable." },
      { q: "Can I download from NSFW subreddits?", a: "NSFW content is treated according to the same access rules. If the video is publicly viewable, it can be downloaded." },
      { q: "What about Reddit live streams (RPAN)?", a: "RPAN broadcasts that have ended and are available as recordings can be downloaded through our service." },
      { q: "What video format is used?", a: "Reddit videos are typically available in MP4 format. You can choose from multiple quality levels up to 1080p." },
    ],
    metaTitle: "Reddit Video Downloader — Download Reddit Videos & GIFs | fetchwave",
    metaDescription: "Free Reddit video downloader. Download videos, GIFs, and media from any Reddit post in HD. Extract audio as MP3. No sign-up required.",
    keywords: ["reddit video downloader", "download reddit videos", "reddit video saver", "reddit to mp4", "reddit gif downloader", "reddit downloader", "save reddit video", "v.redd.it downloader", "reddit mp3", "reddit media downloader"],
  },

  pinterest: {
    id: "pinterest", name: "Pinterest", slug: "pinterest",
    brandColor: "#E60023", fgColor: "#ffffff",
    Logo: PinterestLogo, defaultType: "video",
    badge: "Pinterest Downloader",
    heading: "Download Pinterest Videos",
    headingAccent: "& Pins",
    subheading: "Save Pinterest videos, Idea Pins, and video pins. Download in HD, extract audio, or save thumbnails — instantly, no account required.",
    placeholder: "Paste your Pinterest URL here...",
    inputIcon: Image,
    features: [
      { icon: Film, title: "Save Video Pins", desc: "Download Pinterest video pins in their original quality. Perfect for saving DIY tutorials, recipe videos, and inspiration content." },
      { icon: Music, title: "Extract Pin Audio", desc: "Convert Pinterest video pins to MP3 or AAC audio. Great for saving audio from music pins and instructional content." },
      { icon: Image, title: "Download Pin Images", desc: "Save high-resolution images from Pinterest pins. Get the full quality version without compression or cropping." },
      { icon: Hash, title: "Supports All Pin Types", desc: "Works with video pins, Idea Pins, and standard image pins. Paste any public Pinterest URL and download instantly." },
    ],
    faqs: [
      { q: "Can I download Idea Pins?", a: "Yes, Pinterest Idea Pins (formerly Story Pins) are fully supported. Download the video or extract audio from multi-page Idea Pins." },
      { q: "What video quality is available?", a: "Pinterest video pins can be downloaded in their original quality, typically HD (720p or 1080p) depending on the upload." },
      { q: "Does it work with secret boards?", a: "Only publicly accessible Pinterest content can be downloaded. Secret board content is not accessible through our service." },
      { q: "Can I download just the image from a pin?", a: "Yes, for image pins you can save the full-resolution image directly. For video pins, use the Thumbnail mode to get the cover image." },
      { q: "Is there a limit on pin downloads?", a: "Free accounts get 10 downloads per day. Pro and Team plans offer unlimited downloads with batch processing." },
    ],
    metaTitle: "Pinterest Video Downloader — Download Pinterest Videos & Pins | fetchwave",
    metaDescription: "Free Pinterest video downloader. Download Pinterest videos, Idea Pins, and images in HD. Extract audio as MP3. Save thumbnails. No sign-up required.",
    keywords: ["pinterest video downloader", "download pinterest videos", "pinterest pin downloader", "pinterest video saver", "pinterest to mp4", "idea pin downloader", "save pinterest video", "pinterest image downloader", "pinterest hd downloader", "pinterest mp3"],
  },

  linkedin: {
    id: "linkedin", name: "LinkedIn", slug: "linkedin",
    brandColor: "#0A66C2", fgColor: "#ffffff",
    Logo: LinkedInLogo, defaultType: "video",
    badge: "LinkedIn Downloader",
    heading: "Download LinkedIn Videos",
    headingAccent: "& Learning",
    subheading: "Save LinkedIn videos, company content, and Learning courses. Download in HD, extract audio, or grab thumbnails — fast and free.",
    placeholder: "Paste your LinkedIn URL here...",
    inputIcon: Hash,
    features: [
      { icon: Film, title: "Save Professional Videos", desc: "Download videos from LinkedIn feeds, company pages, and event streams. Perfect for offline reference and content analysis." },
      { icon: Headphones, title: "Extract Course Audio", desc: "Convert LinkedIn Learning videos to MP3 or AAC audio. Great for learning on the go by listening to course content." },
      { icon: Image, title: "Save Post Thumbnails", desc: "Download LinkedIn video thumbnails in high resolution. Useful for archiving and portfolio documentation." },
      { icon: Globe, title: "Public Content Access", desc: "Works with publicly shared LinkedIn videos and content visible without login. Privacy-restricted content requires authentication." },
    ],
    faqs: [
      { q: "Can I download LinkedIn Learning courses?", a: "LinkedIn Learning videos can be downloaded for personal offline study as long as they are publicly accessible through the platform." },
      { q: "What about private or connections-only posts?", a: "Content restricted to connections or specific audiences cannot be accessed through our downloader due to LinkedIn's privacy settings." },
      { q: "What video quality is available?", a: "LinkedIn videos are typically available in standard HD quality (720p) depending on the uploader's original file." },
      { q: "Can I download videos from company pages?", a: "Yes, publicly shared videos on LinkedIn company pages can be downloaded. Paste the company post URL to get started." },
      { q: "Does it work with LinkedIn Events and Live?", a: "LinkedIn Events recordings that are publicly available can be downloaded. Completed live streams are supported when accessible." },
    ],
    metaTitle: "LinkedIn Video Downloader — Download LinkedIn Videos | fetchwave",
    metaDescription: "Free LinkedIn video downloader. Download LinkedIn videos, company content, and Learning videos in HD. Extract audio as MP3. No sign-up required.",
    keywords: ["linkedin video downloader", "download linkedin videos", "linkedin video saver", "linkedin to mp4", "linkedin learning downloader", "linkedin post video download", "save linkedin video", "linkedin mp3", "linkedin hd video downloader"],
  },

  snapchat: {
    id: "snapchat", name: "Snapchat", slug: "snapchat",
    brandColor: "#FFFC00", fgColor: "#000000",
    Logo: SnapchatLogo, defaultType: "video",
    badge: "Snapchat Downloader",
    heading: "Download Snapchat Videos",
    headingAccent: "& Spotlight",
    subheading: "Save Snapchat Spotlight videos and public stories. Download in original quality, extract audio, or grab thumbnails — fast and free.",
    placeholder: "Paste your Snapchat URL here...",
    inputIcon: Camera,
    features: [
      { icon: Film, title: "Save Spotlight Videos", desc: "Download Snapchat Spotlight videos in original quality. Perfect for archiving viral content and creative highlights." },
      { icon: Music, title: "Extract Spotlight Audio", desc: "Convert Snapchat videos to MP3 or AAC audio. Great for saving soundtracks and audio from popular Spotlight posts." },
      { icon: Image, title: "Save Video Thumbnails", desc: "Download Snapchat video thumbnails in high resolution. Available in JPG and PNG formats." },
      { icon: Camera, title: "Supports Public Content", desc: "Works with publicly shared Snapchat Spotlight videos and public story content that is accessible to all users." },
    ],
    faqs: [
      { q: "Can I download private Snapchat stories?", a: "Only publicly shared content like Spotlight videos and public stories can be downloaded. Private stories are not accessible." },
      { q: "What video quality is available?", a: "Snapchat videos can be downloaded in their original uploaded quality. The vertical format is preserved as uploaded." },
      { q: "Does it work with Snapchat Spotlight?", a: "Yes, Snapchat Spotlight videos are fully supported. Paste the Spotlight URL to download the video without the Snapchat interface." },
      { q: "What formats can I download in?", a: "Videos are available in MP4 format. Audio can be extracted as MP3, AAC, FLAC, WAV, or OGG. Thumbnails in JPG, PNG, and WebP." },
      { q: "Is there a download limit?", a: "Free accounts can download up to 10 videos per day. Pro accounts offer unlimited downloads with higher processing priority." },
    ],
    metaTitle: "Snapchat Video Downloader — Download Snapchat Spotlight Videos | fetchwave",
    metaDescription: "Free Snapchat video downloader. Download Snapchat Spotlight videos and public stories. Extract audio as MP3. No sign-up required.",
    keywords: ["snapchat video downloader", "download snapchat videos", "snapchat spotlight downloader", "snapchat video saver", "snapchat to mp4", "snap story downloader", "save snapchat video", "snapchat mp3", "spotlight video downloader"],
  },

  soundcloud: {
    id: "soundcloud", name: "SoundCloud", slug: "soundcloud",
    brandColor: "#FF5500", fgColor: "#ffffff",
    Logo: SoundCloudLogo, defaultType: "audio",
    badge: "SoundCloud Downloader",
    heading: "Download SoundCloud Tracks",
    headingAccent: "as MP3 & FLAC",
    subheading: "Save SoundCloud tracks, playlists, and remixes. Download as high-quality MP3, FLAC, AAC, or WAV — no account required.",
    placeholder: "Paste your SoundCloud track URL here...",
    inputIcon: Headphones,
    features: [
      { icon: Headphones, title: "High-Quality MP3 Downloads", desc: "Download SoundCloud tracks as MP3 up to 320 kbps. Perfect for offline listening with no quality loss." },
      { icon: Radio, title: "Lossless FLAC & WAV", desc: "Extract SoundCloud audio as lossless FLAC or uncompressed WAV. Ideal for DJs, producers, and audiophiles." },
      { icon: Layers, title: "Download Full Playlists", desc: "Save entire SoundCloud playlists and albums in one go with a Pro subscription. No need to process tracks individually." },
      { icon: Globe, title: "Supports All SoundCloud Content", desc: "Works with tracks, playlists, albums, and reposts. Paste any public SoundCloud URL and download instantly." },
    ],
    faqs: [
      { q: "What audio quality does SoundCloud use?", a: "SoundCloud streams at 128 kbps MP3 for free users. Premium tracks may be available at higher bitrates. Our downloads match the source quality." },
      { q: "Can I download SoundCloud playlists?", a: "Yes, you can download individual tracks from playlists. Pro users can batch download entire playlists and albums at once." },
      { q: "Does it work with SoundCloud Go+?", a: "SoundCloud Go+ premium content may have additional protections. We support publicly available tracks and those accessible without a premium subscription." },
      { q: "What audio formats are available?", a: "Choose from MP3 (128/192/320 kbps), AAC (256 kbps), FLAC (lossless), WAV (uncompressed), and OGG (192 kbps) formats." },
      { q: "Can I download tracks from private SoundCloud?", a: "Only publicly shared SoundCloud tracks can be downloaded. Private or secret link tracks require SoundCloud authentication to access." },
    ],
    metaTitle: "SoundCloud Downloader — Download SoundCloud Tracks as MP3, FLAC | fetchwave",
    metaDescription: "Free SoundCloud downloader. Download SoundCloud tracks as high-quality MP3, FLAC, AAC, WAV. Save playlists. No sign-up required.",
    keywords: ["soundcloud downloader", "download soundcloud tracks", "soundcloud to mp3", "soundcloud mp3 downloader", "soundcloud to flac", "soundcloud music downloader", "save soundcloud tracks", "soundcloud audio downloader", "soundcloud playlist downloader", "soundcloud wav"],
  },

  kick: {
    id: "kick", name: "Kick", slug: "kick",
    brandColor: "#53FC18", fgColor: "#000000",
    Logo: KickLogo, defaultType: "video",
    badge: "Kick Downloader",
    heading: "Download Kick Videos",
    headingAccent: "& Streams",
    subheading: "Download Kick VODs, clips, and highlights. Save in HD, extract audio, or grab thumbnails — fast, free, no sign-up needed.",
    placeholder: "Paste your Kick URL here...",
    inputIcon: Monitor,
    features: [
      { icon: Film, title: "Download Kick VODs", desc: "Save Kick past broadcasts and video-on-demand content in original quality. Archive your favorite streams permanently." },
      { icon: Headphones, title: "Extract Stream Audio", desc: "Convert Kick VODs to MP3 or AAC audio. Great for creating stream podcasts or saving audio highlights." },
      { icon: Image, title: "Save Video Thumbnails", desc: "Download Kick stream thumbnails in high resolution. Available in JPG, PNG, and WebP formats." },
      { icon: Radio, title: "Supports All Kick Content", desc: "Works with Kick VODs, clips, and highlighted moments from any public channel on the platform." },
    ],
    faqs: [
      { q: "Can I download live Kick streams?", a: "Currently, we support downloading completed VODs and clips. Live streams need to finish before they can be processed." },
      { q: "What video quality is available?", a: "Kick streams are available in up to 1080p at 60fps depending on the streamer's broadcast settings." },
      { q: "Does it work with subscriber-only content?", a: "Subscriber-only or follower-only content on Kick cannot be accessed through our downloader due to channel restrictions." },
      { q: "How long are Kick VODs available?", a: "Kick stores VODs for a limited time depending on the streamer's settings. Download them promptly to keep them permanently." },
      { q: "Can I download just the audio?", a: "Yes, use the Audio extraction mode to convert Kick VODs to MP3 or AAC. Perfect for background listening on mobile." },
    ],
    metaTitle: "Kick Video Downloader — Download Kick VODs & Clips | fetchwave",
    metaDescription: "Free Kick downloader. Download Kick VODs, clips, and stream highlights in HD. Extract audio as MP3, AAC. Save thumbnails. No sign-up required.",
    keywords: ["kick video downloader", "download kick streams", "kick vod downloader", "kick clip downloader", "kick to mp4", "download kick videos", "kick stream saver", "kick vod to mp3", "kick downloader free", "kick highlight downloader"],
  },

  niconico: {
    id: "niconico", name: "Niconico", slug: "niconico",
    brandColor: "#FF69B3", fgColor: "#ffffff",
    Logo: NiconicoLogo, defaultType: "video",
    badge: "Niconico Downloader",
    heading: "Download Niconico Videos",
    headingAccent: "in HD",
    subheading: "Save Niconico Douga videos, live recordings, and user content. Download in HD, extract audio, or grab thumbnails — quick and free.",
    placeholder: "Paste your Niconico URL here...",
    inputIcon: Play,
    features: [
      { icon: Film, title: "Download Niconico Videos", desc: "Save videos from Niconico Douga in original quality. Preserve Japanese content, VocaDB covers, and user-generated videos." },
      { icon: Headphones, title: "Extract Video Audio", desc: "Convert Niconico videos to MP3 or AAC audio. Great for listening to music covers, vocaloid tracks, and spoken content." },
      { icon: Image, title: "Save Video Thumbnails", desc: "Download Niconico video thumbnails in high resolution. Available in JPG and PNG formats." },
      { icon: Globe, title: "Supports Niconico Content", desc: "Works with publicly accessible Niconico Douga videos from both nicovideo.jp and niconico.jp domains." },
    ],
    faqs: [
      { q: "Can I download Niconico videos with comments?", a: "Our service downloads the raw video file without the Niconico comment overlay. The video content itself is preserved in full quality." },
      { q: "What video quality is available?", a: "Niconico videos are available in various qualities depending on the upload. Standard definition is common, with HD available for premium content." },
      { q: "Does it work with Niconico Live?", a: "Niconico Live broadcasts that have ended and are available as recordings can be downloaded through our service." },
      { q: "What about premium member-only videos?", a: "Member-only or premium restricted content on Niconico cannot be accessed through our downloader due to platform restrictions." },
      { q: "What formats can I download?", a: "Videos are available in MP4 format. Audio can be extracted as MP3, AAC, FLAC, WAV, or OGG. Thumbnails in JPG, PNG, and WebP." },
    ],
    metaTitle: "Niconico Video Downloader — Download Niconico Douga Videos | fetchwave",
    metaDescription: "Free Niconico video downloader. Download Niconico Douga videos in HD. Extract audio as MP3, AAC. Save thumbnails. No sign-up required.",
    keywords: ["niconico video downloader", "download niconico videos", "nicovideo downloader", "niconico to mp4", "niconico douga downloader", "nico video saver", "download nicovideo", "niconico mp3", "niconico video saver", "niconico download free"],
  },
};

export const platformSlugs = Object.keys(platformConfigs);
