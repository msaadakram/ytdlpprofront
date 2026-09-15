/**
 * Monetag OnClick tag (zone 11806240). Fired ONLY from download-button
 * handlers — never globally — so ads show on user download intent.
 *
 * Frequency cap: at most ONE ad per minute. A download click within 60s
 * of the last ad does nothing; after a minute the next click may show one
 * again. The timestamp persists in localStorage so the cap survives page
 * navigation. Failures (private mode, ad-blockers) fall back to memory /
 * silence — ads must never break the download flow.
 */
const MONETAG_ZONE = "11806240";
const MONETAG_SRC = "https://al5sm.com/tag.min.js";
const MIN_GAP_MS = 60 * 1000; // one ad per minute, max
const STORAGE_KEY = "monetag_last_ad";

let memoryFallback = 0;

function readLast(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const t = raw ? parseInt(raw, 10) : NaN;
    if (Number.isFinite(t) && t > 0) return t;
  } catch {
    /* private mode — use memory fallback */
  }
  return memoryFallback;
}

function writeLast(now: number): void {
  memoryFallback = now;
  try {
    localStorage.setItem(STORAGE_KEY, String(now));
  } catch {
    /* private mode — memory fallback already updated */
  }
}

export function triggerMonetagAd(zone: string = MONETAG_ZONE): void {
  if (typeof document === "undefined") return;
  try {
    const now = Date.now();
    if (now - readLast() < MIN_GAP_MS) return; // too soon — stay silent
    const s = document.createElement("script");
    s.dataset.zone = zone;
    s.src = MONETAG_SRC;
    const parent =
      [document.documentElement, document.body].filter(Boolean).pop() as HTMLElement | undefined;
    parent?.appendChild(s);
    writeLast(now);
  } catch {
    /* ignore — ads must never break the download flow */
  }
}
