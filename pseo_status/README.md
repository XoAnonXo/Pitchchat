# Pitchchat pSEO Status

This folder summarizes what has been implemented for the Pitchchat pSEO effort so you can resume later.

## Scope and goals
- Primary conversion: signup.
- Target persona: founders raising Seed or Series A, plus AI-curious founders.
- Primary URL base: `/investor-questions/`.
- Pilot size: 70 pages (7 industries x 2 stages x 5 page types).
- Domain for sitemaps: `https://pitchchat.ai`.

## Pilot configuration
- Industries: aerospace, hardware, robotics, chemistry, finance, blockchain, ai.
- Stages: seed, series-a.
- Page types:
  - investor-questions
  - pitch-deck
  - metrics-benchmarks
  - diligence-checklist
  - investor-update

## Stack
- Next.js App Router with SSG.
- Postgres with Drizzle ORM.
- Internal linking hubs + JSON-LD schema per page type.

## What is implemented
- `pseo` Next.js app under `pseo/` with `/investor-questions/[industry]/[stage]/[pageType]/` routes.
- Five templates:
  - `pseo/src/components/pseo/InvestorQuestionsTemplate.tsx`
  - `pseo/src/components/pseo/PitchDeckTemplate.tsx`
  - `pseo/src/components/pseo/MetricsBenchmarksTemplate.tsx`
  - `pseo/src/components/pseo/DiligenceChecklistTemplate.tsx`
  - `pseo/src/components/pseo/InvestorUpdateTemplate.tsx`
- Internal linking hubs:
  - `/investor-questions/`
  - `/investor-questions/industries/`
  - `/investor-questions/stages/`
- JSON-LD schema per template (FAQPage, HowTo, Dataset, Article).
- GEO tuning: direct-answer lead copy plus at-a-glance <dl> blocks in each template.
- Internal linking expansion: added related combinations and hub links in `PseoInternalLinks`.
- Neighbor mesh: `pseo/src/data/industry-neighbors.json` powers related industry links.
- CTA A/B: `PseoCtaButton` assigns variants A/B, appends utm + cta_variant params, and tracks view/click events.
- CTA metrics: see `pseo_status/cta_metrics.md` for success criteria and reporting.
- Raw ingestion: drop anonymized files into `pseo/data/raw/` and run `npm run pseo:enrich-raw`.
- Conditional visibility: templates now render fallback copy when sections are empty.
- Canonicals/metadata: added canonical alternates + OpenGraph/Twitter metadata for pSEO pages and hubs.
- PR templates: see `pseo_status/pr/press_release_template.md` and `pseo_status/pr/report_outline.md`.
- Monitoring runbook: `pseo_status/monitoring/runbook.md` and `pseo_status/monitoring/checklist.md`.
- Monitoring summary script: `npm run pseo:monitoring-summary` writes `pseo/data/monitoring_summary.json`.
- Remaining work: see `pseo_status/todo.md` and `pseo_status/plan.md`.
- Segmented sitemaps + robots endpoint:
  - `/sitemap.xml`
  - `/sitemaps/industries`
  - `/sitemaps/stages`
  - `/sitemaps/pages`
- Analytics hooks:
  - `pseo/src/components/pseo/PseoCtaButton.tsx`
  - `pseo/src/components/pseo/PseoPageTracker.tsx`
  - `pseo/src/lib/analytics.ts`
- Data ingestion and seeding pipeline:
  - `pseo/scripts/generate_projected_source.mjs`
  - `pseo/scripts/ingest_source.mjs`
  - `pseo/scripts/seed_pseo_db.mjs`
- Quality gate and prune report:
  - `pseo/scripts/quality_check.mjs`
  - `pseo/scripts/prune_report.mjs`

## Data flow
1) Projected data JSONs live in `pseo/data/source/`.
2) `pseo/scripts/ingest_source.mjs` creates `pseo/data/source_normalized.json`.
3) `pseo/scripts/seed_pseo_db.mjs` upserts into Postgres (uses DATABASE_URL).
4) Next.js pages read from DB via `pseo/src/db/queries.ts`.

## Key commands
Run in `pseo/`:
```
npm run pseo:generate-projected
npm run pseo:ingest-source
npm run pseo:quality-check
set -a; source ../.env; set +a; npm run pseo:seed
npm run pseo:validate-sitemaps
```

Prune report (requires GSC export path):
```
npm run pseo:prune-report -- --input /path/to/gsc.csv
```

## Quality gate thresholds (current defaults)
- Summary length >= 80 chars.
- Unique chunk ratio >= 0.30 within each page type.
- Investor questions: >= 10 questions, >= 4 metrics, >= 2 objections.
- Pitch deck: >= 9 sections.
- Metrics benchmarks: >= 4 metrics.
- Diligence checklist: >= 5 items.
- Investor update: >= 6 sections.

## Environment variables
- `DATABASE_URL` or `PSEO_DATABASE_URL` (required for migration and seeding).
- `NEXT_PUBLIC_SITE_URL` (optional; defaults to https://pitchchat.ai).
- `NEXT_PUBLIC_SIGNUP_URL` (optional; used by CTA button).
- `NEXT_PUBLIC_GA_ID` (optional; enables GA4).

## Where to resume
- Plan doc: `docs/pseo_plan.md`.
- Run prune report when GSC export is available (file path needed).
- Swap projected data with anonymized real data in `pseo/data/source/`.
