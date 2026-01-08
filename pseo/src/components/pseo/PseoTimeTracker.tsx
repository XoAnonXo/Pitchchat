"use client";

import { useEffect, useRef, useCallback } from "react";
import { trackEvent } from "@/lib/analytics";

const TIME_MILESTONES = [30, 60, 120, 300];
const CHECK_INTERVAL_MS = 1000;
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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const restoreSession = useCallback(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        const data: SessionData = JSON.parse(stored);
        if (data.path === window.location.pathname) {
          activeTime.current = data.elapsed;
          data.trackedMilestones.forEach((m) => trackedTimes.current.add(m));
        } else {
          sessionStorage.removeItem(SESSION_KEY);
        }
      }
    } catch {
      // Session storage not available or corrupted
    }
  }, []);

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
    restoreSession();

    const handleVisibilityChange = () => {
      isVisible.current = document.visibilityState === "visible";

      if (isVisible.current) {
        lastTickTime.current = Date.now();
      } else {
        persistSession();
      }
    };

    const handleBeforeUnload = () => {
      persistSession();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

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
