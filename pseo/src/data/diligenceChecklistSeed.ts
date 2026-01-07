import type { DiligenceChecklistPageData } from "@/components/pseo/DiligenceChecklistTemplate";
import { labelForIndustry, labelForStage } from "@/data/labelUtils";

const baseItems = [
  {
    item: "Current cap table and option pool plan",
    rationale: "Investors validate ownership, dilution, and incentive structure.",
  },
  {
    item: "Product roadmap and milestone plan",
    rationale: "Shows the path to de-risk the core technical thesis.",
  },
  {
    item: "Customer pipeline with next steps",
    rationale: "Proves commercial momentum and a clear path to revenue.",
  },
  {
    item: "Security or compliance posture",
    rationale: "Critical for regulated or enterprise-heavy markets.",
  },
];

export function getDiligenceChecklistSeed(
  industry: string,
  stage: string
): DiligenceChecklistPageData {
  const industryLabel = labelForIndustry(industry);
  const stageLabel = labelForStage(stage);

  return {
    title: `${industryLabel} ${stageLabel} diligence checklist`,
    summary: `A diligence readiness list for ${industryLabel} founders raising a ${stageLabel} round.`,
    items: baseItems,
    ctaText: "Create your PitchChat room",
    context: {
      industry,
      stage,
      pageType: "diligence-checklist",
    },
  };
}
