import type { ContentTip } from "@/lib/content/types";

export function ProTipsGrid({
  heading,
  subheading,
  paragraphs,
  tips,
}: {
  heading: string;
  subheading?: string;
  paragraphs: string[];
  tips: ContentTip[];
}) {
  return (
    <section className="w-full bg-gradient-to-b from-muted/30 to-muted/10 border-y border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground font-heading tracking-tight mb-4">
            {heading}
          </h2>
          {subheading && (
            <p className="text-base sm:text-lg text-muted-foreground font-sans leading-relaxed mb-4">
              {subheading}
            </p>
          )}
          {paragraphs.map((p, i) => (
            <p key={i} className="text-sm sm:text-base text-foreground/80 font-sans leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          {tips.map((tip, i) => (
            <div
              key={i}
              className="group bg-white rounded-xl border border-border/60 p-5 sm:p-6 shadow-sm hover:shadow-lg hover:border-[#5baab8]/20 transition-all duration-300"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#eef6f8] flex items-center justify-center text-[#5baab8] font-bold text-sm">
                  {i + 1}
                </span>
                <h3 className="font-semibold text-foreground font-heading text-sm sm:text-base pt-1">
                  {tip.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed ml-11">
                {tip.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
