# PRD-08: Social Media & Backlinks Strategy

**Version:** 1.0
**Status:** Draft
**Author:** Engineering
**Created:** 2026-01-08

---

## 1. Overview

### 1.1 Executive Summary

This PRD defines the social media presence setup and backlinks acquisition strategy for Pitchchat. The goal is to build brand visibility, acquire high-quality backlinks, and drive referral traffic to both the main app and pSEO pages.

### 1.2 Goals

| Goal | Metric | Target |
|------|--------|--------|
| Social presence | Active profiles | Twitter, LinkedIn |
| Backlinks | Referring domains | 50+ in 6 months |
| Referral traffic | Sessions from social/referral | 1,000/month |
| Brand mentions | Unlinked brand mentions | Convert to links |

### 1.3 Current State

- No social media profiles created yet
- No ProductHunt or HackerNews launch completed
- Domain authority baseline to be measured

---

## 2. Social Media Setup

### 2.1 Twitter/X Profile

**Handle:** @pitchchat (or @pitchchatai if unavailable)

**Profile Elements:**
| Element | Content |
|---------|---------|
| Display Name | Pitchchat |
| Bio | AI-powered pitch rooms that answer investor questions 24/7. Turn your pitch deck into a Q&A machine. |
| Location | San Francisco, CA (or "The Internet") |
| Website | https://pitchchat.ai |
| Header Image | 1500x500px branded banner |
| Profile Image | Logo (400x400px) |

**Content Strategy:**
- Founder tips and fundraising insights
- Industry news commentary
- Product updates and feature announcements
- User success stories (with permission)
- Engagement with VC and founder communities

### 2.2 LinkedIn Company Page

**URL:** linkedin.com/company/pitchchat

**Page Elements:**
| Element | Content |
|---------|---------|
| Company Name | Pitchchat |
| Tagline | AI-Powered Pitch Room Builder |
| Description | Pitchchat helps founders prepare for investor conversations by turning pitch decks into AI-powered Q&A rooms. Upload your documents and get instant, intelligent answers to investor questions. |
| Industry | Software Development |
| Company Size | 2-10 employees |
| Website | https://pitchchat.ai |
| Logo | 300x300px |
| Cover Image | 1128x191px |

**Content Strategy:**
- Long-form posts on fundraising best practices
- Investor questions series (repurpose pSEO content)
- Product announcements
- Team and culture posts
- Industry thought leadership

### 2.3 Schema.org Integration

**Update Organization Schema:**

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://pitchchat.ai/#organization",
  "name": "Pitchchat",
  "url": "https://pitchchat.ai",
  "logo": "https://pitchchat.ai/logo.png",
  "sameAs": [
    "https://twitter.com/pitchchat",
    "https://www.linkedin.com/company/pitchchat"
  ]
}
```

---

## 3. Launch Platforms

### 3.1 ProductHunt Launch

**Preparation Checklist:**
- [ ] Create ProductHunt maker account
- [ ] Prepare product listing:
  - Tagline (60 chars max)
  - Description (260 chars)
  - Gallery images (5-8 images/GIFs)
  - First comment from maker
- [ ] Schedule launch for Tuesday/Wednesday
- [ ] Prepare email to existing users for support
- [ ] Create launch day social posts

**Launch Day Assets:**
| Asset | Specifications |
|-------|----------------|
| Thumbnail | 240x240px |
| Gallery Images | 1270x760px (5-8 images) |
| GIF Demo | 15-30 seconds |
| Maker Video | Optional, 2-3 minutes |

**Expected Outcomes:**
- 100-500 upvotes
- Top 10 daily product
- 1-5 high-quality backlinks from tech blogs
- 500-2000 website visits on launch day

### 3.2 Hacker News Launch

**Post Format:**

Title: `Show HN: Pitchchat – AI pitch rooms that answer investor questions 24/7`

Body:
```
Hi HN! I'm building Pitchchat to help founders prepare for investor meetings.

The problem: Founders spend hours preparing for investor Q&A, often getting surprised by tough questions.

The solution: Upload your pitch deck and documents to create an AI-powered room that can answer investor questions instantly.

How it works:
1. Upload your pitch deck, financials, and docs
2. AI processes and understands your startup
3. Share the room link with investors
4. AI answers their questions based on your materials

Built with: [tech stack]

Would love your feedback! What would make this more useful for founders?
```

**Timing:** Post Tuesday-Thursday, 9am-11am EST

**Expected Outcomes:**
- 50-200 points
- Front page visibility (if successful)
- High-quality feedback from technical audience
- Potential investor/advisor connections

### 3.3 Indie Hackers

**Community Post:**
- Share founder journey and building in public
- Monthly revenue/user updates (if comfortable)
- Product feedback requests
- Engage in fundraising and startup discussions

---

## 4. Backlink Acquisition Strategy

### 4.1 Content-Based Link Building

**Strategy:** Create linkable assets on pSEO pages

| Asset Type | Example | Link Target |
|------------|---------|-------------|
| Statistics | "50% of VC funding goes to AI startups" | /investor-questions/ai/ |
| Checklists | "Seed Due Diligence Checklist" | /investor-questions/.../diligence-checklist/ |
| Benchmarks | "SaaS Series A Metrics Benchmarks" | /investor-questions/.../metrics-benchmarks/ |

### 4.2 Guest Posting

**Target Publications:**
| Publication | Topic Focus | DA |
|-------------|-------------|-----|
| TechCrunch | Fundraising, AI startups | 90+ |
| Forbes | Entrepreneurship | 90+ |
| Inc.com | Startup advice | 85+ |
| Entrepreneur | Business tips | 85+ |
| SaaStr | SaaS-specific | 70+ |
| First Round Review | Founder stories | 75+ |

**Pitch Template:**
```
Subject: Guest Post Pitch: [Topic Idea]

Hi [Editor Name],

I'm [Your Name], founder of Pitchchat. I noticed your recent piece on [relevant article] and thought your readers might enjoy:

[Proposed Article Title]

Key points I'd cover:
1. [Point 1]
2. [Point 2]
3. [Point 3]

I can have a draft ready within a week. Happy to adjust the angle based on your editorial needs.

Best,
[Your Name]
```

### 4.3 HARO (Help A Reporter Out)

**Strategy:**
- Sign up for HARO at helpareporter.com
- Monitor daily queries in:
  - Business & Finance
  - Technology
  - Startups/Entrepreneurship
- Respond to relevant queries as "startup expert" or "fundraising expert"

**Expected:** 1-3 high-quality backlinks per month

### 4.4 Podcast Appearances

**Target Shows:**
| Podcast | Topic | Audience |
|---------|-------|----------|
| This Week in Startups | General startup | Large |
| The Pitch | Fundraising | Targeted |
| How I Built This | Founder stories | Large |
| Indie Hackers Podcast | Bootstrapping | Targeted |
| My First Million | Business ideas | Large |

**Outreach Template:**
```
Subject: Podcast Guest Pitch - AI Helping Founders Fundraise

Hi [Host Name],

Love what you're doing with [Podcast Name]. Your recent episode on [topic] really resonated.

I'm building Pitchchat, an AI tool that helps founders prepare for investor meetings. Some topics I could discuss:

- How AI is changing the fundraising process
- Common mistakes founders make in investor Q&A
- What investors really want to see in a pitch room

Would be honored to share insights with your audience.

Best,
[Your Name]
```

### 4.5 Resource Page Link Building

**Strategy:** Find "fundraising resources" or "startup tools" pages and request inclusion

**Search Queries:**
- "startup fundraising resources"
- "investor pitch tools"
- "best tools for founders"
- "startup resource list" + inurl:resources

**Outreach:**
```
Subject: Resource Suggestion for Your Fundraising Tools Page

Hi [Name],

I came across your helpful resource page on [page title] and noticed you list tools for founders.

I'd like to suggest Pitchchat (https://pitchchat.ai) - it's an AI tool that helps founders prepare pitch rooms that answer investor questions.

It might be a useful addition for founders preparing for fundraising.

Thanks for putting together such a great resource!

Best,
[Your Name]
```

---

## 5. Community Engagement

### 5.1 Reddit Participation

**Subreddits:**
| Subreddit | Strategy |
|-----------|----------|
| r/startups | Share insights, answer questions |
| r/SaaS | SaaS-specific advice |
| r/entrepreneur | Founder discussions |
| r/venturecapital | VC perspective questions |

**Rules:**
- No direct self-promotion
- Provide genuine value first
- Only mention Pitchchat when directly relevant
- Build karma through helpful contributions

### 5.2 Twitter/X Engagement

**Daily Activities:**
- Engage with 5-10 founder tweets
- Share 1-2 helpful tips
- Retweet/quote tweet relevant content
- Reply to VC posts with insights

**Hashtags to Monitor:**
- #startups
- #fundraising
- #venturecapital
- #pitchdeck
- #seedfunding

---

## 6. Measurement & Tracking

### 6.1 Backlink Monitoring

**Tools:**
| Tool | Purpose |
|------|---------|
| Ahrefs | Backlink monitoring, DA tracking |
| Google Search Console | Link reports |
| Google Alerts | Brand mention monitoring |

**Set up Google Alert:**
- "Pitchchat" (brand mentions)
- "pitchchat.ai" (link mentions)

### 6.2 Key Metrics

| Metric | Baseline | 3-Month Target | 6-Month Target |
|--------|----------|----------------|----------------|
| Referring Domains | 0 | 20 | 50 |
| Domain Authority | N/A | 20 | 35 |
| Twitter Followers | 0 | 500 | 2,000 |
| LinkedIn Followers | 0 | 300 | 1,000 |
| Social Referral Traffic | 0 | 200/mo | 500/mo |

---

## 7. Acceptance Criteria

### 7.1 Social Profiles
- [ ] Twitter profile created and optimized
- [ ] LinkedIn company page created and optimized
- [ ] Profile images and banners uploaded
- [ ] sameAs URLs added to Organization schema

### 7.2 Launch Platforms
- [ ] ProductHunt listing prepared
- [ ] HackerNews Show HN posted
- [ ] Indie Hackers profile created

### 7.3 Backlink Foundation
- [ ] HARO account created
- [ ] Google Alerts configured
- [ ] Target publication list compiled
- [ ] Outreach templates prepared

---

## 8. Timeline

| Week | Activity |
|------|----------|
| 1 | Create Twitter and LinkedIn profiles |
| 2 | Prepare ProductHunt assets |
| 3 | ProductHunt launch |
| 4 | HackerNews Show HN post |
| 5-8 | Guest post outreach |
| Ongoing | HARO responses, community engagement |

---

## 9. Budget Considerations

| Item | Cost | Notes |
|------|------|-------|
| Ahrefs | $99/mo | Backlink monitoring |
| HARO Premium | $0-19/mo | Optional upgrade |
| ProductHunt Ship | $0 | Free for makers |
| Social media | $0 | Organic only initially |

---

## 10. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Low ProductHunt engagement | Pre-build launch community |
| HN downvotes | Focus on genuine value, not promotion |
| Guest post rejections | Volume approach, personalized pitches |
| Negative reviews | Respond professionally, address concerns |

---

## 11. Content Calendar Template

### 11.1 Weekly Content Schedule

| Day | Platform | Content Type | Notes |
|-----|----------|--------------|-------|
| Monday | Twitter | Tip/Insight | Start week with value |
| Monday | LinkedIn | Long-form post | Professional audience peak |
| Tuesday | Twitter | Engagement | Reply to trending topics |
| Wednesday | Twitter | Product feature | Mid-week visibility |
| Wednesday | Reddit | Community engagement | r/startups, r/SaaS |
| Thursday | Twitter | Industry news commentary | Stay relevant |
| Thursday | LinkedIn | Article share | Repurpose pSEO content |
| Friday | Twitter | Question/Poll | Engagement driver |
| Weekend | - | Monitor mentions | Respond to engagement |

### 11.2 Content Themes by Week

```
Week 1: Fundraising fundamentals
Week 2: Pitch deck optimization
Week 3: Investor relations
Week 4: Metrics & benchmarks
(Repeat cycle)
```

### 11.3 Social Post Templates

**Twitter Thread Template:**

```
🧵 [Number] questions investors will ask your [Industry] startup at [Stage] (and how to answer them):

1/ [Question 1]
→ [Brief answer or insight]

2/ [Question 2]
→ [Brief answer or insight]

[Continue...]

[N]/ Want all [N] questions with detailed answers?
Check out our free guide: [pSEO page link]

Follow @pitchchat for more founder insights 🚀
```

**LinkedIn Post Template:**

```
[Hook - Bold statement or question]

[2-3 paragraphs of value-driven content]

Key takeaways:
• [Takeaway 1]
• [Takeaway 2]
• [Takeaway 3]

[CTA] Full guide with [X] more tips: [link]

#startups #fundraising #venturecapital #pitchdeck
```

**ProductHunt Launch Comment Template:**

```
Hey Product Hunt! 👋

I'm [Name], founder of Pitchchat.

The problem we're solving: [1-2 sentences about pain point]

How it works:
1. [Step 1]
2. [Step 2]
3. [Step 3]

We'd love your feedback on:
- [Specific question 1]
- [Specific question 2]

Special for PH community: [offer/discount if any]

Thanks for checking us out! 🙏
```

---

## 12. Outreach Tracking

### 12.1 Outreach Spreadsheet Structure

**File:** Google Sheets or Airtable

**Columns:**

| Column | Type | Description |
|--------|------|-------------|
| Publication | Text | Target publication name |
| Contact Name | Text | Editor/writer name |
| Contact Email | Email | Contact email |
| LinkedIn URL | URL | LinkedIn profile |
| Domain Authority | Number | DA score (Ahrefs) |
| Status | Dropdown | Not Contacted, Contacted, Follow-up, Accepted, Rejected, Published |
| First Contact Date | Date | Initial outreach date |
| Last Contact Date | Date | Most recent contact |
| Follow-up Count | Number | Number of follow-ups sent |
| Pitch Topic | Text | Article topic pitched |
| Response | Text | Summary of response |
| Published URL | URL | URL if published |
| Backlink Quality | Dropdown | DoFollow, NoFollow, None |
| Notes | Long Text | Additional context |

### 12.2 HARO Response Tracker

| Column | Type | Description |
|--------|------|-------------|
| Query ID | Text | HARO query reference |
| Query Topic | Text | Topic of the query |
| Publication | Text | Stated publication |
| Deadline | DateTime | Response deadline |
| Response Sent | DateTime | When response sent |
| Quality Score | Number | Self-rated 1-5 |
| Result | Dropdown | Pending, Used, Not Used, Unknown |
| Published URL | URL | If response was used |
| Notes | Long Text | What worked/didn't |

### 12.3 Backlink Monitoring Sheet

| Column | Type | Description |
|--------|------|-------------|
| Source URL | URL | Page linking to us |
| Source Domain | Text | Domain name |
| Target URL | URL | Our page being linked |
| Anchor Text | Text | Link anchor text |
| Link Type | Dropdown | DoFollow, NoFollow, Sponsored |
| Domain Authority | Number | Source DA |
| First Detected | Date | When link was found |
| Status | Dropdown | Active, Lost, Broken |
| Acquisition Method | Dropdown | Guest Post, HARO, Organic, Outreach |
| Notes | Long Text | Additional context |

---

## 13. Response Templates

### 13.1 Guest Post Follow-up (7 days)

```
Subject: Re: Guest Post Pitch: [Original Topic]

Hi [Name],

Hope you're having a great week! I wanted to follow up on my pitch for [topic] - I know you must get tons of submissions.

I've refined my angle a bit:
[Updated/refined pitch in 2-3 sentences]

Happy to send over a draft whenever works for you, or adjust the angle based on your needs.

Best,
[Name]
```

### 13.2 HARO Response Template

```
Subject: RE: [Query Title]

Hi [Reporter Name],

I'm [Your Name], founder of Pitchchat, an AI platform helping founders prepare for investor conversations.

[Direct answer to the query in 2-3 sentences with specific, quotable insights]

[Optional: Brief supporting context or example]

[Optional: Relevant stat or data point]

I'm happy to provide additional context or clarification if needed.

Best,
[Your Name]
Pitchchat - pitchchat.ai
```

### 13.3 Resource Page Outreach Follow-up

```
Subject: Re: Resource Suggestion

Hi [Name],

Just circling back on my suggestion to add Pitchchat to your [Page Title] - I noticed you recently updated the page with some great new tools.

If it helps, here's a quick summary:
• What: AI pitch room builder for founders
• Best for: Preparing for investor Q&A
• Free tier: Yes

Let me know if you need any additional info!

Best,
[Name]
```

### 13.4 Podcast Pitch Follow-up

```
Subject: Re: Podcast Guest Pitch

Hi [Host Name],

Hope all is well! Following up on my guest pitch for [Podcast Name] - I recently [relevant update: published article, hit milestone, launched feature] that might add some fresh angles to our potential conversation.

Some specific topics I could dive into:
• [Updated topic 1 with specific insight]
• [Updated topic 2 with specific insight]

Would love to contribute to your show whenever you have an opening.

Best,
[Name]
```

---

## 14. Automated Verification & Monitoring

### 14.1 Social Profile Link Verification

**File:** `scripts/verify-social-links.ts`

```typescript
#!/usr/bin/env npx ts-node

/**
 * Verifies that social media profile links are live and consistent
 * with schema.org configuration and site metadata.
 */

interface SocialProfile {
  platform: string;
  url: string;
  expectedHandle: string;
}

const EXPECTED_PROFILES: SocialProfile[] = [
  {
    platform: "Twitter",
    url: "https://twitter.com/pitchchat",
    expectedHandle: "pitchchat",
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/company/pitchchat",
    expectedHandle: "pitchchat",
  },
];

async function verifyProfile(profile: SocialProfile): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const response = await fetch(profile.url, {
      method: "HEAD",
      redirect: "follow",
    });

    if (response.status === 404) {
      return { success: false, error: "Profile not found (404)" };
    }

    if (!response.ok && response.status !== 302) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

async function verifySchemaOrg(siteUrl: string): Promise<{
  success: boolean;
  errors: string[];
}> {
  const errors: string[] = [];

  try {
    const response = await fetch(siteUrl);
    const html = await response.text();

    // Extract JSON-LD
    const jsonLdMatch = html.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
    );

    if (!jsonLdMatch) {
      errors.push("No JSON-LD schema found on homepage");
      return { success: false, errors };
    }

    const schema = JSON.parse(jsonLdMatch[1]);

    // Verify Organization schema
    if (schema["@type"] !== "Organization" && !schema["@graph"]) {
      errors.push("No Organization schema found");
    }

    // Check for sameAs property
    const org = schema["@type"] === "Organization" ? schema :
      schema["@graph"]?.find((item: any) => item["@type"] === "Organization");

    if (!org?.sameAs || !Array.isArray(org.sameAs)) {
      errors.push("sameAs property missing or not an array");
    } else {
      for (const profile of EXPECTED_PROFILES) {
        if (!org.sameAs.includes(profile.url)) {
          errors.push(`sameAs missing: ${profile.url}`);
        }
      }
    }

    return { success: errors.length === 0, errors };
  } catch (error) {
    errors.push(
      `Schema verification failed: ${error instanceof Error ? error.message : "Unknown"}`
    );
    return { success: false, errors };
  }
}

async function main() {
  const siteUrl = process.env.SITE_URL || "https://pitchchat.ai";
  console.log("Social Links & Schema Verification\n");
  console.log("=".repeat(50));

  // Verify each social profile
  console.log("\n1. Social Profile Verification:\n");
  let allProfilesValid = true;

  for (const profile of EXPECTED_PROFILES) {
    const result = await verifyProfile(profile);
    if (result.success) {
      console.log(`  ✅ ${profile.platform}: ${profile.url}`);
    } else {
      console.log(`  ❌ ${profile.platform}: ${result.error}`);
      allProfilesValid = false;
    }
  }

  // Verify schema.org integration
  console.log("\n2. Schema.org Verification:\n");
  const schemaResult = await verifySchemaOrg(siteUrl);

  if (schemaResult.success) {
    console.log("  ✅ Organization schema with sameAs is correctly configured");
  } else {
    schemaResult.errors.forEach((err) => {
      console.log(`  ❌ ${err}`);
    });
  }

  // Summary
  console.log("\n" + "=".repeat(50));
  if (allProfilesValid && schemaResult.success) {
    console.log("✅ All social links and schema verified successfully!");
    process.exit(0);
  } else {
    console.log("❌ Verification failed - see errors above");
    process.exit(1);
  }
}

main();
```

### 14.2 Backlink Health Monitor

**File:** `scripts/monitor-backlinks.ts`

```typescript
#!/usr/bin/env npx ts-node

import { readFileSync, writeFileSync, existsSync } from "fs";

interface Backlink {
  sourceUrl: string;
  sourceDomain: string;
  targetUrl: string;
  anchorText: string;
  linkType: "dofollow" | "nofollow" | "sponsored";
  firstDetected: string;
  lastChecked: string;
  status: "active" | "lost" | "broken";
}

const BACKLINKS_FILE = "data/backlinks.json";

async function checkBacklink(
  backlink: Backlink
): Promise<{ status: "active" | "lost" | "broken"; error?: string }> {
  try {
    const response = await fetch(backlink.sourceUrl, {
      headers: {
        "User-Agent": "Pitchchat-Backlink-Monitor/1.0",
      },
    });

    if (!response.ok) {
      return { status: "broken", error: `HTTP ${response.status}` };
    }

    const html = await response.text();

    // Check if our link is still present
    const linkPattern = new RegExp(
      `href=["']${escapeRegex(backlink.targetUrl)}["']`,
      "i"
    );

    if (linkPattern.test(html)) {
      return { status: "active" };
    }

    // Check for partial match (domain without path)
    if (html.includes("pitchchat.ai")) {
      return { status: "active" };
    }

    return { status: "lost", error: "Link no longer present on page" };
  } catch (error) {
    return {
      status: "broken",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function monitorBacklinks() {
  if (!existsSync(BACKLINKS_FILE)) {
    console.log("No backlinks file found. Creating template...");
    writeFileSync(
      BACKLINKS_FILE,
      JSON.stringify({ backlinks: [], lastUpdated: new Date().toISOString() }, null, 2)
    );
    return;
  }

  const data = JSON.parse(readFileSync(BACKLINKS_FILE, "utf-8"));
  const backlinks: Backlink[] = data.backlinks;

  console.log(`Checking ${backlinks.length} backlinks...\n`);

  const results = {
    active: 0,
    lost: 0,
    broken: 0,
    issues: [] as { backlink: Backlink; error: string }[],
  };

  for (const backlink of backlinks) {
    const result = await checkBacklink(backlink);

    backlink.lastChecked = new Date().toISOString();
    backlink.status = result.status;

    switch (result.status) {
      case "active":
        results.active++;
        console.log(`  ✅ ${backlink.sourceDomain}`);
        break;
      case "lost":
        results.lost++;
        console.log(`  ⚠️  ${backlink.sourceDomain} - LOST`);
        results.issues.push({ backlink, error: result.error || "Lost" });
        break;
      case "broken":
        results.broken++;
        console.log(`  ❌ ${backlink.sourceDomain} - BROKEN: ${result.error}`);
        results.issues.push({ backlink, error: result.error || "Broken" });
        break;
    }

    // Rate limit
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  // Update file
  data.lastUpdated = new Date().toISOString();
  writeFileSync(BACKLINKS_FILE, JSON.stringify(data, null, 2));

  // Summary
  console.log("\n" + "=".repeat(50));
  console.log(`Active: ${results.active}`);
  console.log(`Lost: ${results.lost}`);
  console.log(`Broken: ${results.broken}`);

  if (results.issues.length > 0) {
    console.log("\nIssues to address:");
    results.issues.forEach(({ backlink, error }) => {
      console.log(`  - ${backlink.sourceUrl}: ${error}`);
    });
  }
}

monitorBacklinks();
```

### 14.3 CI Integration for Social Verification

**File:** `.github/workflows/social-verification.yml`

```yaml
name: Social Links Verification

on:
  schedule:
    # Run weekly on Mondays at 9am UTC
    - cron: "0 9 * * 1"
  workflow_dispatch:

jobs:
  verify-social-links:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Verify social profile links
        run: npx ts-node scripts/verify-social-links.ts
        env:
          SITE_URL: https://pitchchat.ai

      - name: Create issue on failure
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: 'Social Links Verification Failed',
              body: `The weekly social links verification failed.\n\nWorkflow: ${process.env.GITHUB_RUN_ID}\n\nPlease check:\n- Social profile links are live\n- Schema.org sameAs configuration is correct`,
              labels: ['bug', 'social-media']
            });

  monitor-backlinks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install dependencies
        run: npm ci

      - name: Monitor backlinks
        run: npx ts-node scripts/monitor-backlinks.ts

      - name: Commit updated backlinks data
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git add data/backlinks.json
          git diff --quiet --cached || git commit -m "chore: update backlink status"

      - name: Push changes
        uses: ad-m/github-push-action@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          branch: main
```

### 14.4 Brand Mention Monitoring Script

**File:** `scripts/check-brand-mentions.ts`

```typescript
#!/usr/bin/env npx ts-node

/**
 * Searches for unlinked brand mentions that could be converted to backlinks.
 * Integrates with Google Alerts and searches major platforms.
 */

const BRAND_TERMS = ["Pitchchat", "pitchchat.ai", "pitch chat ai"];

const SEARCH_SOURCES = [
  "site:twitter.com",
  "site:linkedin.com",
  "site:reddit.com",
  "site:news.ycombinator.com",
  "site:medium.com",
];

interface BrandMention {
  term: string;
  source: string;
  url: string;
  hasLink: boolean;
  discoveredAt: string;
}

async function searchGoogleForMentions(
  term: string,
  source: string
): Promise<BrandMention[]> {
  // Note: In production, use Google Custom Search API or a SERP API
  // This is a placeholder showing the structure

  console.log(`  Searching: "${term}" ${source}`);

  // Simulated results - replace with actual API call
  return [];
}

async function findBrandMentions(): Promise<void> {
  console.log("Brand Mention Discovery\n");
  console.log("=".repeat(50));

  const allMentions: BrandMention[] = [];

  for (const term of BRAND_TERMS) {
    console.log(`\nSearching for: "${term}"`);

    for (const source of SEARCH_SOURCES) {
      const mentions = await searchGoogleForMentions(term, source);
      allMentions.push(...mentions);

      // Rate limit
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // Filter unlinked mentions
  const unlinkedMentions = allMentions.filter((m) => !m.hasLink);

  console.log("\n" + "=".repeat(50));
  console.log(`Total mentions found: ${allMentions.length}`);
  console.log(`Unlinked mentions (opportunities): ${unlinkedMentions.length}`);

  if (unlinkedMentions.length > 0) {
    console.log("\nOutreach Opportunities:");
    unlinkedMentions.forEach((mention) => {
      console.log(`  - ${mention.url}`);
    });
  }
}

// Reminder to set up Google Alerts
console.log(`
╔══════════════════════════════════════════════════════════╗
║  MANUAL SETUP REQUIRED                                   ║
║                                                          ║
║  1. Set up Google Alerts at:                            ║
║     https://www.google.com/alerts                       ║
║                                                          ║
║  2. Create alerts for:                                  ║
║     - "Pitchchat"                                       ║
║     - "pitchchat.ai"                                    ║
║     - "pitch chat" startup                              ║
║                                                          ║
║  3. Set delivery to: RSS feed or email digest           ║
╚══════════════════════════════════════════════════════════╝
`);

findBrandMentions();
```

### 14.5 Acceptance Criteria Verification Checklist

**File:** `scripts/verify-social-setup.ts`

```typescript
#!/usr/bin/env npx ts-node

interface CheckResult {
  name: string;
  passed: boolean;
  details?: string;
}

async function runChecks(): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  // 1. Twitter Profile
  try {
    const twitterRes = await fetch("https://twitter.com/pitchchat", {
      method: "HEAD",
    });
    results.push({
      name: "Twitter profile exists",
      passed: twitterRes.status !== 404,
      details: twitterRes.status === 404 ? "Profile not found" : undefined,
    });
  } catch {
    results.push({ name: "Twitter profile exists", passed: false, details: "Request failed" });
  }

  // 2. LinkedIn Company Page
  try {
    const linkedinRes = await fetch(
      "https://www.linkedin.com/company/pitchchat",
      { method: "HEAD" }
    );
    results.push({
      name: "LinkedIn company page exists",
      passed: linkedinRes.status !== 404,
    });
  } catch {
    results.push({ name: "LinkedIn company page exists", passed: false });
  }

  // 3. Schema.org sameAs
  try {
    const homeRes = await fetch("https://pitchchat.ai");
    const html = await homeRes.text();
    const hasSameAs =
      html.includes('"sameAs"') &&
      html.includes("twitter.com/pitchchat") &&
      html.includes("linkedin.com/company/pitchchat");
    results.push({
      name: "Schema.org sameAs configured",
      passed: hasSameAs,
    });
  } catch {
    results.push({ name: "Schema.org sameAs configured", passed: false });
  }

  // 4. Google Alerts (manual check reminder)
  results.push({
    name: "Google Alerts configured",
    passed: false,
    details: "Manual verification required - check https://www.google.com/alerts",
  });

  // 5. HARO Account (manual check reminder)
  results.push({
    name: "HARO account created",
    passed: false,
    details: "Manual verification required - check helpareporter.com",
  });

  return results;
}

async function main() {
  console.log("Social Media & Backlinks Setup Verification\n");
  console.log("=".repeat(50));

  const results = await runChecks();

  console.log("\nResults:\n");

  let passedCount = 0;
  for (const result of results) {
    const icon = result.passed ? "✅" : "❌";
    console.log(`${icon} ${result.name}`);
    if (result.details) {
      console.log(`   → ${result.details}`);
    }
    if (result.passed) passedCount++;
  }

  console.log("\n" + "=".repeat(50));
  console.log(`\nPassed: ${passedCount}/${results.length}`);

  // Exit with error if any automated checks failed
  const automatedChecks = results.filter(
    (r) => !r.details?.includes("Manual verification")
  );
  const automatedPassed = automatedChecks.filter((r) => r.passed).length;

  if (automatedPassed < automatedChecks.length) {
    process.exit(1);
  }
}

main();
```
