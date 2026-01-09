"use client";

import { useEffect } from "react";

import { trackPseoEvent, type PseoAnalyticsContext } from "@/lib/analytics";
import { useAnalytics } from "@/hooks/useAnalytics";

export function PseoPageTracker({ context }: { context: PseoAnalyticsContext }) {
  // K-anonymity analytics for proprietary data collection
  const { trackViewOnce } = useAnalytics({
    industrySlug: context.industry,
    stageSlug: context.stage,
  });

  useEffect(() => {
    // Track to Google Analytics
    trackPseoEvent("pseo_page_view", {
      ...context,
      label: "page_view",
    });

    // Track to k-anonymity analytics (pageType as category)
    trackViewOnce(context.pageType);
  }, [context, trackViewOnce]);

  return null;
}
