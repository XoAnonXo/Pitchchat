"use client";

import { useCallback, useMemo, useRef } from "react";

type EventType = "view" | "rating" | "expansion" | "copy";

interface AnalyticsContext {
  industrySlug: string;
  stageSlug: string;
}

interface TrackEventOptions {
  category?: string;
  ratingValue?: number;
  searchTerm?: string;
}

/**
 * Generate a random session ID for analytics tracking.
 * This ID is hashed server-side and never stored in identifiable form.
 */
function generateSessionId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Get or create a session ID stored in sessionStorage.
 * Using sessionStorage means the ID is unique per browser tab/session.
 */
function getSessionId(): string {
  if (typeof window === "undefined") return "";

  const STORAGE_KEY = "pseo_analytics_session";
  let sessionId = sessionStorage.getItem(STORAGE_KEY);

  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(STORAGE_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Send an analytics event to the backend.
 * Uses navigator.sendBeacon for reliability (fires even on page unload).
 */
async function sendEvent(
  eventType: EventType,
  context: AnalyticsContext,
  options: TrackEventOptions = {}
): Promise<void> {
  if (typeof window === "undefined") return;

  const sessionId = getSessionId();
  if (!sessionId) return;

  const payload = {
    eventType,
    industrySlug: context.industrySlug,
    stageSlug: context.stageSlug,
    sessionId,
    ...options,
  };

  try {
    // Use sendBeacon if available (more reliable for page unload)
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      navigator.sendBeacon("/api/analytics/event", blob);
    } else {
      // Fallback to fetch
      await fetch("/api/analytics/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    }
  } catch {
    // Silently ignore analytics errors - they shouldn't break the app
  }
}

/**
 * Hook for tracking analytics events with k-anonymity protection.
 *
 * @param context - The industry and stage context for events
 * @returns Object with tracking functions
 *
 * @example
 * ```tsx
 * const { trackView, trackExpansion, trackCopy, trackRating } = useAnalytics({
 *   industrySlug: "saas",
 *   stageSlug: "seed",
 * });
 *
 * // Track page view on mount
 * useEffect(() => { trackView("Unit Economics"); }, []);
 *
 * // Track when user expands an answer
 * <button onClick={() => trackExpansion("Unit Economics")}>Expand</button>
 * ```
 */
export function useAnalytics(context: AnalyticsContext) {
  const hasTrackedView = useRef(false);

  // Memoize context to prevent re-renders when parent passes new object reference
  const stableContext = useMemo(
    () => ({ industrySlug: context.industrySlug, stageSlug: context.stageSlug }),
    [context.industrySlug, context.stageSlug]
  );

  /**
   * Track a page/category view
   */
  const trackView = useCallback(
    (category?: string) => {
      sendEvent("view", stableContext, { category });
    },
    [stableContext]
  );

  /**
   * Track answer expansion (user clicked to see full answer)
   */
  const trackExpansion = useCallback(
    (category?: string) => {
      sendEvent("expansion", stableContext, { category });
    },
    [stableContext]
  );

  /**
   * Track answer copy (user copied answer text)
   */
  const trackCopy = useCallback(
    (category?: string) => {
      sendEvent("copy", stableContext, { category });
    },
    [stableContext]
  );

  /**
   * Track helpfulness rating (1-5 scale)
   */
  const trackRating = useCallback(
    (ratingValue: number, category?: string) => {
      if (ratingValue < 1 || ratingValue > 5) return;
      sendEvent("rating", stableContext, { ratingValue, category });
    },
    [stableContext]
  );

  /**
   * Track view once on component mount
   */
  const trackViewOnce = useCallback(
    (category?: string) => {
      if (hasTrackedView.current) return;
      hasTrackedView.current = true;
      trackView(category);
    },
    [trackView]
  );

  return {
    trackView,
    trackViewOnce,
    trackExpansion,
    trackCopy,
    trackRating,
  };
}

/**
 * Standalone function to track view events outside of React components.
 * Useful for tracking in server components or API routes.
 */
export function trackPageView(
  industrySlug: string,
  stageSlug: string,
  category?: string
): void {
  sendEvent("view", { industrySlug, stageSlug }, { category });
}
