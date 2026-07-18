import type { ContentSection as ContentSectionType } from "@/lib/content/types";

export function ContentSection({
  section,
  variant = "default",
}: {
  section: ContentSectionType;
  variant?: "default" | "branded";
}) {
  return (
    <section className={`w-full ${variant === "branded" ? "bg-gradient-to-br from-[#0d1f26] to-[#1a3545] text-white" : ""}`}>
      <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${variant === "branded" ? "py-16 md:py-20" : "py-12 md:py-16"}`}>
        <div className="max-w-3xl">
          <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold font-heading tracking-tight ${variant === "branded" ? "text-white" : "text-foreground"} mb-4`}>
            {section.heading}
          </h2>
          {section.subheading && (
            <p className={`text-base sm:text-lg font-sans leading-relaxed mb-6 ${variant === "branded" ? "text-white/70" : "text-muted-foreground"}`}>
              {section.subheading}
            </p>
          )}
          <div className={`space-y-4 ${variant === "branded" ? "text-white/80" : "text-foreground/80"}`}>
            {section.paragraphs.map((p, i) => (
              <p key={i} className="text-sm sm:text-base font-sans leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
