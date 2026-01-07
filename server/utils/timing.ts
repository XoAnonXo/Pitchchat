import { performance } from "perf_hooks";

const timingsEnabled = process.env.LOG_TIMINGS === "1";

export function isTimingEnabled() {
  return timingsEnabled;
}

export function logDuration(label: string, startTime: number) {
  if (!timingsEnabled) return;
  const ms = Math.round(performance.now() - startTime);
  console.log(`[timing] ${label} ${ms}ms`);
}

export async function timeAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
  if (!timingsEnabled) {
    return fn();
  }
  const start = performance.now();
  try {
    return await fn();
  } finally {
    logDuration(label, start);
  }
}
