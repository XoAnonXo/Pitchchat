# CTA Metrics and Reporting

## Success metrics
- CTA view rate: total `pseo_signup_cta_view` events per page.
- CTA click rate (CTR): `pseo_signup_cta_click / pseo_signup_cta_view`.
- Signup rate (when available): signups per CTA click.
- Segment cuts: by `industry`, `stage`, `pageType`, `variant`.

## Event names
- `pseo_signup_cta_view` (fires when CTA is rendered).
- `pseo_signup_cta_click` (fires on CTA click).

## Event parameters used
- `industry`, `stage`, `pageType`
- `variant` (A or B)
- `label` (CTA text)
- `location` (page path)

## GA4 setup notes
- Register custom dimensions for: `industry`, `stage`, `pageType`, `variant`, `label`.
- In GA4 Explore, add these dimensions and export to CSV for reporting.

## Report script
```
cd /Users/mac/.gemini/antigravity/scratch/Pitchchat/pseo
npm run pseo:cta-report -- --input /path/to/ga4_export.csv
```

Output:
- `pseo/data/cta_report.json` with totals and per-segment CTR.
