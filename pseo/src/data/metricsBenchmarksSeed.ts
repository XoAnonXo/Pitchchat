import type { MetricsBenchmarksPageData } from "@/components/pseo/MetricsBenchmarksTemplate";
import { labelForIndustry, labelForStage } from "@/data/labelUtils";
import { getMetricsBenchmarksContent } from "@/data/content/contentMatrix";

const baseMetrics = [
  {
    label: "Sales cycle",
    value: "Track pilot-to-paid timeline",
    note: "Demonstrates repeatable pipeline velocity.",
  },
  {
    label: "Pilot conversion",
    value: "Share conversion from pilot to contract",
    note: "Signals proof of value for the buyer.",
  },
  {
    label: "Gross margin plan",
    value: "Explain margin expansion levers",
    note: "Investors expect margin progression at Series A.",
  },
  {
    label: "Capital intensity",
    value: "Outline capital per unit of growth",
    note: "Highlights scale efficiency.",
  },
];

export function getMetricsBenchmarksSeed(
  industry: string,
  stage: string
): MetricsBenchmarksPageData {
  const industryLabel = labelForIndustry(industry);
  const stageLabel = labelForStage(stage);

  // Try to get industry/stage-specific content
  const specificContent = getMetricsBenchmarksContent(industry, stage);

  if (specificContent) {
    return {
      title: `${industryLabel} ${stageLabel} Fundraising Metrics: ${specificContent.metrics.length} Key Benchmarks`,
      summary: specificContent.summary,
      metrics: specificContent.metrics,
      ctaText: "Practice with Pitchchat AI",
      context: {
        industry,
        stage,
        pageType: "metrics-benchmarks",
      },
    };
  }

  // Fallback to base content
  return {
    title: `${industryLabel} ${stageLabel} fundraising metrics benchmarks`,
    summary: `Metrics investors expect to see from ${industryLabel} founders raising a ${stageLabel} round.`,
    metrics: baseMetrics,
    ctaText: "Create your PitchChat room",
    context: {
      industry,
      stage,
      pageType: "metrics-benchmarks",
    },
  };
}
