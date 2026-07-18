import type { PageContent } from "@/lib/content/types";
import { ContentSection } from "./ContentSection";
import { StepByStepGuide } from "./StepByStepGuide";
import { FormatComparisonTable } from "./FormatComparisonTable";
import { ProTipsGrid } from "./ProTipsGrid";

export function BlogContent({ content }: { content: PageContent }) {
  return (
    <>
      <ContentSection section={content.introduction} />
      <StepByStepGuide
        heading={content.stepByStepGuide.heading}
        steps={content.stepByStepGuide.steps!}
      />
      <FormatComparisonTable
        heading={content.formatGuide.heading}
        paragraphs={content.formatGuide.paragraphs}
        table={content.formatGuide.table!}
      />
      <ProTipsGrid
        heading={content.proTips.heading}
        paragraphs={content.proTips.paragraphs}
        tips={content.proTips.tips!}
      />
      <ProTipsGrid
        heading={content.troubleshooting.heading}
        paragraphs={content.troubleshooting.paragraphs}
        tips={content.troubleshooting.tips!}
      />
      <ContentSection section={content.conclusion} />
    </>
  );
}
