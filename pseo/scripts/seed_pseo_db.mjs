import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.join(__dirname, "../src/data/pilot-config.json");
const fallbackSeedPath = path.join(__dirname, "../data/pilot_seed.json");
const normalizedSourcePath = path.join(
  __dirname,
  "../data/source_normalized.json"
);

const connectionString =
  process.env.PSEO_DATABASE_URL ?? process.env.DATABASE_URL ?? "";

if (!connectionString) {
  throw new Error("PSEO_DATABASE_URL or DATABASE_URL must be set");
}

const client = new Client({ connectionString });

async function loadSeedData() {
  try {
    const raw = await fs.readFile(normalizedSourcePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    const raw = await fs.readFile(fallbackSeedPath, "utf8");
    return JSON.parse(raw);
  }
}

async function upsertLookup(table, slug, name) {
  const result = await client.query(
    `INSERT INTO ${table} (slug, name)
     VALUES ($1, $2)
     ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
     RETURNING id`,
    [slug, name]
  );

  return result.rows[0].id;
}

async function upsertPage({
  industryId,
  stageId,
  pageTypeId,
  slug,
  title,
  summary,
  ctaText,
  rawData,
}) {
  const result = await client.query(
    `INSERT INTO pseo_pages
      (industry_id, stage_id, page_type_id, slug, title, summary, cta_text, is_published, raw_data)
     VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, $8)
     ON CONFLICT (slug) DO UPDATE SET
       title = EXCLUDED.title,
       summary = EXCLUDED.summary,
       cta_text = EXCLUDED.cta_text,
       raw_data = EXCLUDED.raw_data,
       updated_at = NOW()
     RETURNING id`,
    [industryId, stageId, pageTypeId, slug, title, summary, ctaText, rawData]
  );

  return result.rows[0].id;
}

async function resetPageChildren(pageId) {
  await client.query("DELETE FROM pseo_investor_questions WHERE page_id = $1", [
    pageId,
  ]);
  await client.query("DELETE FROM pseo_benchmarks WHERE page_id = $1", [pageId]);
  await client.query("DELETE FROM pseo_deck_sections WHERE page_id = $1", [
    pageId,
  ]);
  await client.query("DELETE FROM pseo_checklist_items WHERE page_id = $1", [
    pageId,
  ]);
  await client.query("DELETE FROM pseo_investor_updates WHERE page_id = $1", [
    pageId,
  ]);
  await client.query("DELETE FROM pseo_objections WHERE page_id = $1", [pageId]);
}

async function insertQuestions(pageId, questions) {
  let sortOrder = 0;
  for (const item of questions) {
    await client.query(
      `INSERT INTO pseo_investor_questions
        (page_id, category, question, answer, sort_order)
       VALUES ($1, $2, $3, $4, $5)`,
      [pageId, item.category ?? null, item.question, item.answer, sortOrder]
    );
    sortOrder += 1;
  }
}

async function insertBenchmarks(pageId, metrics) {
  let sortOrder = 0;
  for (const metric of metrics) {
    await client.query(
      `INSERT INTO pseo_benchmarks
        (page_id, metric, value, notes, sort_order)
       VALUES ($1, $2, $3, $4, $5)`,
      [pageId, metric.label, metric.value, metric.note ?? null, sortOrder]
    );
    sortOrder += 1;
  }
}

async function insertObjections(pageId, objections) {
  let sortOrder = 0;
  for (const item of objections) {
    await client.query(
      `INSERT INTO pseo_objections
        (page_id, objection, response, sort_order)
       VALUES ($1, $2, $3, $4)`,
      [pageId, item.objection, item.response, sortOrder]
    );
    sortOrder += 1;
  }
}

async function insertDeckSections(pageId, sections) {
  let sortOrder = 0;
  for (const section of sections) {
    await client.query(
      `INSERT INTO pseo_deck_sections
        (page_id, title, guidance, goal, sort_order)
       VALUES ($1, $2, $3, $4, $5)`,
      [pageId, section.title, section.guidance ?? null, section.goal ?? null, sortOrder]
    );
    sortOrder += 1;
  }
}

async function insertChecklistItems(pageId, items) {
  let sortOrder = 0;
  for (const item of items) {
    await client.query(
      `INSERT INTO pseo_checklist_items
        (page_id, item, rationale, sort_order)
       VALUES ($1, $2, $3, $4)`,
      [pageId, item.item, item.rationale ?? null, sortOrder]
    );
    sortOrder += 1;
  }
}

async function insertInvestorUpdates(pageId, sections) {
  let sortOrder = 0;
  for (const section of sections) {
    await client.query(
      `INSERT INTO pseo_investor_updates
        (page_id, section, content, sort_order)
       VALUES ($1, $2, $3, $4)`,
      [pageId, section.section, section.content, sortOrder]
    );
    sortOrder += 1;
  }
}

async function run() {
  const configRaw = await fs.readFile(configPath, "utf8");
  const config = JSON.parse(configRaw);
  const seed = await loadSeedData();

  await client.connect();
  console.log(`Loaded ${seed.items.length} seed items.`);
  console.log("Connected to database.");

  try {
    const industryMap = {};
    const stageMap = {};
    const pageTypeMap = {};

    for (const industry of config.industries) {
      industryMap[industry.slug] = await upsertLookup(
        "pseo_industries",
        industry.slug,
        industry.label
      );
    }

    for (const stage of config.stages) {
      stageMap[stage.slug] = await upsertLookup(
        "pseo_stages",
        stage.slug,
        stage.label
      );
    }

    for (const pageType of config.pageTypes) {
      pageTypeMap[pageType.slug] = await upsertLookup(
        "pseo_page_types",
        pageType.slug,
        pageType.label
      );
    }

    console.log("Lookup tables seeded.");

    let processed = 0;
    for (const item of seed.items) {
      const pageId = await upsertPage({
        industryId: industryMap[item.industry],
        stageId: stageMap[item.stage],
        pageTypeId: pageTypeMap[item.pageType],
        slug: item.slug,
        title: item.title,
        summary: item.summary ?? null,
        ctaText: item.ctaText ?? "Create your PitchChat room",
        rawData: item,
      });

      await resetPageChildren(pageId);

      if (item.pageType === "investor-questions") {
        if (item.questions?.length) {
          await insertQuestions(pageId, item.questions);
        }
        if (item.metrics?.length) {
          await insertBenchmarks(pageId, item.metrics);
        }
        if (item.objections?.length) {
          await insertObjections(pageId, item.objections);
        }
      }

      if (item.pageType === "pitch-deck" && item.sections?.length) {
        await insertDeckSections(pageId, item.sections);
      }

      if (item.pageType === "diligence-checklist" && item.items?.length) {
        await insertChecklistItems(pageId, item.items);
      }

      if (item.pageType === "investor-update" && item.sections?.length) {
        await insertInvestorUpdates(pageId, item.sections);
      }

      processed += 1;
      if (processed % 10 === 0 || processed === seed.items.length) {
        console.log(`Seeded ${processed}/${seed.items.length} pages.`);
      }
    }
  } finally {
    await client.end();
  }
}

run()
  .then(() => {
    console.log("pSEO seed complete.");
  })
  .catch((error) => {
    console.error("pSEO seed failed:", error.message);
    process.exitCode = 1;
  });
