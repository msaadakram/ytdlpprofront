/**
 * Monetag OnClick tag (zone 11806240). Fired ONLY from download-button
 * handlers — never globally — so ads show on user download intent.
 * Each call injects a fresh tag script (mirrors Monetag's snippet);
 * ad-blockers may throw, so failures are swallowed to never break downloads.
 */
const MONETAG_ZONE = "11806240";
const MONETAG_SRC = "https://al5sm.com/tag.min.js";

export function triggerMonetagAd(zone: string = MONETAG_ZONE): void {
  if (typeof document === "undefined") return;
  try {
    const s = document.createElement("script");
    s.dataset.zone = zone;
    s.src = MONETAG_SRC;
    const parent =
      [document.documentElement, document.body].filter(Boolean).pop() as HTMLElement | undefined;
    parent?.appendChild(s);
  } catch {
    /* ignore — ads must never break the download flow */
  }
}
