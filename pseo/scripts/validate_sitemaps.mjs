import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.join(__dirname, "../src/data/pilot-config.json");

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.SITE_URL ??
  "https://pitchchat.ai";

function timestamp() {
  return new Date().toISOString();
}

function log(message) {
  console.log(`[${timestamp()}] ${message}`);
}

function buildUrl(pathname) {
  return `${siteUrl}${pathname}`;
}

function summarize(label, urls, sampleCount = 3) {
  const unique = new Set(urls);
  const samples = Array.from(unique).slice(0, sampleCount);
  return {
    label,
    total: urls.length,
    unique: unique.size,
    samples,
  };
}

async function run() {
  const raw = await fs.readFile(configPath, "utf8");
  const config = JSON.parse(raw);

  const industryUrls = config.industries.map((industry) =>
    buildUrl(`/investor-questions/industries/${industry.slug}/`)
  );

  const stageUrls = config.stages.map((stage) =>
    buildUrl(`/investor-questions/stages/${stage.slug}/`)
  );

  const pageUrls = [];
  for (const industry of config.industries) {
    for (const stage of config.stages) {
      for (const pageType of config.pageTypes) {
        pageUrls.push(
          buildUrl(
            `/investor-questions/${industry.slug}/${stage.slug}/${pageType.slug}/`
          )
        );
      }
    }
  }

  const summaries = [
    summarize("Industries sitemap", industryUrls),
    summarize("Stages sitemap", stageUrls),
    summarize("Pages sitemap", pageUrls),
  ];

  const totalPages = config.industries.length * config.stages.length * config.pageTypes.length;

  log("pSEO sitemap validation");
  log(`Site: ${siteUrl}`);
  log(`Expected pages: ${totalPages}`);
  console.log("");
  for (const summary of summaries) {
    log(`${summary.label}: ${summary.unique} URLs`);
    log("Samples:");
    for (const sample of summary.samples) {
      console.log(`- ${sample}`);
    }
    console.log("");
  }

  const allUnique =
    summaries.every((summary) => summary.total === summary.unique) &&
    pageUrls.length === totalPages;

  if (!allUnique) {
    console.error("Validation warning: duplicate or missing URLs detected.");
    process.exitCode = 1;
  } else {
    log("Validation passed: URL counts and samples look correct.");
  }
}

run().catch((error) => {
  console.error("Validation failed:", error.message);
  process.exitCode = 1;
});
