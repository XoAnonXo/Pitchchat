# Raw Data Ingestion

Drop anonymized source files here and run the enrichment script to generate
structured pSEO pages under `pseo/data/source/`.

## Required fields (all page types)
- `industry`: slug (e.g., "ai")
- `stage`: slug (e.g., "seed")
- `pageType`: one of `investor-questions`, `pitch-deck`, `metrics-benchmarks`,
  `diligence-checklist`, `investor-update`

Optional fields:
- `title`: override default title
- `summary`: override generated summary
- `ctaText`: override CTA label
- `sourceId`: anonymized source identifier
- `sourceNotes`: anonymized notes
- `sourceTags`: array of strings

## Page type fields

### investor-questions
- `questions`: [{ question, answer, category? }]
- `objections`: [{ objection, response }]
- `metrics`: [{ label, value, note? }]

### pitch-deck
- `sections`: [{ title, goal?, guidance? }]

### metrics-benchmarks
- `metrics`: [{ label, value, note? }]

### diligence-checklist
- `items`: [{ item, rationale? }]

### investor-update
- `sections`: [{ section, content }]

## Example file
See `example_investor_questions.json` in this folder.
