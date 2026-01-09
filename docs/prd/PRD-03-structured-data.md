# PRD-03: Enhanced Structured Data

**Version:** 1.0
**Status:** Draft
**Author:** Engineering
**Created:** 2026-01-08

---

## 1. Overview

### 1.1 Executive Summary

This PRD defines the implementation of comprehensive JSON-LD structured data across Pitchchat's pSEO pages. The goal is to maximize rich result eligibility in Google Search and enhance semantic understanding of page content.

### 1.2 Goals

| Goal | Metric | Target |
|------|--------|--------|
| Rich results eligibility | Valid schemas per page | 2+ |
| Search visibility | Rich snippets in SERPs | FAQ, HowTo visible |
| Schema errors | Google Rich Results Test | 0 errors |
| Brand consistency | Organization schema | Sitewide |

### 1.3 Current State

Existing schemas:
- FAQPage (Investor Questions template)
- HowTo (Pitch Deck, Diligence Checklist templates)

Missing schemas:
- Organization (global)
- BreadcrumbList (navigation)
- Article (content pages)
- Dataset (metrics pages)

---

## 2. Schema Types to Implement

### 2.1 Organization Schema (Global)

**Scope:** All pSEO pages via layout.tsx
**Purpose:** Establish brand entity in knowledge graph

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://pitchchat.ai/#organization",
  "name": "Pitchchat",
  "url": "https://pitchchat.ai",
  "logo": {
    "@type": "ImageObject",
    "url": "https://pitchchat.ai/logo.png",
    "width": 400,
    "height": 400
  },
  "description": "AI-powered investor Q&A preparation for founders",
  "sameAs": []
}
```

**Note:** `sameAs` will be populated when social profiles are created (Phase 8).

### 2.2 BreadcrumbList Schema (Per Page)

**Scope:** All content pages
**Purpose:** Enable breadcrumb rich results, improve navigation understanding

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://pitchchat.ai/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Investor Questions",
      "item": "https://pitchchat.ai/investor-questions/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "AI",
      "item": "https://pitchchat.ai/investor-questions/industries/ai/"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Seed",
      "item": "https://pitchchat.ai/investor-questions/stages/seed/"
    },
    {
      "@type": "ListItem",
      "position": 5,
      "name": "Investor Questions"
    }
  ]
}
```

### 2.3 Article Schema (Content Pages)

**Scope:** All 5 page types
**Purpose:** Enhance content understanding, author attribution

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Investor Questions for AI Seed Startups",
  "description": "Comprehensive guide to questions AI founders face when raising seed rounds.",
  "url": "https://pitchchat.ai/investor-questions/ai/seed/investor-questions/",
  "datePublished": "2024-01-01",
  "dateModified": "2026-01-08",
  "author": {
    "@type": "Organization",
    "name": "Pitchchat",
    "url": "https://pitchchat.ai"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Pitchchat",
    "logo": {
      "@type": "ImageObject",
      "url": "https://pitchchat.ai/logo.png"
    }
  },
  "about": [
    { "@type": "Thing", "name": "AI" },
    { "@type": "Thing", "name": "Seed Funding" },
    { "@type": "Thing", "name": "Startup Fundraising" }
  ]
}
```

### 2.4 Dataset Schema (Metrics Benchmarks)

**Scope:** metrics-benchmarks page type only
**Purpose:** Qualify for dataset search features

```json
{
  "@context": "https://schema.org",
  "@type": "Dataset",
  "name": "AI Seed Stage Metrics Benchmarks",
  "description": "Key performance metrics and benchmarks for AI startups at seed stage fundraising.",
  "url": "https://pitchchat.ai/investor-questions/ai/seed/metrics-benchmarks/",
  "license": "https://creativecommons.org/licenses/by-nc/4.0/",
  "creator": {
    "@type": "Organization",
    "name": "Pitchchat",
    "url": "https://pitchchat.ai"
  },
  "keywords": [
    "AI metrics",
    "seed benchmarks",
    "startup funding",
    "investor metrics"
  ]
}
```

---

## 3. Component Architecture

### 3.1 New Components to Create

| Component | Location | Purpose |
|-----------|----------|---------|
| PseoBreadcrumbSchema.tsx | `components/pseo/` | BreadcrumbList JSON-LD |
| PseoArticleSchema.tsx | `components/pseo/` | Article JSON-LD |
| PseoDatasetSchema.tsx | `components/pseo/` | Dataset JSON-LD |

### 3.2 Existing Component to Use

**PseoJsonLd.tsx** - Base component for rendering JSON-LD:

```typescript
export function PseoJsonLd({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### 3.3 Component Usage in Templates

```typescript
// InvestorQuestionsTemplate.tsx
<>
  <PseoBreadcrumbSchema context={data.context} pageTitle={data.title} />
  <PseoArticleSchema
    title={data.title}
    description={data.summary}
    url={pageUrl}
    industry={data.context.industry}
    stage={data.context.stage}
  />
  {/* Existing FAQPage schema */}
  <PseoJsonLd schema={faqSchema} />
</>

// MetricsBenchmarksTemplate.tsx
<>
  <PseoBreadcrumbSchema context={data.context} pageTitle={data.title} />
  <PseoArticleSchema {...props} />
  <PseoDatasetSchema {...props} />
</>
```

---

## 4. Integration Points

### 4.1 layout.tsx (Organization Schema)

Add Organization schema as a global script:

```typescript
// pseo/src/app/layout.tsx
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://pitchchat.ai/#organization",
  name: "Pitchchat",
  url: "https://pitchchat.ai",
  logo: {
    "@type": "ImageObject",
    url: "https://pitchchat.ai/logo.png",
    width: 400,
    height: 400,
  },
  description: "AI-powered investor Q&A preparation for founders",
  sameAs: [],
};

// In the component return:
<head>
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
  />
</head>
```

### 4.2 Template Integration Matrix

| Template | Schemas |
|----------|---------|
| InvestorQuestionsTemplate | BreadcrumbList, Article, FAQPage |
| PitchDeckTemplate | BreadcrumbList, Article, HowTo |
| MetricsBenchmarksTemplate | BreadcrumbList, Article, Dataset |
| DiligenceChecklistTemplate | BreadcrumbList, Article, HowTo |
| InvestorUpdateTemplate | BreadcrumbList, Article |

---

## 5. Acceptance Criteria

### 5.1 Organization Schema
- [ ] Present on all pSEO pages
- [ ] Validates without errors in Rich Results Test
- [ ] Contains correct logo URL

### 5.2 BreadcrumbList Schema
- [ ] Present on all content pages
- [ ] Contains correct hierarchy (Home > Investor Questions > Industry > Stage > Page Type)
- [ ] Last item has no "item" property (current page)
- [ ] All URLs are absolute

### 5.3 Article Schema
- [ ] Present on all content pages
- [ ] Contains datePublished and dateModified
- [ ] Contains author and publisher organizations
- [ ] Contains relevant "about" topics

### 5.4 Dataset Schema
- [ ] Present only on metrics-benchmarks pages
- [ ] Contains appropriate keywords
- [ ] Contains license information

### 5.5 Validation
- [ ] All schemas validate in Google Rich Results Test
- [ ] No errors in Google Search Console rich results report
- [ ] No conflicting schema types

---

## 6. JSON-LD Examples

### 6.1 Full Page Example (Investor Questions)

```html
<!-- Organization (from layout) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://pitchchat.ai/#organization",
  "name": "Pitchchat",
  "url": "https://pitchchat.ai",
  "logo": {"@type": "ImageObject", "url": "https://pitchchat.ai/logo.png"}
}
</script>

<!-- BreadcrumbList -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
</script>

<!-- Article -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Investor Questions for AI Seed Startups",
  ...
}
</script>

<!-- FAQPage (existing) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [...]
}
</script>
```

---

## 7. Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| PseoJsonLd component | Internal | Implemented |
| labelUtils | Internal | Implemented |
| getSiteUrl | Internal | Implemented |
| pseoRoutes | Internal | Implemented |

---

## 8. Testing

### 8.1 Validation Tools

| Tool | Purpose |
|------|---------|
| Google Rich Results Test | Primary validation |
| Schema.org Validator | Secondary validation |
| Google Search Console | Production monitoring |

### 8.2 Test URLs

Test at least one URL per page type:
- `/investor-questions/ai/seed/investor-questions/`
- `/investor-questions/fintech/series-a/pitch-deck/`
- `/investor-questions/healthcare/seed/metrics-benchmarks/`
- `/investor-questions/robotics/seed/diligence-checklist/`
- `/investor-questions/blockchain/series-a/investor-update/`

---

## 9. Schema Validation Rules

### 9.1 JSON Schema for Validation

**File:** `pseo/src/lib/schema-validation.ts`

```typescript
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Organization Schema Validation
const organizationSchema = {
  type: "object",
  required: ["@context", "@type", "@id", "name", "url"],
  properties: {
    "@context": { const: "https://schema.org" },
    "@type": { const: "Organization" },
    "@id": { type: "string", format: "uri" },
    name: { type: "string", minLength: 1 },
    url: { type: "string", format: "uri" },
    logo: {
      type: "object",
      required: ["@type", "url"],
      properties: {
        "@type": { const: "ImageObject" },
        url: { type: "string", format: "uri" },
        width: { type: "integer", minimum: 1 },
        height: { type: "integer", minimum: 1 },
      },
    },
    description: { type: "string" },
    sameAs: { type: "array", items: { type: "string", format: "uri" } },
  },
};

// BreadcrumbList Schema Validation
const breadcrumbListSchema = {
  type: "object",
  required: ["@context", "@type", "itemListElement"],
  properties: {
    "@context": { const: "https://schema.org" },
    "@type": { const: "BreadcrumbList" },
    itemListElement: {
      type: "array",
      minItems: 2,
      items: {
        type: "object",
        required: ["@type", "position", "name"],
        properties: {
          "@type": { const: "ListItem" },
          position: { type: "integer", minimum: 1 },
          name: { type: "string", minLength: 1 },
          item: { type: "string", format: "uri" },
        },
      },
    },
  },
};

// Article Schema Validation
const articleSchema = {
  type: "object",
  required: ["@context", "@type", "headline", "url", "author", "publisher"],
  properties: {
    "@context": { const: "https://schema.org" },
    "@type": { const: "Article" },
    headline: { type: "string", minLength: 1, maxLength: 110 },
    description: { type: "string", maxLength: 300 },
    url: { type: "string", format: "uri" },
    datePublished: { type: "string", format: "date" },
    dateModified: { type: "string", format: "date" },
    author: {
      type: "object",
      required: ["@type", "name"],
      properties: {
        "@type": { enum: ["Organization", "Person"] },
        name: { type: "string", minLength: 1 },
        url: { type: "string", format: "uri" },
      },
    },
    publisher: {
      type: "object",
      required: ["@type", "name"],
      properties: {
        "@type": { const: "Organization" },
        name: { type: "string", minLength: 1 },
        logo: {
          type: "object",
          properties: {
            "@type": { const: "ImageObject" },
            url: { type: "string", format: "uri" },
          },
        },
      },
    },
    about: {
      type: "array",
      items: {
        type: "object",
        required: ["@type", "name"],
        properties: {
          "@type": { const: "Thing" },
          name: { type: "string" },
        },
      },
    },
  },
};

// FAQPage Schema Validation
const faqPageSchema = {
  type: "object",
  required: ["@context", "@type", "mainEntity"],
  properties: {
    "@context": { const: "https://schema.org" },
    "@type": { const: "FAQPage" },
    mainEntity: {
      type: "array",
      minItems: 1,
      items: {
        type: "object",
        required: ["@type", "name", "acceptedAnswer"],
        properties: {
          "@type": { const: "Question" },
          name: { type: "string", minLength: 1 },
          acceptedAnswer: {
            type: "object",
            required: ["@type", "text"],
            properties: {
              "@type": { const: "Answer" },
              text: { type: "string", minLength: 1 },
            },
          },
        },
      },
    },
  },
};

// Dataset Schema Validation
const datasetSchema = {
  type: "object",
  required: ["@context", "@type", "name", "description", "url"],
  properties: {
    "@context": { const: "https://schema.org" },
    "@type": { const: "Dataset" },
    name: { type: "string", minLength: 1 },
    description: { type: "string", minLength: 50 },
    url: { type: "string", format: "uri" },
    license: { type: "string", format: "uri" },
    creator: {
      type: "object",
      required: ["@type", "name"],
    },
    keywords: { type: "array", items: { type: "string" }, minItems: 1 },
  },
};

// Validation functions
export const validateOrganization = ajv.compile(organizationSchema);
export const validateBreadcrumbList = ajv.compile(breadcrumbListSchema);
export const validateArticle = ajv.compile(articleSchema);
export const validateFAQPage = ajv.compile(faqPageSchema);
export const validateDataset = ajv.compile(datasetSchema);

export function validateSchema(
  schema: object,
  type: "Organization" | "BreadcrumbList" | "Article" | "FAQPage" | "Dataset"
): { valid: boolean; errors: string[] } {
  const validators = {
    Organization: validateOrganization,
    BreadcrumbList: validateBreadcrumbList,
    Article: validateArticle,
    FAQPage: validateFAQPage,
    Dataset: validateDataset,
  };

  const validate = validators[type];
  const valid = validate(schema);

  return {
    valid: !!valid,
    errors: validate.errors?.map((e) => `${e.instancePath} ${e.message}`) || [],
  };
}
```

### 9.2 Validation Rules Summary

| Schema Type | Required Fields | Constraints |
|-------------|-----------------|-------------|
| Organization | @context, @type, @id, name, url | @id must be absolute URI with #organization |
| BreadcrumbList | @context, @type, itemListElement | Min 2 items, positions must be sequential |
| Article | @context, @type, headline, url, author, publisher | headline max 110 chars |
| FAQPage | @context, @type, mainEntity | Min 1 question, each needs answer |
| Dataset | @context, @type, name, description, url | description min 50 chars |

---

## 10. Schema Nesting Best Practices

### 10.1 Nesting Rules

**DO:**
- Use `@id` references for shared entities (Organization)
- Keep schemas separate in distinct `<script>` tags
- Use absolute URLs for all `url` and `item` properties

**DON'T:**
- Nest multiple top-level schemas in one object
- Use relative URLs in schemas
- Duplicate Organization data in every Article schema

### 10.2 Referencing Shared Entities

```json
// Organization (defined once in layout)
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://pitchchat.ai/#organization",
  "name": "Pitchchat",
  "url": "https://pitchchat.ai"
}

// Article referencing Organization by @id
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Investor Questions for AI Seed Startups",
  "author": {
    "@id": "https://pitchchat.ai/#organization"
  },
  "publisher": {
    "@id": "https://pitchchat.ai/#organization"
  }
}
```

### 10.3 Multiple Schemas Per Page

**Correct approach - separate script tags:**

```html
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Organization",...}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList",...}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Article",...}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage",...}</script>
```

**Alternative - @graph array (single script):**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "https://pitchchat.ai/#organization", ... },
    { "@type": "BreadcrumbList", ... },
    { "@type": "Article", ... },
    { "@type": "FAQPage", ... }
  ]
}
```

### 10.4 Common Nesting Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Nesting FAQPage inside Article | Invalid structure | Keep separate |
| Missing @context in nested schemas | Won't validate | Always include @context at top level |
| Relative URLs | Google can't resolve | Use absolute URLs |
| Duplicate Organization definitions | Confuses parsers | Use @id reference |

---

## 11. Automated Schema Testing

### 11.1 Build-Time Validation

**File:** `pseo/scripts/validate-schemas.ts`

```typescript
import { chromium } from "playwright";
import { validateSchema } from "../src/lib/schema-validation";

interface SchemaValidationResult {
  url: string;
  schemas: Array<{
    type: string;
    valid: boolean;
    errors: string[];
  }>;
}

async function validatePageSchemas(url: string): Promise<SchemaValidationResult> {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle" });

  const schemas = await page.evaluate(() => {
    const scripts = document.querySelectorAll('script[type="application/ld+json"]');
    return Array.from(scripts).map((script) => {
      try {
        return JSON.parse(script.textContent || "");
      } catch {
        return null;
      }
    }).filter(Boolean);
  });

  await browser.close();

  const results = schemas.map((schema: any) => {
    const type = schema["@type"] || "Unknown";
    const validation = validateSchema(schema, type);
    return {
      type,
      valid: validation.valid,
      errors: validation.errors,
    };
  });

  return { url, schemas: results };
}

// Run validation
async function main() {
  const testUrls = [
    "http://localhost:3000/investor-questions/ai/seed/investor-questions/",
    "http://localhost:3000/investor-questions/fintech/series-a/pitch-deck/",
    "http://localhost:3000/investor-questions/healthcare/seed/metrics-benchmarks/",
  ];

  for (const url of testUrls) {
    const result = await validatePageSchemas(url);
    console.log(`\n${result.url}`);
    result.schemas.forEach((schema) => {
      const status = schema.valid ? "✓" : "✗";
      console.log(`  ${status} ${schema.type}`);
      schema.errors.forEach((err) => console.log(`    - ${err}`));
    });
  }
}

main();
```

### 11.2 CI Integration

```yaml
# .github/workflows/schema-validation.yml
name: Schema Validation

on:
  push:
    paths:
      - "pseo/src/components/pseo/**Schema**.tsx"
      - "pseo/src/lib/schema-validation.ts"

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: cd pseo && npm ci

      - name: Build
        run: cd pseo && npm run build

      - name: Start server
        run: cd pseo && npm start &

      - name: Wait for server
        run: npx wait-on http://localhost:3000

      - name: Validate schemas
        run: cd pseo && npx tsx scripts/validate-schemas.ts
```

---

## 12. Industry Best Practices (2025)

### 12.1 Schema Markup Standards

Based on current industry research ([Schema.org](https://schema.org/), [Google Search Central](https://developers.google.com/search/docs/appearance/structured-data)):

| Best Practice | Implementation | Status |
|---------------|----------------|--------|
| **JSON-LD format** | Use JSON-LD over Microdata/RDFa | ✅ Implemented |
| **Single @context** | One context declaration per script | ✅ Implemented |
| **Absolute URLs** | All item/url properties use absolute URLs | ✅ Implemented |
| **@id references** | Use @id for shared entities (Organization) | ✅ Implemented |
| **Separate scripts** | One schema type per script tag | ✅ Implemented |

### 12.2 SaaS-Specific Schema Recommendations

For B2B SaaS applications like Pitchchat:

| Schema Type | Use Case | Rich Result Eligibility |
|-------------|----------|-------------------------|
| **SoftwareApplication** | Main app pages | App rich results |
| **Organization** | Site-wide identity | Knowledge panel |
| **FAQPage** | Q&A content | FAQ rich snippets |
| **Article** | Blog/content pages | Article rich results |
| **BreadcrumbList** | Navigation | Breadcrumb trail |
| **Dataset** | Metrics/benchmarks | Dataset search |

### 12.3 SEO Impact Statistics

- **40% higher CTR** for pages with rich results vs. standard blue links
- **~30% of Google searches** now trigger rich results
- **Schema markup improves LLM visibility** - AI assistants increasingly rely on structured data to understand and cite content

### 12.4 Common Schema Mistakes to Avoid

| Mistake | Impact | Prevention |
|---------|--------|------------|
| Missing required fields | Schema rejected | JSON Schema validation |
| Relative URLs | Google can't resolve | Use `getSiteUrl()` helper |
| Duplicate @id values | Confuses parsers | Unique IDs per entity |
| Invisible content in schema | Manual action risk | Only schema visible content |
| Nesting incompatible types | Validation failure | Separate script tags |

### 12.5 Schema Testing Workflow

**Pre-deployment checklist:**

1. [ ] Validate with Google Rich Results Test
2. [ ] Check Schema.org Validator for warnings
3. [ ] Verify all URLs resolve (no 404s)
4. [ ] Confirm dateModified is current
5. [ ] Test with multiple page types

**Post-deployment monitoring:**

1. [ ] Monitor GSC Rich Results report weekly
2. [ ] Check for manual actions monthly
3. [ ] Verify rich result appearance in SERPs
4. [ ] Track CTR changes for pages with schema

### 12.6 Future Schema Considerations

| Schema Type | Consideration | Priority |
|-------------|---------------|----------|
| **WebApplication** | When main app has public features | Medium |
| **Course** | If educational content added | Low |
| **VideoObject** | If video content added | Low |
| **Review/Rating** | If user reviews implemented | Medium |
