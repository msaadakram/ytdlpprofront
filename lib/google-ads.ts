/**
 * Google Ads conversion tracking (gtag.js).
 *
 * - The global tag itself is loaded once per page by
 *   `components/analytics/GoogleAdsTag.tsx` (rendered in both root layouts).
 * - Call `trackGoogleAdsConversion()` ONLY after the backend confirms the
 *   file/result was generated AND the browser download was triggered —
 *   never on Download-button click, never on failure.
 * - Never pass media URLs, filenames, page URLs, or any user data here.
 *   Only the conversion ID (and an optional numeric value) is sent.
 */

export const GOOGLE_ADS_ID = "AW-16771671972";

/**
 * Conversion-action label from Google Ads
 * (Tools → Conversions → your "Download" action → Tag setup → `send_to`
 * looks like `AW-16771671972/AbC-D_efGhIjKlMn` — paste the part after `/`).
 *
 * Until this is filled in, the `conversion` event fires with the account ID
 * only, which Google Ads does NOT attribute to any conversion action.
 */
export const GOOGLE_ADS_CONVERSION_LABEL = "";

export type GoogleAdsDownloadType = "video" | "audio" | "thumbnail" | "transcript";

interface TrackConversionOptions {
  /** Which tool produced the result. Sent as a custom param (no PII). */
  type?: GoogleAdsDownloadType | string;
  /**
   * Dedupe key — one conversion is sent per unique key for the lifetime of
   * the page (e.g. the backend `job_id`). Repeat deliveries of the same
   * successful action (re-clicks, re-saves) are ignored.
   */
  dedupeKey?: string;
}

// Bounded in-memory record of fired keys so the set can't grow forever
// during long sessions (Pro users batching many jobs).
const firedKeys: string[] = [];
const MAX_KEYS = 500;

function alreadyFired(key: string): boolean {
  return firedKeys.includes(key);
}

function markFired(key: string): void {
  firedKeys.push(key);
  if (firedKeys.length > MAX_KEYS) firedKeys.shift();
}

function sendTo(): string {
  return GOOGLE_ADS_CONVERSION_LABEL
    ? `${GOOGLE_ADS_ID}/${GOOGLE_ADS_CONVERSION_LABEL}`
    : GOOGLE_ADS_ID;
}

/**
 * Fire a Google Ads `conversion` event for one successfully generated
 * download/result. Safe to call anywhere:
 * - no-ops during SSR,
 * - never throws (ad blockers / consent blocking can't break downloads),
 * - queues via `dataLayer` when `gtag` hasn't loaded yet,
 * - returns `true` only when a new conversion was actually dispatched.
 */
export function trackGoogleAdsConversion(options: TrackConversionOptions = {}): boolean {
  try {
    if (typeof window === "undefined") return false;

    const { type, dedupeKey } = options;
    if (dedupeKey) {
      if (alreadyFired(dedupeKey)) return false;
      markFired(dedupeKey);
    }

    const payload: Record<string, unknown> = { send_to: sendTo() };
    // Custom segmentation only — never a URL, filename, or user identifier.
    if (type) payload.download_type = type;

    const w = window as unknown as {
      gtag?: (...args: unknown[]) => void;
      dataLayer?: unknown[];
    };

    if (typeof w.gtag === "function") {
      w.gtag("event", "conversion", payload);
    } else {
      // gtag.js not ready (slow network) or blocked: push the same event
      // shape onto dataLayer. If gtag loads later it consumes the queue;
      // if it's blocked, this is a harmless array push.
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ event: "conversion", ...payload });
    }
    return true;
  } catch {
    // Tracking must never break the download flow.
    return false;
  }
}
