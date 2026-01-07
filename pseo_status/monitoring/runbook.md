---
title: "Pitchchat pSEO Monitoring Runbook"
version: "v1"
---

# Pitchchat pSEO Monitoring Runbook

## Weekly checks (30-60 minutes)
1) **GSC coverage**
   - Review "Pages" report.
   - Watch for spikes in "Crawled - currently not indexed".
   - Compare indexed counts vs. sitemap counts.
2) **Sitemaps**
   - Confirm all four sitemaps are fetched without errors:
     - `/sitemap.xml`
     - `/sitemaps/industries`
     - `/sitemaps/stages`
     - `/sitemaps/pages`
3) **CTA performance**
   - Export GA4 Explore for events:
     - `pseo_signup_cta_view`
     - `pseo_signup_cta_click`
   - Run `npm run pseo:cta-report -- --input /path/to/ga4_export.csv`.
   - Flag any segment CTR below 1.5%.
4) **Index velocity**
   - Sample 10 URLs across industries/stages.
   - Check if they are indexed (site: search or GSC URL inspection).
5) **Monitoring summary**
   - Run `npm run pseo:monitoring-summary` after CTA/prune reports.
   - Save the JSON for weekly review.

## Monthly checks (1-2 hours)
1) **Prune report**
   - Export GSC Search Results by page.
   - Run `npm run pseo:prune-report -- --input /path/to/gsc.csv`.
   - Create a "refresh vs remove" list.
2) **Content quality**
   - Run `npm run pseo:quality-check`.
   - Investigate any failing page types.
3) **Authority signals**
   - Ship a data report or press release.
   - Track citations and mentions.
4) **Monitoring summary**
   - Re-run `npm run pseo:monitoring-summary` for the monthly archive.

## Alert thresholds
- GSC "Crawled - currently not indexed" > 20% of indexed pages.
- CTA CTR < 1.5% for any major segment.
- More than 10% of pilot pages with 0 impressions after 30 days.

## Escalation steps
1) Pause publishing for 3-5 days.
2) Prune or refresh low-performing pages.
3) Increase internal linking for orphan pages.
4) Update templates to increase unique content density.
