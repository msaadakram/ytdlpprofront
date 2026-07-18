import type { ContentSection as ContentSectionType } from "@/lib/content/types";

export function ContentSection({ section }: { section: ContentSectionType }) {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-heading mb-4">
          {section.heading}
        </h2>
        {section.subheading && (
          <p className="text-lg text-muted-foreground font-sans mb-6 leading-relaxed">
            {section.subheading}
          </p>
        )}
        {section.paragraphs.map((p, i) => (
          <p key={i} className="text-foreground/80 font-sans leading-relaxed mb-4 last:mb-0">
            {p}
          </p>
        ))}
      </div>
    </section>
  );
}
