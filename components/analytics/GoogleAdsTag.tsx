import Script from "next/script";
import { GOOGLE_ADS_ID } from "@/lib/google-ads";

/**
 * Global Google tag (gtag.js), loaded exactly once per page.
 *
 * Rendered in BOTH root layouts (`app/(en)/layout.tsx` and
 * `app/(locale)/[locale]/layout.tsx`) — those trees are mutually exclusive
 * per route, so only one instance ever exists on a page. `next/script`
 * additionally dedupes by `src`, and `afterInteractive` is the framework's
 * recommended equivalent of "immediately after <head>".
 *
 * Consent: the project has no consent-management platform yet, so Google's
 * default (granted) applies. When a CMP/cookie banner is added, update the
 * `consent` defaults below and call
 * `gtag('consent', 'update', {...})` from the banner decision handler.
 */
export function GoogleAdsTag() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GOOGLE_ADS_ID}');
        `}
      </Script>
    </>
  );
}
