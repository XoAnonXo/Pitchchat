Projected (placeholder) data for local development only.

Do not ship this content to production. To use projected data locally:
- Run `npm run pseo:generate-projected` to populate this folder.
- Set `PSEO_ALLOW_SEED_FALLBACK=true` and `PSEO_ALLOW_PROJECTED=true` before seeding.

Real/anonymized data should live in `pseo/data/raw/` and be enriched into
`pseo/data/source/` via `npm run pseo:enrich-raw`.
