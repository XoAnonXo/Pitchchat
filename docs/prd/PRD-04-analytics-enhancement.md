# PRD-04: Enhanced Analytics Tracking

**Version:** 1.0
**Status:** Draft
**Author:** Engineering
**Created:** 2026-01-08

---

## 1. Overview

### 1.1 Executive Summary

This PRD defines the implementation of enhanced analytics tracking for pSEO pages, including scroll depth tracking, time on page tracking, and conversion funnel analysis. The goal is to understand user engagement patterns and optimize for conversions.

### 1.2 Goals

| Goal | Metric | Target |
|------|--------|--------|
| Engagement visibility | Scroll depth data | 100% pages tracked |
| Time tracking | Average time on page | Baseline + 20% |
| Funnel analysis | Click-through tracking | All internal links |
| Conversion attribution | CTA click tracking | 100% CTAs tracked |

### 1.3 Current State

Existing analytics:
- GA4 page views via `PseoPageTracker.tsx`
- CTA click tracking via `PseoCtaButton.tsx`
- Consent Mode v2 implementation

Missing:
- Scroll depth tracking
- Time on page tracking
- Internal link click tracking
- Funnel visualization data

---

## 2. User Stories

1. **As a growth marketer**, I want to see how far users scroll on each page type so I can optimize content placement.

2. **As a product manager**, I want to know which pages have the highest engagement time so I can understand content quality.

3. **As a conversion optimizer**, I want to track the complete funnel from page view to CTA click to understand drop-off points.

---

## 3. Technical Requirements

### 3.1 Scroll Depth Tracking Component (with Throttling)

**New File:** `pseo/src/components/pseo/PseoScrollTracker.tsx`

```typescript
"use client";

import { useEffect, useRef, useCallback } from "react";
import { trackEvent } from "@/lib/analytics";

const SCROLL_MILESTONES = [25, 50, 75, 100];
const THROTTLE_MS = 100; // Throttle scroll handler to 100ms

// Throttle utility function
function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number
): T {
  let inThrottle = false;
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}

export function PseoScrollTracker() {
  const trackedMilestones = useRef<Set<number>>(new Set());
  const ticking = useRef(false);

  const calculateScrollDepth = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Guard against division by zero on short pages
    if (docHeight <= 0) return;

    const scrollPercent = Math.round((scrollTop / docHeight) * 100);

    SCROLL_MILESTONES.forEach((milestone) => {
      if (scrollPercent >= milestone && !trackedMilestones.current.has(milestone)) {
        trackedMilestones.current.add(milestone);
        trackEvent("scroll_depth", {
          depth: milestone,
          page_path: window.location.pathname,
        });
      }
    });
  }, []);

  useEffect(() => {
    // Use requestAnimationFrame for smoother performance
    const handleScroll = throttle(() => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          calculateScrollDepth();
          ticking.current = false;
        });
        ticking.current = true;
      }
    }, THROTTLE_MS);

    // Initial check for pages that load scrolled
    calculateScrollDepth();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [calculateScrollDepth]);

  return null;
}
```

### 3.2 Time on Page Tracking Component (with Page Visibility API)

**New File:** `pseo/src/components/pseo/PseoTimeTracker.tsx`

```typescript
"use client";

import { useEffect, useRef, useCallback } from "react";
import { trackEvent } from "@/lib/analytics";

const TIME_MILESTONES = [30, 60, 120, 300]; // seconds
const CHECK_INTERVAL_MS = 1000; // Check every second for more accurate tracking
const SESSION_KEY = "pseo_time_tracker";

interface SessionData {
  path: string;
  elapsed: number;
  trackedMilestones: number[];
}

export function PseoTimeTracker() {
  const trackedTimes = useRef<Set<number>>(new Set());
  const activeTime = useRef<number>(0);
  const lastTickTime = useRef<number>(Date.now());
  const isVisible = useRef<boolean>(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Restore session data if returning to same page
  const restoreSession = useCallback(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        const data: SessionData = JSON.parse(stored);
        if (data.path === window.location.pathname) {
          activeTime.current = data.elapsed;
          data.trackedMilestones.forEach((m) => trackedTimes.current.add(m));
        } else {
          // Different page, clear session
          sessionStorage.removeItem(SESSION_KEY);
        }
      }
    } catch {
      // Session storage not available or corrupted
    }
  }, []);

  // Persist session data
  const persistSession = useCallback(() => {
    try {
      const data: SessionData = {
        path: window.location.pathname,
        elapsed: activeTime.current,
        trackedMilestones: Array.from(trackedTimes.current),
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
    } catch {
      // Session storage not available
    }
  }, []);

  const checkTime = useCallback(() => {
    // Only count time when page is visible
    if (!isVisible.current) {
      lastTickTime.current = Date.now();
      return;
    }

    const now = Date.now();
    const delta = (now - lastTickTime.current) / 1000;
    lastTickTime.current = now;
    activeTime.current += delta;

    const elapsed = Math.floor(activeTime.current);

    TIME_MILESTONES.forEach((milestone) => {
      if (elapsed >= milestone && !trackedTimes.current.has(milestone)) {
        trackedTimes.current.add(milestone);
        trackEvent("time_on_page", {
          seconds: milestone,
          page_path: window.location.pathname,
          was_visible: true,
        });
        persistSession();
      }
    });
  }, [persistSession]);

  useEffect(() => {
    // Restore any previous session
    restoreSession();

    // Page Visibility API handler
    const handleVisibilityChange = () => {
      isVisible.current = document.visibilityState === "visible";

      if (isVisible.current) {
        // Resuming - reset lastTickTime to avoid counting hidden time
        lastTickTime.current = Date.now();
      } else {
        // Going hidden - persist current state
        persistSession();
      }
    };

    // Handle page unload
    const handleBeforeUnload = () => {
      persistSession();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Start tracking
    lastTickTime.current = Date.now();
    intervalRef.current = setInterval(checkTime, CHECK_INTERVAL_MS);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      persistSession();
    };
  }, [checkTime, restoreSession, persistSession]);

  return null;
}
```

### 3.2.1 Benefits of Page Visibility API Integration

| Feature | Benefit |
|---------|---------|
| Accurate time tracking | Only counts time when tab is active/visible |
| Session persistence | Preserves time across soft navigations |
| Battery efficient | Pauses tracking when tab is hidden |
| Realistic engagement | Reflects actual user attention |

### 3.3 Internal Link Tracking

**Modify:** `pseo/src/components/pseo/PseoInternalLinks.tsx`

Add click tracking to all internal links:

```typescript
import { trackEvent } from "@/lib/analytics";

const handleLinkClick = (destinationUrl: string, linkType: string) => {
  trackEvent("internal_link_click", {
    destination_url: destinationUrl,
    link_type: linkType, // "related_content", "breadcrumb", "footer"
    source_page: window.location.pathname,
  });
};

// In link render:
<Link
  href={url}
  onClick={() => handleLinkClick(url, "related_content")}
>
  {label}
</Link>
```

### 3.4 Analytics Event Types

**Update:** `pseo/src/lib/analytics.ts`

```typescript
export type AnalyticsEventName =
  | "page_view"
  | "cta_click"
  | "scroll_depth"
  | "time_on_page"
  | "internal_link_click"
  | "external_link_click";

export interface AnalyticsEventParams {
  page_view: { page_path: string; page_title: string };
  cta_click: { cta_type: string; page_path: string };
  scroll_depth: { depth: number; page_path: string };
  time_on_page: { seconds: number; page_path: string };
  internal_link_click: {
    destination_url: string;
    link_type: string;
    source_page: string;
  };
  external_link_click: {
    destination_url: string;
    source_page: string;
  };
}
```

---

## 4. GA4 Configuration

### 4.1 Custom Dimensions

Create in GA4 Admin > Custom definitions:

| Dimension Name | Scope | Parameter |
|----------------|-------|-----------|
| Scroll Depth | Event | depth |
| Time on Page | Event | seconds |
| Link Type | Event | link_type |
| Source Page | Event | source_page |

### 4.2 Conversion Events

Mark as conversions in GA4:
- `cta_click` (primary conversion)
- `scroll_depth` when depth = 100 (engagement)
- `time_on_page` when seconds >= 120 (quality engagement)

---

## 5. Integration Points

### 5.1 Layout Integration

**Update:** `pseo/src/app/layout.tsx`

```typescript
import { PseoScrollTracker } from "@/components/pseo/PseoScrollTracker";
import { PseoTimeTracker } from "@/components/pseo/PseoTimeTracker";

// In the body:
<body>
  {children}
  <PseoScrollTracker />
  <PseoTimeTracker />
</body>
```

### 5.2 Template Integration

All templates already include `PseoPageTracker` for page views. Internal link tracking will be added to:
- `PseoInternalLinks.tsx`
- `PseoBreadcrumbs.tsx` (new)
- Footer component

---

## 6. Acceptance Criteria

### 6.1 Scroll Depth
- [ ] Tracks 25%, 50%, 75%, 100% scroll milestones
- [ ] Each milestone fires only once per page view
- [ ] Events visible in GA4 Realtime
- [ ] Includes page_path in all events

### 6.2 Time on Page
- [ ] Tracks 30s, 60s, 120s, 300s milestones
- [ ] Timer resets on page navigation
- [ ] Events visible in GA4 Realtime
- [ ] Stops tracking when page is backgrounded (optional)

### 6.3 Link Tracking
- [ ] All internal links fire click events
- [ ] Events include destination URL and link type
- [ ] Events include source page path
- [ ] No duplicate events on rapid clicks

### 6.4 Data Quality
- [ ] Events respect Consent Mode v2
- [ ] No PII in event parameters
- [ ] Events visible in GA4 DebugView

---

## 7. Reporting

### 7.1 GA4 Exploration Reports

Create the following reports:

| Report | Purpose |
|--------|---------|
| Scroll Funnel | Visualize drop-off at each scroll milestone |
| Engagement by Page Type | Compare time/scroll by investor-questions, pitch-deck, etc. |
| Internal Link Flow | Path analysis from pSEO to main app |
| Conversion Attribution | Which pages drive most CTA clicks |

### 7.2 Key Metrics to Monitor

| Metric | Definition | Target |
|--------|------------|--------|
| Avg. Scroll Depth | Mean scroll % across all pages | 60%+ |
| Engaged Sessions | Sessions with 100% scroll OR 120s+ time | 30%+ |
| Link CTR | Internal link clicks / page views | 5%+ |
| CTA CTR | CTA clicks / page views | 2%+ |

---

## 8. Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| GA4 property | External | Configured |
| Consent Mode v2 | Internal | Implemented |
| trackEvent function | Internal | Implemented |

---

## 9. Privacy Considerations

- All events respect user consent choices
- No personally identifiable information (PII) collected
- Page paths are anonymized (no query parameters)
- IP anonymization enabled in GA4

---

## 10. Testing

### 10.1 Test Scenarios

| Scenario | Expected Result |
|----------|-----------------|
| Scroll to 50% | `scroll_depth` event with depth=25, then depth=50 |
| Stay 2 minutes | `time_on_page` events at 30s, 60s, 120s |
| Click internal link | `internal_link_click` event with correct params |
| Refresh page | Scroll/time trackers reset |

### 10.2 Tools

| Tool | Purpose |
|------|---------|
| GA4 DebugView | Real-time event inspection |
| Chrome DevTools | Network request verification |
| GA4 Realtime | Immediate event visibility |

---

## 11. Advanced Analytics Patterns

### 11.1 GTM Data Layer Integration

If using Google Tag Manager alongside GA4:

```typescript
// pseo/src/lib/analytics.ts
declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
  }
}

export function pushToDataLayer(event: string, data: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    ...data,
    timestamp: new Date().toISOString(),
  });
}

// Enhanced trackEvent with GTM support
export function trackEvent<T extends AnalyticsEventName>(
  event: T,
  params: AnalyticsEventParams[T]
) {
  // GA4 direct tracking
  if (typeof gtag !== "undefined") {
    gtag("event", event, params);
  }

  // GTM data layer (for custom triggers)
  pushToDataLayer(event, params);
}
```

### 11.2 Debounced Link Click Handler

Prevent duplicate events from rapid clicks:

```typescript
// pseo/src/lib/analytics.ts
const clickTimestamps = new Map<string, number>();
const DEBOUNCE_MS = 500;

export function trackLinkClick(
  destinationUrl: string,
  linkType: string,
  sourcePage: string
) {
  const key = `${sourcePage}:${destinationUrl}`;
  const now = Date.now();
  const lastClick = clickTimestamps.get(key) || 0;

  if (now - lastClick < DEBOUNCE_MS) {
    return; // Ignore duplicate click
  }

  clickTimestamps.set(key, now);

  trackEvent("internal_link_click", {
    destination_url: destinationUrl,
    link_type: linkType,
    source_page: sourcePage,
  });
}
```

### 11.3 Engagement Score Calculation

```typescript
// pseo/src/lib/engagement-score.ts
interface EngagementMetrics {
  scrollDepth: number; // 0-100
  timeOnPage: number; // seconds
  interactions: number; // clicks, etc.
}

export function calculateEngagementScore(metrics: EngagementMetrics): number {
  const scrollScore = (metrics.scrollDepth / 100) * 30; // Max 30 points
  const timeScore = Math.min(metrics.timeOnPage / 300, 1) * 40; // Max 40 points (5 min cap)
  const interactionScore = Math.min(metrics.interactions, 5) * 6; // Max 30 points (5 interactions)

  return Math.round(scrollScore + timeScore + interactionScore);
}

// Track engagement score on page exit
export function trackEngagementOnExit(metrics: EngagementMetrics) {
  const score = calculateEngagementScore(metrics);

  trackEvent("engagement_score", {
    score,
    scroll_depth: metrics.scrollDepth,
    time_on_page: metrics.timeOnPage,
    interactions: metrics.interactions,
    page_path: window.location.pathname,
  });
}
```

### 11.4 Custom Dimension Mapping

```typescript
// GA4 custom dimensions to register
const CUSTOM_DIMENSIONS = {
  // Event-scoped
  scroll_depth: "depth",
  time_milestone: "seconds",
  link_type: "link_type",
  source_page: "source_page",
  engagement_score: "score",

  // User-scoped (set once)
  user_type: "user_type", // "new" | "returning"

  // Session-scoped
  session_engagement: "session_engagement", // "low" | "medium" | "high"
};

// Set user-scoped dimensions
export function setUserDimensions() {
  const isReturning = localStorage.getItem("pseo_visited") === "true";

  if (!isReturning) {
    localStorage.setItem("pseo_visited", "true");
  }

  gtag("set", "user_properties", {
    user_type: isReturning ? "returning" : "new",
  });
}
```

---

## 12. Performance Impact Considerations

### 12.1 Event Batching

For high-frequency events, consider batching:

```typescript
// pseo/src/lib/analytics.ts
const eventQueue: Array<{ event: string; params: object }> = [];
let flushTimeout: NodeJS.Timeout | null = null;
const BATCH_INTERVAL_MS = 2000;

function queueEvent(event: string, params: object) {
  eventQueue.push({ event, params });

  if (!flushTimeout) {
    flushTimeout = setTimeout(flushEventQueue, BATCH_INTERVAL_MS);
  }
}

function flushEventQueue() {
  if (eventQueue.length === 0) return;

  const events = [...eventQueue];
  eventQueue.length = 0;
  flushTimeout = null;

  events.forEach(({ event, params }) => {
    gtag("event", event, params);
  });
}

// Flush on page unload
window.addEventListener("beforeunload", flushEventQueue);
```

### 12.2 Lazy Loading Analytics

```typescript
// pseo/src/components/pseo/PseoAnalyticsLoader.tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const PseoScrollTracker = dynamic(
  () => import("./PseoScrollTracker").then((mod) => mod.PseoScrollTracker),
  { ssr: false }
);

const PseoTimeTracker = dynamic(
  () => import("./PseoTimeTracker").then((mod) => mod.PseoTimeTracker),
  { ssr: false }
);

export function PseoAnalyticsLoader() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Delay loading analytics until after initial paint
    const timeout = setTimeout(() => setShouldLoad(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  if (!shouldLoad) return null;

  return (
    <>
      <PseoScrollTracker />
      <PseoTimeTracker />
    </>
  );
}
```
