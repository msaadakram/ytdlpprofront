/**
 * Monetag OnClick tag (zone 11806240). Fired ONLY from download-button
 * handlers — never globally — so ads show on user download intent.
 *
 * Frequency cap: at most ONE ad per 10 minutes. A download click within
 * 10 minutes of the last ad does nothing; after that the next click may
 * show one again. The timestamp persists in localStorage so the cap
 * survives page navigation. Failures (private mode, ad-blockers) fall back
 * to memory / silence — ads must never break the download flow.
 */
const MONETAG_ZONE = "11806240";
const MONETAG_SRC = "https://al5sm.com/tag.min.js";
const MIN_GAP_MS = 10 * 60 * 1000; // one ad per 10 minutes, max
const STORAGE_KEY = "monetag_last_ad";

// Hosts serving Monetag's obfuscated third-party scripts. Their internal
// errors (e.g. "ReferenceError: qued is not defined") are ad-network noise,
// not app bugs — `qued` appears nowhere in this repo.
const AD_HOSTS = ["al5sm.com", "5gvci.com"];

let filterInstalled = false;

function isAdError(e: ErrorEvent): boolean {
  const file = typeof e.filename === "string" ? e.filename : "";
  if (AD_HOSTS.some((h) => file.includes(h))) return true;
  const stack = (e.error as { stack?: unknown } | null | undefined)?.stack;
  if (typeof stack === "string" && AD_HOSTS.some((h) => stack.includes(h))) return true;
  return false;
}

function ensureAdErrorFilter(): void {
  if (filterInstalled || typeof window === "undefined") return;
  filterInstalled = true;
  // Capture phase, scoped to ad hosts only: preventDefault() suppresses the
  // console "Uncaught ..." report for ad-script errors. App errors untouched.
  window.addEventListener(
    "error",
    (ev) => {
      try {
        if (isAdError(ev as ErrorEvent)) ev.preventDefault();
      } catch {
        /* never break the app from inside an error filter */
      }
    },
    true,
  );
}

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
    ensureAdErrorFilter();
    const now = Date.now();
    if (now - readLast() < MIN_GAP_MS) return; // too soon — stay silent
    const s = document.createElement("script");
    s.dataset.zone = zone;
    s.src = MONETAG_SRC;
    s.async = true;
    // Silent on load failure (ad-blockers) — no console noise.
    s.onerror = () => {};
    const parent =
      [document.documentElement, document.body].filter(Boolean).pop() as HTMLElement | undefined;
    parent?.appendChild(s);
    writeLast(now);
  } catch {
    /* ignore — ads must never break the download flow */
  }
}
