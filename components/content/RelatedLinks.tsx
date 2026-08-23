import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";
import type { RelatedLink } from "@/lib/content/types";

export function RelatedLinks({ links, heading = "More Free Downloaders" }: { links: RelatedLink[]; heading?: string }) {
  if (links.length === 0) return null;

  return (
    <section className="w-full border-t border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground font-heading tracking-tight mb-3 text-balance">
          {heading}
        </h2>
        <p className="text-base sm:text-lg text-muted-foreground font-sans leading-relaxed mb-8">
          Every DownForge tool is free, browser-based, and needs no sign-up.
        </p>
        <nav aria-label="Related downloader pages" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex flex-col rounded-xl border border-border/60 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-accent/40 hover:-translate-y-0.5"
            >
              <span className="flex items-center justify-between gap-2 mb-2">
                <span className="font-semibold text-foreground font-heading text-sm sm:text-base leading-snug">
                  {link.title}
                </span>
                <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent shrink-0" />
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
                {link.desc}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
