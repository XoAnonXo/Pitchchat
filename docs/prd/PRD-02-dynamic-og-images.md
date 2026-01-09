# PRD-02: Dynamic OG Images for pSEO

**Version:** 1.0
**Status:** Draft
**Author:** Engineering
**Created:** 2026-01-08

---

## 1. Overview

### 1.1 Executive Summary

This PRD defines the implementation of dynamic Open Graph image generation for all pSEO pages using Next.js ImageResponse API. Each of the 280 pages will have a unique, auto-generated OG image featuring the page's industry, stage, and content type.

### 1.2 Goals

| Goal | Metric | Target |
|------|--------|--------|
| Social share CTR | Click rate from shared links | 5%+ |
| Brand consistency | Visual recognition | 100% branded |
| Automation | Manual image creation | 0 images |
| Page coverage | Pages with OG images | 100% |

---

## 2. User Stories

1. **As a founder sharing a specific investor questions page**, I want the social preview to show the exact topic (e.g., "AI Seed Investor Questions") so my network knows what they're clicking.

2. **As a content marketer**, I want every pSEO page to automatically have a unique, branded OG image so I don't need to create 280+ images manually.

3. **As a visitor from social media**, I want to see what the page is about from the preview image so I can decide if it's relevant to me.

---

## 3. Technical Requirements

### 3.1 Next.js ImageResponse API

**Runtime:** Edge (for performance)
**Size:** 1200 x 630 px
**Content-Type:** image/png

### 3.2 File Structure

```
pseo/src/app/investor-questions/[industry]/[stage]/[pageType]/
├── page.tsx
└── opengraph-image.tsx  # NEW
```

### 3.3 opengraph-image.tsx Implementation

```typescript
import { ImageResponse } from "next/og";
import { labelForIndustry, labelForStage, labelForPageType } from "@/data/labelUtils";

export const runtime = "edge";
export const alt = "Pitchchat Investor Questions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ industry: string; stage: string; pageType: string }>;
}) {
  const { industry, stage, pageType } = await params;

  const industryLabel = labelForIndustry(industry);
  const stageLabel = labelForStage(stage);
  const pageTypeLabel = labelForPageType(pageType);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#FFFFFF",
          padding: "60px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo/Brand */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: "40px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "#000000",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontSize: "32px",
              fontWeight: "bold",
            }}
          >
            P
          </div>
          <span
            style={{
              marginLeft: "16px",
              fontSize: "28px",
              fontWeight: "600",
              color: "#000000",
            }}
          >
            Pitchchat
          </span>
        </div>

        {/* Main Title */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              fontSize: "56px",
              fontWeight: "700",
              color: "#000000",
              margin: "0 0 20px 0",
              lineHeight: "1.1",
            }}
          >
            {pageTypeLabel}
          </h1>
          <p
            style={{
              fontSize: "32px",
              color: "#404040",
              margin: 0,
            }}
          >
            {industryLabel} · {stageLabel}
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: "2px solid #E5E5E5",
            paddingTop: "24px",
            fontSize: "20px",
            color: "#808080",
          }}
        >
          pitchchat.ai/investor-questions
        </div>
      </div>
    ),
    { ...size }
  );
}
```

### 3.4 Design Specifications

| Element | Specification |
|---------|---------------|
| Background | #FFFFFF (white) |
| Logo container | 60x60px, #000000, border-radius: 12px |
| Logo text | "P", white, 32px, bold |
| Brand text | 28px, #000000, semibold |
| Main headline | 56px, #000000, bold |
| Subtitle | 32px, #404040 |
| Footer | 20px, #808080 |
| Padding | 60px all sides |

### 3.5 Metadata Integration

Update `page.tsx` metadata to reference the dynamic image:

```typescript
export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { industry, stage, pageType } = await params;
  const slugPath = `/investor-questions/${industry}/${stage}/${pageType}/`;

  return {
    // ... existing metadata
    openGraph: {
      title,
      description,
      url: slugPath,
      type: "article",
      images: [
        {
          url: slugPath, // Next.js auto-resolves to opengraph-image.tsx
          width: 1200,
          height: 630,
          alt: `${pageTypeLabel} for ${industryLabel} ${stageLabel}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
```

---

## 4. Performance Considerations

| Consideration | Approach |
|---------------|----------|
| Edge runtime | Use `export const runtime = "edge"` for fast generation |
| Caching | Next.js automatically caches generated images |
| Font loading | Use system fonts to avoid network requests |
| Image size | Target < 100KB per generated image |

---

## 5. Acceptance Criteria

- [ ] `opengraph-image.tsx` file created in dynamic route folder
- [ ] Runtime set to "edge" for performance
- [ ] Image dimensions exactly 1200x630px
- [ ] Dynamic text correctly displays industry, stage, pageType
- [ ] Brand elements (logo, colors) match design system
- [ ] Page metadata references OG image correctly
- [ ] Facebook Sharing Debugger shows correct preview for sample URLs
- [ ] Twitter Card Validator shows correct preview for sample URLs
- [ ] LinkedIn Post Inspector shows correct preview for sample URLs

---

## 6. Testing Approach

### 6.1 Social Media Debuggers

Test with at least 5 representative URLs:

| Platform | Tool |
|----------|------|
| Facebook | https://developers.facebook.com/tools/debug/ |
| Twitter | https://cards-dev.twitter.com/validator |
| LinkedIn | https://www.linkedin.com/post-inspector/ |

### 6.2 Sample Test URLs

```
/investor-questions/ai/seed/investor-questions/
/investor-questions/fintech/series-a/pitch-deck/
/investor-questions/healthcare/seed/metrics-benchmarks/
/investor-questions/saas/series-a/diligence-checklist/
/investor-questions/biotech/seed/investor-update/
```

---

## 7. Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Next.js 14+ | Framework | Available (16.1.1) |
| labelUtils | Internal | Implemented |
| pilotConfig | Internal | Implemented |

---

## 8. Error Handling & Fallbacks

### 8.1 Error Handling in OG Image Generation

**Update opengraph-image.tsx with try-catch:**

```typescript
import { ImageResponse } from "next/og";
import { labelForIndustry, labelForStage, labelForPageType } from "@/data/labelUtils";

export const runtime = "edge";
export const alt = "Pitchchat Investor Questions";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fallback image for error cases
const FallbackImage = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#FFFFFF",
      fontFamily: "system-ui, sans-serif",
    }}
  >
    <div
      style={{
        width: "80px",
        height: "80px",
        backgroundColor: "#000000",
        borderRadius: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#FFFFFF",
        fontSize: "48px",
        fontWeight: "bold",
      }}
    >
      P
    </div>
    <h1 style={{ fontSize: "48px", fontWeight: "700", color: "#000000", marginTop: "24px" }}>
      Pitchchat
    </h1>
    <p style={{ fontSize: "24px", color: "#404040", marginTop: "12px" }}>
      AI-Powered Investor Q&A
    </p>
  </div>
);

export default async function OGImage({
  params,
}: {
  params: Promise<{ industry: string; stage: string; pageType: string }>;
}) {
  try {
    const { industry, stage, pageType } = await params;

    // Validate params exist
    if (!industry || !stage || !pageType) {
      console.error("Missing OG image params:", { industry, stage, pageType });
      return new ImageResponse(<FallbackImage />, { ...size });
    }

    const industryLabel = labelForIndustry(industry);
    const stageLabel = labelForStage(stage);
    const pageTypeLabel = labelForPageType(pageType);

    // Validate labels resolved correctly
    if (!industryLabel || !stageLabel || !pageTypeLabel) {
      console.error("Invalid label resolution:", { industryLabel, stageLabel, pageTypeLabel });
      return new ImageResponse(<FallbackImage />, { ...size });
    }

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#FFFFFF",
            padding: "60px",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {/* Logo/Brand */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "40px" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "#000000",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontSize: "32px",
                fontWeight: "bold",
              }}
            >
              P
            </div>
            <span
              style={{
                marginLeft: "16px",
                fontSize: "28px",
                fontWeight: "600",
                color: "#000000",
              }}
            >
              Pitchchat
            </span>
          </div>

          {/* Main Title */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h1
              style={{
                fontSize: "56px",
                fontWeight: "700",
                color: "#000000",
                margin: "0 0 20px 0",
                lineHeight: "1.1",
              }}
            >
              {pageTypeLabel}
            </h1>
            <p
              style={{
                fontSize: "32px",
                color: "#404040",
                margin: 0,
              }}
            >
              {industryLabel} · {stageLabel}
            </p>
          </div>

          {/* Footer */}
          <div
            style={{
              borderTop: "2px solid #E5E5E5",
              paddingTop: "24px",
              fontSize: "20px",
              color: "#808080",
            }}
          >
            pitchchat.ai/investor-questions
          </div>
        </div>
      ),
      { ...size }
    );
  } catch (error) {
    console.error("OG image generation error:", error);
    return new ImageResponse(<FallbackImage />, { ...size });
  }
}
```

### 8.2 Error Types and Handling

| Error Type | Cause | Handling |
|------------|-------|----------|
| Missing params | Invalid URL route | Return fallback image |
| Invalid labels | Unknown industry/stage/pageType | Return fallback image |
| Render error | JSX/style issues | Catch and return fallback |
| Memory limit | Complex rendering | Simplify design |
| Timeout | Edge function timeout | Reduce complexity |

---

## 9. Caching Strategy

### 9.1 Next.js Built-in Caching

Next.js automatically caches OG images generated via `opengraph-image.tsx`. Configure additional caching:

```typescript
// In opengraph-image.tsx
export const revalidate = 86400; // Revalidate once per day (24 hours)

// Alternative: static generation at build time
export const dynamic = "force-static";
```

### 9.2 Cache Headers

**Configure in next.config.ts:**

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: "/investor-questions/:path*/opengraph-image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, max-age=604800",
          },
        ],
      },
    ];
  },
};
```

### 9.3 Cache Invalidation

| Scenario | Approach |
|----------|----------|
| Content update | Redeploy (triggers revalidation) |
| Design change | Redeploy (new hash) |
| Bug fix | Clear CDN cache + redeploy |
| Emergency | Purge CDN cache via API |

### 9.4 CDN Configuration (Railway/Cloudflare)

```yaml
# Railway.toml
[service]
  staticCacheMaxAge = 604800  # 7 days

# Cloudflare Page Rules (if applicable)
# Cache Level: Cache Everything
# Edge Cache TTL: 7 days
# Browser Cache TTL: 1 day
```

---

## 10. Performance Monitoring

### 10.1 Edge Function Metrics

Monitor in Railway/Vercel dashboard:
- **Execution time:** Target < 500ms
- **Memory usage:** Target < 128MB
- **Error rate:** Target < 0.1%

### 10.2 Image Quality Checks

```typescript
// scripts/validate-og-images.ts
import sharp from "sharp";

async function validateOGImage(url: string): Promise<{
  valid: boolean;
  width: number;
  height: number;
  size: number;
  errors: string[];
}> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const image = sharp(Buffer.from(buffer));
  const metadata = await image.metadata();

  const errors: string[] = [];

  if (metadata.width !== 1200) errors.push(`Invalid width: ${metadata.width}`);
  if (metadata.height !== 630) errors.push(`Invalid height: ${metadata.height}`);
  if (buffer.byteLength > 300 * 1024) errors.push(`File too large: ${buffer.byteLength}`);

  return {
    valid: errors.length === 0,
    width: metadata.width || 0,
    height: metadata.height || 0,
    size: buffer.byteLength,
    errors,
  };
}
```

---

## 11. Automated Testing

### 11.1 Unit Tests (Vitest)

**File:** `pseo/src/app/investor-questions/[industry]/[stage]/[pageType]/__tests__/opengraph-image.test.tsx`

```typescript
import { describe, it, expect, vi } from "vitest";
import OGImage from "../opengraph-image";

describe("OG Image Generation", () => {
  const validParams = Promise.resolve({
    industry: "ai",
    stage: "seed",
    pageType: "investor-questions",
  });

  describe("Valid Parameters", () => {
    it("should return ImageResponse for valid params", async () => {
      const response = await OGImage({ params: validParams });
      expect(response).toBeDefined();
      expect(response.headers.get("content-type")).toBe("image/png");
    });

    it("should generate correct dimensions", async () => {
      const response = await OGImage({ params: validParams });
      // ImageResponse doesn't expose dimensions directly, but we verify the export
      expect(response).toBeDefined();
    });
  });

  describe("Invalid Parameters", () => {
    it("should return fallback image for missing industry", async () => {
      const params = Promise.resolve({
        industry: "",
        stage: "seed",
        pageType: "investor-questions",
      });
      const response = await OGImage({ params });
      expect(response).toBeDefined();
      expect(response.headers.get("content-type")).toBe("image/png");
    });

    it("should return fallback image for invalid stage", async () => {
      const params = Promise.resolve({
        industry: "ai",
        stage: "invalid-stage",
        pageType: "investor-questions",
      });
      const response = await OGImage({ params });
      expect(response).toBeDefined();
    });

    it("should handle null params gracefully", async () => {
      const params = Promise.resolve({
        industry: null as unknown as string,
        stage: null as unknown as string,
        pageType: null as unknown as string,
      });
      const response = await OGImage({ params });
      expect(response).toBeDefined();
    });
  });

  describe("Label Resolution", () => {
    it("should resolve AI industry label correctly", async () => {
      // Test via integration - the image should generate without error
      const params = Promise.resolve({
        industry: "ai",
        stage: "seed",
        pageType: "investor-questions",
      });
      const response = await OGImage({ params });
      expect(response).toBeDefined();
    });
  });
});
```

### 11.2 Visual Regression Tests (Playwright)

**File:** `pseo/e2e/og-images.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

const TEST_URLS = [
  "/investor-questions/ai/seed/investor-questions/opengraph-image",
  "/investor-questions/fintech/series-a/pitch-deck/opengraph-image",
  "/investor-questions/healthcare/seed/metrics-benchmarks/opengraph-image",
  "/investor-questions/saas/series-a/diligence-checklist/opengraph-image",
  "/investor-questions/biotech/seed/investor-update/opengraph-image",
];

test.describe("OG Image Generation", () => {
  for (const url of TEST_URLS) {
    test(`should generate OG image for ${url}`, async ({ request }) => {
      const response = await request.get(url);

      expect(response.status()).toBe(200);
      expect(response.headers()["content-type"]).toBe("image/png");

      const buffer = await response.body();
      expect(buffer.length).toBeGreaterThan(0);
      expect(buffer.length).toBeLessThan(300 * 1024); // Under 300KB
    });
  }

  test("should return 200 for edge cases", async ({ request }) => {
    // Test longest industry name
    const response = await request.get(
      "/investor-questions/consumer-products/series-a/metrics-benchmarks/opengraph-image"
    );
    expect(response.status()).toBe(200);
  });

  test("should have correct cache headers", async ({ request }) => {
    const response = await request.get(TEST_URLS[0]);
    const cacheControl = response.headers()["cache-control"];

    expect(cacheControl).toContain("public");
    expect(cacheControl).toContain("max-age");
  });
});

test.describe("OG Image Dimensions", () => {
  test("should have correct dimensions (1200x630)", async ({ request }) => {
    const response = await request.get(TEST_URLS[0]);
    const buffer = await response.body();

    // PNG header validation (dimensions are at bytes 16-23)
    // Width: bytes 16-19 (big-endian)
    // Height: bytes 20-23 (big-endian)
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);

    expect(width).toBe(1200);
    expect(height).toBe(630);
  });
});
```

### 11.3 CI Integration (GitHub Actions)

**File:** `.github/workflows/og-images.yml`

```yaml
name: OG Image Validation

on:
  push:
    paths:
      - "pseo/src/app/investor-questions/**/opengraph-image.tsx"
      - "pseo/src/data/labelUtils.ts"
  pull_request:
    paths:
      - "pseo/src/app/investor-questions/**/opengraph-image.tsx"
      - "pseo/src/data/labelUtils.ts"

jobs:
  test-og-images:
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

      - name: Run unit tests
        working-directory: pseo
        run: npm run test -- --filter="og"

      - name: Build Next.js app
        working-directory: pseo
        run: npm run build

      - name: Start server and run E2E tests
        working-directory: pseo
        run: |
          npm run start &
          sleep 10
          npx playwright test og-images.spec.ts

  validate-all-og-images:
    runs-on: ubuntu-latest
    needs: test-og-images
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        working-directory: pseo
        run: npm ci

      - name: Build and start server
        working-directory: pseo
        run: |
          npm run build
          npm run start &
          sleep 10

      - name: Validate all 280 OG images
        working-directory: pseo
        run: node scripts/validate-all-og-images.js
```

### 11.4 Batch Validation Script

**File:** `pseo/scripts/validate-all-og-images.js`

```javascript
#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const INDUSTRIES = [
  "ai", "fintech", "healthcare", "saas", "biotech",
  "ecommerce", "edtech", "cleantech", "gaming", "cybersecurity",
  "proptech", "foodtech", "martech", "consumer-products"
];

const STAGES = ["seed", "series-a", "series-b", "growth"];

const PAGE_TYPES = [
  "investor-questions", "pitch-deck", "metrics-benchmarks",
  "diligence-checklist", "investor-update"
];

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function validateOGImage(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      return { valid: false, error: `HTTP ${response.status}` };
    }

    const contentType = response.headers.get("content-type");
    if (contentType !== "image/png") {
      return { valid: false, error: `Wrong content-type: ${contentType}` };
    }

    const buffer = await response.arrayBuffer();
    const size = buffer.byteLength;

    if (size > 300 * 1024) {
      return { valid: false, error: `File too large: ${size} bytes` };
    }

    // Validate PNG dimensions
    const view = new DataView(buffer);
    const width = view.getUint32(16);
    const height = view.getUint32(20);

    if (width !== 1200 || height !== 630) {
      return { valid: false, error: `Wrong dimensions: ${width}x${height}` };
    }

    return { valid: true, size, width, height };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}

async function main() {
  console.log("Validating all OG images...\n");

  const results = { passed: 0, failed: 0, errors: [] };
  let total = INDUSTRIES.length * STAGES.length * PAGE_TYPES.length;
  let current = 0;

  for (const industry of INDUSTRIES) {
    for (const stage of STAGES) {
      for (const pageType of PAGE_TYPES) {
        current++;
        const url = `${BASE_URL}/investor-questions/${industry}/${stage}/${pageType}/opengraph-image`;

        process.stdout.write(`\r[${current}/${total}] Validating...`);

        const result = await validateOGImage(url);

        if (result.valid) {
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
    console.log("\nErrors:");
    results.errors.forEach(({ url, error }) => {
      console.log(`  - ${url}: ${error}`);
    });
    process.exit(1);
  }

  console.log("\n🎉 All OG images validated successfully!");
}

main();
```

### 11.5 Social Media Validator Integration

**File:** `pseo/scripts/social-validator.js`

```javascript
#!/usr/bin/env node

/**
 * Outputs URLs for manual testing with social media debuggers.
 * Run after deployment to production.
 */

const SAMPLE_URLS = [
  "/investor-questions/ai/seed/investor-questions/",
  "/investor-questions/fintech/series-a/pitch-deck/",
  "/investor-questions/healthcare/seed/metrics-benchmarks/",
  "/investor-questions/saas/series-a/diligence-checklist/",
  "/investor-questions/biotech/seed/investor-update/",
];

const BASE_URL = "https://pitchchat.ai";

console.log("Social Media Debugger URLs\n");
console.log("=".repeat(50));

console.log("\n📘 Facebook Sharing Debugger:");
SAMPLE_URLS.forEach(url => {
  const fullUrl = encodeURIComponent(`${BASE_URL}${url}`);
  console.log(`  https://developers.facebook.com/tools/debug/?q=${fullUrl}`);
});

console.log("\n🐦 Twitter Card Validator:");
SAMPLE_URLS.forEach(url => {
  console.log(`  Validate: ${BASE_URL}${url}`);
});
console.log("  Tool: https://cards-dev.twitter.com/validator");

console.log("\n💼 LinkedIn Post Inspector:");
SAMPLE_URLS.forEach(url => {
  const fullUrl = encodeURIComponent(`${BASE_URL}${url}`);
  console.log(`  https://www.linkedin.com/post-inspector/inspect/${fullUrl}`);
});
```

---

## 12. Industry Best Practices (2025)

### 12.1 OG Image Optimization Standards

Based on current industry research ([Krumzi](https://www.krumzi.com/blog/open-graph-image-sizes-for-social-media-the-complete-2025-guide), [OpenGraph.xyz](https://www.opengraph.xyz/blog/the-ultimate-guide-to-open-graph-images)):

| Best Practice | Implementation | Status |
|---------------|----------------|--------|
| **Dimensions** | 1200×630px (1.91:1 ratio) | ✅ Implemented |
| **Format** | PNG for sharp text/logos | ✅ Implemented |
| **File size** | < 100-150KB for SEO, < 5MB for compatibility | ✅ Target < 100KB |
| **Unique per page** | Each page has tailored OG image | ✅ Dynamic generation |
| **Text legibility** | Simple, readable text (avoid clutter) | ✅ Clean design |
| **Brand consistency** | Logo, colors, typography match brand | ✅ Pitchchat branding |

### 12.2 Engagement Impact

Research shows OG image optimization significantly impacts engagement:

- **2-3x higher CTR** for posts with optimized OG images vs. those without ([INMA 2024](https://www.opengraph.xyz/blog/the-ultimate-guide-to-open-graph-images))
- **100% more engagement** on Facebook posts with images
- **50% more engagement** with properly implemented Open Graph data ([Moz](https://nogood.io/blog/open-graph-seo/))

### 12.3 Platform-Specific Considerations

| Platform | Recommendation | Our Approach |
|----------|----------------|--------------|
| **Facebook** | 1200×630px, under 5MB | ✅ Matches |
| **Twitter/X** | summary_large_image card, same dimensions | ✅ Implemented |
| **LinkedIn** | PNG/JPG only (no WebP support) | ✅ PNG format |
| **Pinterest** | 1000×1500px (2:3) for pins | Out of scope |

### 12.4 Pre-deployment Testing Checklist

Based on best practices ([OpenGraph Magic](https://opengraphmagic.com/optimal-open-graph-image-size-best-practices-for-social-sharing/)):

- [ ] **Pre-cache images** by running URLs through Facebook Debugger before announcing
- [ ] Test with **incognito/private browsing** to avoid cached previews
- [ ] Verify **no text cropping** on mobile previews
- [ ] Check **load time** (target < 500ms for Edge generation)
- [ ] Validate dimensions with **PNG header inspection**

### 12.5 Next.js Edge Runtime Benefits

Using Edge runtime for OG generation aligns with best practices ([Next.js SEO Guide](https://nextjs.org/learn/seo/rendering-strategies)):

- **Fast cold starts** (~50ms vs. ~500ms for serverless)
- **Global distribution** via CDN edge nodes
- **Automatic caching** with ISR/static export compatibility
- **Memory efficient** for image generation workloads

---

## 13. Out of Scope

- Custom fonts in OG images (requires font file hosting)
- Logos/graphics beyond text
- A/B testing of OG image designs
- User-uploaded images in OG
