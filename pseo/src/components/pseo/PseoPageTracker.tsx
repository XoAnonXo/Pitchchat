"use client";

import { useEffect } from "react";

import { trackPseoEvent, type PseoAnalyticsContext } from "@/lib/analytics";

export function PseoPageTracker({ context }: { context: PseoAnalyticsContext }) {
  useEffect(() => {
    trackPseoEvent("pseo_page_view", {
      ...context,
      label: "page_view",
    });
  }, [context]);

  return null;
}
