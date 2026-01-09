import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.join(__dirname, "../src/data/pilot-config.json");
const defaultInputDir = path.join(__dirname, "../data/raw");
const defaultOutputDir = path.join(__dirname, "../data/source");
const defaultCtaText = "Create your PitchChat room";

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    input: defaultInputDir,
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

function buildLabelMap(items) {
  return Object.fromEntries(items.map((item) => [item.slug, item.label]));
}

function buildSlug(industry, stage, pageType) {
  return `/investor-questions/${industry}/${stage}/${pageType}/`;
}

function normalizeText(value) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function normalizeOrigin(value) {
  const normalized = normalizeText(value).toLowerCase();
  if (!normalized) return "anonymized";
  return normalized;
}

function ensureArray(value) {
  if (Array.isArray(value)) return value;
  return [];
}

function inferCategory(question) {
  const text = question.toLowerCase();
  if (text.includes("problem") || text.includes("pain")) return "Problem";
  if (text.includes("buyer") || text.includes("customer")) return "Buyer";
  if (text.includes("moat") || text.includes("defens")) return "Moat";
  if (text.includes("traction") || text.includes("pipeline")) return "Traction";
  if (text.includes("margin") || text.includes("unit economics")) return "Economics";
  if (text.includes("roadmap") || text.includes("milestone")) return "Roadmap";
  if (text.includes("risk") || text.includes("regulat")) return "Risk";
  return "General";
}

function buildTitle(pageType, industryLabel, stageLabel) {
  if (pageType === "investor-questions") {
    return `Investor questions for ${industryLabel} ${stageLabel} startups`;
  }
  if (pageType === "pitch-deck") {
    return `Pitch deck outline for ${industryLabel} ${stageLabel} startups`;
  }
  if (pageType === "metrics-benchmarks") {
    return `${industryLabel} ${stageLabel} fundraising metrics benchmarks`;
  }
  if (pageType === "diligence-checklist") {
    return `${industryLabel} ${stageLabel} diligence checklist`;
  }
  if (pageType === "investor-update") {
    return `${industryLabel} ${stageLabel} investor update template`;
  }
  return `${industryLabel} ${stageLabel} fundraising guide`;
}

function buildSummary(pageType, industryLabel, stageLabel, counts) {
  if (pageType === "investor-questions") {
    return `Anonymized investor questions for ${industryLabel} ${stageLabel} rounds, covering ${counts.questions} questions, ${counts.metrics} metrics, and ${counts.objections} objections.`;
  }
  if (pageType === "pitch-deck") {
    return `Anonymized pitch deck outline for ${industryLabel} ${stageLabel} founders with ${counts.sections} sections and investor-facing guidance.`;
  }
  if (pageType === "metrics-benchmarks") {
    return `Anonymized fundraising benchmarks for ${industryLabel} ${stageLabel} startups with ${counts.metrics} key metrics.`;
  }
  if (pageType === "diligence-checklist") {
    return `Anonymized diligence checklist for ${industryLabel} ${stageLabel} fundraising with ${counts.items} critical documents.`;
  }
  if (pageType === "investor-update") {
    return `Anonymized investor update template for ${industryLabel} ${stageLabel} startups with ${counts.sections} sections and KPI prompts.`;
  }
  return `Anonymized fundraising guidance for ${industryLabel} ${stageLabel} startups.`;
}

function buildBase(raw, industryLabel, stageLabel, pageType) {
  const sourceTags = ensureArray(raw.sourceTags).map((tag) => normalizeText(tag)).filter(Boolean);
  return {
    industry: raw.industry,
    stage: raw.stage,
    pageType,
    slug: raw.slug ?? buildSlug(raw.industry, raw.stage, pageType),
    title: normalizeText(raw.title) || buildTitle(pageType, industryLabel, stageLabel),
    summary: normalizeText(raw.summary),
    ctaText: normalizeText(raw.ctaText) || defaultCtaText,
    sourceId: normalizeText(raw.sourceId),
    sourceNotes: normalizeText(raw.sourceNotes),
    sourceTags,
    dataOrigin: normalizeOrigin(raw.dataOrigin),
  };
}

function normalizeInvestorQuestions(raw, industryLabel, stageLabel) {
  const questions = ensureArray(raw.questions).map((item) => ({
    category: normalizeText(item.category) || inferCategory(item.question ?? ""),
    question: normalizeText(item.question),
    answer: normalizeText(item.answer),
  }));

  const objections = ensureArray(raw.objections).map((item) => ({
    objection: normalizeText(item.objection),
    response: normalizeText(item.response),
  }));

  const metrics = ensureArray(raw.metrics).map((item) => ({
    label: normalizeText(item.label),
    value: normalizeText(item.value),
    note: normalizeText(item.note),
    unit: normalizeText(item.unit),
    source: normalizeText(item.source),
  }));

  const base = buildBase(raw, industryLabel, stageLabel, "investor-questions");
  const summary =
    base.summary ||
    buildSummary("investor-questions", industryLabel, stageLabel, {
      questions: questions.length,
      metrics: metrics.length,
      objections: objections.length,
    });

  return {
    ...base,
    summary,
    questions,
    metrics,
    objections,
  };
}

function normalizePitchDeck(raw, industryLabel, stageLabel) {
  const sections = ensureArray(raw.sections).map((item) => ({
    title: normalizeText(item.title),
    goal: normalizeText(item.goal),
    guidance: normalizeText(item.guidance),
  }));

  const base = buildBase(raw, industryLabel, stageLabel, "pitch-deck");
  const summary =
    base.summary ||
    buildSummary("pitch-deck", industryLabel, stageLabel, {
      sections: sections.length,
    });

  return {
    ...base,
    summary,
    sections,
  };
}

function normalizeBenchmarks(raw, industryLabel, stageLabel) {
  const metrics = ensureArray(raw.metrics).map((item) => ({
    label: normalizeText(item.label),
    value: normalizeText(item.value),
    note: normalizeText(item.note),
    unit: normalizeText(item.unit),
    source: normalizeText(item.source),
  }));

  const base = buildBase(raw, industryLabel, stageLabel, "metrics-benchmarks");
  const summary =
    base.summary ||
    buildSummary("metrics-benchmarks", industryLabel, stageLabel, {
      metrics: metrics.length,
    });

  return {
    ...base,
    summary,
    metrics,
  };
}

function normalizeChecklist(raw, industryLabel, stageLabel) {
  const items = ensureArray(raw.items).map((item) => ({
    item: normalizeText(item.item),
    rationale: normalizeText(item.rationale),
  }));

  const base = buildBase(raw, industryLabel, stageLabel, "diligence-checklist");
  const summary =
    base.summary ||
    buildSummary("diligence-checklist", industryLabel, stageLabel, {
      items: items.length,
    });

  return {
    ...base,
    summary,
    items,
  };
}

function normalizeUpdate(raw, industryLabel, stageLabel) {
  const sections = ensureArray(raw.sections).map((item) => ({
    section: normalizeText(item.section),
    content: normalizeText(item.content),
  }));

  const base = buildBase(raw, industryLabel, stageLabel, "investor-update");
  const summary =
    base.summary ||
    buildSummary("investor-update", industryLabel, stageLabel, {
      sections: sections.length,
    });

  return {
    ...base,
    summary,
    sections,
  };
}

function validateRequired(value, label, errors) {
  if (!value) {
    errors.push(`missing ${label}`);
    return false;
  }
  return true;
}

async function run() {
  const options = parseArgs();
  const configRaw = await fs.readFile(configPath, "utf8");
  const config = JSON.parse(configRaw);

  const industryLabels = buildLabelMap(config.industries);
  const stageLabels = buildLabelMap(config.stages);
  const pageTypes = new Set(config.pageTypes.map((item) => item.slug));

  await fs.mkdir(options.output, { recursive: true });

  const entries = await fs.readdir(options.input, { withFileTypes: true });
  const files = entries.filter(
    (entry) => entry.isFile() && entry.name.endsWith(".json")
  );

  const errors = [];
  let generated = 0;
  const seenSlugs = new Set();

  for (const file of files) {
    const fullPath = path.join(options.input, file.name);
    const rawText = await fs.readFile(fullPath, "utf8");
    const raw = JSON.parse(rawText);

    const fileErrors = [];

    validateRequired(raw.industry, "industry", fileErrors);
    validateRequired(raw.stage, "stage", fileErrors);
    validateRequired(raw.pageType, "pageType", fileErrors);

    if (!pageTypes.has(raw.pageType)) {
      fileErrors.push(`unknown pageType ${raw.pageType}`);
    }

    if (!industryLabels[raw.industry]) {
      fileErrors.push(`unknown industry ${raw.industry}`);
    }

    if (!stageLabels[raw.stage]) {
      fileErrors.push(`unknown stage ${raw.stage}`);
    }

    if (fileErrors.length > 0) {
      errors.push(`${file.name}: ${fileErrors.join(", ")}`);
      continue;
    }

    const industryLabel = industryLabels[raw.industry];
    const stageLabel = stageLabels[raw.stage];
    let enriched = null;

    if (raw.pageType === "investor-questions") {
      enriched = normalizeInvestorQuestions(raw, industryLabel, stageLabel);
    } else if (raw.pageType === "pitch-deck") {
      enriched = normalizePitchDeck(raw, industryLabel, stageLabel);
    } else if (raw.pageType === "metrics-benchmarks") {
      enriched = normalizeBenchmarks(raw, industryLabel, stageLabel);
    } else if (raw.pageType === "diligence-checklist") {
      enriched = normalizeChecklist(raw, industryLabel, stageLabel);
    } else if (raw.pageType === "investor-update") {
      enriched = normalizeUpdate(raw, industryLabel, stageLabel);
    }

    if (!enriched) {
      errors.push(`${file.name}: unable to enrich pageType ${raw.pageType}`);
      continue;
    }

    const slugKey = enriched.slug ?? buildSlug(raw.industry, raw.stage, raw.pageType);
    if (seenSlugs.has(slugKey)) {
      errors.push(`${file.name}: duplicate slug ${slugKey}`);
      continue;
    }
    seenSlugs.add(slugKey);

    const outputName = `${raw.industry}_${raw.stage}_${raw.pageType}.json`;
    const outputPath = path.join(options.output, outputName);
    await fs.writeFile(outputPath, JSON.stringify(enriched, null, 2), "utf8");
    generated += 1;
  }

  if (errors.length > 0) {
    console.error("Raw enrichment completed with warnings:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
  }

  console.log(`Raw enrichment completed: ${generated} files written.`);
}

run().catch((error) => {
  console.error("Raw enrichment failed:", error.message);
  process.exitCode = 1;
});
