"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  label: string;
}

/**
 * Sticky table of contents. Tracks scroll position to highlight the active
 * section. On small screens it collapses into a horizontally scrollable pill
 * bar; on lg+ it renders a vertical list in the sidebar.
 */
export function ApiPageToc({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      // Trigger when the section's top passes ~30% from the viewport top,
      // accounting for the fixed 4rem header.
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveId(id);
    }
  }

  return (
    <nav aria-label="On this page">
      {/* Desktop vertical list */}
      <div className="hidden lg:block sticky top-24">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground font-mono mb-3">
          On this page
        </p>
        <ul className="space-y-1 border-l border-border">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => handleClick(e, item.id)}
                  className={cn(
                    "-ml-px block border-l-2 py-1.5 pl-4 text-sm transition-colors font-sans",
                    isActive
                      ? "border-[#5baab8] text-foreground font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile horizontal pill bar */}
      <div className="lg:hidden -mx-4 px-4 overflow-x-auto pb-2">
        <div className="flex items-center gap-2 w-max">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={cn(
                  "shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-[#0d1f26] text-white"
                    : "bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
