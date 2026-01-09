# PRD-01: Main App Meta Tags & Static OG Image

**Version:** 1.0
**Status:** Draft
**Author:** Engineering
**Created:** 2026-01-08

---

## 1. Overview

### 1.1 Executive Summary

This PRD defines the implementation of meta tags, Open Graph tags, Twitter Card tags, and static OG image for the main Pitchchat application (`client/`). The goal is to maximize social sharing conversion and establish consistent branding across all sharing surfaces.

### 1.2 Goals

| Goal | Metric | Target |
|------|--------|--------|
| Social share CTR | Link click rate from shares | 3%+ |
| Brand consistency | Visual recognition | 100% branded shares |
| Search snippet quality | Meta description in SERPs | Compelling, action-oriented |

### 1.3 Non-Goals

- Dynamic OG images for main app (static only)
- Multi-language meta tags
- App-specific deep linking meta tags

---

## 2. User Stories

1. **As a founder**, I want my shared Pitchchat link to display professionally on LinkedIn so that investors take my pitch room seriously.

2. **As a user sharing on Twitter**, I want an eye-catching image and clear description so my network understands what Pitchchat does.

3. **As a search engine user**, I want to see a compelling meta description so I can decide if Pitchchat solves my problem.

4. **As the marketing team**, I want consistent branding across all social previews so our brand recognition increases.

---

## 3. Technical Requirements

### 3.1 Meta Tags Specification

**File to modify:** `client/index.html`

**Critical: Tag Ordering in `<head>`**

Tags must be ordered correctly for proper parsing:

```html
<head>
  <!-- 1. Charset (must be first, within first 1024 bytes) -->
  <meta charset="UTF-8">

  <!-- 2. Viewport -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- 3. Title -->
  <title>Pitchchat - AI-Powered Pitch Room Builder</title>

  <!-- 4. Primary Meta Tags -->
  <meta name="description" content="Turn your pitch deck into an AI-powered room that answers investor questions 24/7. Upload documents, get instant answers.">

  <!-- 5. Canonical URL -->
  <link rel="canonical" href="https://pitchchat.ai/">

  <!-- 6. Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://pitchchat.ai/">
  <meta property="og:title" content="Pitchchat - AI-Powered Pitch Room Builder">
  <meta property="og:description" content="Turn your pitch deck into an AI-powered room that answers investor questions 24/7.">
  <meta property="og:image" content="https://pitchchat.ai/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Pitchchat - AI-Powered Pitch Room Builder">
  <meta property="og:site_name" content="Pitchchat">
  <meta property="og:locale" content="en_US">

  <!-- 7. Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="https://pitchchat.ai/">
  <meta name="twitter:title" content="Pitchchat - AI-Powered Pitch Room Builder">
  <meta name="twitter:description" content="Turn your pitch deck into an AI-powered room that answers investor questions 24/7.">
  <meta name="twitter:image" content="https://pitchchat.ai/og-image.png">

  <!-- 8. Favicon and Icons -->
  <link rel="icon" href="/favicon.ico">

  <!-- 9. Structured Data (see section 3.3) -->
</head>
```

### 3.2 Static OG Image Requirements

**File to create:** `client/public/og-image.png`

| Specification | Value |
|---------------|-------|
| Dimensions | 1200 x 630 px |
| Format | PNG |
| Background | #FFFFFF (white) |
| Primary text color | #000000 (black) |
| Font | Inter Tight Bold |
| Max file size | 300KB |

**Design Elements:**
- Pitchchat logo (top-left, 60x60px)
- Main headline: "AI-Powered Pitch Room Builder"
- Subheadline: "Turn your pitch deck into a 24/7 investor Q&A"
- Visual: Abstract representation of chat/Q&A or pitch deck

### 3.3 SoftwareApplication Schema

**Add to `client/index.html`:**

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Pitchchat",
  "description": "Turn your pitch deck into an AI-powered room that answers investor questions 24/7.",
  "url": "https://pitchchat.ai",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "creator": {
    "@type": "Organization",
    "name": "Pitchchat"
  }
}
</script>
```

---

## 4. File Changes Required

| File | Action | Changes |
|------|--------|---------|
| `client/index.html` | Modify | Add meta tags, OG tags, Twitter tags, schema |
| `client/public/og-image.png` | Create | Static 1200x630 OG image |

---

## 5. Acceptance Criteria

- [ ] Meta description tag present with compelling copy (< 160 chars)
- [ ] All OG tags (type, url, title, description, image, image:width, image:height) present
- [ ] All Twitter Card tags (card, url, title, description, image) present
- [ ] OG image file exists at `/og-image.png`
- [ ] OG image dimensions exactly 1200x630px
- [ ] Facebook Sharing Debugger shows correct preview
- [ ] Twitter Card Validator shows correct preview
- [ ] SoftwareApplication schema validates in Rich Results Test

---

## 6. Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Brand guidelines | Design | Available (monochrome, Inter Tight) |
| Logo SVG | Asset | Available at `client/public/logo.svg` |
| Domain access | Infrastructure | Configured |

---

## 7. Out of Scope

- Dynamic OG images based on user content
- Per-room OG images
- A/B testing of OG images
- Video in OG tags

---

## 8. Testing & Verification

### 8.1 Command Line Verification

```bash
# Verify meta tags are rendered correctly
curl -s https://pitchchat.ai/ | grep -E '<meta|<title|og:|twitter:'

# Check OG image accessibility and headers
curl -I https://pitchchat.ai/og-image.png

# Verify Content-Type and caching headers
curl -I https://pitchchat.ai/ | grep -i "content-type\|cache-control"

# Extract all meta tags for review
curl -s https://pitchchat.ai/ | grep -oP '<meta[^>]+>' | head -20
```

### 8.2 Social Platform Debuggers

| Platform | URL | Action |
|----------|-----|--------|
| Facebook | https://developers.facebook.com/tools/debug/ | Enter URL, click "Debug" |
| Twitter | https://cards-dev.twitter.com/validator | Enter URL, click "Preview Card" |
| LinkedIn | https://www.linkedin.com/post-inspector/ | Enter URL, click "Inspect" |

### 8.3 Schema Validation

```bash
# Extract JSON-LD and validate structure
curl -s https://pitchchat.ai/ | grep -oP '<script type="application/ld\+json">[^<]+</script>' | \
  sed 's/<[^>]*>//g' | jq .
```

Validate at: https://search.google.com/test/rich-results

---

## 9. Edge Cases & Error Handling

### 9.1 Edge Cases Matrix

| Scenario | Expected Behavior | Handling |
|----------|-------------------|----------|
| OG image fails to load | Social platforms show fallback | Serve smaller fallback image |
| Title contains special characters | Proper HTML encoding | Use `encodeURIComponent()` |
| Description exceeds 160 chars | Truncation at word boundary | Server-side truncation |
| Canonical URL mismatch | Duplicate content issues | Strict canonical enforcement |
| Schema parsing fails | Silent failure, no rich results | JSON validation before deploy |
| CDN cache stale | Old OG image shown | Cache invalidation on deploy |
| User shares non-existent URL | 404 with basic meta tags | Custom 404 page with meta |
| Bot crawls during deployment | Inconsistent content | Blue-green deployment |

### 9.2 OG Image Error Scenarios

```typescript
// client/src/utils/og-image-fallback.ts

interface OGImageStatus {
  url: string;
  loaded: boolean;
  fallbackUsed: boolean;
  error?: string;
}

export async function verifyOGImage(imageUrl: string): Promise<OGImageStatus> {
  try {
    const response = await fetch(imageUrl, { method: "HEAD" });

    if (!response.ok) {
      return {
        url: imageUrl,
        loaded: false,
        fallbackUsed: true,
        error: `HTTP ${response.status}`,
      };
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.startsWith("image/")) {
      return {
        url: imageUrl,
        loaded: false,
        fallbackUsed: true,
        error: `Invalid content-type: ${contentType}`,
      };
    }

    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 300 * 1024) {
      console.warn(`OG image too large: ${contentLength} bytes`);
    }

    return { url: imageUrl, loaded: true, fallbackUsed: false };
  } catch (error) {
    return {
      url: imageUrl,
      loaded: false,
      fallbackUsed: true,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
```

### 9.3 Meta Tag Encoding

```typescript
// client/src/utils/meta-encoding.ts

export function sanitizeMetaContent(content: string): string {
  return content
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

export function truncateDescription(description: string, maxLength = 160): string {
  if (description.length <= maxLength) return description;

  // Find last space before maxLength to avoid word cutting
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  if (lastSpace > maxLength - 30) {
    return truncated.substring(0, lastSpace) + "...";
  }

  return truncated.substring(0, maxLength - 3) + "...";
}
```

---

## 10. Fallback Handling

### 10.1 OG Image Fallback

If `og-image.png` fails to load, platforms fall back to:
1. First image found on page
2. Default platform placeholder

**Mitigation:**
- Host OG image on CDN with high availability
- Create a smaller fallback image (200KB max)
- Test image loading from multiple regions

### 10.2 Missing Meta Tag Handling

```html
<!-- Fallback title if og:title missing -->
<title>Pitchchat - AI-Powered Pitch Room Builder</title>

<!-- Ensure og:title matches title tag -->
<meta property="og:title" content="Pitchchat - AI-Powered Pitch Room Builder">
```

---

## 11. Security Considerations

### 11.1 Content Security Policy (CSP)

For inline JSON-LD scripts, use hash-based CSP instead of `unsafe-inline`:

**Step 1:** Generate SHA256 hash of the schema script content:

```bash
echo -n '{"@context":"https://schema.org",...}' | openssl dgst -sha256 -binary | base64
```

**Step 2:** Add to CSP header:

```
Content-Security-Policy: script-src 'self' 'sha256-[generated-hash]';
```

**Alternative:** Move JSON-LD to external file:

```html
<script type="application/ld+json" src="/schema/software-application.json"></script>
```

### 11.2 X-Frame-Options

Prevent OG image from being embedded in malicious frames:

```
X-Frame-Options: SAMEORIGIN
```

---

## 12. Rollback Plan

If implementation causes issues:

1. **Immediate:** Revert `client/index.html` to previous version
2. **Monitoring:** Check for 404s on `/og-image.png`
3. **Validation:** Re-test with social debuggers after rollback
4. **Root cause:** Review server logs for errors

---

## 13. Automated Testing

### 13.1 Unit Tests (Vitest)

**File:** `client/src/__tests__/meta-tags.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { readFileSync } from "fs";
import { sanitizeMetaContent, truncateDescription } from "../utils/meta-encoding";

describe("Meta Tags - index.html", () => {
  let dom: JSDOM;

  beforeAll(() => {
    const html = readFileSync("client/index.html", "utf-8");
    dom = new JSDOM(html);
  });

  describe("Required Meta Tags", () => {
    it("should have charset as first meta tag within 1024 bytes", () => {
      const html = dom.window.document.documentElement.outerHTML;
      const charsetIndex = html.indexOf('<meta charset="UTF-8">');
      expect(charsetIndex).toBeLessThan(1024);
    });

    it("should have viewport meta tag", () => {
      const viewport = dom.window.document.querySelector('meta[name="viewport"]');
      expect(viewport).toBeTruthy();
      expect(viewport?.getAttribute("content")).toContain("width=device-width");
    });

    it("should have description under 160 characters", () => {
      const description = dom.window.document.querySelector('meta[name="description"]');
      expect(description).toBeTruthy();
      const content = description?.getAttribute("content") || "";
      expect(content.length).toBeLessThanOrEqual(160);
      expect(content.length).toBeGreaterThan(50);
    });

    it("should have canonical URL", () => {
      const canonical = dom.window.document.querySelector('link[rel="canonical"]');
      expect(canonical).toBeTruthy();
      expect(canonical?.getAttribute("href")).toBe("https://pitchchat.ai/");
    });
  });

  describe("Open Graph Tags", () => {
    it("should have all required OG tags", () => {
      const requiredOgTags = [
        "og:type",
        "og:url",
        "og:title",
        "og:description",
        "og:image",
        "og:image:width",
        "og:image:height",
      ];

      requiredOgTags.forEach((tag) => {
        const element = dom.window.document.querySelector(`meta[property="${tag}"]`);
        expect(element, `Missing ${tag}`).toBeTruthy();
        expect(element?.getAttribute("content")).toBeTruthy();
      });
    });

    it("should have correct OG image dimensions", () => {
      const width = dom.window.document.querySelector('meta[property="og:image:width"]');
      const height = dom.window.document.querySelector('meta[property="og:image:height"]');
      expect(width?.getAttribute("content")).toBe("1200");
      expect(height?.getAttribute("content")).toBe("630");
    });

    it("should have OG image URL with correct format", () => {
      const image = dom.window.document.querySelector('meta[property="og:image"]');
      const imageUrl = image?.getAttribute("content") || "";
      expect(imageUrl).toMatch(/^https:\/\/.+\.(png|jpg|jpeg)$/);
    });
  });

  describe("Twitter Card Tags", () => {
    it("should have summary_large_image card type", () => {
      const card = dom.window.document.querySelector('meta[name="twitter:card"]');
      expect(card?.getAttribute("content")).toBe("summary_large_image");
    });

    it("should have all required Twitter tags", () => {
      const requiredTags = ["twitter:card", "twitter:title", "twitter:description", "twitter:image"];

      requiredTags.forEach((tag) => {
        const element = dom.window.document.querySelector(`meta[name="${tag}"]`);
        expect(element, `Missing ${tag}`).toBeTruthy();
      });
    });
  });

  describe("JSON-LD Schema", () => {
    it("should have valid SoftwareApplication schema", () => {
      const script = dom.window.document.querySelector('script[type="application/ld+json"]');
      expect(script).toBeTruthy();

      const schema = JSON.parse(script?.textContent || "{}");
      expect(schema["@context"]).toBe("https://schema.org");
      expect(schema["@type"]).toBe("SoftwareApplication");
      expect(schema.name).toBe("Pitchchat");
      expect(schema.applicationCategory).toBe("BusinessApplication");
    });
  });
});

describe("Meta Encoding Utilities", () => {
  describe("sanitizeMetaContent", () => {
    it("should encode HTML entities", () => {
      expect(sanitizeMetaContent('Test & "quotes"')).toBe("Test &amp; &quot;quotes&quot;");
      expect(sanitizeMetaContent("<script>")).toBe("&lt;script&gt;");
    });

    it("should trim whitespace", () => {
      expect(sanitizeMetaContent("  test  ")).toBe("test");
    });
  });

  describe("truncateDescription", () => {
    it("should not truncate short descriptions", () => {
      expect(truncateDescription("Short description")).toBe("Short description");
    });

    it("should truncate at word boundary", () => {
      const longText = "This is a very long description that exceeds the maximum allowed length for meta descriptions and should be truncated at an appropriate word boundary.";
      const result = truncateDescription(longText, 80);
      expect(result.length).toBeLessThanOrEqual(83); // 80 + "..."
      expect(result).toEndWith("...");
    });
  });
});
```

### 13.2 OG Image Validation Test

**File:** `client/src/__tests__/og-image.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import { existsSync, statSync } from "fs";
import sharp from "sharp";

describe("Static OG Image", () => {
  const ogImagePath = "client/public/og-image.png";

  it("should exist at correct path", () => {
    expect(existsSync(ogImagePath)).toBe(true);
  });

  it("should be exactly 1200x630 pixels", async () => {
    const metadata = await sharp(ogImagePath).metadata();
    expect(metadata.width).toBe(1200);
    expect(metadata.height).toBe(630);
  });

  it("should be under 300KB", () => {
    const stats = statSync(ogImagePath);
    expect(stats.size).toBeLessThan(300 * 1024);
  });

  it("should be PNG format", async () => {
    const metadata = await sharp(ogImagePath).metadata();
    expect(metadata.format).toBe("png");
  });
});
```

### 13.3 E2E Tests (Playwright)

**File:** `client/e2e/meta-tags.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Meta Tags E2E", () => {
  test("homepage has correct meta tags", async ({ page }) => {
    await page.goto("/");

    // Check title
    await expect(page).toHaveTitle(/Pitchchat/);

    // Check OG tags via page.evaluate
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute("content");
    expect(ogTitle).toContain("Pitchchat");

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(ogImage).toMatch(/og-image\.png$/);
  });

  test("OG image returns 200 and correct headers", async ({ request }) => {
    const response = await request.get("/og-image.png");
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("image/png");
  });
});
```

### 13.4 CI Integration (GitHub Actions)

**File:** `.github/workflows/meta-tags.yml`

```yaml
name: Meta Tags Validation

on:
  push:
    paths:
      - "client/index.html"
      - "client/public/og-image.png"
  pull_request:
    paths:
      - "client/index.html"
      - "client/public/og-image.png"

jobs:
  validate-meta-tags:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run meta tag unit tests
        run: npm run test -- --filter="meta-tags"

      - name: Validate OG image dimensions
        run: |
          npm install sharp
          node -e "
            const sharp = require('sharp');
            sharp('client/public/og-image.png')
              .metadata()
              .then(m => {
                if (m.width !== 1200 || m.height !== 630) {
                  console.error('Invalid dimensions:', m.width, 'x', m.height);
                  process.exit(1);
                }
                if (m.size > 300 * 1024) {
                  console.error('File too large:', m.size, 'bytes');
                  process.exit(1);
                }
                console.log('OG image valid:', m.width, 'x', m.height, '-', m.size, 'bytes');
              });
          "

      - name: Validate JSON-LD schema
        run: |
          node -e "
            const fs = require('fs');
            const html = fs.readFileSync('client/index.html', 'utf-8');
            const match = html.match(/<script type=\"application\/ld\+json\">([^<]+)<\/script>/);
            if (!match) {
              console.error('No JSON-LD found');
              process.exit(1);
            }
            const schema = JSON.parse(match[1]);
            if (schema['@type'] !== 'SoftwareApplication') {
              console.error('Invalid schema type');
              process.exit(1);
            }
            console.log('JSON-LD schema valid');
          "

  lighthouse-meta:
    runs-on: ubuntu-latest
    needs: validate-meta-tags
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Run Lighthouse SEO audit
        uses: treosh/lighthouse-ci-action@v10
        with:
          configPath: "./lighthouserc.json"
          uploadArtifacts: true
```

### 13.5 Lighthouse Configuration

**File:** `lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run start",
      "url": ["http://localhost:3000/"],
      "numberOfRuns": 1
    },
    "assert": {
      "assertions": {
        "categories:seo": ["error", { "minScore": 0.9 }],
        "meta-description": "error",
        "document-title": "error",
        "image-alt": "error"
      }
    }
  }
}
```
