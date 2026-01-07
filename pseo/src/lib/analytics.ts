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
