import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEFAULTS = {
  input: null,
  output: path.join(__dirname, "../data/cta_report.json"),
  minViews: 10,
};

const CTA_EVENTS = new Set(["pseo_signup_cta_view", "pseo_signup_cta_click"]);

function parseArgs() {
  const args = process.argv.slice(2);
  const config = { ...DEFAULTS };

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
    if (arg === "--min-views") {
      config.minViews = Number(args[i + 1]);
      i += 1;
    }
  }

  if (!config.input) {
    throw new Error("Missing --input path to GA4 export.");
  }

  return config;
}

function parseNumber(value) {
  if (value === undefined || value === null || value === "") {
    return 0;
  }
  const cleaned = value.toString().replace(/[%," ]/g, "");
  const parsed = Number(cleaned);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function splitCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }
    if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  result.push(current);
  return result;
}

function getField(row, keys) {
  const lowered = new Map(
    Object.entries(row).map(([key, value]) => [key.toLowerCase(), value])
  );

  for (const key of keys) {
    const value = lowered.get(key.toLowerCase());
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }

  return "";
}

function guessField(row, fragments) {
  for (const [key, value] of Object.entries(row)) {
    const lower = key.toLowerCase();
    if (fragments.some((fragment) => lower.includes(fragment))) {
      if (value !== undefined && value !== null && value !== "") {
        return value;
      }
    }
  }
  return "";
}

function normalizeRow(row) {
  const eventName =
    getField(row, [
      "event_name",
      "event name",
      "eventname",
      "event name (event)",
    ]) || guessField(row, ["event", "event_name"]);
  if (!eventName) {
    return null;
  }

  const normalizedEvent = eventName.toString().trim().toLowerCase();
  if (!CTA_EVENTS.has(normalizedEvent)) {
    return null;
  }

  const countRaw =
    getField(row, ["event_count", "event count", "eventcount", "count"]) ||
    guessField(row, ["event count", "event_count"]);
  const count = parseNumber(countRaw) || 1;

  const industry =
    getField(row, ["industry", "industry (event parameter)"]) ||
    guessField(row, ["industry"]);
  const stage =
    getField(row, ["stage", "stage (event parameter)"]) || guessField(row, ["stage"]);
  const pageType =
    getField(row, ["pagetype", "page type", "page_type", "pageType"]) ||
    guessField(row, ["page type", "pagetype"]);
  const variant =
    getField(row, ["variant", "cta_variant", "cta variant"]) ||
    guessField(row, ["variant", "cta"]);
  const location =
    getField(row, ["location", "page_location", "page location"]) ||
    guessField(row, ["location", "page"]);

  return {
    event: normalizedEvent,
    count,
    industry: industry || "unknown",
    stage: stage || "unknown",
    pageType: pageType || "unknown",
    variant: variant || "unknown",
    location: location || "",
  };
}

async function loadRows(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  if (filePath.endsWith(".json")) {
    const data = JSON.parse(raw);
    if (Array.isArray(data)) {
      return data.map(normalizeRow).filter(Boolean);
    }
    if (Array.isArray(data.rows)) {
      return data.rows.map(normalizeRow).filter(Boolean);
    }
    return [];
  }

  const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) {
    return [];
  }

  const headers = splitCsvLine(lines[0]).map((value) => value.trim());
  const rows = [];

  for (let i = 1; i < lines.length; i += 1) {
    const values = splitCsvLine(lines[i]);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });
    const normalized = normalizeRow(row);
    if (normalized) {
      rows.push(normalized);
    }
  }

  return rows;
}

function buildKey(row) {
  return [row.industry, row.stage, row.pageType, row.variant].join("|");
}

function summarize(rows, minViews) {
  const totals = { views: 0, clicks: 0 };
  const summaryMap = new Map();

  rows.forEach((row) => {
    const key = buildKey(row);
    if (!summaryMap.has(key)) {
      summaryMap.set(key, {
        industry: row.industry,
        stage: row.stage,
        pageType: row.pageType,
        variant: row.variant,
        views: 0,
        clicks: 0,
      });
    }
    const entry = summaryMap.get(key);
    if (row.event === "pseo_signup_cta_view") {
      entry.views += row.count;
      totals.views += row.count;
    }
    if (row.event === "pseo_signup_cta_click") {
      entry.clicks += row.count;
      totals.clicks += row.count;
    }
  });

  const rowsSummary = Array.from(summaryMap.values())
    .map((entry) => ({
      ...entry,
      ctr: entry.views > 0 ? entry.clicks / entry.views : 0,
    }))
    .sort((a, b) => b.views - a.views);

  const filtered = rowsSummary.filter((entry) => entry.views >= minViews);

  return {
    totals: {
      views: totals.views,
      clicks: totals.clicks,
      ctr: totals.views > 0 ? totals.clicks / totals.views : 0,
    },
    bySegment: rowsSummary,
    minViews,
    filteredSegments: filtered,
  };
}

async function run() {
  const config = parseArgs();
  const rows = await loadRows(config.input);
  const summary = summarize(rows, config.minViews);

  const output = {
    generatedAt: new Date().toISOString(),
    totals: summary.totals,
    minViews: summary.minViews,
    filteredSegments: summary.filteredSegments,
    bySegment: summary.bySegment,
  };

  await fs.writeFile(config.output, JSON.stringify(output, null, 2), "utf8");

  console.log(
    `CTA report written to ${config.output} (${summary.bySegment.length} segments).`
  );
}

run().catch((error) => {
  console.error("CTA report failed:", error.message);
  process.exitCode = 1;
});
