import type { ContentStep } from "@/lib/content/types";

export function StepByStepGuide({ heading, steps }: { heading: string; steps: ContentStep[] }) {
  return (
    <section className="bg-muted/30 border-y border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-heading mb-8">
          {heading}
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0d1f26] text-white flex items-center justify-center text-sm font-bold font-mono">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-foreground font-heading mb-1">{step.title}</h3>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
