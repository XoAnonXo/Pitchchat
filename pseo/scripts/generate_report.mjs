import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "../..");
const defaultInput = path.join(__dirname, "../data/source_normalized.json");
const defaultOutputDir = path.join(rootDir, "pseo_status/pr");

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    input: defaultInput,
    output: defaultOutputDir,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--input") {
      config.input = args[i + 1];
      i += 1;
    }
    if (arg === "--output") {
      config.output = args[i + 1];
      i += 1;
    }
  }

  return config;
}

function sum(items, selector) {
  return items.reduce((total, item) => total + selector(item), 0);
}

function toCountMap(items, selector) {
  const map = new Map();
  for (const item of items) {
    const key = selector(item);
    if (!key) continue;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
}

function sortCounts(map, limit = 5) {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit);
}

function formatCountList(entries) {
  if (entries.length === 0) {
    return ["- UNCONFIRMED: Add more data to generate insights."];
  }
  return entries.map(([label, count]) => `- ${label}: ${count}`);
}

function formatInlineList(entries) {
  if (entries.length === 0) {
    return "UNCONFIRMED";
  }
  return entries.map(([label, count]) => `${label} (${count})`).join(", ");
}

function buildExecutiveSummary(stats) {
  const summary = [];

  if (stats.totalQuestions > 0) {
    summary.push(
      `Analyzed ${stats.totalQuestions} anonymized investor questions across ${stats.industryCount} industries and ${stats.stageCount} stages.`
    );
  }

  if (stats.topCategories.length > 0) {
    summary.push(
      `Most common question categories: ${formatInlineList(stats.topCategories)}.`
    );
  }

  if (stats.topStage) {
    summary.push(
      `${stats.topStage[0]} accounts for ${stats.topStage[1]} of the recorded questions.`
    );
  }

  if (summary.length === 0) {
    summary.push("UNCONFIRMED: Add real data to generate insights.");
  }

  return summary.map((line) => `- ${line}`).join("\n");
}

async function run() {
  const config = parseArgs();
  const raw = await fs.readFile(config.input, "utf8");
  const payload = JSON.parse(raw);
  const items = payload.items ?? [];
  const generatedAt = payload.generatedAt ?? new Date().toISOString();

  const investorItems = items.filter((item) => item.pageType === "investor-questions");
  const totalQuestions = sum(investorItems, (item) => (item.questions ?? []).length);
  const totalMetrics = sum(investorItems, (item) => (item.metrics ?? []).length);
  const totalObjections = sum(investorItems, (item) => (item.objections ?? []).length);
  const sourceIds = new Set(
    items.map((item) => item.sourceId).filter(Boolean)
  );

  const industries = Array.from(
    new Set(items.map((item) => item.industry).filter(Boolean))
  );
  const stages = Array.from(
    new Set(items.map((item) => item.stage).filter(Boolean))
  );

  const categoryCounts = toCountMap(
    investorItems.flatMap((item) => item.questions ?? []),
    (question) => question.category
  );
  const stageCounts = toCountMap(
    investorItems.flatMap((item) =>
      (item.questions ?? []).map(() => item.stage)
    ),
    (stage) => stage
  );
  const industryCounts = toCountMap(
    investorItems.flatMap((item) =>
      (item.questions ?? []).map(() => item.industry)
    ),
    (industry) => industry
  );

  const topCategories = sortCounts(categoryCounts, 3);
  const topStages = sortCounts(stageCounts, 3);
  const topIndustries = sortCounts(industryCounts, 3);
  const topStage = topStages[0];

  const stats = {
    totalQuestions,
    totalMetrics,
    totalObjections,
    sampleSize: sourceIds.size || "UNCONFIRMED",
    industryCount: industries.length || 0,
    stageCount: stages.length || 0,
    topCategories,
    topStages,
    topIndustries,
    topStage,
  };

  const today = new Date().toISOString().slice(0, 10);
  const pressRelease = `---
title: "Pitchchat Investor Q&A Trends (Draft)"
date: "${today}"
embargo: "none"
primary_entity: "Pitchchat"
data_source: "Anonymized founder Q&A + pitch decks"
coverage: "${stages.join(", ") || "UNCONFIRMED"}"
industries: [${industries.map((industry) => `"${industry}"`).join(", ")}]
methodology: "Aggregated anonymized founder data from Pitchchat rooms; summarized trends; removed identifying details."
---

# Pitchchat Investor Q&A Trends (Draft)

## Executive summary
${buildExecutiveSummary(stats)}

## The data
**Sample size**
- Total founders: ${stats.sampleSize}
- Total investor questions analyzed: ${stats.totalQuestions || "UNCONFIRMED"}
- Date range: ${generatedAt}

**Segments covered**
- Stages: ${stages.join(", ") || "UNCONFIRMED"}
- Industries: ${industries.join(", ") || "UNCONFIRMED"}

## Top insights
### 1) Top question categories
${formatCountList(topCategories).join("\n")}

### 2) Question volume by stage
${formatCountList(topStages).join("\n")}

### 3) Question volume by industry
${formatCountList(topIndustries).join("\n")}

## Breakdown by stage
${formatCountList(topStages).join("\n")}

## Breakdown by industry
${formatCountList(topIndustries).join("\n")}

## Methodology
Summarized anonymized investor Q&A and metrics data from Pitchchat rooms. Removed identifying details and aggregated counts by segment.

## About Pitchchat
Pitchchat turns your decks into an interactive AI room that answers investor questions.

## Media contact
Name: [Name]
Email: [Email]
`;

  const reportDraft = `---
title: "Quarterly Investor Q&A Report (Draft)"
date: "${today}"
version: "v1"
---

# Quarterly Investor Q&A Report (Draft)

## 1. Overview
- Purpose: Share anonymized investor questions and readiness benchmarks for founders.
- Audience: Founders, investors, media

## 2. Key findings (TL;DR)
${buildExecutiveSummary(stats)}

## 3. What investors asked most
- Top categories: ${formatInlineList(topCategories)}
- Questions analyzed: ${stats.totalQuestions || "UNCONFIRMED"}

## 4. Metrics investors want to see
- Metrics referenced: ${stats.totalMetrics || "UNCONFIRMED"}
- Objections captured: ${stats.totalObjections || "UNCONFIRMED"}

## 5. Founder readiness gaps
- UNCONFIRMED: Add gap analysis once dataset grows.

## 6. Recommended actions for founders
- Prepare answers for the top categories above.
- Add metrics that show momentum and efficiency.
- Address common objections with proof points.

## 7. Methodology
- Data sources: anonymized Pitchchat submissions.
- Anonymization policy: remove names, company identifiers, and sensitive data.
- Sampling notes: ${generatedAt}

## 8. Appendix
- Stage breakdown:
${formatCountList(topStages).join("\n")}
- Industry breakdown:
${formatCountList(topIndustries).join("\n")}
`;

  await fs.mkdir(config.output, { recursive: true });
  await fs.writeFile(
    path.join(config.output, "press_release_draft.md"),
    pressRelease,
    "utf8"
  );
  await fs.writeFile(
    path.join(config.output, "report_draft.md"),
    reportDraft,
    "utf8"
  );

  console.log("Drafts written to pseo_status/pr/.");
}

run().catch((error) => {
  console.error("Report generation failed:", error.message);
  process.exitCode = 1;
});
