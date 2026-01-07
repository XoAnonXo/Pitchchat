---
title: "pSEO Remaining TODO"
owner: "Pitchchat"
priority: "Critical -> Low"
---

# Critical
- Ingest real anonymized data (drop JSONs into `pseo/data/raw/`, run `pseo:enrich-raw`, `pseo:ingest-source`, `pseo:quality-check`, `pseo:seed`).
- Export GA4 events CSV (CTA view/click) and run `pseo:cta-report`.
- Export GSC Search Results CSV (by page) and run `pseo:prune-report`.
- Produce refresh list: update vs remove pages based on CTA + prune reports.

# High
- Add LLM enrichment step (optional) to generate unique summaries/insights from raw data.
- Ship first data report/press release using `pseo_status/pr/press_release_template.md`.
- Implement a basic chart block (per template) for visual signals.

# Medium
- Add UGC intake flow to collect anonymized Q&A (simple form + moderation).
- Add batch publishing throttle for scale (e.g., 200-500 pages/week).

# Low
- Evaluate Indexing API usage for time-sensitive pages (optional/grey-hat).
- Add external citation tracking workflow.
