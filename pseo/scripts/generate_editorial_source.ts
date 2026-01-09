import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import pilotConfig from "../src/data/pilot-config.json";
import { labelForIndustry, labelForStage } from "../src/data/labelUtils";
import { getIndustryStageContent } from "../src/data/content/contentMatrix";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, "../data/source");

const defaultCta = "Create your PitchChat room";
const dataOrigin = "editorial";
const sourceTags = ["editorial", "pitchchat-guidance"];
const fallbackBenchmarkSource =
  "World Bank Financial Sector Overview (https://www.worldbank.org/en/topic/financialsector)";
const benchmarkSourcesByIndustry: Record<string, string> = {
  aerospace: "Space Capital Space IQ (https://www.spacecapital.com/space-iq)",
  hardware: "NIST Manufacturing (https://www.nist.gov/manufacturing)",
  robotics: "IFR World Robotics Report (https://ifr.org/worldrobotics/)",
  chemistry: "ICIS Chemicals Resources (https://www.icis.com/explore/resources/chemicals/)",
  finance: "PwC Financial Services Industry (https://www.pwc.com/gx/en/industries/financial-services.html)",
  blockchain: "Chainalysis Reports (https://www.chainalysis.com/reports/)",
  ai: "Stanford AI Index (https://hai.stanford.edu/ai-index)",
  saas:
    "SaaStr Metrics Masterclass (https://www.saastr.com/saas-metrics-masterclass-key-business-metrics/)",
  healthcare: "WHO Digital Health (https://www.who.int/health-topics/digital-health)",
  fintech: "World Bank Global Findex (https://www.worldbank.org/en/publication/globalfindex)",
};

const productLine: Record<string, string> = {
  "investor-questions":
    "Pitchchat turns investor questions into an interactive pitch room founders can share.",
  "pitch-deck": "Pitchchat turns your deck into an interactive pitch room for investors.",
  "metrics-benchmarks": "Pitchchat keeps fundraising metrics investor-ready in one room.",
  "diligence-checklist": "Pitchchat keeps diligence docs organized and easy to review.",
  "investor-update": "Pitchchat helps founders share updates in a single room.",
};

function buildSlug(industry: string, stage: string, pageType: string) {
  return `/investor-questions/${industry}/${stage}/${pageType}/`;
}

async function run() {
  await fs.mkdir(outputDir, { recursive: true });
  const errors: string[] = [];
  let generated = 0;

  for (const industry of pilotConfig.industries) {
    for (const stage of pilotConfig.stages) {
      const content = getIndustryStageContent(industry.slug, stage.slug);
      if (!content) {
        errors.push(`Missing content for ${industry.slug}/${stage.slug}`);
        continue;
      }

      const industryLabel = labelForIndustry(industry.slug);
      const stageLabel = labelForStage(stage.slug);
      const metricSource =
        benchmarkSourcesByIndustry[industry.slug] ?? fallbackBenchmarkSource;

      for (const pageType of pilotConfig.pageTypes) {
        const slug = buildSlug(industry.slug, stage.slug, pageType.slug);
        const base = {
          industry: industry.slug,
          stage: stage.slug,
          pageType: pageType.slug,
          slug,
          ctaText: defaultCta,
          dataOrigin,
          sourceId: `editorial-${industry.slug}-${stage.slug}`,
          sourceNotes:
            "Editorial guidance prepared by Pitchchat; not sourced from user submissions.",
          sourceTags,
        };

        if (pageType.slug === "investor-questions") {
          const metrics = content.investorQuestions.metrics.map((metric) => ({
            ...metric,
            source: metric.source ?? metricSource,
          }));
          const payload = {
            ...base,
            title: `Investor questions for ${industryLabel} ${stageLabel} startups`,
            summary: `${content.investorQuestions.summary} ${productLine[pageType.slug]}`,
            questions: content.investorQuestions.questions,
            metrics,
            objections: content.investorQuestions.objections,
          };
          await fs.writeFile(
            path.join(outputDir, `${industry.slug}_${stage.slug}_${pageType.slug}.json`),
            JSON.stringify(payload, null, 2),
            "utf8"
          );
          generated += 1;
          continue;
        }

        if (pageType.slug === "pitch-deck") {
          const payload = {
            ...base,
            title: `Pitch deck outline for ${industryLabel} ${stageLabel} startups`,
            summary: `${content.pitchDeck.summary} ${productLine[pageType.slug]}`,
            sections: content.pitchDeck.sections,
          };
          await fs.writeFile(
            path.join(outputDir, `${industry.slug}_${stage.slug}_${pageType.slug}.json`),
            JSON.stringify(payload, null, 2),
            "utf8"
          );
          generated += 1;
          continue;
        }

        if (pageType.slug === "metrics-benchmarks") {
          const metrics = content.metricsBenchmarks.metrics.map((metric) => ({
            ...metric,
            source: metric.source ?? metricSource,
          }));
          const payload = {
            ...base,
            title: `${industryLabel} ${stageLabel} fundraising metrics benchmarks`,
            summary: `${content.metricsBenchmarks.summary} ${productLine[pageType.slug]}`,
            metrics,
          };
          await fs.writeFile(
            path.join(outputDir, `${industry.slug}_${stage.slug}_${pageType.slug}.json`),
            JSON.stringify(payload, null, 2),
            "utf8"
          );
          generated += 1;
          continue;
        }

        if (pageType.slug === "diligence-checklist") {
          const payload = {
            ...base,
            title: `${industryLabel} ${stageLabel} diligence checklist`,
            summary: `${content.diligenceChecklist.summary} ${productLine[pageType.slug]}`,
            items: content.diligenceChecklist.items,
          };
          await fs.writeFile(
            path.join(outputDir, `${industry.slug}_${stage.slug}_${pageType.slug}.json`),
            JSON.stringify(payload, null, 2),
            "utf8"
          );
          generated += 1;
          continue;
        }

        if (pageType.slug === "investor-update") {
          const payload = {
            ...base,
            title: `${industryLabel} ${stageLabel} investor update template`,
            summary: `${content.investorUpdate.summary} ${productLine[pageType.slug]}`,
            sections: content.investorUpdate.sections,
          };
          await fs.writeFile(
            path.join(outputDir, `${industry.slug}_${stage.slug}_${pageType.slug}.json`),
            JSON.stringify(payload, null, 2),
            "utf8"
          );
          generated += 1;
        }
      }
    }
  }

  if (errors.length > 0) {
    console.error("Editorial generation completed with warnings:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
  }

  console.log(`Generated ${generated} editorial source files.`);
}

run().catch((error) => {
  console.error("Editorial source generation failed:", error.message);
  process.exitCode = 1;
});
