import Link from "next/link";
import { Link as LocaleLink } from "@/lib/i18n/navigation";
import { isEnglishOnlyPath } from "@/lib/i18n/english-only";

type AppLinkProps = React.ComponentProps<typeof LocaleLink>;

/**
 * Locale-aware link that never prefixes English-only routes.
 *
 * Informational pages (about, pricing, blog, api-docs, …) exist only at the
 * top level — they are not translated. The next-intl <Link> would still emit
 * /es/about etc., causing an unnecessary redirect hop; AppLink detects those
 * paths (via isEnglishOnlyPath, which also covers /blog/{slug}) and renders
 * a plain next/link instead. Everything else keeps normal locale prefixing.
 */
export function AppLink({ href, ...rest }: AppLinkProps) {
  const path = typeof href === "string" ? href : "";
  if (path && isEnglishOnlyPath(path)) {
    return <Link {...(rest as React.ComponentProps<typeof Link>)} href={path} />;
  }
  return <LocaleLink {...rest} href={href} />;
}