import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import type { RelatedLink } from "@/lib/content/types";

/**
 * Localized related-links grid. Link copy is resolved from the `RelatedLinks`
 * message namespace via each link's stable `id` (`{id}Title` / `{id}Desc`);
 * the English `title`/`desc` on the link object act as the fallback copy so
 * the section never renders a raw key path.
 */
function useLocalizedLink() {
  const t = useTranslations("RelatedLinks");
  return (link: RelatedLink) => {
    if (!link.id) return { title: link.title, desc: link.desc };
    const titleKey = `${link.id}Title`;
    const descKey = `${link.id}Desc`;
    const title = t.has(titleKey) ? (link.params ? t(titleKey, link.params) : t(titleKey)) : link.title;
    const desc = t.has(descKey) ? (link.params ? t(descKey, link.params) : t(descKey)) : link.desc;
    return { title, desc };
  };
}

export function RelatedLinks({ links, heading }: { links: RelatedLink[]; heading?: string }) {
  const t = useTranslations("RelatedLinks");
  const localize = useLocalizedLink();

  if (links.length === 0) return null;

  return (
    <section className="w-full border-t border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground font-heading tracking-tight mb-3 text-balance">
          {heading ?? t("heading")}
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground font-sans leading-relaxed mb-8">
          {t("subline")}
        </p>
        <nav aria-label={t("navLabel")} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => {
            const { title, desc } = localize(link);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group flex flex-col rounded-xl border border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-accent/40 hover:-translate-y-0.5"
              >
                <span className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-semibold text-foreground font-heading text-sm sm:text-base leading-snug">
                    {title}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent shrink-0" />
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
                  {desc}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
