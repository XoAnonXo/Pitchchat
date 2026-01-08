"use client";

import { useEffect, useRef, useCallback } from "react";
import { trackEvent } from "@/lib/analytics";

const SCROLL_MILESTONES = [25, 50, 75, 100];
const THROTTLE_MS = 100;

function throttle<T extends (...args: unknown[]) => void>(
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
    const handleScroll = throttle(() => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          calculateScrollDepth();
          ticking.current = false;
        });
        ticking.current = true;
      }
    }, THROTTLE_MS);

    calculateScrollDepth();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [calculateScrollDepth]);

  return null;
}
