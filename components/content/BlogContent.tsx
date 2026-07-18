import type { PageContent } from "@/lib/content/types";
import { ContentSection } from "./ContentSection";
import { StepByStepGuide } from "./StepByStepGuide";
import { FormatComparisonTable } from "./FormatComparisonTable";
import { ProTipsGrid } from "./ProTipsGrid";

export function BlogContent({ content }: { content: PageContent }) {
  return (
    <div className="divide-y divide-border/40">
      <ContentSection section={content.introduction} />

      <ContentSection
        section={content.whatIsPlatform}
        variant="branded"
      />

      <StepByStepGuide
        heading={content.stepByStepGuide.heading}
        subheading={content.stepByStepGuide.subheading}
        steps={content.stepByStepGuide.steps!}
      />

      <FormatComparisonTable
        heading={content.formatGuide.heading}
        subheading={content.formatGuide.subheading}
        paragraphs={content.formatGuide.paragraphs}
        table={content.formatGuide.table!}
      />

      <ContentSection section={content.whyDownForge} />

      <ProTipsGrid
        heading={content.proTips.heading}
        subheading={content.proTips.subheading}
        paragraphs={content.proTips.paragraphs}
        tips={content.proTips.tips!}
      />

      <ProTipsGrid
        heading={content.troubleshooting.heading}
        subheading={content.troubleshooting.subheading}
        paragraphs={content.troubleshooting.paragraphs}
        tips={content.troubleshooting.tips!}
      />

      <ContentSection
        section={content.conclusion}
        variant="branded"
      />
    </div>
  );
}
