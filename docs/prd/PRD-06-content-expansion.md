# PRD-06: Content Expansion (70 to 280 Pages)

**Version:** 1.0
**Status:** Draft
**Author:** Engineering
**Created:** 2026-01-08

---

## 1. Overview

### 1.1 Executive Summary

This PRD defines the expansion of pSEO content from 70 pages to 280 pages by adding 7 new industries and 2 new funding stages. Content will be generated using Claude Opus with a writing skill to ensure quality and consistency.

### 1.2 Goals

| Goal | Metric | Target |
|------|--------|--------|
| Page count | Total indexed pages | 280 |
| Keyword coverage | Target keywords covered | 4x current |
| Content quality | AI content score | 90%+ original |
| Generation time | Time to generate all content | < 1 week |

### 1.3 Current State

Current configuration:
- Industries: ai, fintech, saas, healthcare, robotics, blockchain, biotech (7)
- Stages: seed, series-a (2)
- Page Types: investor-questions, pitch-deck, metrics-benchmarks, diligence-checklist, investor-update (5)
- Total: 7 × 2 × 5 = 70 pages

---

## 2. Expansion Plan

### 2.1 New Industries (7 additional)

| Industry Slug | Display Label | Search Volume Priority |
|---------------|---------------|------------------------|
| edtech | EdTech | Medium |
| cleantech | CleanTech | Medium |
| marketplace | Marketplace | High |
| ecommerce | E-Commerce | High |
| cybersecurity | Cybersecurity | Medium |
| gaming | Gaming | Medium |
| proptech | PropTech | Low |

### 2.2 New Stages (2 additional)

| Stage Slug | Display Label | Search Volume Priority |
|------------|---------------|------------------------|
| pre-seed | Pre-Seed | High |
| series-b | Series B | Medium |

### 2.3 Content Prioritization Tiers

Based on keyword research (AI captures 50% of VC funding):

**Tier 1 (Generate First):**
- AI × all 4 stages
- Fintech × all 4 stages
- SaaS × all 4 stages
- Healthcare × all 4 stages

**Tier 2:**
- Marketplace × all 4 stages
- E-Commerce × all 4 stages
- Biotech × all 4 stages
- Robotics × all 4 stages

**Tier 3:**
- EdTech × all 4 stages
- CleanTech × all 4 stages
- Cybersecurity × all 4 stages
- Gaming × all 4 stages

**Tier 4:**
- Blockchain × all 4 stages
- PropTech × all 4 stages

---

## 3. Configuration Changes

### 3.1 Update pilot-config.json

**File:** `pseo/src/data/pilot-config.json`

```json
{
  "industries": [
    "ai",
    "fintech",
    "saas",
    "healthcare",
    "robotics",
    "blockchain",
    "biotech",
    "edtech",
    "cleantech",
    "marketplace",
    "ecommerce",
    "cybersecurity",
    "gaming",
    "proptech"
  ],
  "stages": [
    "pre-seed",
    "seed",
    "series-a",
    "series-b"
  ],
  "pageTypes": [
    "investor-questions",
    "pitch-deck",
    "metrics-benchmarks",
    "diligence-checklist",
    "investor-update"
  ]
}
```

### 3.2 Update labelUtils.ts

**File:** `pseo/src/data/labelUtils.ts`

Add new industry and stage labels:

```typescript
export const INDUSTRY_LABELS: Record<string, string> = {
  ai: "AI",
  fintech: "Fintech",
  saas: "SaaS",
  healthcare: "Healthcare",
  robotics: "Robotics",
  blockchain: "Blockchain",
  biotech: "Biotech",
  edtech: "EdTech",
  cleantech: "CleanTech",
  marketplace: "Marketplace",
  ecommerce: "E-Commerce",
  cybersecurity: "Cybersecurity",
  gaming: "Gaming",
  proptech: "PropTech",
};

export const STAGE_LABELS: Record<string, string> = {
  "pre-seed": "Pre-Seed",
  seed: "Seed",
  "series-a": "Series A",
  "series-b": "Series B",
};
```

---

## 4. Content Generation

### 4.1 Generation Approach

Use Claude Opus with a structured prompt to generate content for each page type:

```typescript
// Content generation prompt template
const generateContentPrompt = (industry: string, stage: string, pageType: string) => `
You are an expert startup advisor and investor relations specialist.

Generate content for a ${labelForPageType(pageType)} page targeting ${labelForIndustry(industry)} startups at ${labelForStage(stage)} stage.

Requirements:
1. Title: Compelling, keyword-rich title
2. Summary: 2-3 sentence overview (150-200 chars)
3. Content: Comprehensive, actionable content appropriate for the page type

Page Type Guidelines:
- investor-questions: 8-12 questions with detailed model answers
- pitch-deck: 10-12 slides with descriptions and tips
- metrics-benchmarks: 6-10 key metrics with benchmark ranges
- diligence-checklist: 15-20 checklist items grouped by category
- investor-update: Template structure with 6-8 sections

Output format: JSON matching the existing schema
`;
```

### 4.2 Content Schema

Each page type has a defined schema in `pseo/src/types/pseo.ts`:

```typescript
interface InvestorQuestionsData {
  title: string;
  summary: string;
  questions: Array<{
    question: string;
    answer: string;
    tips?: string[];
  }>;
}

interface PitchDeckData {
  title: string;
  summary: string;
  slides: Array<{
    title: string;
    description: string;
    tips: string[];
  }>;
}

// Similar for metrics-benchmarks, diligence-checklist, investor-update
```

### 4.3 Generation Script

**New File:** `pseo/scripts/generate-content.ts`

```typescript
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname } from "path";
import { INDUSTRIES, STAGES, PAGE_TYPES } from "../src/data/pilot-config";

const OUTPUT_DIR = "pseo/src/data/generated";
const MAX_RETRIES = 3;
const BASE_DELAY = 2000; // 2 seconds
const MAX_CONCURRENT = 5; // Max concurrent API calls

interface GenerationResult {
  success: boolean;
  filePath: string;
  error?: string;
  retries: number;
}

// Exponential backoff with jitter
function getBackoffDelay(attempt: number): number {
  const exponentialDelay = BASE_DELAY * Math.pow(2, attempt);
  const jitter = Math.random() * 1000;
  return Math.min(exponentialDelay + jitter, 30000); // Cap at 30s
}

async function generateWithRetry(
  industry: string,
  stage: string,
  pageType: string,
  retries = 0
): Promise<GenerationResult> {
  const filePath = `${OUTPUT_DIR}/${industry}/${stage}/${pageType}.json`;

  try {
    const content = await generateWithClaude(industry, stage, pageType);

    // Validate content before writing
    const validationErrors = validateContent(content, pageType);
    if (validationErrors.length > 0) {
      throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
    }

    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, JSON.stringify(content, null, 2));

    return { success: true, filePath, retries };
  } catch (error) {
    if (retries < MAX_RETRIES) {
      const delay = getBackoffDelay(retries);
      console.log(`Retry ${retries + 1}/${MAX_RETRIES} for ${filePath} after ${delay}ms`);
      await sleep(delay);
      return generateWithRetry(industry, stage, pageType, retries + 1);
    }

    return {
      success: false,
      filePath,
      error: error instanceof Error ? error.message : "Unknown error",
      retries,
    };
  }
}

async function generateContent() {
  const results: GenerationResult[] = [];
  const queue: Array<() => Promise<GenerationResult>> = [];

  // Build queue of generation tasks
  for (const industry of INDUSTRIES) {
    for (const stage of STAGES) {
      for (const pageType of PAGE_TYPES) {
        const filePath = `${OUTPUT_DIR}/${industry}/${stage}/${pageType}.json`;

        if (existsSync(filePath)) {
          console.log(`Skipping existing: ${filePath}`);
          continue;
        }

        queue.push(() => generateWithRetry(industry, stage, pageType));
      }
    }
  }

  // Process queue with concurrency limit
  const chunks = [];
  for (let i = 0; i < queue.length; i += MAX_CONCURRENT) {
    chunks.push(queue.slice(i, i + MAX_CONCURRENT));
  }

  for (const chunk of chunks) {
    const chunkResults = await Promise.all(chunk.map((fn) => fn()));
    results.push(...chunkResults);

    // Rate limit between chunks
    await sleep(BASE_DELAY);
  }

  // Report results
  const failures = results.filter((r) => !r.success);
  console.log(`\nGeneration complete: ${results.length - failures.length}/${results.length} succeeded`);

  if (failures.length > 0) {
    console.log("\nFailed generations:");
    failures.forEach((f) => console.log(`  ${f.filePath}: ${f.error}`));
  }

  return results;
}
```

---

## 5. Data Structure

### 5.1 File Organization

```
pseo/src/data/generated/
├── ai/
│   ├── pre-seed/
│   │   ├── investor-questions.json
│   │   ├── pitch-deck.json
│   │   ├── metrics-benchmarks.json
│   │   ├── diligence-checklist.json
│   │   └── investor-update.json
│   ├── seed/
│   ├── series-a/
│   └── series-b/
├── fintech/
│   └── ...
└── ... (12 more industries)
```

### 5.2 Content Loading

**Update:** `pseo/src/lib/content.ts`

```typescript
export async function getPageContent(
  industry: string,
  stage: string,
  pageType: string
) {
  try {
    const content = await import(
      `@/data/generated/${industry}/${stage}/${pageType}.json`
    );
    return content.default;
  } catch (error) {
    console.error(`Content not found: ${industry}/${stage}/${pageType}`);
    return null;
  }
}
```

---

## 6. Quality Assurance

### 6.1 Content Quality Checks

Each generated file should pass:

| Check | Criteria |
|-------|----------|
| Title length | 30-70 characters |
| Summary length | 120-200 characters |
| Question count | 8-12 for investor-questions |
| Answer length | 100-300 words per answer |
| No duplicates | Each question/answer unique |
| Industry relevance | Content specific to industry |
| Stage relevance | Content appropriate for funding stage |

### 6.2 Validation Script

**New File:** `pseo/scripts/validate-content.ts`

```typescript
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// JSON Schema for investor-questions page type
const investorQuestionsSchema = {
  type: "object",
  required: ["title", "summary", "questions"],
  properties: {
    title: { type: "string", minLength: 30, maxLength: 70 },
    summary: { type: "string", minLength: 120, maxLength: 200 },
    questions: {
      type: "array",
      minItems: 8,
      maxItems: 12,
      items: {
        type: "object",
        required: ["question", "answer"],
        properties: {
          question: { type: "string", minLength: 20 },
          answer: { type: "string", minLength: 200, maxLength: 1500 },
          tips: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
};

// JSON Schema for pitch-deck page type
const pitchDeckSchema = {
  type: "object",
  required: ["title", "summary", "slides"],
  properties: {
    title: { type: "string", minLength: 30, maxLength: 70 },
    summary: { type: "string", minLength: 120, maxLength: 200 },
    slides: {
      type: "array",
      minItems: 10,
      maxItems: 12,
      items: {
        type: "object",
        required: ["title", "description", "tips"],
        properties: {
          title: { type: "string", minLength: 5 },
          description: { type: "string", minLength: 50 },
          tips: { type: "array", items: { type: "string" }, minItems: 1 },
        },
      },
    },
  },
};

// Schema map by page type
const schemas: Record<string, object> = {
  "investor-questions": investorQuestionsSchema,
  "pitch-deck": pitchDeckSchema,
  // Add other page type schemas...
};

function validateContent(data: unknown, pageType: string): string[] {
  const errors: string[] = [];
  const schema = schemas[pageType];

  if (!schema) {
    errors.push(`Unknown page type: ${pageType}`);
    return errors;
  }

  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid && validate.errors) {
    validate.errors.forEach((err) => {
      errors.push(`${err.instancePath} ${err.message}`);
    });
  }

  // Additional semantic validation
  if (pageType === "investor-questions" && isInvestorQuestionsData(data)) {
    // Check for duplicate questions
    const questions = data.questions.map((q) => q.question.toLowerCase().trim());
    const uniqueQuestions = new Set(questions);
    if (uniqueQuestions.size !== questions.length) {
      errors.push("Duplicate questions detected");
    }

    // Check for similarity between questions (Jaccard similarity)
    for (let i = 0; i < questions.length; i++) {
      for (let j = i + 1; j < questions.length; j++) {
        const similarity = jaccardSimilarity(questions[i], questions[j]);
        if (similarity > 0.7) {
          errors.push(`Questions ${i + 1} and ${j + 1} are too similar (${Math.round(similarity * 100)}%)`);
        }
      }
    }
  }

  return errors;
}

function jaccardSimilarity(a: string, b: string): number {
  const setA = new Set(a.split(/\s+/));
  const setB = new Set(b.split(/\s+/));
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
}
```

### 6.3 Content Versioning

**File:** `pseo/src/data/content-manifest.json`

Track content versions for cache invalidation and rollback:

```json
{
  "version": "1.0.0",
  "generatedAt": "2026-01-08T00:00:00Z",
  "generator": "claude-opus-4",
  "checksum": "sha256:abc123...",
  "pages": {
    "ai/seed/investor-questions": {
      "version": "1.0.0",
      "generatedAt": "2026-01-08T00:00:00Z",
      "wordCount": 2450,
      "checksum": "sha256:def456..."
    }
  }
}
```

**Manifest Generation:**

```typescript
import { createHash } from "crypto";
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

function generateManifest(contentDir: string): void {
  const manifest = {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    generator: "claude-opus-4",
    checksum: "",
    pages: {} as Record<string, PageManifest>,
  };

  // Walk content directory
  walkDir(contentDir, (filePath, content) => {
    const relativePath = filePath.replace(contentDir + "/", "").replace(".json", "");
    const wordCount = JSON.stringify(content).split(/\s+/).length;

    manifest.pages[relativePath] = {
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      wordCount,
      checksum: createHash("sha256").update(JSON.stringify(content)).digest("hex"),
    };
  });

  // Generate overall checksum
  manifest.checksum = createHash("sha256")
    .update(JSON.stringify(manifest.pages))
    .digest("hex");

  writeFileSync(join(contentDir, "../content-manifest.json"), JSON.stringify(manifest, null, 2));
}
```

---

## 7. Sitemap Updates

### 7.1 Dynamic Sitemap Generation

The existing sitemap generation at `pseo/src/app/sitemap.ts` will automatically include new pages based on `pilot-config.json`.

### 7.2 Expected Sitemap Entries

- 280 content pages
- 14 industry index pages
- 4 stage index pages
- 1 main index page
- **Total: ~300 URLs**

---

## 8. Acceptance Criteria

### 8.1 Configuration
- [ ] pilot-config.json updated with 14 industries and 4 stages
- [ ] labelUtils.ts updated with all new labels
- [ ] No TypeScript errors

### 8.2 Content Generation
- [ ] 280 content JSON files generated
- [ ] All files pass validation checks
- [ ] Content is industry-specific and stage-appropriate
- [ ] No duplicate content across pages

### 8.3 Page Rendering
- [ ] All 280 pages render without errors
- [ ] Pages have correct meta tags
- [ ] Pages have correct JSON-LD schemas
- [ ] Internal links work correctly

### 8.4 Sitemap
- [ ] Sitemap includes all 280+ URLs
- [ ] Sitemap validates at xml-sitemaps.com
- [ ] Sitemap submitted to Google Search Console

---

## 9. Rollout Plan

### 9.1 Phase 1: Tier 1 Content (Week 1)

Generate content for AI, Fintech, SaaS, Healthcare:
- 4 industries × 4 stages × 5 page types = 80 pages
- Deploy and submit to GSC

### 9.2 Phase 2: Tier 2 Content (Week 2)

Generate content for Marketplace, E-Commerce, Biotech, Robotics:
- 4 industries × 4 stages × 5 page types = 80 pages
- Deploy and submit to GSC

### 9.3 Phase 3: Tier 3 Content (Week 3)

Generate content for EdTech, CleanTech, Cybersecurity, Gaming:
- 4 industries × 4 stages × 5 page types = 80 pages
- Deploy and submit to GSC

### 9.4 Phase 4: Tier 4 Content (Week 4)

Generate content for Blockchain, PropTech:
- 2 industries × 4 stages × 5 page types = 40 pages
- Deploy and submit to GSC

---

## 10. Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Claude Opus API | External | Available |
| pilot-config.json | Internal | Exists |
| labelUtils.ts | Internal | Exists |
| Content schemas | Internal | Defined |
| Sitemap generation | Internal | Implemented |

---

## 11. Risk Mitigation

### 11.1 Content Quality Risks

| Risk | Mitigation |
|------|------------|
| Generic content | Include industry-specific prompts with examples |
| Factual errors | Human review of first batch per industry |
| Duplicate phrasing | Validation script to detect similarity |
| Off-topic responses | Strict JSON schema enforcement |

### 11.2 Technical Risks

| Risk | Mitigation |
|------|------------|
| API rate limits | Implement exponential backoff |
| Generation failures | Retry logic with logging |
| Large bundle size | Dynamic imports for content |
| Build time increase | Incremental static regeneration |

---

## 12. Automated Testing & CI Integration

### 12.1 Content Validation Tests (Vitest)

**File:** `pseo/src/__tests__/content-validation.test.ts`

```typescript
import { describe, it, expect, beforeAll } from "vitest";
import { readdirSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const CONTENT_DIR = "src/data/generated";
const INDUSTRIES = [
  "ai", "fintech", "saas", "healthcare", "robotics", "blockchain", "biotech",
  "edtech", "cleantech", "marketplace", "ecommerce", "cybersecurity", "gaming", "proptech"
];
const STAGES = ["pre-seed", "seed", "series-a", "series-b"];
const PAGE_TYPES = [
  "investor-questions", "pitch-deck", "metrics-benchmarks",
  "diligence-checklist", "investor-update"
];

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

describe("Content Validation", () => {
  describe("File Structure", () => {
    it("should have all expected content files", () => {
      const missingFiles: string[] = [];

      for (const industry of INDUSTRIES) {
        for (const stage of STAGES) {
          for (const pageType of PAGE_TYPES) {
            const filePath = join(CONTENT_DIR, industry, stage, `${pageType}.json`);
            if (!existsSync(filePath)) {
              missingFiles.push(filePath);
            }
          }
        }
      }

      expect(missingFiles).toEqual([]);
    });

    it("should have valid JSON in all content files", () => {
      const invalidFiles: string[] = [];

      walkContentDir((filePath) => {
        try {
          const content = readFileSync(filePath, "utf-8");
          JSON.parse(content);
        } catch (error) {
          invalidFiles.push(filePath);
        }
      });

      expect(invalidFiles).toEqual([]);
    });
  });

  describe("Schema Validation", () => {
    const investorQuestionsSchema = {
      type: "object",
      required: ["title", "summary", "questions"],
      properties: {
        title: { type: "string", minLength: 30, maxLength: 70 },
        summary: { type: "string", minLength: 100, maxLength: 250 },
        questions: {
          type: "array",
          minItems: 8,
          maxItems: 12,
          items: {
            type: "object",
            required: ["question", "answer"],
          },
        },
      },
    };

    it("should validate investor-questions content against schema", () => {
      const errors: string[] = [];
      const validate = ajv.compile(investorQuestionsSchema);

      walkContentDir((filePath) => {
        if (filePath.includes("investor-questions.json")) {
          const content = JSON.parse(readFileSync(filePath, "utf-8"));
          if (!validate(content)) {
            errors.push(`${filePath}: ${JSON.stringify(validate.errors)}`);
          }
        }
      });

      expect(errors).toEqual([]);
    });
  });

  describe("Content Quality", () => {
    it("should have no duplicate questions within a file", () => {
      const duplicates: string[] = [];

      walkContentDir((filePath) => {
        if (filePath.includes("investor-questions.json")) {
          const content = JSON.parse(readFileSync(filePath, "utf-8"));
          const questions = content.questions?.map((q: any) =>
            q.question.toLowerCase().trim()
          ) || [];
          const unique = new Set(questions);

          if (unique.size !== questions.length) {
            duplicates.push(filePath);
          }
        }
      });

      expect(duplicates).toEqual([]);
    });

    it("should have industry-specific content", () => {
      const generic: string[] = [];
      const genericPhrases = [
        "your industry",
        "your sector",
        "your market",
        "[industry]",
        "[company]",
      ];

      walkContentDir((filePath) => {
        const content = readFileSync(filePath, "utf-8").toLowerCase();
        for (const phrase of genericPhrases) {
          if (content.includes(phrase)) {
            generic.push(`${filePath}: contains "${phrase}"`);
            break;
          }
        }
      });

      expect(generic).toEqual([]);
    });

    it("should have minimum word count per answer", () => {
      const tooShort: string[] = [];
      const MIN_WORDS = 50;

      walkContentDir((filePath) => {
        if (filePath.includes("investor-questions.json")) {
          const content = JSON.parse(readFileSync(filePath, "utf-8"));
          content.questions?.forEach((q: any, i: number) => {
            const wordCount = q.answer?.split(/\s+/).length || 0;
            if (wordCount < MIN_WORDS) {
              tooShort.push(`${filePath} Q${i + 1}: ${wordCount} words`);
            }
          });
        }
      });

      expect(tooShort).toEqual([]);
    });
  });
});

function walkContentDir(callback: (filePath: string) => void) {
  for (const industry of INDUSTRIES) {
    const industryPath = join(CONTENT_DIR, industry);
    if (!existsSync(industryPath)) continue;

    for (const stage of STAGES) {
      const stagePath = join(industryPath, stage);
      if (!existsSync(stagePath)) continue;

      for (const file of readdirSync(stagePath)) {
        if (file.endsWith(".json")) {
          callback(join(stagePath, file));
        }
      }
    }
  }
}
```

### 12.2 CI Integration (GitHub Actions)

**File:** `.github/workflows/content-generation.yml`

```yaml
name: Content Generation & Validation

on:
  workflow_dispatch:
    inputs:
      tier:
        description: "Content tier to generate (1-4 or all)"
        required: true
        default: "1"
        type: choice
        options:
          - "1"
          - "2"
          - "3"
          - "4"
          - "all"
      dry_run:
        description: "Dry run (validate only, don't commit)"
        required: false
        default: true
        type: boolean
  push:
    paths:
      - "pseo/src/data/generated/**/*.json"
      - "pseo/src/data/pilot-config.json"

env:
  ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

jobs:
  validate-existing:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: pseo/package-lock.json

      - name: Install dependencies
        working-directory: pseo
        run: npm ci

      - name: Validate existing content
        working-directory: pseo
        run: npm run test -- --filter="content-validation"

      - name: Check content manifest
        working-directory: pseo
        run: |
          if [ -f src/data/content-manifest.json ]; then
            node scripts/verify-manifest.js
          fi

  generate-content:
    runs-on: ubuntu-latest
    needs: validate-existing
    if: github.event_name == 'workflow_dispatch'
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        working-directory: pseo
        run: npm ci

      - name: Generate content for tier ${{ inputs.tier }}
        working-directory: pseo
        run: |
          npx ts-node scripts/generate-content.ts --tier=${{ inputs.tier }}

      - name: Validate generated content
        working-directory: pseo
        run: npm run test -- --filter="content-validation"

      - name: Update content manifest
        working-directory: pseo
        run: npx ts-node scripts/generate-manifest.ts

      - name: Check for changes
        id: check-changes
        working-directory: pseo
        run: |
          if git diff --quiet src/data/generated; then
            echo "has_changes=false" >> $GITHUB_OUTPUT
          else
            echo "has_changes=true" >> $GITHUB_OUTPUT
            echo "files_changed=$(git diff --name-only src/data/generated | wc -l)" >> $GITHUB_OUTPUT
          fi

      - name: Commit changes
        if: steps.check-changes.outputs.has_changes == 'true' && inputs.dry_run == false
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git add pseo/src/data/generated pseo/src/data/content-manifest.json
          git commit -m "chore(content): generate tier ${{ inputs.tier }} content

          Generated ${{ steps.check-changes.outputs.files_changed }} content files
          Workflow: ${{ github.run_id }}"

      - name: Push changes
        if: steps.check-changes.outputs.has_changes == 'true' && inputs.dry_run == false
        uses: ad-m/github-push-action@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          branch: ${{ github.ref }}

      - name: Upload generation report
        uses: actions/upload-artifact@v4
        with:
          name: content-generation-report
          path: pseo/logs/generation-*.log
          retention-days: 30

  build-and-test:
    runs-on: ubuntu-latest
    needs: generate-content
    if: always() && needs.generate-content.result != 'cancelled'
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.ref }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        working-directory: pseo
        run: npm ci

      - name: Build Next.js app
        working-directory: pseo
        run: npm run build

      - name: Verify all pages render
        working-directory: pseo
        run: |
          npm run start &
          sleep 10
          node scripts/verify-all-pages.js
```

### 12.3 Content Validation on PR

**File:** `.github/workflows/content-pr-check.yml`

```yaml
name: Content PR Validation

on:
  pull_request:
    paths:
      - "pseo/src/data/generated/**/*.json"
      - "pseo/src/data/pilot-config.json"
      - "pseo/src/data/labelUtils.ts"

jobs:
  validate-content-changes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        working-directory: pseo
        run: npm ci

      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v41
        with:
          files: |
            pseo/src/data/generated/**/*.json

      - name: Validate changed content files
        if: steps.changed-files.outputs.any_changed == 'true'
        working-directory: pseo
        run: |
          echo "Validating changed files:"
          for file in ${{ steps.changed-files.outputs.all_changed_files }}; do
            echo "  - $file"
            npx ts-node scripts/validate-single-content.ts "$file"
          done

      - name: Check for content quality issues
        working-directory: pseo
        run: npm run test -- --filter="content-validation"

      - name: Build test
        working-directory: pseo
        run: npm run build

      - name: Comment PR with validation results
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const validationReport = fs.existsSync('pseo/logs/validation-report.json')
              ? JSON.parse(fs.readFileSync('pseo/logs/validation-report.json', 'utf-8'))
              : { passed: true, issues: [] };

            let body = '## Content Validation Report\n\n';

            if (validationReport.passed) {
              body += '✅ All content validation checks passed!\n\n';
            } else {
              body += '❌ Content validation issues found:\n\n';
              validationReport.issues.forEach(issue => {
                body += `- **${issue.file}**: ${issue.message}\n`;
              });
            }

            body += `\n---\n*Workflow: ${process.env.GITHUB_RUN_ID}*`;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: body
            });
```

### 12.4 Pre-commit Hook

**File:** `pseo/.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Check if any content files are being committed
CONTENT_FILES=$(git diff --cached --name-only | grep "src/data/generated/.*\.json$" || true)

if [ -n "$CONTENT_FILES" ]; then
  echo "Content files detected, running validation..."

  cd pseo

  # Validate each staged content file
  for file in $CONTENT_FILES; do
    echo "Validating: $file"
    npx ts-node scripts/validate-single-content.ts "$file"
    if [ $? -ne 0 ]; then
      echo "❌ Validation failed for $file"
      exit 1
    fi
  done

  # Update manifest if content changed
  echo "Updating content manifest..."
  npx ts-node scripts/generate-manifest.ts
  git add src/data/content-manifest.json

  echo "✅ Content validation passed"
fi
```

### 12.5 Page Render Verification Script

**File:** `pseo/scripts/verify-all-pages.js`

```javascript
#!/usr/bin/env node

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const INDUSTRIES = [
  "ai", "fintech", "saas", "healthcare", "robotics", "blockchain", "biotech",
  "edtech", "cleantech", "marketplace", "ecommerce", "cybersecurity", "gaming", "proptech"
];
const STAGES = ["pre-seed", "seed", "series-a", "series-b"];
const PAGE_TYPES = [
  "investor-questions", "pitch-deck", "metrics-benchmarks",
  "diligence-checklist", "investor-update"
];

async function verifyPage(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    const html = await response.text();

    // Check for critical elements
    const checks = {
      hasTitle: html.includes("<title>") && !html.includes("<title></title>"),
      hasH1: html.includes("<h1"),
      hasContent: html.length > 5000,
      noError: !html.includes("Error:") && !html.includes("not found"),
      hasMetaDescription: html.includes('name="description"'),
      hasOGTags: html.includes('property="og:'),
      hasJsonLd: html.includes("application/ld+json"),
    };

    const failures = Object.entries(checks)
      .filter(([, passed]) => !passed)
      .map(([check]) => check);

    return {
      success: failures.length === 0,
      error: failures.length > 0 ? `Failed checks: ${failures.join(", ")}` : null,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log("Verifying all pSEO pages...\n");

  const results = { passed: 0, failed: 0, errors: [] };
  const total = INDUSTRIES.length * STAGES.length * PAGE_TYPES.length;
  let current = 0;

  for (const industry of INDUSTRIES) {
    for (const stage of STAGES) {
      for (const pageType of PAGE_TYPES) {
        current++;
        const url = `${BASE_URL}/investor-questions/${industry}/${stage}/${pageType}/`;

        process.stdout.write(`\r[${current}/${total}] Verifying pages...`);

        const result = await verifyPage(url);

        if (result.success) {
          results.passed++;
        } else {
          results.failed++;
          results.errors.push({ url, error: result.error });
        }
      }
    }
  }

  console.log(`\n\n✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);

  if (results.errors.length > 0) {
    console.log("\nFailed pages:");
    results.errors.slice(0, 10).forEach(({ url, error }) => {
      console.log(`  - ${url}: ${error}`);
    });
    if (results.errors.length > 10) {
      console.log(`  ... and ${results.errors.length - 10} more`);
    }
    process.exit(1);
  }

  console.log("\n🎉 All pages verified successfully!");
}

main();
```

### 12.6 Single File Validation Script

**File:** `pseo/scripts/validate-single-content.ts`

```typescript
#!/usr/bin/env npx ts-node

import { readFileSync, existsSync } from "fs";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { schemas } from "./content-schemas";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

function validateFile(filePath: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check file exists
  if (!existsSync(filePath)) {
    return { valid: false, errors: [`File not found: ${filePath}`] };
  }

  // Parse JSON
  let content: unknown;
  try {
    content = JSON.parse(readFileSync(filePath, "utf-8"));
  } catch (e) {
    return { valid: false, errors: [`Invalid JSON: ${e}`] };
  }

  // Determine page type from path
  const pageType = filePath.split("/").pop()?.replace(".json", "");
  if (!pageType || !schemas[pageType]) {
    return { valid: false, errors: [`Unknown page type: ${pageType}`] };
  }

  // Schema validation
  const validate = ajv.compile(schemas[pageType]);
  if (!validate(content)) {
    validate.errors?.forEach((err) => {
      errors.push(`Schema: ${err.instancePath} ${err.message}`);
    });
  }

  // Content quality checks
  if (typeof content === "object" && content !== null) {
    const contentStr = JSON.stringify(content).toLowerCase();

    // Check for placeholder text
    const placeholders = ["[todo]", "[placeholder]", "lorem ipsum", "example.com"];
    for (const placeholder of placeholders) {
      if (contentStr.includes(placeholder)) {
        errors.push(`Contains placeholder text: "${placeholder}"`);
      }
    }

    // Check for minimum content length
    if (contentStr.length < 1000) {
      errors.push(`Content too short: ${contentStr.length} chars (min: 1000)`);
    }
  }

  return { valid: errors.length === 0, errors };
}

// CLI entry point
const filePath = process.argv[2];
if (!filePath) {
  console.error("Usage: validate-single-content.ts <file-path>");
  process.exit(1);
}

const result = validateFile(filePath);

if (result.valid) {
  console.log(`✅ ${filePath} is valid`);
  process.exit(0);
} else {
  console.error(`❌ ${filePath} has errors:`);
  result.errors.forEach((err) => console.error(`   - ${err}`));
  process.exit(1);
}
```

---

## 13. Success Metrics

| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Indexed pages | 70 | 280 | GSC Coverage report |
| Organic traffic | Current | 4x | GA4 sessions |
| Keyword rankings | Current | +200 keywords | GSC Performance |
| Avg. page quality | N/A | No manual actions | GSC |

---

## 14. Industry Best Practices (2025)

### 14.1 Programmatic SEO Content Standards

Based on current industry research ([Ahrefs pSEO Guide](https://ahrefs.com/blog/programmatic-seo/), [Google Search Central](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)):

| Best Practice | Implementation | Status |
|---------------|----------------|--------|
| **Unique value per page** | Industry + stage specific content | ✅ Claude Opus generation |
| **Avoid thin content** | Min 1000+ words per page | ✅ Content validation |
| **No duplicate content** | Jaccard similarity < 70% | ✅ Validation script |
| **User intent match** | Content matches search query intent | ✅ Page type templates |
| **E-E-A-T signals** | Expertise in investor relations | ✅ Author attribution |

### 14.2 Next.js pSEO Rendering Strategy

| Strategy | Use Case | Implementation |
|----------|----------|----------------|
| **SSG (Static)** | All 280 pSEO pages | ✅ `generateStaticParams()` |
| **ISR (Incremental)** | Content updates | Consider for future |
| **Dynamic metadata** | Per-page SEO | ✅ `generateMetadata()` |
| **Sitemap** | Search engine discovery | ✅ `app/sitemap.ts` |

**Recommended Next.js patterns:**

```typescript
// Static params for all industry/stage/pageType combinations
export async function generateStaticParams() {
  return INDUSTRIES.flatMap(industry =>
    STAGES.flatMap(stage =>
      PAGE_TYPES.map(pageType => ({
        industry,
        stage,
        pageType,
      }))
    )
  );
}

// Dynamic metadata per page
export async function generateMetadata({ params }): Promise<Metadata> {
  const content = await getPageContent(params);
  return {
    title: content.title,
    description: content.summary,
    openGraph: { ... },
  };
}
```

### 14.3 URL Structure Best Practices

| Best Practice | Implementation | Example |
|---------------|----------------|---------|
| **Descriptive slugs** | Human-readable paths | `/investor-questions/ai/seed/pitch-deck/` |
| **Keyword inclusion** | Target keyword in URL | ✅ "investor-questions" |
| **Lowercase** | Avoid mixed case | ✅ All lowercase |
| **Hyphens** | Word separator | ✅ "series-a" not "seriesA" |
| **Trailing slash** | Consistent (with or without) | ✅ With trailing slash |

### 14.4 Content Quality Signals

**Google's Helpful Content guidelines for pSEO:**

| Signal | How to Achieve | Validation |
|--------|----------------|------------|
| **Original insights** | Industry-specific advice | Content review |
| **Comprehensive coverage** | 8-12 questions per topic | Schema validation |
| **First-hand expertise** | Investor relations domain | Author schema |
| **Satisfying experience** | Answers the query fully | User testing |

### 14.5 Avoiding pSEO Penalties

**Red flags to avoid:**

| Risk | Mitigation | Automated Check |
|------|------------|-----------------|
| **Doorway pages** | Unique value per page | Content similarity < 70% |
| **Thin content** | Minimum word counts | 1000+ words per page |
| **Keyword stuffing** | Natural language | Keyword density < 3% |
| **Hidden text** | Schema matches visible content | E2E test verification |
| **Auto-generated spam** | Human review + Claude quality | Validation scripts |

### 14.6 Content Freshness Strategy

| Signal | Implementation | Frequency |
|--------|----------------|-----------|
| **dateModified** | Update in Article schema | On content update |
| **New content** | Add new industries/stages | Quarterly review |
| **Content refresh** | Update outdated metrics | Every 6 months |
| **Sitemap lastmod** | Accurate last modified dates | Automatic |

### 14.7 Scalability Considerations

For 280+ pages:

| Concern | Solution |
|---------|----------|
| **Build time** | ISR for updates, SSG for initial |
| **Bundle size** | Dynamic imports for content JSON |
| **Sitemap size** | Under 50,000 URLs (current: ~300) |
| **API rate limits** | Exponential backoff in generation |
| **Content storage** | File-based JSON (no DB needed at scale) |

### 14.8 Measuring pSEO Success

| Metric | Timeline | Target |
|--------|----------|--------|
| **Indexation rate** | 2-4 weeks | 90%+ of pages indexed |
| **Impressions** | 1-3 months | Visible for target keywords |
| **Click-through rate** | 3-6 months | 2-5% CTR |
| **Conversions** | 6-12 months | Measurable main app signups |

**GSC monitoring checklist:**

1. [ ] Coverage report: Check for excluded pages
2. [ ] Performance: Track impressions by page group
3. [ ] Core Web Vitals: All pages pass
4. [ ] Mobile usability: No issues
5. [ ] Rich results: Verify eligibility
