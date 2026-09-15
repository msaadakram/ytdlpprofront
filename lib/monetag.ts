/**
 * Monetag OnClick tag (zone 11806240). Fired ONLY from download-button
 * handlers — never globally — so ads show on user download intent.
 *
 * Frequency cap: max 2 ads per 5-minute window (sliding). Further download
 * clicks inside the window do nothing; once the window expires the counter
 * resets. Persisted in localStorage so the cap survives page navigation.
 * Failures (private mode, ad-blockers) fall back to memory / silence —
 * ads must never break the download flow.
 */
const MONETAG_ZONE = "11806240";
const MONETAG_SRC = "https://al5sm.com/tag.min.js";
const MAX_ADS = 2;
const WINDOW_MS = 5 * 60 * 1000;
const STORAGE_KEY = "monetag_ad_fires";

const memoryFallback: number[] = [];

function readFires(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...memoryFallback];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((t) => typeof t === "number") : [...memoryFallback];
  } catch {
    return [...memoryFallback];
  }
}

function writeFires(fires: number[]): void {
  memoryFallback.length = 0;
  memoryFallback.push(...fires);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fires));
  } catch {
    /* private mode — memory fallback already updated */
  }
}

export function triggerMonetagAd(zone: string = MONETAG_ZONE): void {
  if (typeof document === "undefined") return;
  try {
    const now = Date.now();
    const recent = readFires().filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_ADS) return; // cap reached — stay silent
    const s = document.createElement("script");
    s.dataset.zone = zone;
    s.src = MONETAG_SRC;
    const parent =
      [document.documentElement, document.body].filter(Boolean).pop() as HTMLElement | undefined;
    parent?.appendChild(s);
    writeFires([...recent, now]);
  } catch {
    /* ignore — ads must never break the download flow */
  }
}
