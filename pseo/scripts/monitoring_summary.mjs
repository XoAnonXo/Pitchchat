import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.join(__dirname, "../src/data/pilot-config.json");

const DEFAULTS = {
  ctaReport: path.join(__dirname, "../data/cta_report.json"),
  pruneReport: path.join(__dirname, "../data/prune_candidates.json"),
  output: path.join(__dirname, "../data/monitoring_summary.json"),
};

function parseArgs() {
  const args = process.argv.slice(2);
  const config = { ...DEFAULTS };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--cta-report") {
      config.ctaReport = args[i + 1];
      i += 1;
    }
    if (arg === "--prune-report") {
      config.pruneReport = args[i + 1];
      i += 1;
    }
    if (arg === "--output") {
      config.output = args[i + 1];
      i += 1;
    }
  }

  return config;
}

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "https://pitchchat.ai"
  );
}

async function readJsonIfExists(filePath) {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

function sortSegments(segments, key) {
  if (!Array.isArray(segments)) return [];
  return [...segments].sort((a, b) => (b[key] ?? 0) - (a[key] ?? 0));
}

async function run() {
  const options = parseArgs();
  const rawConfig = await fs.readFile(configPath, "utf8");
  const config = JSON.parse(rawConfig);

  const expectedPages =
    config.industries.length * config.stages.length * config.pageTypes.length;
  const siteUrl = getSiteUrl().replace(/\/$/, "");

  const summary = {
    generatedAt: new Date().toISOString(),
    siteUrl,
    expectedPages,
    sitemaps: {
      index: `${siteUrl}/sitemap.xml`,
      industries: `${siteUrl}/sitemaps/industries`,
      stages: `${siteUrl}/sitemaps/stages`,
      pages: `${siteUrl}/sitemaps/pages`,
    },
    reports: {},
    warnings: [],
  };

  const ctaReport = await readJsonIfExists(options.ctaReport);
  if (ctaReport) {
    summary.reports.cta = {
      generatedAt: ctaReport.generatedAt,
      totals: ctaReport.totals ?? null,
      minViews: ctaReport.minViews ?? null,
      topSegmentsByCtr: sortSegments(ctaReport.filteredSegments, "ctr").slice(0, 5),
      topSegmentsByViews: sortSegments(ctaReport.bySegment, "views").slice(0, 5),
    };
  } else {
    summary.warnings.push(`CTA report not found at ${options.ctaReport}`);
  }

  const pruneReport = await readJsonIfExists(options.pruneReport);
  if (pruneReport) {
    summary.reports.prune = {
      generatedAt: pruneReport.generatedAt,
      candidateCount: pruneReport.candidateCount ?? 0,
      byPageType: pruneReport.byPageType ?? {},
      criteria: pruneReport.criteria ?? {},
    };
  } else {
    summary.warnings.push(`Prune report not found at ${options.pruneReport}`);
  }

  await fs.writeFile(options.output, JSON.stringify(summary, null, 2), "utf8");
  console.log(`Monitoring summary written to ${options.output}.`);
}

run().catch((error) => {
  console.error("Monitoring summary failed:", error.message);
  process.exitCode = 1;
});
