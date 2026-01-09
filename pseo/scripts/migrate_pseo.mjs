import { Client } from "pg";

const connectionString =
  process.env.PSEO_DATABASE_URL ?? process.env.DATABASE_URL ?? "";

if (!connectionString) {
  throw new Error("PSEO_DATABASE_URL or DATABASE_URL must be set");
}

const client = new Client({ connectionString });

const statements = [
  `CREATE TABLE IF NOT EXISTS pseo_industries (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `CREATE TABLE IF NOT EXISTS pseo_stages (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(128) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `CREATE TABLE IF NOT EXISTS pseo_page_types (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(128) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `CREATE TABLE IF NOT EXISTS pseo_pages (
    id SERIAL PRIMARY KEY,
    industry_id INTEGER NOT NULL REFERENCES pseo_industries(id),
    stage_id INTEGER NOT NULL REFERENCES pseo_stages(id),
    page_type_id INTEGER NOT NULL REFERENCES pseo_page_types(id),
    slug VARCHAR(256) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    summary TEXT,
    seo_title VARCHAR(200),
    seo_description VARCHAR(320),
    canonical_path VARCHAR(256),
    cta_text VARCHAR(160),
    data_quality_score INTEGER,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    raw_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `CREATE TABLE IF NOT EXISTS pseo_investor_questions (
    id SERIAL PRIMARY KEY,
    page_id INTEGER NOT NULL REFERENCES pseo_pages(id),
    category VARCHAR(120),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  );`,
  `CREATE TABLE IF NOT EXISTS pseo_benchmarks (
    id SERIAL PRIMARY KEY,
    page_id INTEGER NOT NULL REFERENCES pseo_pages(id),
    metric VARCHAR(160) NOT NULL,
    value VARCHAR(160) NOT NULL,
    unit VARCHAR(64),
    source VARCHAR(160),
    notes TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
  );`,
  `CREATE TABLE IF NOT EXISTS pseo_deck_sections (
    id SERIAL PRIMARY KEY,
    page_id INTEGER NOT NULL REFERENCES pseo_pages(id),
    title VARCHAR(160) NOT NULL,
    guidance TEXT,
    goal TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
  );`,
  `CREATE TABLE IF NOT EXISTS pseo_checklist_items (
    id SERIAL PRIMARY KEY,
    page_id INTEGER NOT NULL REFERENCES pseo_pages(id),
    item TEXT NOT NULL,
    rationale TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0
  );`,
  `CREATE TABLE IF NOT EXISTS pseo_investor_updates (
    id SERIAL PRIMARY KEY,
    page_id INTEGER NOT NULL REFERENCES pseo_pages(id),
    section VARCHAR(160) NOT NULL,
    content TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  );`,
  `CREATE TABLE IF NOT EXISTS pseo_objections (
    id SERIAL PRIMARY KEY,
    page_id INTEGER NOT NULL REFERENCES pseo_pages(id),
    objection TEXT NOT NULL,
    response TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  );`,
  `CREATE TABLE IF NOT EXISTS pseo_ugc_submissions (
    id SERIAL PRIMARY KEY,
    industry_slug VARCHAR(64) NOT NULL,
    stage_slug VARCHAR(64) NOT NULL,
    category VARCHAR(120),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    contact_email VARCHAR(200),
    source_url VARCHAR(256),
    consent BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(32) NOT NULL DEFAULT 'pending',
    ip_hash VARCHAR(64),
    user_agent TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`,
  `CREATE INDEX IF NOT EXISTS pseo_pages_industry_idx ON pseo_pages (industry_id);`,
  `CREATE INDEX IF NOT EXISTS pseo_pages_stage_idx ON pseo_pages (stage_id);`,
  `CREATE INDEX IF NOT EXISTS pseo_pages_type_idx ON pseo_pages (page_type_id);`,
  `CREATE INDEX IF NOT EXISTS pseo_ugc_submissions_industry_stage_idx ON pseo_ugc_submissions (industry_slug, stage_slug);`,
  `CREATE INDEX IF NOT EXISTS pseo_ugc_submissions_status_idx ON pseo_ugc_submissions (status);`,
  `CREATE INDEX IF NOT EXISTS pseo_ugc_submissions_ip_hash_idx ON pseo_ugc_submissions (ip_hash);`,
];

async function run() {
  await client.connect();
  try {
    for (const statement of statements) {
      await client.query(statement);
    }
  } finally {
    await client.end();
  }
}

run()
  .then(() => {
    console.log("pSEO migrations applied.");
  })
  .catch((error) => {
    console.error("pSEO migration failed:", error.message);
    process.exitCode = 1;
  });
