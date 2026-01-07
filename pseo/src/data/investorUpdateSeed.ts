import type { InvestorUpdatePageData } from "@/components/pseo/InvestorUpdateTemplate";
import { labelForIndustry, labelForStage } from "@/data/labelUtils";

const baseSections = [
  {
    section: "Highlights",
    content: "Summarize the most meaningful wins since the last update.",
  },
  {
    section: "Key metrics",
    content: "Share the handful of metrics that show momentum and retention.",
  },
  {
    section: "Product",
    content: "List major product milestones and what they unlock next.",
  },
  {
    section: "Go-to-market",
    content: "Explain current pipeline, conversions, and expansion plans.",
  },
  {
    section: "Help needed",
    content: "Ask for specific customer intros or domain expertise.",
  },
];

export function getInvestorUpdateSeed(
  industry: string,
  stage: string
): InvestorUpdatePageData {
  const industryLabel = labelForIndustry(industry);
  const stageLabel = labelForStage(stage);

  return {
    title: `${industryLabel} ${stageLabel} investor update template`,
    summary: `A clear investor update format for ${industryLabel} founders raising a ${stageLabel} round.`,
    sections: baseSections,
    ctaText: "Create your PitchChat room",
    context: {
      industry,
      stage,
      pageType: "investor-update",
    },
  };
}
