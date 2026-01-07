import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEFAULTS = {
  input: path.join(__dirname, "../data/source_normalized.json"),
  minSummaryLength: 80,
  minUniqueRatio: 0.3,
  investorQuestions: {
    minQuestions: 10,
    minMetrics: 4,
    minObjections: 2,
  },
  pitchDeck: {
    minSections: 9,
  },
  metricsBenchmarks: {
    minMetrics: 4,
  },
  diligenceChecklist: {
    minItems: 5,
  },
  investorUpdate: {
    minSections: 6,
  },
};

function parseArgs() {
  const args = process.argv.slice(2);
  const config = { ...DEFAULTS };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--input") {
      config.input = args[i + 1];
      i += 1;
    }
    if (arg === "--min-summary-length") {
      config.minSummaryLength = Number(args[i + 1]);
      i += 1;
    }
    if (arg === "--min-unique-ratio") {
      config.minUniqueRatio = Number(args[i + 1]);
      i += 1;
    }
  }

  return config;
}

function normalizeChunk(text) {
  if (!text) {
    return "";
  }
  return text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function flattenText(parts) {
  return parts
    .flatMap((part) => {
      if (!part) {
        return [];
      }
      if (Array.isArray(part)) {
        return part;
      }
      return [part];
    })
    .map((item) => normalizeChunk(item))
    .filter(Boolean);
}

function collectChunks(item) {
  if (item.pageType === "investor-questions") {
    return flattenText([
      item.summary,
      item.questions?.map((q) => `${q.question} ${q.answer}`),
      item.metrics?.map((m) => `${m.label} ${m.value} ${m.note ?? ""}`),
      item.objections?.map((o) => `${o.objection} ${o.response}`),
    ]);
  }

  if (item.pageType === "pitch-deck") {
    return flattenText([
      item.summary,
      item.sections?.map(
        (s) => `${s.title} ${s.goal ?? ""} ${s.guidance ?? ""}`
      ),
    ]);
  }

  if (item.pageType === "metrics-benchmarks") {
    return flattenText([
      item.summary,
      item.metrics?.map((m) => `${m.label} ${m.value} ${m.note ?? ""}`),
    ]);
  }

  if (item.pageType === "diligence-checklist") {
    return flattenText([
      item.summary,
      item.items?.map((i) => `${i.item} ${i.rationale ?? ""}`),
    ]);
  }

  if (item.pageType === "investor-update") {
    return flattenText([
      item.summary,
      item.sections?.map((s) => `${s.section} ${s.content ?? ""}`),
    ]);
  }

  return flattenText([item.summary]);
}

function validateItem(item, config) {
  const errors = [];
  const summaryLength = (item.summary ?? "").trim().length;

  if (!item.title) {
    errors.push("missing title");
  }

  if (summaryLength < config.minSummaryLength) {
    errors.push(
      `summary too short (${summaryLength} < ${config.minSummaryLength})`
    );
  }

  if (item.pageType === "investor-questions") {
    if ((item.questions?.length ?? 0) < config.investorQuestions.minQuestions) {
      errors.push(
        `questions ${item.questions?.length ?? 0} < ${
          config.investorQuestions.minQuestions
        }`
      );
    }
    if ((item.metrics?.length ?? 0) < config.investorQuestions.minMetrics) {
      errors.push(
        `metrics ${item.metrics?.length ?? 0} < ${
          config.investorQuestions.minMetrics
        }`
      );
    }
    if ((item.objections?.length ?? 0) < config.investorQuestions.minObjections) {
      errors.push(
        `objections ${item.objections?.length ?? 0} < ${
          config.investorQuestions.minObjections
        }`
      );
    }
  }

  if (item.pageType === "pitch-deck") {
    if ((item.sections?.length ?? 0) < config.pitchDeck.minSections) {
      errors.push(
        `sections ${item.sections?.length ?? 0} < ${
          config.pitchDeck.minSections
        }`
      );
    }
  }

  if (item.pageType === "metrics-benchmarks") {
    if ((item.metrics?.length ?? 0) < config.metricsBenchmarks.minMetrics) {
      errors.push(
        `metrics ${item.metrics?.length ?? 0} < ${
          config.metricsBenchmarks.minMetrics
        }`
      );
    }
  }

  if (item.pageType === "diligence-checklist") {
    if ((item.items?.length ?? 0) < config.diligenceChecklist.minItems) {
      errors.push(
        `items ${item.items?.length ?? 0} < ${
          config.diligenceChecklist.minItems
        }`
      );
    }
  }

  if (item.pageType === "investor-update") {
    if ((item.sections?.length ?? 0) < config.investorUpdate.minSections) {
      errors.push(
        `sections ${item.sections?.length ?? 0} < ${
          config.investorUpdate.minSections
        }`
      );
    }
  }

  return errors;
}

async function run() {
  const config = parseArgs();
  const raw = await fs.readFile(config.input, "utf8");
  const data = JSON.parse(raw);
  const items = data.items ?? [];

  const errors = [];
  const groupedChunks = new Map();

  for (const item of items) {
    const itemErrors = validateItem(item, config);
    if (itemErrors.length > 0) {
      errors.push(
        `${item.slug ?? item.title ?? "unknown"}: ${itemErrors.join("; ")}`
      );
    }

    const chunks = collectChunks(item);
    if (!groupedChunks.has(item.pageType)) {
      groupedChunks.set(item.pageType, []);
    }
    groupedChunks.get(item.pageType).push(...chunks);
  }

  const ratioErrors = [];
  for (const [pageType, chunks] of groupedChunks.entries()) {
    const normalized = chunks.filter(Boolean);
    const unique = new Set(normalized);
    const ratio = normalized.length === 0 ? 1 : unique.size / normalized.length;
    if (ratio < config.minUniqueRatio) {
      ratioErrors.push(
        `${pageType}: unique chunk ratio ${ratio.toFixed(2)} < ${
          config.minUniqueRatio
        }`
      );
    }
  }

  if (errors.length === 0 && ratioErrors.length === 0) {
    console.log(`Quality check passed for ${items.length} items.`);
    return;
  }

  if (errors.length > 0) {
    console.error("Quality check failures:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
  }

  if (ratioErrors.length > 0) {
    console.error("Uniqueness threshold failures:");
    for (const error of ratioErrors) {
      console.error(`- ${error}`);
    }
  }

  process.exitCode = 1;
}

run().catch((error) => {
  console.error("Quality check failed:", error.message);
  process.exitCode = 1;
});
