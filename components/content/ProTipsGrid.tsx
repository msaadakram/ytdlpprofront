import type { ContentTip } from "@/lib/content/types";

export function ProTipsGrid({ heading, paragraphs, tips }: {
  heading: string;
  paragraphs: string[];
  tips: ContentTip[];
}) {
  return (
    <section className="bg-muted/30 border-y border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-heading mb-4">
          {heading}
        </h2>
        {paragraphs.map((p, i) => (
          <p key={i} className="text-foreground/80 font-sans leading-relaxed mb-6">{p}</p>
        ))}
        <div className="grid gap-4 md:grid-cols-2">
          {tips.map((tip, i) => (
            <div key={i} className="bg-white rounded-xl border border-border/60 p-5 shadow-sm">
              <h3 className="font-semibold text-foreground font-heading mb-2">{tip.title}</h3>
              <p className="text-sm text-muted-foreground font-sans leading-relaxed">{tip.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
