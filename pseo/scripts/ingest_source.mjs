import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultSourceDir = path.join(__dirname, "../data/source");
const defaultOutputPath = path.join(__dirname, "../data/source_normalized.json");

const requiredFields = ["industry", "stage", "pageType", "title", "dataOrigin"];

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    input: defaultSourceDir,
    output: defaultOutputPath,
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

async function run() {
  const config = parseArgs();
  const entries = await fs.readdir(config.input, { withFileTypes: true });
  const files = entries.filter(
    (entry) =>
      entry.isFile() &&
      entry.name.endsWith(".json") &&
      entry.name !== "example.json"
  );

  const items = [];
  const errors = [];

  for (const file of files) {
    const fullPath = path.join(config.input, file.name);
    const raw = await fs.readFile(fullPath, "utf8");
    const data = JSON.parse(raw);

    const missing = requiredFields.filter((field) => !data[field]);
    if (missing.length > 0) {
      errors.push(`${file.name}: missing ${missing.join(", ")}`);
      continue;
    }

    const slugPath =
      data.slug ??
      `/investor-questions/${data.industry}/${data.stage}/${data.pageType}/`;

    items.push({
      industry: data.industry,
      stage: data.stage,
      pageType: data.pageType,
      slug: slugPath,
      title: data.title,
      summary: data.summary ?? "",
      ctaText: data.ctaText ?? "Create your PitchChat room",
      sourceId: data.sourceId ?? null,
      sourceNotes: data.sourceNotes ?? "",
      sourceTags: Array.isArray(data.sourceTags) ? data.sourceTags : [],
      dataOrigin: data.dataOrigin ?? "unknown",
      questions: data.questions ?? [],
      metrics: data.metrics ?? [],
      objections: data.objections ?? [],
      sections: data.sections ?? [],
      items: data.items ?? [],
    });
  }

  await fs.writeFile(
    config.output,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        items,
        errors,
      },
      null,
      2
    ),
    "utf8"
  );

  if (errors.length > 0) {
    console.error("Source ingestion completed with warnings:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
  } else {
    console.log(`Source ingestion completed: ${items.length} items.`);
  }
}

run().catch((error) => {
  console.error("Source ingestion failed:", error.message);
  process.exitCode = 1;
});
