# PRD-09: Verification & Final Checklist

**Version:** 1.0
**Status:** Draft
**Author:** Engineering
**Created:** 2026-01-08

---

## 1. Overview

### 1.1 Executive Summary

This PRD defines the final verification steps and comprehensive checklist to ensure all SEO implementations are complete, functional, and properly monitored. This includes search engine verification, schema validation, and ongoing monitoring setup.

### 1.2 Goals

| Goal | Metric | Target |
|------|--------|--------|
| Search engine coverage | Verified properties | Google, Bing |
| Schema validation | Valid schemas | 0 errors |
| Sitemap submission | Indexed URLs | 100% submitted |
| Monitoring | Active dashboards | GSC, GA4, Ahrefs |

---

## 2. Search Engine Verification

### 2.1 Google Search Console (Completed)

**Status:** Already configured

**Verification:**
- [ ] Property verified (pitchchat.ai)
- [ ] pSEO subdomain/path verified if separate
- [ ] User permissions configured
- [ ] Email notifications enabled

**Sitemap Submission:**
- [ ] Main sitemap submitted: `/sitemap.xml`
- [ ] pSEO sitemap submitted: `/investor-questions/sitemap.xml`
- [ ] Sitemap appears in "Sitemaps" report
- [ ] No sitemap errors reported

### 2.2 Bing Webmaster Tools

**Setup Instructions:**

1. Go to https://www.bing.com/webmasters
2. Sign in with Microsoft account (or create one)
3. Add property: `https://pitchchat.ai`
4. Choose verification method:

**Option A: DNS TXT Record (Recommended)**
```
Name: @
Type: TXT
Value: <provided by Bing>
```

**Option B: Meta Tag**
```html
<meta name="msvalidate.01" content="<provided by Bing>" />
```

5. Add to `client/index.html` or DNS
6. Click "Verify"
7. Submit sitemap: `https://pitchchat.ai/sitemap.xml`

**Checklist:**
- [ ] Bing Webmaster account created
- [ ] Property added
- [ ] Verification completed
- [ ] Sitemap submitted
- [ ] No crawl errors

### 2.3 Yandex Webmaster (Optional)

For international coverage:

1. Go to https://webmaster.yandex.com
2. Add site and verify
3. Submit sitemap

---

## 3. Schema Validation

### 3.1 Validation Tools

| Tool | URL | Purpose |
|------|-----|---------|
| Google Rich Results Test | https://search.google.com/test/rich-results | Rich result eligibility |
| Schema.org Validator | https://validator.schema.org | Schema syntax |
| JSON-LD Playground | https://json-ld.org/playground/ | JSON-LD debugging |

### 3.2 Schemas to Validate

**Main App (client/):**
- [ ] SoftwareApplication schema validates
- [ ] No errors in Rich Results Test

**pSEO Layout (all pages):**
- [ ] Organization schema validates
- [ ] Organization @id is consistent

**Per-Page Schemas:**

| Page Type | Schemas to Validate |
|-----------|---------------------|
| investor-questions | BreadcrumbList, Article, FAQPage |
| pitch-deck | BreadcrumbList, Article, HowTo |
| metrics-benchmarks | BreadcrumbList, Article, Dataset |
| diligence-checklist | BreadcrumbList, Article, HowTo |
| investor-update | BreadcrumbList, Article |

### 3.3 Validation Checklist

For each schema type:
- [ ] No errors in Google Rich Results Test
- [ ] No warnings affecting eligibility
- [ ] Correct @context and @type
- [ ] All required properties present
- [ ] URLs are absolute (https://...)
- [ ] No conflicting schema types

---

## 4. Meta Tags Verification

### 4.1 Main App Meta Tags

**Verify in source:**
```bash
curl -s https://pitchchat.ai | grep -E "(og:|twitter:|description)"
```

**Checklist:**
- [ ] `<meta name="description">` present
- [ ] `<meta property="og:title">` present
- [ ] `<meta property="og:description">` present
- [ ] `<meta property="og:image">` present
- [ ] `<meta property="og:url">` present
- [ ] `<meta name="twitter:card">` present
- [ ] `<meta name="twitter:image">` present

### 4.2 pSEO Meta Tags

**Test URL:** `/investor-questions/ai/seed/investor-questions/`

- [ ] Title tag is unique and descriptive
- [ ] Meta description is unique (< 160 chars)
- [ ] OG tags present and correct
- [ ] Twitter Card tags present
- [ ] Canonical URL is correct

### 4.3 Social Preview Testing

**Tools:**
| Platform | Debugger URL |
|----------|--------------|
| Facebook | https://developers.facebook.com/tools/debug/ |
| Twitter | https://cards-dev.twitter.com/validator |
| LinkedIn | https://www.linkedin.com/post-inspector/ |

**Test URLs:**
- [ ] https://pitchchat.ai (main app)
- [ ] /investor-questions/ai/seed/investor-questions/
- [ ] /investor-questions/fintech/series-a/pitch-deck/
- [ ] /investor-questions/healthcare/seed/metrics-benchmarks/

---

## 5. Technical SEO Verification

### 5.1 Robots.txt

**Verify:** `https://pitchchat.ai/robots.txt`

Expected content:
```
User-agent: *
Allow: /
Sitemap: https://pitchchat.ai/sitemap.xml
```

- [ ] robots.txt accessible
- [ ] No critical pages blocked
- [ ] Sitemap URL included

### 5.2 Sitemap.xml

**Verify:** `https://pitchchat.ai/sitemap.xml`

- [ ] Sitemap accessible
- [ ] Valid XML format
- [ ] All 280+ URLs included
- [ ] URLs use absolute paths
- [ ] `<lastmod>` dates present
- [ ] No broken URLs in sitemap

**Validation:**
```bash
# Check sitemap URL count
curl -s https://pitchchat.ai/sitemap.xml | grep -c "<loc>"
```

### 5.3 URL Structure

- [ ] All URLs are lowercase
- [ ] No trailing slashes inconsistency
- [ ] No duplicate content (www vs non-www)
- [ ] HTTPS enforced everywhere
- [ ] No URL parameters causing duplicates

### 5.4 Mobile Friendliness

**Tool:** https://search.google.com/test/mobile-friendly

- [ ] Main app passes mobile-friendly test
- [ ] pSEO pages pass mobile-friendly test
- [ ] No viewport issues
- [ ] Touch targets appropriately sized

---

## 6. Performance Verification

### 6.1 PageSpeed Insights

**Test URLs:**
- https://pitchchat.ai
- /investor-questions/ai/seed/investor-questions/

**Targets:**
| Metric | Mobile Target | Desktop Target |
|--------|---------------|----------------|
| Performance | 80+ | 90+ |
| Accessibility | 90+ | 90+ |
| Best Practices | 90+ | 90+ |
| SEO | 90+ | 90+ |

### 6.2 Core Web Vitals

- [ ] LCP < 2.5s (Good)
- [ ] INP < 200ms (Good)
- [ ] CLS < 0.1 (Good)

---

## 7. Analytics Verification

### 7.1 Google Analytics 4

- [ ] GA4 property configured
- [ ] Tracking code on all pages
- [ ] Page views recording
- [ ] Events recording (CTA clicks, scroll depth)
- [ ] Conversions configured
- [ ] Consent Mode v2 implemented

**Verify in GA4:**
1. Realtime report shows data
2. Events appear in Events report
3. No data collection issues flagged

### 7.2 Search Console Integration

- [ ] GA4 linked to Search Console
- [ ] Search queries visible in GA4

---

## 8. Monitoring Setup

### 8.1 Google Search Console Monitoring

**Weekly Checks:**
- [ ] Coverage report: Check for new errors
- [ ] Performance report: Track impressions/clicks
- [ ] Core Web Vitals: Monitor scores
- [ ] Manual Actions: Ensure none

**Alerts:**
- Enable email notifications for:
  - Coverage issues
  - Manual actions
  - Security issues

### 8.2 Uptime Monitoring

**Recommended:** Pingdom, UptimeRobot, or Better Uptime

- [ ] Monitor: https://pitchchat.ai
- [ ] Monitor: https://pitchchat.ai/investor-questions/
- [ ] Alert threshold: 5 minutes
- [ ] Alert channels: Email, Slack

### 8.3 Rank Tracking (Optional)

**Tools:** Ahrefs, SEMrush, or Moz

**Track Keywords:**
- "AI investor questions"
- "seed pitch deck template"
- "series A metrics benchmarks"
- "startup due diligence checklist"

---

## 9. Final Checklist Summary

### 9.1 Main App (client/)

| Item | Status |
|------|--------|
| Meta description tag | [ ] |
| Open Graph tags | [ ] |
| Twitter Card tags | [ ] |
| Static OG image | [ ] |
| SoftwareApplication schema | [ ] |
| robots.txt | [ ] |

### 9.2 pSEO App (pseo/)

| Item | Status |
|------|--------|
| Organization schema (layout) | [ ] |
| BreadcrumbList schema (pages) | [ ] |
| Article schema (pages) | [ ] |
| FAQPage/HowTo/Dataset schemas | [ ] |
| Dynamic OG images | [ ] |
| Breadcrumb navigation UI | [ ] |
| Header with CTA | [ ] |
| Footer with links | [ ] |
| Internal linking | [ ] |
| 280 pages generated | [ ] |
| Sitemap complete | [ ] |

### 9.3 Search Engines

| Item | Status |
|------|--------|
| Google Search Console verified | [ ] |
| Google sitemap submitted | [ ] |
| Bing Webmaster Tools verified | [ ] |
| Bing sitemap submitted | [ ] |

### 9.4 Analytics

| Item | Status |
|------|--------|
| GA4 tracking | [ ] |
| Scroll depth tracking | [ ] |
| Time on page tracking | [ ] |
| CTA click tracking | [ ] |
| Internal link tracking | [ ] |
| Web Vitals tracking | [ ] |

### 9.5 Performance

| Item | Status |
|------|--------|
| LCP < 2.5s | [ ] |
| INP < 200ms | [ ] |
| CLS < 0.1 | [ ] |
| Mobile-friendly | [ ] |

### 9.6 Social & Backlinks

| Item | Status |
|------|--------|
| Twitter profile created | [ ] |
| LinkedIn page created | [ ] |
| ProductHunt launch prepared | [ ] |
| sameAs in Organization schema | [ ] |

---

## 10. Post-Launch Monitoring Schedule

### 10.1 Daily (First Week)

- Check GA4 Realtime for traffic
- Monitor Search Console for crawl errors
- Respond to social mentions

### 10.2 Weekly

- Review Search Console Coverage report
- Check Core Web Vitals scores
- Review top-performing pages
- Analyze conversion funnel

### 10.3 Monthly

- Full Search Console audit
- Backlink profile review
- Content performance analysis
- Keyword ranking changes
- Competitor analysis

---

## 11. Success Metrics (90-Day Goals)

| Metric | Current | 30-Day | 60-Day | 90-Day |
|--------|---------|--------|--------|--------|
| Indexed Pages | 70 | 150 | 250 | 280 |
| Organic Impressions | Baseline | +50% | +100% | +200% |
| Organic Clicks | Baseline | +50% | +100% | +200% |
| Referring Domains | 0 | 10 | 25 | 50 |
| Avg. Position | Baseline | Improve | Improve | Top 20 |

---

## 12. Troubleshooting

### 12.1 Common Issues

| Issue | Solution |
|-------|----------|
| Pages not indexed | Check robots.txt, submit in GSC |
| Schema errors | Validate with Rich Results Test |
| OG image not showing | Clear cache in social debuggers |
| Slow indexing | Request indexing in GSC, build backlinks |
| CWV failing | Follow PRD-07 optimizations |

### 12.2 Escalation Path

1. Check Search Console for errors
2. Validate schemas with Google tools
3. Test with PageSpeed Insights
4. Review server logs for crawl issues
5. Contact Google support if manual action

---

## 13. Documentation

### 13.1 Files Created

| File | Purpose |
|------|---------|
| PRD-01-main-app-meta-tags.md | Main app meta tags |
| PRD-02-dynamic-og-images.md | OG image generation |
| PRD-03-structured-data.md | JSON-LD schemas |
| PRD-04-analytics-enhancement.md | Analytics tracking |
| PRD-05-internal-linking.md | Navigation & linking |
| PRD-06-content-expansion.md | 70→280 pages |
| PRD-07-core-web-vitals.md | Performance |
| PRD-08-social-backlinks.md | Social & backlinks |
| PRD-09-verification.md | This document |

### 13.2 Reference Links

| Resource | URL |
|----------|-----|
| Google Search Console | https://search.google.com/search-console |
| Bing Webmaster Tools | https://www.bing.com/webmasters |
| Rich Results Test | https://search.google.com/test/rich-results |
| PageSpeed Insights | https://pagespeed.web.dev |
| GA4 | https://analytics.google.com |

---

## 14. Automated Testing Scripts

### 14.1 SEO Validation Script

**File:** `pseo/scripts/validate-seo.ts`

```typescript
import { chromium } from "playwright";
import * as cheerio from "cheerio";

interface SEOValidationResult {
  url: string;
  passed: boolean;
  errors: string[];
  warnings: string[];
  metrics: {
    titleLength: number;
    descriptionLength: number;
    h1Count: number;
    canonicalPresent: boolean;
    ogTagsComplete: boolean;
    twitterTagsComplete: boolean;
    schemaCount: number;
  };
}

const REQUIRED_OG_TAGS = ["og:title", "og:description", "og:image", "og:url", "og:type"];
const REQUIRED_TWITTER_TAGS = ["twitter:card", "twitter:title", "twitter:description", "twitter:image"];

async function validateSEO(url: string): Promise<SEOValidationResult> {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle" });
  const html = await page.content();
  const $ = cheerio.load(html);

  const result: SEOValidationResult = {
    url,
    passed: true,
    errors: [],
    warnings: [],
    metrics: {
      titleLength: 0,
      descriptionLength: 0,
      h1Count: 0,
      canonicalPresent: false,
      ogTagsComplete: false,
      twitterTagsComplete: false,
      schemaCount: 0,
    },
  };

  // Title validation
  const title = $("title").text();
  result.metrics.titleLength = title.length;
  if (!title) {
    result.errors.push("Missing title tag");
    result.passed = false;
  } else if (title.length < 30 || title.length > 60) {
    result.warnings.push(`Title length (${title.length}) outside optimal 30-60 range`);
  }

  // Meta description validation
  const description = $('meta[name="description"]').attr("content") || "";
  result.metrics.descriptionLength = description.length;
  if (!description) {
    result.errors.push("Missing meta description");
    result.passed = false;
  } else if (description.length < 120 || description.length > 160) {
    result.warnings.push(`Description length (${description.length}) outside optimal 120-160 range`);
  }

  // H1 validation
  const h1s = $("h1");
  result.metrics.h1Count = h1s.length;
  if (h1s.length === 0) {
    result.errors.push("Missing H1 tag");
    result.passed = false;
  } else if (h1s.length > 1) {
    result.warnings.push(`Multiple H1 tags found (${h1s.length})`);
  }

  // Canonical validation
  const canonical = $('link[rel="canonical"]').attr("href");
  result.metrics.canonicalPresent = !!canonical;
  if (!canonical) {
    result.errors.push("Missing canonical URL");
    result.passed = false;
  }

  // OG tags validation
  const missingOG = REQUIRED_OG_TAGS.filter(
    (tag) => !$(`meta[property="${tag}"]`).attr("content")
  );
  result.metrics.ogTagsComplete = missingOG.length === 0;
  if (missingOG.length > 0) {
    result.errors.push(`Missing OG tags: ${missingOG.join(", ")}`);
    result.passed = false;
  }

  // Twitter tags validation
  const missingTwitter = REQUIRED_TWITTER_TAGS.filter(
    (tag) => !$(`meta[name="${tag}"]`).attr("content")
  );
  result.metrics.twitterTagsComplete = missingTwitter.length === 0;
  if (missingTwitter.length > 0) {
    result.errors.push(`Missing Twitter tags: ${missingTwitter.join(", ")}`);
    result.passed = false;
  }

  // Schema validation
  const schemas = $('script[type="application/ld+json"]');
  result.metrics.schemaCount = schemas.length;
  schemas.each((_, el) => {
    try {
      JSON.parse($(el).html() || "");
    } catch {
      result.errors.push("Invalid JSON-LD schema");
      result.passed = false;
    }
  });

  await browser.close();
  return result;
}

// Run validation on all pSEO pages
async function validateAllPages() {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  const pages = await fetch(`${baseUrl}/sitemap.xml`)
    .then((r) => r.text())
    .then((xml) => {
      const $ = cheerio.load(xml, { xmlMode: true });
      return $("loc").map((_, el) => $(el).text()).get();
    });

  const results: SEOValidationResult[] = [];

  for (const url of pages) {
    console.log(`Validating: ${url}`);
    const result = await validateSEO(url);
    results.push(result);

    if (!result.passed) {
      console.error(`  FAILED: ${result.errors.join(", ")}`);
    }
    if (result.warnings.length > 0) {
      console.warn(`  Warnings: ${result.warnings.join(", ")}`);
    }
  }

  // Generate report
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log(`\n=== SEO Validation Report ===`);
  console.log(`Total: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  // Write detailed report
  const report = {
    timestamp: new Date().toISOString(),
    summary: { total: results.length, passed, failed },
    results,
  };

  await Bun.write("seo-validation-report.json", JSON.stringify(report, null, 2));

  return failed === 0;
}

validateAllPages().then((success) => {
  process.exit(success ? 0 : 1);
});
```

### 14.2 Schema Validation Script

**File:** `pseo/scripts/validate-schemas.ts`

```typescript
import Ajv from "ajv";
import addFormats from "ajv-formats";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// BreadcrumbList schema
const breadcrumbSchema = {
  type: "object",
  required: ["@context", "@type", "itemListElement"],
  properties: {
    "@context": { const: "https://schema.org" },
    "@type": { const: "BreadcrumbList" },
    itemListElement: {
      type: "array",
      minItems: 1,
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

// FAQPage schema
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
          name: { type: "string", minLength: 10 },
          acceptedAnswer: {
            type: "object",
            required: ["@type", "text"],
            properties: {
              "@type": { const: "Answer" },
              text: { type: "string", minLength: 50 },
            },
          },
        },
      },
    },
  },
};

// Organization schema
const organizationSchema = {
  type: "object",
  required: ["@context", "@type", "@id", "name", "url"],
  properties: {
    "@context": { const: "https://schema.org" },
    "@type": { const: "Organization" },
    "@id": { type: "string", format: "uri" },
    name: { type: "string" },
    url: { type: "string", format: "uri" },
    logo: { type: "string", format: "uri" },
    sameAs: { type: "array", items: { type: "string", format: "uri" } },
  },
};

const schemaValidators: Record<string, ReturnType<typeof ajv.compile>> = {
  BreadcrumbList: ajv.compile(breadcrumbSchema),
  FAQPage: ajv.compile(faqPageSchema),
  Organization: ajv.compile(organizationSchema),
};

export function validateSchema(schema: unknown): { valid: boolean; errors: string[] } {
  if (typeof schema !== "object" || schema === null) {
    return { valid: false, errors: ["Schema is not an object"] };
  }

  const schemaType = (schema as Record<string, unknown>)["@type"];
  if (typeof schemaType !== "string") {
    return { valid: false, errors: ["Missing @type"] };
  }

  const validator = schemaValidators[schemaType];
  if (!validator) {
    return { valid: true, errors: [] }; // Unknown schema types pass
  }

  const valid = validator(schema);
  if (!valid && validator.errors) {
    return {
      valid: false,
      errors: validator.errors.map((e) => `${e.instancePath} ${e.message}`),
    };
  }

  return { valid: true, errors: [] };
}
```

---

## 15. CI/CD Integration

### 15.1 SEO Validation Workflow

**File:** `.github/workflows/seo-validation.yml`

```yaml
name: SEO Validation

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: "0 6 * * *" # Daily at 6am UTC

jobs:
  validate-seo:
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
        working-directory: ./pseo

      - name: Install Playwright
        run: npx playwright install chromium
        working-directory: ./pseo

      - name: Build
        run: npm run build
        working-directory: ./pseo

      - name: Start server
        run: npm run start &
        working-directory: ./pseo
        env:
          PORT: 3000

      - name: Wait for server
        run: npx wait-on http://localhost:3000 --timeout 60000

      - name: Run SEO validation
        run: npx ts-node scripts/validate-seo.ts
        working-directory: ./pseo
        env:
          BASE_URL: http://localhost:3000

      - name: Upload validation report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: seo-validation-report
          path: pseo/seo-validation-report.json

      - name: Post results to PR
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const report = JSON.parse(fs.readFileSync('pseo/seo-validation-report.json'));

            const { summary, results } = report;
            const failed = results.filter(r => !r.passed);

            let body = `## SEO Validation Report\n\n`;
            body += `✅ Passed: ${summary.passed} | ❌ Failed: ${summary.failed}\n\n`;

            if (failed.length > 0) {
              body += `### Failed Pages\n\n`;
              failed.forEach(r => {
                body += `**${r.url}**\n`;
                r.errors.forEach(e => body += `- ❌ ${e}\n`);
                body += `\n`;
              });
            }

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body
            });
```

### 15.2 Schema Validation Job

```yaml
  validate-schemas:
    runs-on: ubuntu-latest
    needs: validate-seo

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      - name: Install dependencies
        run: npm ci
        working-directory: ./pseo

      - name: Validate schemas
        run: npx ts-node scripts/validate-schemas.ts
        working-directory: ./pseo
```

---

## 16. Monitoring Alert Thresholds

### 16.1 Uptime Monitoring (Better Uptime / Pingdom)

| Monitor | URL | Check Interval | Alert Threshold |
|---------|-----|----------------|-----------------|
| Main App | https://pitchchat.ai | 1 min | 2 consecutive failures |
| pSEO Index | https://pitchchat.ai/investor-questions/ | 1 min | 2 consecutive failures |
| OG Image API | https://pitchchat.ai/api/og/ai/seed/investor-questions | 5 min | 3 consecutive failures |
| Sitemap | https://pitchchat.ai/sitemap.xml | 15 min | 2 consecutive failures |

### 16.2 Performance Alerts (via GA4 + Google Alerts)

| Metric | Warning Threshold | Critical Threshold | Check Frequency |
|--------|------------------|-------------------|-----------------|
| LCP (p75) | > 2.0s | > 2.5s | Daily |
| INP (p75) | > 150ms | > 200ms | Daily |
| CLS (p75) | > 0.08 | > 0.1 | Daily |
| Server Error Rate | > 0.5% | > 1% | Hourly |
| 404 Rate | > 2% | > 5% | Hourly |

### 16.3 Search Console Alerts

| Metric | Warning Threshold | Action |
|--------|------------------|--------|
| Coverage Errors | Any increase | Investigate immediately |
| Crawl Errors | > 10 in 24h | Check server logs |
| Mobile Usability | Any issues | Fix within 24h |
| Manual Actions | Any | Immediate escalation |
| Security Issues | Any | Immediate escalation |

### 16.4 Alert Notification Channels

```yaml
# Example: PagerDuty / OpsGenie integration
alerts:
  critical:
    - channel: pagerduty
      escalation_policy: seo_critical
    - channel: slack
      channel: "#alerts-critical"

  warning:
    - channel: slack
      channel: "#alerts-warning"
    - channel: email
      recipients: ["engineering@pitchchat.ai"]

  info:
    - channel: slack
      channel: "#seo-monitoring"
```

---

## 17. Incident Response Procedures

### 17.1 SEO Incident Severity Levels

| Level | Description | Response Time | Examples |
|-------|-------------|---------------|----------|
| P1 | Critical - Site-wide impact | < 15 min | Site down, all pages deindexed |
| P2 | High - Major feature affected | < 1 hour | OG images broken, schema errors |
| P3 | Medium - Limited impact | < 4 hours | Single page 404, minor CWV regression |
| P4 | Low - Cosmetic/minor | < 24 hours | Meta description typo |

### 17.2 Incident Response Runbook

**P1 - Site Down / Deindexed:**

```
1. Acknowledge alert (< 5 min)
2. Check server status (Railway dashboard)
3. Check DNS resolution (dig pitchchat.ai)
4. Check SSL certificate validity
5. Review recent deployments
6. If deployment issue: rollback immediately
7. If infrastructure issue: contact Railway support
8. Update status page
9. Post-incident: Root cause analysis within 24h
```

**P2 - OG Images Not Loading:**

```
1. Verify OG image endpoint responding
   curl -I https://pitchchat.ai/api/og/ai/seed/investor-questions

2. Check Edge function logs (Railway logs)

3. Verify caching headers
   curl -I https://pitchchat.ai/api/og/ai/seed/investor-questions | grep -i cache

4. Test with Facebook Debugger
   https://developers.facebook.com/tools/debug/

5. If cache issue: purge CDN cache
6. If code issue: rollback or hotfix

7. Force social platforms to refetch:
   - Facebook: Use debugger "Scrape Again"
   - Twitter: Wait or contact support
   - LinkedIn: Use Post Inspector
```

**P2 - Schema Validation Errors:**

```
1. Identify affected pages from GSC
2. Run local schema validation
   npx ts-node scripts/validate-schemas.ts

3. Check for recent schema changes in git
   git log --oneline -20 -- "**/schema*" "**/json-ld*"

4. Fix schema in source
5. Deploy fix
6. Revalidate with Rich Results Test
7. Request reindexing in GSC
```

### 17.3 Post-Incident Report Template

```markdown
# Incident Report: [Title]

**Date:** YYYY-MM-DD
**Duration:** HH:MM - HH:MM (X hours)
**Severity:** P1/P2/P3/P4
**Author:** [Name]

## Summary
[1-2 sentence summary of what happened]

## Impact
- Pages affected: [number]
- Users affected: [estimate]
- Traffic impact: [% drop during incident]
- Revenue impact: [if applicable]

## Timeline
- HH:MM - [Event]
- HH:MM - [Event]
- HH:MM - [Resolution]

## Root Cause
[Technical explanation of what caused the incident]

## Resolution
[Steps taken to resolve]

## Lessons Learned
- What went well:
- What could be improved:

## Action Items
- [ ] [Action 1] - Owner: [Name] - Due: [Date]
- [ ] [Action 2] - Owner: [Name] - Due: [Date]
```
