import type { ContentStep } from "@/lib/content/types";

export function StepByStepGuide({
  heading,
  subheading,
  steps,
}: {
  heading: string;
  subheading?: string;
  steps: ContentStep[];
}) {
  return (
    <section className="w-full bg-gradient-to-b from-muted/20 to-muted/40 border-y border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground font-heading tracking-tight mb-4">
            {heading}
          </h2>
          {subheading && (
            <p className="text-base sm:text-lg text-muted-foreground font-sans leading-relaxed">
              {subheading}
            </p>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-xl border border-border/60 p-5 sm:p-6 shadow-sm hover:shadow-md hover:border-border transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-[#0d1f26] text-white flex items-center justify-center text-sm font-bold font-mono shadow-sm">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground font-heading text-sm sm:text-base mb-2 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
