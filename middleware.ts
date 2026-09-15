import createMiddleware from "next-intl/middleware";
import { routing } from "./lib/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // NOTE: /admin is intentionally excluded from the next-intl middleware —
    // admin auth is a localStorage token checked client-side in
    // app/(en)/admin/layout.tsx (middleware can't read localStorage), so
    // routing admin through locale handling would only add redirect loops.
    // The layout redirects unauthenticated /admin → /admin/login with an
    // early return (no flash) before any session check runs.
    "/((?!api|_next|_vercel|admin|about|features|pricing|contact|changelog|privacy|terms|blog|api-status|api-disclaimer|api-docs|dashboard|sign-in|sign-up|verify-email|forgot-password|.*\\..*).*)",
  ],
};
