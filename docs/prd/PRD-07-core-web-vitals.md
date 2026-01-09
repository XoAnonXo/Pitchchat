# PRD-07: Core Web Vitals Optimization

**Version:** 1.0
**Status:** Draft
**Author:** Engineering
**Created:** 2026-01-08

---

## 1. Overview

### 1.1 Executive Summary

This PRD defines the optimization of Core Web Vitals (CWV) for pSEO pages to achieve "Good" scores across all metrics. Core Web Vitals are a Google ranking factor and directly impact user experience.

### 1.2 Goals

| Goal | Metric | Target |
|------|--------|--------|
| LCP (Largest Contentful Paint) | Loading performance | < 2.5s |
| INP (Interaction to Next Paint) | Interactivity | < 200ms |
| CLS (Cumulative Layout Shift) | Visual stability | < 0.1 |
| Overall CWV | PageSpeed Insights | "Good" for all |

### 1.3 Current State

To be measured via Google PageSpeed Insights for:
- `/investor-questions/ai/seed/investor-questions/`
- `/investor-questions/fintech/series-a/pitch-deck/`

---

## 2. Core Web Vitals Explained

### 2.1 LCP (Largest Contentful Paint)

Measures when the largest content element becomes visible.

| Score | Value |
|-------|-------|
| Good | ≤ 2.5s |
| Needs Improvement | 2.5s - 4s |
| Poor | > 4s |

**Common Causes of Poor LCP:**
- Slow server response times
- Render-blocking JavaScript/CSS
- Slow resource load times
- Client-side rendering

### 2.2 INP (Interaction to Next Paint)

Measures responsiveness to user interactions.

| Score | Value |
|-------|-------|
| Good | ≤ 200ms |
| Needs Improvement | 200ms - 500ms |
| Poor | > 500ms |

**Common Causes of Poor INP:**
- Long JavaScript tasks
- Main thread blocking
- Excessive DOM size

### 2.3 CLS (Cumulative Layout Shift)

Measures visual stability during page load.

| Score | Value |
|-------|-------|
| Good | ≤ 0.1 |
| Needs Improvement | 0.1 - 0.25 |
| Poor | > 0.25 |

**Common Causes of Poor CLS:**
- Images without dimensions
- Dynamically injected content
- Web fonts causing FOIT/FOUT
- Ads or embeds without reserved space

---

## 3. Optimization Strategies

### 3.1 Font Optimization

**Current State:** Using `next/font/google` with Geist font

**Optimizations:**

```typescript
// pseo/src/app/layout.tsx
import { GeistSans } from "geist/font/sans";

// Already optimal - next/font handles:
// - Automatic self-hosting (no external requests)
// - font-display: swap (prevents FOIT)
// - Preloading critical font files
```

**Additional Optimization:**

```html
<!-- Add to head for external font services if used -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

### 3.2 Image Optimization

**Use Next.js Image Component:**

```typescript
import Image from "next/image";

// Always specify width and height to prevent CLS
<Image
  src="/images/example.png"
  width={800}
  height={400}
  alt="Description"
  priority={isAboveFold} // Add priority for LCP images
  loading={isAboveFold ? undefined : "lazy"}
/>
```

**Image Best Practices:**
- Use WebP format (Next.js handles automatically)
- Specify explicit width/height attributes
- Use `priority` for above-the-fold images
- Lazy load below-the-fold images
- Use appropriate sizes for different viewports

### 3.3 JavaScript Optimization

**Dynamic Imports for Non-Critical Components:**

```typescript
// Before: Static import
import { PseoScrollTracker } from "@/components/pseo/PseoScrollTracker";

// After: Dynamic import
import dynamic from "next/dynamic";

const PseoScrollTracker = dynamic(
  () => import("@/components/pseo/PseoScrollTracker").then(mod => mod.PseoScrollTracker),
  { ssr: false }
);
```

**Bundle Analysis:**

```bash
# Add to package.json scripts
"analyze": "ANALYZE=true next build"

# Install analyzer
npm install @next/bundle-analyzer
```

**next.config.js:**

```javascript
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  // existing config
});
```

### 3.4 Critical CSS

Next.js App Router automatically handles critical CSS extraction. Ensure:

```typescript
// Use CSS Modules or Tailwind (atomic classes)
// Avoid large CSS files that block rendering

// Good: Tailwind classes (atomic, tree-shaken)
<div className="flex items-center justify-between p-4">

// Avoid: Large imported CSS files
// import "./heavy-styles.css";
```

### 3.5 Server Response Time (TTFB)

**Current:** Next.js on Railway with Edge caching

**Optimizations:**

1. **Static Generation with ISR:**
```typescript
// pseo/src/app/investor-questions/[industry]/[stage]/[pageType]/page.tsx

// Pre-generate all pages at build time
export async function generateStaticParams() {
  return allCombinations.map(({ industry, stage, pageType }) => ({
    industry,
    stage,
    pageType,
  }));
}

// Enable ISR with 24-hour revalidation
export const revalidate = 86400; // 24 hours in seconds

// Force static generation (no dynamic server rendering)
export const dynamic = "force-static";

// Disable dynamic params - only pre-generated paths work
export const dynamicParams = false;
```

2. **Comprehensive Next.js Config:**
```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable strict mode for better error catching
  reactStrictMode: true,

  // Optimize production builds
  swcMinify: true,

  // Enable experimental features for better performance
  experimental: {
    // Optimize package imports
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Comprehensive caching headers
  async headers() {
    return [
      // Static pSEO pages - aggressive caching
      {
        source: "/investor-questions/:path*",
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
      // Static assets - immutable
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Images - long cache
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // OG images - moderate cache with revalidation
      {
        source: "/api/og/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },

  // Rewrites for cleaner URLs if needed
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;
```

3. **Script Loading Strategy:**
```typescript
// pseo/src/app/layout.tsx
import Script from "next/script";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}

        {/* Analytics - load after interactive */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXX', {
              page_path: window.location.pathname,
              send_page_view: false
            });
          `}
        </Script>

        {/* Non-critical scripts - load when idle */}
        <Script
          src="/scripts/scroll-tracker.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
```

### 3.6 Resource Hints

**Add to layout.tsx:**

```typescript
export const metadata = {
  // DNS prefetch for external resources
  other: {
    "dns-prefetch": ["https://www.googletagmanager.com"],
  },
};

// Or in head:
<head>
  <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
  <link rel="preconnect" href="https://www.googletagmanager.com" />
</head>
```

---

## 4. Implementation Checklist

### 4.1 Fonts

- [ ] Verify `next/font` is used for all fonts
- [ ] Ensure `font-display: swap` is set
- [ ] Remove any external font CDN links
- [ ] Preload critical font files if needed

### 4.2 Images

- [ ] All images use Next.js `<Image>` component
- [ ] All images have explicit width/height
- [ ] Above-fold images have `priority` attribute
- [ ] Below-fold images have `loading="lazy"`
- [ ] No images without alt text

### 4.3 JavaScript

- [ ] Dynamic import non-critical components
- [ ] Run bundle analysis to identify large dependencies
- [ ] Remove unused dependencies from package.json
- [ ] Defer analytics scripts where possible

### 4.4 CSS

- [ ] Use Tailwind CSS (atomic classes)
- [ ] Remove unused CSS with PurgeCSS (built into Tailwind)
- [ ] Avoid CSS-in-JS with runtime overhead

### 4.5 Server

- [ ] Verify static generation is working
- [ ] Add appropriate cache headers
- [ ] Configure CDN caching if available

---

## 5. Monitoring

### 5.1 Google Search Console

- Navigate to Core Web Vitals report
- Monitor Mobile and Desktop scores
- Address any URLs in "Poor" or "Needs Improvement"

### 5.2 PageSpeed Insights

Test representative URLs:
- Homepage: `/investor-questions/`
- Content page: `/investor-questions/ai/seed/investor-questions/`

### 5.3 Web Vitals Library

**Add real user monitoring:**

```typescript
// pseo/src/components/pseo/PseoWebVitals.tsx
"use client";

import { useEffect } from "react";
import { onCLS, onINP, onLCP } from "web-vitals";
import { trackEvent } from "@/lib/analytics";

export function PseoWebVitals() {
  useEffect(() => {
    onCLS((metric) => {
      trackEvent("web_vitals", {
        metric_name: "CLS",
        metric_value: metric.value,
        metric_rating: metric.rating,
      });
    });

    onINP((metric) => {
      trackEvent("web_vitals", {
        metric_name: "INP",
        metric_value: metric.value,
        metric_rating: metric.rating,
      });
    });

    onLCP((metric) => {
      trackEvent("web_vitals", {
        metric_name: "LCP",
        metric_value: metric.value,
        metric_rating: metric.rating,
      });
    });
  }, []);

  return null;
}
```

**Install dependency:**

```bash
npm install web-vitals
```

---

## 6. Common Issues & Fixes

### 6.1 LCP Issues

| Issue | Fix |
|-------|-----|
| Large hero image | Use `priority`, optimize size, use WebP |
| Web fonts blocking | Use `next/font` with `display: swap` |
| Slow TTFB | Enable static generation, add caching |
| Third-party scripts | Defer non-critical scripts |

### 6.2 INP Issues

| Issue | Fix |
|-------|-----|
| Long JavaScript tasks | Break into smaller chunks |
| Heavy event handlers | Debounce scroll/resize handlers |
| Large DOM | Virtualize long lists |
| Main thread blocking | Use Web Workers for heavy computation |

### 6.3 CLS Issues

| Issue | Fix |
|-------|-----|
| Images without dimensions | Add width/height attributes |
| Font swap | Use `font-display: optional` or preload |
| Dynamic content | Reserve space with CSS |
| Ads/embeds | Reserve space with min-height |

---

## 7. Acceptance Criteria

### 7.1 PageSpeed Insights Scores

- [ ] Mobile LCP < 2.5s
- [ ] Mobile INP < 200ms
- [ ] Mobile CLS < 0.1
- [ ] Desktop LCP < 2.5s
- [ ] Desktop INP < 200ms
- [ ] Desktop CLS < 0.1

### 7.2 Google Search Console

- [ ] No URLs in "Poor" category
- [ ] < 10% URLs in "Needs Improvement"
- [ ] 90%+ URLs in "Good" category

### 7.3 Real User Metrics

- [ ] 75th percentile LCP < 2.5s
- [ ] 75th percentile INP < 200ms
- [ ] 75th percentile CLS < 0.1

---

## 8. Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| next/font | Framework | Available |
| next/image | Framework | Available |
| web-vitals | npm package | To install |
| @next/bundle-analyzer | npm package | To install |

---

## 9. Testing

### 9.1 Tools

| Tool | Purpose |
|------|---------|
| PageSpeed Insights | Lab data, recommendations |
| Chrome DevTools Lighthouse | Local testing |
| Chrome DevTools Performance | Detailed analysis |
| WebPageTest | Advanced performance testing |
| Search Console | Field data from real users |

### 9.2 Test URLs

Test at minimum:
- `/investor-questions/` (index)
- `/investor-questions/ai/seed/investor-questions/`
- `/investor-questions/fintech/series-a/pitch-deck/`
- `/investor-questions/healthcare/seed/metrics-benchmarks/`

### 9.3 Test Conditions

| Condition | Setting |
|-----------|---------|
| Device | Mobile (primary), Desktop |
| Network | Slow 4G simulation |
| CPU | 4x slowdown |

---

## 10. Timeline

| Phase | Task | Duration |
|-------|------|----------|
| 1 | Baseline measurement | 1 day |
| 2 | Font & image optimization | 2 days |
| 3 | JavaScript optimization | 2 days |
| 4 | Caching & server optimization | 1 day |
| 5 | Monitoring setup | 1 day |
| 6 | Verification & iteration | 2 days |

---

## 11. Advanced Optimizations

### 11.1 Prefetching Strategy

```typescript
// pseo/src/components/pseo/PseoPrefetch.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface PrefetchLink {
  href: string;
  priority: "high" | "low";
}

export function PseoPrefetch({ links }: { links: PrefetchLink[] }) {
  const router = useRouter();

  useEffect(() => {
    // Prefetch high-priority links immediately
    const highPriority = links.filter((l) => l.priority === "high");
    highPriority.forEach((link) => router.prefetch(link.href));

    // Prefetch low-priority links when idle
    if ("requestIdleCallback" in window) {
      const lowPriority = links.filter((l) => l.priority === "low");
      requestIdleCallback(() => {
        lowPriority.forEach((link) => router.prefetch(link.href));
      });
    }
  }, [links, router]);

  return null;
}
```

### 11.2 Resource Hints in Head

```typescript
// pseo/src/app/investor-questions/[industry]/[stage]/[pageType]/page.tsx

export async function generateMetadata({ params }) {
  // Generate resource hints for related pages
  return {
    other: {
      // Prefetch related content
      "link": [
        { rel: "prefetch", href: `/investor-questions/${params.industry}/` },
        { rel: "dns-prefetch", href: "https://www.googletagmanager.com" },
      ],
    },
  };
}
```

### 11.3 Skeleton Loading States

```typescript
// pseo/src/components/pseo/PseoSkeleton.tsx
export function PseoContentSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Title skeleton */}
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />

      {/* Summary skeleton */}
      <div className="h-4 bg-gray-200 rounded w-full mb-2" />
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-6" />

      {/* Content skeleton */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-full mb-1" />
          <div className="h-4 bg-gray-200 rounded w-4/5" />
        </div>
      ))}
    </div>
  );
}
```

### 11.4 Lighthouse CI Configuration

**File:** `lighthouserc.js`

```javascript
module.exports = {
  ci: {
    collect: {
      url: [
        "http://localhost:3000/investor-questions/",
        "http://localhost:3000/investor-questions/ai/seed/investor-questions/",
        "http://localhost:3000/investor-questions/fintech/series-a/pitch-deck/",
      ],
      numberOfRuns: 3,
      settings: {
        preset: "desktop",
        throttling: {
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
        "first-contentful-paint": ["error", { maxNumericValue: 1500 }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500 }],
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["error", { maxNumericValue: 200 }],
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
```

### 11.5 CI/CD Integration

**File:** `.github/workflows/lighthouse.yml`

```yaml
name: Lighthouse CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lighthouse:
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

      - name: Build
        run: npm run build
        working-directory: ./pseo

      - name: Start server
        run: npm run start &
        working-directory: ./pseo

      - name: Wait for server
        run: npx wait-on http://localhost:3000

      - name: Run Lighthouse CI
        run: npx @lhci/cli autorun
        working-directory: ./pseo
```
