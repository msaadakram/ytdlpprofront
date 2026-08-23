export type TocEntry = { id: string; label: string };

export function TableOfContents({ entries }: { entries: TocEntry[] }) {
  if (entries.length < 4) return null;

  return (
    <nav
      aria-label="On this page"
      className="not-prose mb-2 rounded-xl border border-border/60 bg-muted/30 px-5 py-4"
    >
      <p className="text-xs font-bold tracking-widest uppercase font-mono text-muted-foreground mb-3">
        On this page
      </p>
      <ol className="flex flex-wrap gap-x-5 gap-y-2">
        {entries.map((entry, i) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className="text-sm text-muted-foreground hover:text-foreground font-sans underline-offset-4 hover:underline decoration-border transition-colors"
            >
              <span className="font-mono text-xs text-accent mr-1.5">{String(i + 1).padStart(2, "0")}</span>
              {entry.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
