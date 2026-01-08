/**
 * Content Matrix Loader
 * Central module for accessing industry/stage-specific pSEO content
 */

import type { IndustryStageContent } from "./types";

// AI content
import { aiSeedContent } from "./ai/seed";
import { aiSeriesAContent } from "./ai/series-a";

// Aerospace content
import { aerospaceSeedContent } from "./aerospace/seed";
import { aerospaceSeriesAContent } from "./aerospace/series-a";

// Hardware content
import { hardwareSeedContent } from "./hardware/seed";
import { hardwareSeriesAContent } from "./hardware/series-a";

// Robotics content
import { roboticsSeedContent } from "./robotics/seed";
import { roboticsSeriesAContent } from "./robotics/series-a";

// Blockchain content
import { blockchainSeedContent } from "./blockchain/seed";
import { blockchainSeriesAContent } from "./blockchain/series-a";

// Finance content
import { financeSeedContent } from "./finance/seed";
import { financeSeriesAContent } from "./finance/series-a";

// Chemistry content
import { chemistrySeedContent } from "./chemistry/seed";
import { chemistrySeriesAContent } from "./chemistry/series-a";

type ContentMatrix = {
  [industry: string]: {
    [stage: string]: IndustryStageContent;
  };
};

const contentMatrix: ContentMatrix = {
  ai: {
    seed: aiSeedContent,
    "series-a": aiSeriesAContent,
  },
  aerospace: {
    seed: aerospaceSeedContent,
    "series-a": aerospaceSeriesAContent,
  },
  hardware: {
    seed: hardwareSeedContent,
    "series-a": hardwareSeriesAContent,
  },
  robotics: {
    seed: roboticsSeedContent,
    "series-a": roboticsSeriesAContent,
  },
  blockchain: {
    seed: blockchainSeedContent,
    "series-a": blockchainSeriesAContent,
  },
  finance: {
    seed: financeSeedContent,
    "series-a": financeSeriesAContent,
  },
  chemistry: {
    seed: chemistrySeedContent,
    "series-a": chemistrySeriesAContent,
  },
};

/**
 * Get complete content for an industry/stage combination
 */
export function getIndustryStageContent(
  industry: string,
  stage: string
): IndustryStageContent | null {
  return contentMatrix[industry]?.[stage] ?? null;
}

/**
 * Get investor questions content for an industry/stage combination
 */
export function getInvestorQuestionsContent(industry: string, stage: string) {
  return contentMatrix[industry]?.[stage]?.investorQuestions ?? null;
}

/**
 * Get pitch deck content for an industry/stage combination
 */
export function getPitchDeckContent(industry: string, stage: string) {
  return contentMatrix[industry]?.[stage]?.pitchDeck ?? null;
}

/**
 * Get metrics benchmarks content for an industry/stage combination
 */
export function getMetricsBenchmarksContent(industry: string, stage: string) {
  return contentMatrix[industry]?.[stage]?.metricsBenchmarks ?? null;
}

/**
 * Get diligence checklist content for an industry/stage combination
 */
export function getDiligenceChecklistContent(industry: string, stage: string) {
  return contentMatrix[industry]?.[stage]?.diligenceChecklist ?? null;
}

/**
 * Get investor update content for an industry/stage combination
 */
export function getInvestorUpdateContent(industry: string, stage: string) {
  return contentMatrix[industry]?.[stage]?.investorUpdate ?? null;
}
