import type { ContentTable } from "@/lib/content/types";

export function FormatComparisonTable({ heading, paragraphs, table }: {
  heading: string;
  paragraphs: string[];
  table: ContentTable;
}) {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-foreground font-heading mb-4">
        {heading}
      </h2>
      {paragraphs.map((p, i) => (
        <p key={i} className="text-foreground/80 font-sans leading-relaxed mb-4 last:mb-6">
          {p}
        </p>
      ))}
      <div className="overflow-x-auto rounded-xl border border-border/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#0d1f26]">
              {table.headers.map((h, i) => (
                <th key={i} className="text-left px-5 py-3.5 text-white font-semibold font-sans">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr key={ri} className="border-t border-border/40 even:bg-muted/20">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-5 py-3 text-foreground/80 font-sans">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.caption && (
        <p className="text-xs text-muted-foreground mt-3 font-sans italic">{table.caption}</p>
      )}
    </section>
  );
}
