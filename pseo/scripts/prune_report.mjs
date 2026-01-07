import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DEFAULTS = {
  input: null,
  output: path.join(__dirname, "../data/prune_candidates.json"),
  minImpressions: 50,
  maxClicks: 0,
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
    if (arg === "--output") {
      config.output = args[i + 1];
      i += 1;
    }
    if (arg === "--min-impressions") {
      config.minImpressions = Number(args[i + 1]);
      i += 1;
    }
    if (arg === "--max-clicks") {
      config.maxClicks = Number(args[i + 1]);
      i += 1;
    }
  }

  if (!config.input) {
    throw new Error("Missing --input path to GSC export.");
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

function normalizeRow(row) {
  if (!row) {
    return null;
  }
  if (row.page || row.Page) {
    return {
      page: row.page ?? row.Page,
      clicks: parseNumber(row.clicks ?? row.Clicks),
      impressions: parseNumber(row.impressions ?? row.Impressions),
      ctr: parseNumber(row.ctr ?? row.CTR),
      position: parseNumber(row.position ?? row.Position),
    };
  }
  if (row.keys && Array.isArray(row.keys)) {
    return {
      page: row.keys[0],
      clicks: parseNumber(row.clicks),
      impressions: parseNumber(row.impressions),
      ctr: parseNumber(row.ctr),
      position: parseNumber(row.position),
    };
  }
  return null;
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

function summarizeByPageType(candidates) {
  const summary = {};

  for (const candidate of candidates) {
    const slug = candidate.page ?? "";
    const match = slug.match(/\/investor-questions\/[^/]+\/[^/]+\/([^/]+)\//);
    const pageType = match ? match[1] : "unknown";
    summary[pageType] = (summary[pageType] ?? 0) + 1;
  }

  return summary;
}

async function run() {
  const config = parseArgs();
  const rows = await loadRows(config.input);

  const candidates = rows.filter(
    (row) =>
      row.clicks <= config.maxClicks &&
      row.impressions >= config.minImpressions
  );

  const output = {
    generatedAt: new Date().toISOString(),
    criteria: {
      minImpressions: config.minImpressions,
      maxClicks: config.maxClicks,
    },
    totalRows: rows.length,
    candidateCount: candidates.length,
    byPageType: summarizeByPageType(candidates),
    candidates,
  };

  await fs.writeFile(config.output, JSON.stringify(output, null, 2), "utf8");

  console.log(
    `Prune report written to ${config.output} (${candidates.length} candidates).`
  );
}

run().catch((error) => {
  console.error("Prune report failed:", error.message);
  process.exitCode = 1;
});
