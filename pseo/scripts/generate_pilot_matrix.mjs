import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.join(__dirname, "../src/data/pilot-config.json");
const outputPath = path.join(__dirname, "../data/pilot_matrix.json");

const configRaw = await fs.readFile(configPath, "utf8");
const config = JSON.parse(configRaw);

const items = [];

for (const industry of config.industries) {
  for (const stage of config.stages) {
    for (const pageType of config.pageTypes) {
      items.push({
        industry: industry.slug,
        stage: stage.slug,
        pageType: pageType.slug,
        path: `/investor-questions/${industry.slug}/${stage.slug}/${pageType.slug}/`,
        title: `${pageType.label} for ${industry.label} ${stage.label}`,
      });
    }
  }
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(
  outputPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      items,
    },
    null,
    2
  ),
  "utf8"
);

console.log(`Generated ${items.length} pilot pages -> ${outputPath}`);
