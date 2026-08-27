import createMiddleware from "next-intl/middleware";
import { routing } from "./lib/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // Exclude top-level English-only routes (no locale prefix) from i18n handling
    // They are served at /about, /pricing, etc. directly
    "/((?!api|_next|_vercel|admin|about|features|pricing|contact|changelog|privacy|terms|blog|api-status|api-disclaimer|dashboard|sign-in|sign-up|.*\\..*).*)",
  ],
};
