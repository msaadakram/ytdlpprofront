import { Link } from "@/lib/i18n/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, Sparkles, Compass, Layers } from "lucide-react";
import { platformConfigs } from "@/lib/platform-config";
import { otherToolsForPlatform, sameToolOtherPlatforms, toolDefs, popularCrossLinks, type ToolType } from "@/lib/content/tool-links";

type Props = {
  platform: string;
  currentTool: ToolType;
  heading?: string;
  subheading?: string;
};

export function ExploreOtherTools({ platform, currentTool, heading, subheading }: Props) {
  const config = platformConfigs[platform];
  const platformName = config?.name ?? platform;
  const brandColor = config?.brandColor ?? "#0d1f26";

  const et = useTranslations("ExploreTools");
  const rt = useTranslations("RelatedLinks");

  const otherTools = otherToolsForPlatform(platform, currentTool);
  const sameToolPeers = sameToolOtherPlatforms(platform, currentTool, 8);
  const currentDef = toolDefs.find((t) => t.id === currentTool);

  // Localized tool label/desc with English fallback from tool-links data.
  const toolLabel = (id: string, fallback: string) => {
    const key = `tools.${id}.label`;
    return et.has(key) ? et(key) : fallback;
  };
  const toolShortLabel = (id: string, fallback: string) => {
    const key = `tools.${id}.shortLabel`;
    return et.has(key) ? et(key) : fallback;
  };
  const toolDesc = (id: string, fallback: string) => {
    const key = `tools.${id}.desc`;
    return et.has(key) ? et(key) : fallback;
  };

  const currentToolLabel = currentDef ? toolLabel(currentDef.id, currentDef.label) : "Downloader";

  const defaultHeading = et("heading", { platform: platformName });
  const defaultSub = et("subheading", { tool: currentToolLabel, platform: platformName });

  // Localize popular cross-links via their stable ids (RelatedLinks namespace).
  const localizePopular = (link: { id?: string; title: string; desc: string; params?: Record<string, string> }) => {
    if (!link.id) return { title: link.title, desc: link.desc };
    const titleKey = `${link.id}Title`;
    const descKey = `${link.id}Desc`;
    const title = rt.has(titleKey) ? (link.params ? rt(titleKey, link.params) : rt(titleKey)) : link.title;
    const desc = rt.has(descKey) ? (link.params ? rt(descKey, link.params) : rt(descKey)) : link.desc;
    return { title, desc };
  };

  const peerSpec =
    currentDef?.id === "audio"
      ? et("specAudio")
      : currentDef?.id === "thumbnail"
        ? et("specThumbnail")
        : currentDef?.id === "transcript"
          ? et("specTranscript")
          : et("specVideo");

  return (
    <section className="w-full border-t border-border/40 bg-gradient-to-b from-muted/20 via-background to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Header */}
        <div className="flex flex-col gap-3 mb-8 md:mb-10">
          <span className="inline-flex items-center gap-2 w-fit rounded-full border border-border/60 bg-card px-3 py-1 text-[11px] font-bold tracking-[0.14em] uppercase text-muted-foreground font-mono">
            <Compass className="w-3.5 h-3.5" style={{ color: brandColor }} />
            {et("kicker")}
            <span className="hidden sm:inline-flex items-center gap-1 text-accent">
              <Sparkles className="w-3 h-3" /> {et("stats")}
            </span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-heading text-balance">
            {heading ?? defaultHeading}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground font-sans leading-relaxed max-w-3xl text-pretty">
            {subheading ?? defaultSub}
          </p>
        </div>

        {/* Row 1: Other tools for THIS platform */}
        <div className="mb-10">
          <h3 className="flex items-center gap-2 text-sm font-bold tracking-wide text-foreground font-heading mb-3">
            <span className="w-7 h-7 rounded-xl flex items-center justify-center border border-border/60 bg-card shadow-sm">
              <Layers className="w-4 h-4" style={{ color: brandColor }} />
            </span>
            {et("moreToolsHeading", { platform: platformName })}
            <span className="text-xs font-mono font-normal text-muted-foreground px-2 py-1 rounded-full bg-muted border border-border/40">{et("chipSamePlatform")}</span>
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {otherTools.map((tool) => {
              const Icon = tool.icon;
              const isActive = tool.current;
              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative flex flex-col rounded-2xl border p-4 transition-all duration-200 overflow-hidden ${
                    isActive
                      ? "bg-[#0d1f26] text-white border-[#0d1f26] shadow-lg dark:bg-white dark:text-[#0d1f26] dark:border-white"
                      : "bg-card border-border/60 hover:border-accent/40 hover:shadow-lg hover:-translate-y-0.5"
                  }`}
                >
                  {!isActive && (
                    <div
                      className="pointer-events-none absolute inset-x-0 top-0 h-1 opacity-80"
                      style={{ background: `linear-gradient(90deg, ${tool.accent}, ${brandColor})` }}
                    />
                  )}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-sm shrink-0 ${
                        isActive ? "bg-white/15 border-white/20 dark:bg-[#0d1f26]/10 dark:border-[#0d1f26]/15" : "bg-gradient-to-br from-white to-slate-50 border-border/40"
                      }`}
                    >
                      <Icon className="w-4 h-4" style={{ color: isActive ? "#fff" : tool.accent }} />
                    </span>
                    {isActive ? (
                      <span className="text-[10px] font-bold tracking-widest uppercase rounded-full bg-white text-[#0d1f26] dark:bg-[#0d1f26] dark:text-white px-2 py-1 font-mono">{et("youAreHere")}</span>
                    ) : (
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
                    )}
                  </div>
                  <span className={`text-sm font-bold leading-tight font-heading ${isActive ? "text-white dark:text-[#0d1f26]" : "text-foreground"}`}>{toolLabel(tool.id, tool.label)}</span>
                  <span className={`text-xs mt-1 font-sans leading-relaxed ${isActive ? "text-white/70 dark:text-[#0d1f26]/60" : "text-muted-foreground"}`}>{toolDesc(tool.id, tool.desc)}</span>
                  <span className={`mt-3 inline-flex text-xs font-semibold ${isActive ? "text-white/90 dark:text-[#0d1f26]/80" : "text-accent group-hover:text-foreground"}`}>{isActive ? et("currentPage") : et("open")}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Row 2: Same tool, other platforms */}
        <div className="mb-10">
          <h3 className="flex items-center gap-2 text-sm font-bold tracking-wide text-foreground font-heading mb-3">
            <span className="w-7 h-7 rounded-xl flex items-center justify-center border border-border/60 bg-card shadow-sm">
              <span className="w-4 h-4 rounded-full flex items-center justify-center border border-black/5" style={{ background: config?.brandColor ?? "#0d1f26" }}>
                {/* use platform logo dot */}
                <span className="w-1.5 h-1.5 rounded-full bg-white/90" />
              </span>
            </span>
            {et("otherPlatformsHeading", { tool: currentToolLabel })}
            <span className="text-xs font-mono font-normal text-muted-foreground px-2 py-1 rounded-full bg-muted border border-border/40">{et("chipSameTool")}</span>
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sameToolPeers.map((p) => {
              const PLogo = p.Logo;
              return (
                <Link
                  key={p.slug}
                  href={p.href}
                  className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 hover:border-accent/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm border border-black/5 group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: p.brandColor }}
                  >
                    {PLogo ? <PLogo className="w-5 h-5" style={{ color: p.fgColor }} /> : <span className="text-xs font-bold" style={{ color: p.fgColor }}>{p.name.slice(0, 2).toUpperCase()}</span>}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-foreground font-heading leading-none truncate group-hover:text-accent transition-colors">
                      {p.name} {currentDef?.shortLabel ?? ""}
                    </div>
                    <div className="text-xs text-muted-foreground font-sans truncate">
                      {peerSpec}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Row 3: Popular combos (always show for SEO breadth) */}
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold tracking-wide text-foreground font-heading mb-3">
            <span className="w-7 h-7 rounded-xl flex items-center justify-center border border-amber-200 bg-amber-50 dark:bg-amber-500/10 dark:border-amber-500/20 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </span>
            {et("popularHeading")}
            <span className="text-xs font-mono font-normal text-muted-foreground px-2 py-1 rounded-full bg-muted border border-border/40">{et("chipPopular")}</span>
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {popularCrossLinks
              .filter((l) => l.href !== toolDefs.find((d) => d.id === currentTool)?.hrefFor(platform))
              .slice(0, 8)
              .map((link) => {
                const { title, desc } = localizePopular(link);
                return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex flex-col rounded-2xl border border-border/60 bg-card p-4 hover:border-accent/40 hover:shadow-md transition-all duration-200"
                >
                  <span className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-sm font-bold text-foreground font-heading leading-tight line-clamp-2 flex-1">{title}</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all shrink-0" />
                  </span>
                  <span className="text-xs text-muted-foreground font-sans leading-relaxed">{desc}</span>
                </Link>
                );
              })}
          </div>
          <p className="mt-4 text-xs text-muted-foreground font-sans">
            {et("footnote")}
          </p>
        </div>
      </div>
    </section>
  );
}
