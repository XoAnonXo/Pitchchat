export type PseoAnalyticsContext = {
  industry: string;
  stage: string;
  pageType: string;
};

type PseoEventPayload = PseoAnalyticsContext & {
  label: string;
  variant?: string;
  location?: string;
};

type WindowWithAnalytics = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: Array<Record<string, unknown>>;
};

export function trackPseoEvent(eventName: string, payload: PseoEventPayload) {
  if (typeof window === "undefined") return;

  const analyticsWindow = window as WindowWithAnalytics;
  const eventPayload = {
    ...payload,
    location: payload.location ?? window.location.pathname,
  };

  if (typeof analyticsWindow.gtag === "function") {
    analyticsWindow.gtag("event", eventName, eventPayload);
    return;
  }

  if (Array.isArray(analyticsWindow.dataLayer)) {
    analyticsWindow.dataLayer.push({ event: eventName, ...eventPayload });
  }
}

/**
 * Generic event tracking function for scroll depth, time on page, and link clicks
 */
export function trackEvent(eventName: string, params: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  const analyticsWindow = window as WindowWithAnalytics;

  if (typeof analyticsWindow.gtag === "function") {
    analyticsWindow.gtag("event", eventName, params);
    return;
  }

  if (Array.isArray(analyticsWindow.dataLayer)) {
    analyticsWindow.dataLayer.push({ event: eventName, ...params });
  }
}

/**
 * Debounced link click tracking to prevent duplicate events from rapid clicks
 */
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
