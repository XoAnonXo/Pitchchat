import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sourceDir = path.join(__dirname, "../data/source");
const outputPath = path.join(__dirname, "../data/source_normalized.json");

const requiredFields = ["industry", "stage", "pageType", "title"];

async function run() {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });
  const files = entries.filter(
    (entry) =>
      entry.isFile() &&
      entry.name.endsWith(".json") &&
      entry.name !== "example.json"
  );

  const items = [];
  const errors = [];

  for (const file of files) {
    const fullPath = path.join(sourceDir, file.name);
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
      questions: data.questions ?? [],
      metrics: data.metrics ?? [],
      objections: data.objections ?? [],
      sections: data.sections ?? [],
      items: data.items ?? [],
    });
  }

  await fs.writeFile(
    outputPath,
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
