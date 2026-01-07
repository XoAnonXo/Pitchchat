---
title: "pSEO Finish Plan"
version: "v1"
---

# Plan (finish mode)

## Phase 1: Real data + health checks (Week 1)
- Collect anonymized source JSONs and drop into `pseo/data/raw/`.
- Run:
  - `npm run pseo:enrich-raw`
  - `npm run pseo:ingest-source`
  - `npm run pseo:quality-check`
  - `npm run pseo:seed`
- Validate sitemaps with `npm run pseo:validate-sitemaps`.

## Phase 2: Performance reports (Week 1)
- Export GA4 events CSV for `pseo_signup_cta_view` and `pseo_signup_cta_click`.
- Export GSC Search Results CSV by page.
- Run:
  - `npm run pseo:cta-report -- --input /path/to/ga4_export.csv`
  - `npm run pseo:prune-report -- --input /path/to/gsc.csv`
  - `npm run pseo:monitoring-summary`

## Phase 3: Refresh + prune (Week 2)
- Create refresh list (update vs remove).
- Update raw data where possible; remove stale/zero-performance pages.
- Re-run `pseo:enrich-raw`, `pseo:ingest-source`, `pseo:quality-check`, `pseo:seed`.

## Phase 4: Authority push (Week 2)
- Fill `pseo_status/pr/press_release_template.md` and publish.
- Convert into a report using `pseo_status/pr/report_outline.md`.
- Track mentions/citations.

## Phase 5: Scale (Week 3+)
- Add new industries or page types only after health checks.
- Maintain weekly monitoring cadence from `pseo_status/monitoring/runbook.md`.
