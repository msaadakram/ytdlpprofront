import type { ContentTable } from "@/lib/content/types";

export function FormatComparisonTable({
  heading,
  subheading,
  paragraphs,
  table,
}: {
  heading: string;
  subheading?: string;
  paragraphs: string[];
  table: ContentTable;
}) {
  return (
    <section className="w-full">
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
          <div className="space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-sm sm:text-base text-foreground/80 font-sans leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/60 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#0d1f26]">
                  {table.headers.map((h, i) => (
                    <th
                      key={i}
                      className="text-left px-4 sm:px-5 py-3.5 sm:py-4 text-white font-semibold font-sans text-xs sm:text-sm whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, ri) => (
                  <tr
                    key={ri}
                    className="border-t border-border/40 even:bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    {row.map((cell, ci) => (
                      <td
                        key={ci}
                        className="px-4 sm:px-5 py-3 sm:py-3.5 text-foreground/80 font-sans text-xs sm:text-sm"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {table.caption && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-3 font-sans italic leading-relaxed px-1">
            {table.caption}
          </p>
        )}
      </div>
    </section>
  );
}
