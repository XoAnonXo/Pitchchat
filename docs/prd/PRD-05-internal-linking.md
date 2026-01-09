# PRD-05: Internal Linking & Navigation

**Version:** 1.0
**Status:** Draft
**Author:** Engineering
**Created:** 2026-01-08

---

## 1. Overview

### 1.1 Executive Summary

This PRD defines the implementation of enhanced internal linking and navigation for pSEO pages. This includes breadcrumb navigation UI, improved cross-linking between related pages, and strategic links to the main Pitchchat application to drive conversions.

### 1.2 Goals

| Goal | Metric | Target |
|------|--------|--------|
| Navigation clarity | Breadcrumb presence | 100% pages |
| Cross-linking | Avg. internal links per page | 5+ |
| Main app traffic | Clicks to pitchchat.ai | 10% of page views |
| SEO link equity | Pages with inbound internal links | 100% |

### 1.3 Current State

Existing components:
- `PseoInternalLinks.tsx` - Related content links at page bottom

Missing:
- Breadcrumb navigation UI
- Header with main app link
- Footer with sitemap links
- Cross-page type linking

---

## 2. User Stories

1. **As a visitor**, I want to see breadcrumbs so I can understand where I am in the site hierarchy and navigate to parent pages.

2. **As a founder**, I want prominent access to the main Pitchchat app so I can easily try the product after reading helpful content.

3. **As a search engine**, I want clear internal link structure so I can understand site hierarchy and distribute link equity.

---

## 3. Component Architecture

### 3.1 New Components

| Component | Location | Purpose |
|-----------|----------|---------|
| PseoBreadcrumbs.tsx | `components/pseo/` | Visual breadcrumb navigation |
| PseoHeader.tsx | `components/pseo/` | Site header with logo and CTA |
| PseoFooter.tsx | `components/pseo/` | Footer with sitemap links |

### 3.2 Component Hierarchy

```
Layout
├── PseoHeader
│   ├── Logo (link to /investor-questions/)
│   └── CTA Button (link to main app)
├── PseoBreadcrumbs
│   └── Breadcrumb items
├── Page Content
│   └── PseoInternalLinks (existing)
└── PseoFooter
    ├── Industry links
    ├── Stage links
    └── Main app link
```

---

## 4. Technical Specifications

### 4.1 PseoBreadcrumbs Component

**File:** `pseo/src/components/pseo/PseoBreadcrumbs.tsx`

```typescript
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import type { PseoContext } from "@/types/pseo";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PseoBreadcrumbsProps {
  context: PseoContext;
  pageTitle: string;
}

export function PseoBreadcrumbs({ context, pageTitle }: PseoBreadcrumbsProps) {
  const { industry, stage, industryLabel, stageLabel } = context;

  const items: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Investor Questions", href: "/investor-questions/" },
    { label: industryLabel, href: `/investor-questions/industries/${industry}/` },
    { label: stageLabel, href: `/investor-questions/stages/${stage}/` },
    { label: pageTitle }, // Current page - no link
  ];

  const handleClick = (href: string) => {
    trackEvent("internal_link_click", {
      destination_url: href,
      link_type: "breadcrumb",
      source_page: window.location.pathname,
    });
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-600">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="mx-1 h-4 w-4" />}
            {item.href ? (
              <Link
                href={item.href}
                onClick={() => handleClick(item.href!)}
                className="hover:text-black hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-black font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

### 4.2 PseoHeader Component

**File:** `pseo/src/components/pseo/PseoHeader.tsx`

```typescript
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

export function PseoHeader() {
  const handleCtaClick = () => {
    trackEvent("cta_click", {
      cta_type: "header_try_pitchchat",
      page_path: window.location.pathname,
    });
  };

  const handleLogoClick = () => {
    trackEvent("internal_link_click", {
      destination_url: "/investor-questions/",
      link_type: "header_logo",
      source_page: window.location.pathname,
    });
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
        <Link
          href="/investor-questions/"
          onClick={handleLogoClick}
          className="flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold">
            P
          </div>
          <span className="font-semibold text-lg">Pitchchat</span>
        </Link>

        <a
          href="https://pitchchat.ai"
          onClick={handleCtaClick}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          Try Pitchchat
        </a>
      </div>
    </header>
  );
}
```

### 4.3 PseoFooter Component

**File:** `pseo/src/components/pseo/PseoFooter.tsx`

```typescript
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { INDUSTRIES, STAGES } from "@/data/pilot-config";
import { labelForIndustry, labelForStage } from "@/data/labelUtils";

export function PseoFooter() {
  const handleLinkClick = (href: string, linkType: string) => {
    trackEvent("internal_link_click", {
      destination_url: href,
      link_type: linkType,
      source_page: window.location.pathname,
    });
  };

  return (
    <footer className="border-t border-gray-200 bg-gray-50 mt-16">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Industries */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-4">
              By Industry
            </h3>
            <ul className="space-y-2">
              {INDUSTRIES.slice(0, 7).map((industry) => (
                <li key={industry}>
                  <Link
                    href={`/investor-questions/industries/${industry}/`}
                    onClick={() =>
                      handleLinkClick(
                        `/investor-questions/industries/${industry}/`,
                        "footer_industry"
                      )
                    }
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    {labelForIndustry(industry)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stages */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-4">
              By Stage
            </h3>
            <ul className="space-y-2">
              {STAGES.map((stage) => (
                <li key={stage}>
                  <Link
                    href={`/investor-questions/stages/${stage}/`}
                    onClick={() =>
                      handleLinkClick(
                        `/investor-questions/stages/${stage}/`,
                        "footer_stage"
                      )
                    }
                    className="text-sm text-gray-600 hover:text-black"
                  >
                    {labelForStage(stage)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/investor-questions/"
                  onClick={() =>
                    handleLinkClick("/investor-questions/", "footer_resource")
                  }
                  className="text-sm text-gray-600 hover:text-black"
                >
                  All Investor Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Pitchchat */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-4">
              Pitchchat
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://pitchchat.ai"
                  onClick={() => {
                    trackEvent("cta_click", {
                      cta_type: "footer_main_app",
                      page_path: window.location.pathname,
                    });
                  }}
                  className="text-sm text-gray-600 hover:text-black"
                >
                  Try Pitchchat
                </a>
              </li>
              <li>
                <a
                  href="https://pitchchat.ai"
                  className="text-sm text-gray-600 hover:text-black"
                >
                  About
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Pitchchat. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
```

### 4.4 Enhanced PseoInternalLinks

**Update:** `pseo/src/components/pseo/PseoInternalLinks.tsx`

Add cross-page-type linking:

```typescript
// Add links to other page types for the same industry/stage
const pageTypes = ["investor-questions", "pitch-deck", "metrics-benchmarks", "diligence-checklist", "investor-update"];

const relatedPageTypeLinks = pageTypes
  .filter((pt) => pt !== currentPageType)
  .map((pt) => ({
    label: labelForPageType(pt),
    href: `/investor-questions/${industry}/${stage}/${pt}/`,
  }));

// Render section for "More for {Industry} {Stage}"
<section className="mt-8">
  <h3 className="font-semibold mb-4">More for {industryLabel} {stageLabel}</h3>
  <ul className="grid grid-cols-2 gap-2">
    {relatedPageTypeLinks.map((link) => (
      <li key={link.href}>
        <Link href={link.href} onClick={() => handleLinkClick(link.href, "related_page_type")}>
          {link.label}
        </Link>
      </li>
    ))}
  </ul>
</section>
```

---

## 5. Layout Integration

**Update:** `pseo/src/app/layout.tsx`

```typescript
import { PseoHeader } from "@/components/pseo/PseoHeader";
import { PseoFooter } from "@/components/pseo/PseoFooter";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PseoHeader />
        <main className="min-h-screen">{children}</main>
        <PseoFooter />
      </body>
    </html>
  );
}
```

**Update:** All page templates to include breadcrumbs:

```typescript
// InvestorQuestionsTemplate.tsx, PitchDeckTemplate.tsx, etc.
import { PseoBreadcrumbs } from "@/components/pseo/PseoBreadcrumbs";

export function InvestorQuestionsTemplate({ data }: Props) {
  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      <PseoBreadcrumbs context={data.context} pageTitle={data.title} />
      {/* Rest of template */}
    </article>
  );
}
```

---

## 6. Link Strategy

### 6.1 Internal Link Distribution

| Link Type | Source | Destination | Purpose |
|-----------|--------|-------------|---------|
| Breadcrumb | All pages | Parent pages | Navigation, SEO |
| Related Content | Bottom of page | Same industry/stage | Engagement |
| Cross Page Type | Bottom of page | Other page types | Discovery |
| Footer Industry | Footer | Industry index | SEO |
| Footer Stage | Footer | Stage index | SEO |
| Header CTA | Header | Main app | Conversion |
| Footer CTA | Footer | Main app | Conversion |

### 6.2 Link Equity Flow

```
Homepage
    ├── Industry Index Pages (7)
    │   └── Industry/Stage combinations
    │       └── Page Type pages (5 per combo)
    └── Stage Index Pages (2)
        └── Industry/Stage combinations
            └── Page Type pages (5 per combo)
```

---

## 7. Acceptance Criteria

### 7.1 Breadcrumbs
- [ ] Visible on all pSEO content pages
- [ ] Contains 5 levels: Home > Investor Questions > Industry > Stage > Page
- [ ] All links except current page are clickable
- [ ] Click tracking implemented
- [ ] Accessible (aria-label, semantic nav element)

### 7.2 Header
- [ ] Logo links to /investor-questions/
- [ ] "Try Pitchchat" button links to main app
- [ ] Fixed/sticky on scroll (optional)
- [ ] Mobile responsive

### 7.3 Footer
- [ ] Lists all industries (up to 7)
- [ ] Lists all stages (4)
- [ ] Links to main app
- [ ] Copyright notice

### 7.4 Cross-Linking
- [ ] Each page links to other page types for same industry/stage
- [ ] Related industry links in sidebar or bottom
- [ ] All links have click tracking

---

## 8. SEO Considerations

### 8.1 Anchor Text Strategy

| Link Type | Anchor Text Pattern |
|-----------|---------------------|
| Industry links | "{Industry}" or "{Industry} Investor Questions" |
| Stage links | "{Stage}" or "{Stage} Fundraising" |
| Page type links | "{Page Type}" |
| Main app CTA | "Try Pitchchat" or "Create Your Pitch Room" |

### 8.2 Nofollow Policy

- All internal links: `rel` omitted (follow)
- External links to main app: `rel` omitted (follow, same organization)
- External links to third parties: `rel="nofollow"` if applicable

---

## 9. Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| pilot-config.json | Data | Implemented |
| labelUtils | Internal | Implemented |
| analytics.ts | Internal | Implemented |
| lucide-react | Package | Installed |

---

## 10. Testing

### 10.1 Manual Testing

| Test | Steps | Expected |
|------|-------|----------|
| Breadcrumb navigation | Click each breadcrumb link | Navigate to correct page |
| Header CTA | Click "Try Pitchchat" | Navigate to main app |
| Footer links | Click industry/stage links | Navigate to index pages |
| Link tracking | Check GA4 DebugView | Events fire with correct params |

### 10.2 Accessibility Testing

- [ ] Keyboard navigation works for all links
- [ ] Screen reader announces breadcrumb navigation
- [ ] Focus states visible on all links
- [ ] Color contrast meets WCAG AA

---

## 11. Accessibility Requirements (WCAG 2.1 AA)

### 11.1 Keyboard Navigation

**All interactive elements must be:**
- Focusable via Tab key
- Activatable via Enter/Space
- Have visible focus indicators

**Enhanced PseoBreadcrumbs with keyboard support:**

```typescript
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import type { PseoContext } from "@/types/pseo";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PseoBreadcrumbsProps {
  context: PseoContext;
  pageTitle: string;
}

export function PseoBreadcrumbs({ context, pageTitle }: PseoBreadcrumbsProps) {
  const { industry, stage, industryLabel, stageLabel } = context;

  const items: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Investor Questions", href: "/investor-questions/" },
    { label: industryLabel, href: `/investor-questions/industries/${industry}/` },
    { label: stageLabel, href: `/investor-questions/stages/${stage}/` },
    { label: pageTitle },
  ];

  const handleClick = (href: string) => {
    trackEvent("internal_link_click", {
      destination_url: href,
      link_type: "breadcrumb",
      source_page: window.location.pathname,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, href?: string) => {
    if (href && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      handleClick(href);
      window.location.href = href;
    }
  };

  return (
    <nav
      aria-label="Breadcrumb navigation"
      className="mb-6"
    >
      <ol
        className="flex flex-wrap items-center gap-1 text-sm text-gray-600"
        role="list"
      >
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-center"
          >
            {index > 0 && (
              <ChevronRight
                className="mx-1 h-4 w-4"
                aria-hidden="true"
              />
            )}
            {item.href ? (
              <Link
                href={item.href}
                onClick={() => handleClick(item.href!)}
                onKeyDown={(e) => handleKeyDown(e, item.href)}
                className="hover:text-black hover:underline focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded px-1"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-black font-medium px-1"
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

### 11.2 ARIA Attributes Reference

| Element | Required ARIA | Purpose |
|---------|---------------|---------|
| Breadcrumb nav | `aria-label="Breadcrumb navigation"` | Identifies landmark |
| Current page | `aria-current="page"` | Indicates current location |
| Separator icons | `aria-hidden="true"` | Hide decorative elements |
| Footer sections | `role="navigation"` + `aria-label` | Multiple nav landmarks |
| Skip link | (See 11.3) | Bypass navigation |

### 11.3 Skip Navigation Link

**Add to layout.tsx for keyboard users:**

```typescript
export function PseoHeader() {
  return (
    <>
      {/* Skip link - visually hidden until focused */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to main content
      </a>
      <header className="border-b border-gray-200 bg-white">
        {/* ... existing header content */}
      </header>
    </>
  );
}

// In page templates, add id to main content
<main id="main-content" className="min-h-screen">
  {/* ... content */}
</main>
```

### 11.4 Focus Management

```typescript
// Focus ring styles (Tailwind)
const focusRingClasses = "focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2";

// Apply to all interactive elements
<Link href={url} className={`hover:underline ${focusRingClasses}`}>
  {label}
</Link>

<button className={`bg-black text-white px-4 py-2 rounded ${focusRingClasses}`}>
  Try Pitchchat
</button>
```

### 11.5 Color Contrast

| Element | Foreground | Background | Ratio | WCAG |
|---------|------------|------------|-------|------|
| Body text | #000000 | #FFFFFF | 21:1 | AAA |
| Secondary text | #404040 | #FFFFFF | 10.4:1 | AAA |
| Muted text | #808080 | #FFFFFF | 4.5:1 | AA |
| Links (hover) | #000000 | #FFFFFF | 21:1 | AAA |
| Footer text | #6B7280 | #F9FAFB | 4.6:1 | AA |

---

## 12. Link Prefetch Strategy

### 12.1 Next.js Prefetch Behavior

Next.js `<Link>` components automatically prefetch in production when:
- Link is in viewport
- Browser is idle
- User has not disabled data saver

### 12.2 Strategic Prefetching

**High-priority links (prefetch immediately):**

```typescript
// Breadcrumb links - likely navigation targets
<Link href={item.href} prefetch={true}>
  {item.label}
</Link>

// Related content links - high click probability
<Link href={relatedPage.href} prefetch={true}>
  {relatedPage.title}
</Link>
```

**Lower-priority links (prefetch on hover/viewport):**

```typescript
// Footer links - less likely to be clicked
<Link href={industryUrl} prefetch={false}>
  {industryLabel}
</Link>
```

### 12.3 Intersection Observer Prefetch

```typescript
// pseo/src/components/pseo/PrefetchOnView.tsx
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface PrefetchOnViewProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function PrefetchOnView({ href, children, className }: PrefetchOnViewProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const router = useRouter();
  const prefetched = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !prefetched.current) {
            router.prefetch(href);
            prefetched.current = true;
            observer.disconnect();
          }
        });
      },
      { rootMargin: "100px" } // Prefetch when 100px from viewport
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [href, router]);

  return (
    <a ref={ref} href={href} className={className}>
      {children}
    </a>
  );
}
```

### 12.4 Prefetch Priority Matrix

| Link Type | Prefetch | Reason |
|-----------|----------|--------|
| Breadcrumb (parent) | Always | High click probability |
| Related content (same industry/stage) | Viewport | Medium probability |
| Cross page type | Viewport | Discovery links |
| Footer industry/stage | Hover only | Low probability |
| External (main app) | Never | Different domain |

---

## 13. Responsive Breakpoints

### 13.1 Component Responsive Behavior

**PseoHeader:**

```typescript
// Mobile: Hamburger menu or simplified header
// Desktop: Full header with all elements

<header className="border-b border-gray-200 bg-white">
  <div className="mx-auto max-w-4xl px-4 py-3 md:py-4 flex items-center justify-between">
    {/* Logo - always visible */}
    <Link href="/investor-questions/" className="flex items-center gap-2">
      <div className="w-7 h-7 md:w-8 md:h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm md:text-base">
        P
      </div>
      <span className="font-semibold text-base md:text-lg">Pitchchat</span>
    </Link>

    {/* CTA - visible but smaller on mobile */}
    <a
      href="https://pitchchat.ai"
      className="bg-black text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg text-xs md:text-sm font-medium hover:bg-gray-800"
    >
      Try Pitchchat
    </a>
  </div>
</header>
```

**PseoBreadcrumbs:**

```typescript
// Mobile: Truncate middle items, show first and last
// Desktop: Full breadcrumb trail

<nav aria-label="Breadcrumb navigation" className="mb-4 md:mb-6">
  <ol className="flex flex-wrap items-center gap-0.5 md:gap-1 text-xs md:text-sm text-gray-600">
    {items.map((item, index) => {
      // On mobile, hide middle items if more than 3
      const isMobileHidden =
        items.length > 3 &&
        index > 0 &&
        index < items.length - 1;

      return (
        <li
          key={index}
          className={`flex items-center ${isMobileHidden ? 'hidden md:flex' : ''}`}
        >
          {/* ... breadcrumb content */}
        </li>
      );
    })}

    {/* Mobile ellipsis for hidden items */}
    {items.length > 3 && (
      <li className="flex md:hidden items-center">
        <ChevronRight className="mx-0.5 h-3 w-3" aria-hidden="true" />
        <span className="text-gray-400">...</span>
      </li>
    )}
  </ol>
</nav>
```

**PseoFooter:**

```typescript
// Mobile: Stack columns vertically
// Tablet: 2 columns
// Desktop: 4 columns

<div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
  {/* Industries - full width on mobile */}
  <div className="col-span-2 md:col-span-1">
    <h3 className="font-semibold text-xs md:text-sm text-gray-900 mb-3 md:mb-4">
      By Industry
    </h3>
    {/* ... */}
  </div>
  {/* ... other columns */}
</div>
```

### 13.2 Breakpoint Reference

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets, small laptops |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |

### 13.3 Touch Target Sizes

Ensure all interactive elements meet minimum touch targets:

```css
/* Minimum 44x44px touch targets for mobile */
@media (max-width: 768px) {
  a, button {
    min-height: 44px;
    min-width: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
```

---

## 14. Industry Best Practices (2025)

### 14.1 pSEO Internal Linking Standards

Based on current industry research ([Ahrefs](https://ahrefs.com/blog/internal-links-for-seo/), [Search Engine Journal](https://www.searchenginejournal.com/internal-linking-guide/)):

| Best Practice | Implementation | Status |
|---------------|----------------|--------|
| **No orphan pages** | Every page has ≥1 inbound link | ✅ Footer/breadcrumbs |
| **Topic clusters** | Group related content | ✅ Industry/Stage hubs |
| **Descriptive anchor text** | Use keyword-rich anchors | ✅ Label utilities |
| **Shallow architecture** | Max 3 clicks to any page | ✅ Breadcrumb structure |
| **Contextual links** | Links within content body | ✅ PseoInternalLinks |

### 14.2 Link Equity Distribution

**Recommended internal links per page:**

| Page Type | Minimum Links | Maximum Links | Target |
|-----------|---------------|---------------|--------|
| Content pages | 3 | 10 | 5-7 |
| Index/hub pages | 10 | 50 | 15-25 |
| Footer (global) | 10 | 20 | 14 |

**Link placement priority (top to bottom of page):**
1. Breadcrumbs (highest SEO value)
2. In-content contextual links
3. Related content section
4. Footer navigation

### 14.3 Anchor Text Strategy

| Link Type | Anchor Text Pattern | Example |
|-----------|---------------------|---------|
| Industry pages | "{Industry} Investor Questions" | "AI Investor Questions" |
| Stage pages | "{Stage} Fundraising Guide" | "Seed Fundraising Guide" |
| Page type links | Descriptive phrase | "Common Investor Questions" |
| CTA links | Action-oriented | "Try Pitchchat Free" |

**Avoid:**
- Generic anchors ("click here", "read more")
- Over-optimized exact match anchors
- Broken or redirect chains

### 14.4 Orphan Page Prevention

**Automated checks:**

```typescript
// pseo/scripts/check-orphan-pages.ts
function findOrphanPages(): string[] {
  const allPages = getAllPageUrls();
  const linkedPages = new Set<string>();

  // Crawl all pages and collect internal links
  for (const page of allPages) {
    const links = extractInternalLinks(page);
    links.forEach(link => linkedPages.add(link));
  }

  // Find pages with no inbound links (except homepage)
  return allPages.filter(page =>
    page !== '/' && !linkedPages.has(page)
  );
}
```

**Mitigation strategies:**
1. Footer includes all industry/stage index pages
2. Breadcrumbs link to all parent pages
3. Cross-page-type links connect all 5 page types per combo
4. Related content links to same-industry pages

### 14.5 Link Velocity Guidelines

For programmatic SEO with 280 pages:

| Action | Recommendation |
|--------|----------------|
| Initial launch | All pages at once (acceptable for pSEO) |
| New industry addition | Deploy all 20 pages (4 stages × 5 types) together |
| Link building | Internal links indexed faster than external |
| Sitemap submission | Submit after each major content batch |

### 14.6 Measuring Internal Linking Success

| Metric | Tool | Target |
|--------|------|--------|
| Pages with inbound links | Screaming Frog | 100% |
| Avg. internal links per page | Ahrefs Site Audit | 5+ |
| Orphan pages | GSC Coverage | 0 |
| Click depth | Screaming Frog | ≤3 |
| Link equity distribution | Ahrefs | Even across priority pages |
