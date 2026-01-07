import type { InvestorQuestionsPageData } from "@/components/pseo/InvestorQuestionsTemplate";
import { labelForIndustry, labelForStage } from "@/data/labelUtils";

const baseQuestions = [
  {
    category: "Problem",
    question: "What is the wedge problem and why does it matter now?",
    answer:
      "Anchor the answer in a clear pain point and a timing advantage tied to market shifts or regulation.",
  },
  {
    category: "Buyer",
    question: "Who is the buyer and how do you reach them efficiently?",
    answer:
      "Name the buyer role, the first channel you win, and the path from pilot to paid.",
  },
  {
    category: "Moat",
    question: "What makes the business defensible beyond speed?",
    answer:
      "Highlight proprietary data, approvals, or workflow lock-in that compounds over time.",
  },
  {
    category: "Traction",
    question: "What early signals prove pull from the market?",
    answer:
      "Share the strongest signal of demand and how it translates into repeatable pipeline.",
  },
  {
    category: "Economics",
    question: "How will margins improve as you scale?",
    answer:
      "Explain how unit economics improve with learning curves, automation, or procurement.",
  },
  {
    category: "Roadmap",
    question: "What milestones unlock the next round?",
    answer:
      "Define technical, revenue, and compliance milestones tied to Series A readiness.",
  },
];

const baseMetrics = [
  {
    label: "Sales cycle length",
    value: "Document pilot-to-paid timing",
    note: "Investors expect evidence of a repeatable motion.",
  },
  {
    label: "Pilot conversion",
    value: "Share pilot conversion trends",
    note: "Shows confidence in the go-to-market approach.",
  },
  {
    label: "Gross margin plan",
    value: "Explain margin expansion levers",
    note: "Margin trajectory matters for Series A.",
  },
  {
    label: "Capital intensity",
    value: "Outline capital per unit of growth",
    note: "Highlight how scale reduces capital burden.",
  },
];

const baseObjections = [
  {
    objection: "Adoption cycles are too long for this market.",
    response:
      "Show short-cycle pilots and a land-and-expand plan with reference customers.",
  },
  {
    objection: "The product requires heavy upfront investment.",
    response:
      "Detail staged milestones and how capital de-risks the core thesis.",
  },
];

export function getInvestorQuestionsSeed(
  industry: string,
  stage: string
): InvestorQuestionsPageData {
  const industryLabel = labelForIndustry(industry);
  const stageLabel = labelForStage(stage);

  return {
    title: `Investor questions for ${industryLabel} ${stageLabel} startups`,
    summary: `Founders raising a ${stageLabel} round in ${industryLabel} should be ready to answer these investor questions with clarity and evidence.`,
    questions: baseQuestions,
    metrics: baseMetrics,
    objections: baseObjections,
    ctaText: "Create your PitchChat room",
    context: {
      industry,
      stage,
      pageType: "investor-questions",
    },
  };
}
