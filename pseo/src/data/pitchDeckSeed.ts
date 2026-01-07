import type { PitchDeckPageData } from "@/components/pseo/PitchDeckTemplate";
import { labelForIndustry, labelForStage } from "@/data/labelUtils";

const baseSections = [
  {
    title: "Problem",
    goal: "Show the pain and why now matters.",
    guidance: "Quantify the problem with a clear market shift or constraint.",
  },
  {
    title: "Solution",
    goal: "Explain the product in one sentence.",
    guidance: "Focus on the core workflow and the wedge you own.",
  },
  {
    title: "Market",
    goal: "Define the reachable initial market.",
    guidance: "Start with the first buyer segment and a realistic wedge.",
  },
  {
    title: "Traction",
    goal: "Prove early demand signals.",
    guidance: "Highlight pilots, LOIs, or early revenue.",
  },
  {
    title: "Business model",
    goal: "Explain how money is made.",
    guidance: "Show pricing logic tied to value delivered.",
  },
  {
    title: "Moat",
    goal: "Defensibility beyond execution speed.",
    guidance: "Data, IP, approvals, or operational scale.",
  },
  {
    title: "Team",
    goal: "Why this team can win.",
    guidance: "Emphasize domain expertise and execution history.",
  },
];

export function getPitchDeckSeed(
  industry: string,
  stage: string
): PitchDeckPageData {
  const industryLabel = labelForIndustry(industry);
  const stageLabel = labelForStage(stage);

  return {
    title: `Pitch deck outline for ${industryLabel} ${stageLabel} startups`,
    summary: `A high-signal deck structure for ${industryLabel} founders raising a ${stageLabel} round.`,
    sections: baseSections,
    ctaText: "Create your PitchChat room",
    context: {
      industry,
      stage,
      pageType: "pitch-deck",
    },
  };
}
