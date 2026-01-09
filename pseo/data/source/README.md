This folder holds editorial or anonymized source JSON files for pSEO ingestion.

Required fields per file:
- industry (slug, e.g. "ai")
- stage (slug, e.g. "seed")
- pageType (slug, e.g. "investor-questions")
- title (string)
- dataOrigin (e.g. "anonymized", "ugc", "survey")

Optional fields:
- summary (string)
- ctaText (string)
- questions (array of { category, question, answer })
- metrics (array of { label, value, note, source, unit? })
- objections (array of { objection, response })
- sections (array of { title, guidance, goal } or { section, content })
- items (array of { item, rationale })
- sourceId (anonymized identifier)
- sourceNotes (anonymized notes)
- sourceTags (array of strings)

Projected placeholder data should live under `pseo/data/projected/` and is not
intended for production ingestion. Editorial files should use `dataOrigin: "editorial"`.

Run `npm run pseo:ingest-source` to normalize data into `data/source_normalized.json`,
then `npm run pseo:seed` to load into Postgres.
