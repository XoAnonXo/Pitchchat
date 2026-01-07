This folder holds anonymized source JSON files for pSEO ingestion.

Required fields per file:
- industry (slug, e.g. "ai")
- stage (slug, e.g. "seed")
- pageType (slug, e.g. "investor-questions")
- title (string)

Optional fields:
- summary (string)
- ctaText (string)
- questions (array of { category, question, answer })
- metrics (array of { label, value, note })
- objections (array of { objection, response })
- sections (array of { title, guidance, goal } or { section, content })
- items (array of { item, rationale })

Run `npm run pseo:ingest-source` to normalize data into `data/source_normalized.json`,
then `npm run pseo:seed` to load into Postgres.
