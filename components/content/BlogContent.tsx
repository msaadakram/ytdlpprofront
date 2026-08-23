import type { PageContent } from "@/lib/content/types";
import { ContentSection } from "./ContentSection";
import { StepByStepGuide } from "./StepByStepGuide";
import { FormatComparisonTable } from "./FormatComparisonTable";
import { ProTipsGrid } from "./ProTipsGrid";
import { TableOfContents } from "./TableOfContents";

export function BlogContent({ content }: { content: PageContent }) {
  const sections: Array<{ id: string; label: string }> = [
    { id: "guide-intro", label: "Overview" },
    { id: "guide-what-is", label: content.whatIsPlatform.heading },
    { id: "guide-how-to", label: "Step-by-Step" },
    { id: "guide-formats", label: "Formats" },
    ...(content.qualityGuide ? [{ id: "guide-quality", label: "Quality & 4K" }] : []),
    ...(content.deviceGuide ? [{ id: "guide-devices", label: "Android, iPhone & PC" }] : []),
    ...(content.useCases ? [{ id: "guide-use-cases", label: "What You Can Download" }] : []),
    ...(content.safety ? [{ id: "guide-safety", label: "Safety & Legality" }] : []),
    { id: "guide-why", label: "Why DownForge" },
    { id: "guide-tips", label: "Expert Tips" },
    { id: "guide-troubleshooting", label: "Troubleshooting" },
  ].filter((s) => s.label);

  return (
    <div className="divide-y divide-border/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14">
        <TableOfContents entries={sections} />
      </div>

      <div id="guide-intro" className="scroll-mt-24">
        <ContentSection section={content.introduction} />
      </div>

      <ContentSection
        section={content.whatIsPlatform}
        variant="branded"
        sectionId="guide-what-is"
      />

      <StepByStepGuide
        heading={content.stepByStepGuide.heading}
        subheading={content.stepByStepGuide.subheading}
        steps={content.stepByStepGuide.steps!}
        sectionId="guide-how-to"
      />

      <FormatComparisonTable
        heading={content.formatGuide.heading}
        subheading={content.formatGuide.subheading}
        paragraphs={content.formatGuide.paragraphs}
        table={content.formatGuide.table!}
        sectionId="guide-formats"
      />

      {content.qualityGuide && (
        <FormatComparisonTable
          heading={content.qualityGuide.heading}
          subheading={content.qualityGuide.subheading}
          paragraphs={content.qualityGuide.paragraphs}
          table={content.qualityGuide.table!}
          sectionId="guide-quality"
        />
      )}

      {content.deviceGuide && (
        <StepByStepGuide
          heading={content.deviceGuide.heading}
          subheading={content.deviceGuide.subheading}
          steps={content.deviceGuide.steps ?? []}
          sectionId="guide-devices"
        />
      )}

      {content.useCases && (
        <ProTipsGrid
          heading={content.useCases.heading}
          subheading={content.useCases.subheading}
          paragraphs={content.useCases.paragraphs}
          tips={content.useCases.tips ?? []}
          sectionId="guide-use-cases"
        />
      )}

      {content.safety && (
        <ContentSection section={content.safety} sectionId="guide-safety" />
      )}

      <ContentSection section={content.whyDownForge} sectionId="guide-why" />

      <ProTipsGrid
        heading={content.proTips.heading}
        subheading={content.proTips.subheading}
        paragraphs={content.proTips.paragraphs}
        tips={content.proTips.tips!}
        sectionId="guide-tips"
      />

      <ProTipsGrid
        heading={content.troubleshooting.heading}
        subheading={content.troubleshooting.subheading}
        paragraphs={content.troubleshooting.paragraphs}
        tips={content.troubleshooting.tips!}
        sectionId="guide-troubleshooting"
      />

      <ContentSection
        section={content.conclusion}
        variant="branded"
      />
    </div>
  );
}
