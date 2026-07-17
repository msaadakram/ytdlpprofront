const PLATFORM_DETECTORS: { platform: string; test: (host: string) => boolean }[] = [
  { platform: 'youtube',     test: (h) => h === 'youtu.be' || h.endsWith('youtube.com') || h.endsWith('youtube-nocookie.com') },
  { platform: 'tiktok',      test: (h) => h.endsWith('tiktok.com') },
  { platform: 'instagram',   test: (h) => h.endsWith('instagram.com') },
  { platform: 'facebook',    test: (h) => h.endsWith('facebook.com') || h.endsWith('fb.watch') },
  { platform: 'vimeo',       test: (h) => h.endsWith('vimeo.com') },
  { platform: 'twitch',      test: (h) => h.endsWith('twitch.tv') },
  { platform: 'dailymotion', test: (h) => h.endsWith('dailymotion.com') || h.endsWith('dai.ly') },
  { platform: 'reddit',      test: (h) => h.endsWith('reddit.com') || h.endsWith('redd.it') },
  { platform: 'soundcloud',  test: (h) => h.endsWith('soundcloud.com') || h.endsWith('on.soundcloud.com') },
  { platform: 'kick',        test: (h) => h.endsWith('kick.com') },
  { platform: 'snapchat',    test: (h) => h.endsWith('snapchat.com') },
  { platform: 'linkedin',    test: (h) => h.endsWith('linkedin.com') },
  { platform: 'pinterest',   test: (h) => h.endsWith('pinterest.com') || h.endsWith('pin.it') },
  { platform: 'niconico',    test: (h) => h.endsWith('nicovideo.jp') || h.endsWith('niconico.jp') },
];

export interface DetectedPlatform {
  platform: string;
  hostname: string;
}

export function detectPlatform(url: string): DetectedPlatform | null {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();
    for (const d of PLATFORM_DETECTORS) {
      if (d.test(host)) {
        return { platform: d.platform, hostname: host };
      }
    }
    return null;
  } catch {
    return null;
  }
}
