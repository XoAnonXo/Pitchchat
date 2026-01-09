/**
 * Simple in-memory rate limiter for defense-in-depth.
 *
 * IMPORTANT: This is a backup rate limiter for development and non-Cloudflare deployments.
 * For production, configure Cloudflare WAF Rate Limiting Rules at the edge.
 *
 * Cloudflare WAF setup (recommended):
 * 1. Go to Cloudflare Dashboard > Security > WAF > Rate limiting rules
 * 2. Create rule:
 *    - Expression: (http.request.uri.path eq "/api/analytics/event")
 *    - Characteristics: IP
 *    - Rate: 100 requests per 60 seconds
 *    - Action: Block for 60 seconds
 *
 * This in-memory limiter:
 * - Uses sliding window algorithm
 * - Per-IP rate limiting
 * - Auto-cleans expired entries
 * - NOT distributed (won't work across multiple serverless instances)
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

/** Rate limit configuration */
export interface RateLimitConfig {
  /** Maximum requests allowed in the window */
  limit: number;
  /** Window duration in milliseconds */
  windowMs: number;
}

/** Rate limit check result */
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

/** Default config: 100 requests per minute per IP */
const DEFAULT_CONFIG: RateLimitConfig = {
  limit: 100,
  windowMs: 60 * 1000, // 1 minute
};

/** In-memory store for rate limit entries */
const store = new Map<string, RateLimitEntry>();

/** Cleanup interval handle */
let cleanupInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Start periodic cleanup of expired entries.
 * Called automatically on first rate limit check.
 */
function startCleanup(): void {
  if (cleanupInterval) return;

  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      if (entry.resetAt <= now) {
        store.delete(key);
      }
    }
  }, 60 * 1000); // Clean every minute

  // Don't prevent process from exiting
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }
}

/**
 * Check and increment rate limit for a given key (usually IP address).
 *
 * @param key - Unique identifier for the client (IP address)
 * @param config - Rate limit configuration
 * @returns Rate limit result with success status and headers info
 *
 * @example
 * ```ts
 * const ip = request.headers.get("cf-connecting-ip") || "unknown";
 * const result = checkRateLimit(ip);
 * if (!result.success) {
 *   return new Response("Too Many Requests", { status: 429 });
 * }
 * ```
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): RateLimitResult {
  startCleanup();

  const now = Date.now();
  const entry = store.get(key);

  // No existing entry or expired - create new window
  if (!entry || entry.resetAt <= now) {
    const resetAt = now + config.windowMs;
    store.set(key, { count: 1, resetAt });
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      resetAt,
    };
  }

  // Increment existing entry
  entry.count++;
  const success = entry.count <= config.limit;

  return {
    success,
    limit: config.limit,
    remaining: Math.max(0, config.limit - entry.count),
    resetAt: entry.resetAt,
  };
}

/**
 * Build rate limit headers for response.
 *
 * @param result - Rate limit check result
 * @returns Headers object with standard rate limit headers
 */
export function buildRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(result.resetAt / 1000).toString(),
  };
}

/**
 * Get client IP from request headers.
 * Supports Cloudflare, Vercel, and standard proxied requests.
 *
 * @param headers - Request headers
 * @returns Client IP address or "unknown"
 */
export function getClientIP(headers: Headers): string {
  // Cloudflare
  const cfIP = headers.get("cf-connecting-ip");
  if (cfIP) return cfIP;

  // Vercel
  const vercelIP = headers.get("x-vercel-forwarded-for");
  if (vercelIP) return vercelIP.split(",")[0].trim();

  // Standard proxy header
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  // Direct connection (dev)
  const realIP = headers.get("x-real-ip");
  if (realIP) return realIP;

  return "unknown";
}

/** Export config for testing */
export { DEFAULT_CONFIG };
