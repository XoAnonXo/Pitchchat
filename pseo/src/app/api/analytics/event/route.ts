import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { pseoAnalyticsEvents } from "@/db/schema";
import { createHash } from "crypto";
import { checkRateLimit, buildRateLimitHeaders, getClientIP } from "@/lib/rateLimit";

/**
 * Valid event types for analytics tracking
 */
export const VALID_EVENT_TYPES = ["view", "rating", "expansion", "copy"] as const;
export type EventType = (typeof VALID_EVENT_TYPES)[number];

/**
 * CORS allowlist for analytics endpoint.
 * Only these origins can submit analytics events.
 */
const ALLOWED_ORIGINS = [
  "https://pitchchat.com",
  "https://www.pitchchat.com",
  "https://app.pitchchat.com",
  // Development origins
  ...(process.env.NODE_ENV === "development"
    ? ["http://localhost:3000", "http://127.0.0.1:3000"]
    : []),
];

/**
 * Get CORS origin header value.
 * Returns the origin if it's in the allowlist, otherwise null.
 */
function getCorsOrigin(request: NextRequest): string | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  return ALLOWED_ORIGINS.includes(origin) ? origin : null;
}

/**
 * Request body schema for analytics events
 */
interface AnalyticsEventRequest {
  eventType: EventType;
  industrySlug: string;
  stageSlug: string;
  category?: string;
  ratingValue?: number;
  searchTerm?: string;
  /** Client-generated session ID (will be hashed server-side) */
  sessionId: string;
}

/**
 * Generate a non-reversible hash from session ID + salt
 * This ensures we can deduplicate without storing identifiable data
 */
function hashSessionId(sessionId: string): string {
  const salt = process.env.ANALYTICS_SALT;
  if (!salt && process.env.NODE_ENV === "production") {
    throw new Error("ANALYTICS_SALT environment variable is required in production");
  }
  return createHash("sha256")
    .update(sessionId + (salt || "dev-salt-not-for-production"))
    .digest("hex")
    .substring(0, 64);
}

/**
 * Hash search terms to prevent storing potentially identifying queries
 */
function hashSearchTerm(term: string): string {
  const salt = process.env.ANALYTICS_SALT;
  if (!salt && process.env.NODE_ENV === "production") {
    throw new Error("ANALYTICS_SALT environment variable is required in production");
  }
  return createHash("sha256")
    .update(term.toLowerCase().trim() + (salt || "dev-salt-not-for-production"))
    .digest("hex")
    .substring(0, 64);
}

/**
 * Validate the request body
 */
function validateRequest(
  body: unknown
): { valid: true; data: AnalyticsEventRequest } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be an object" };
  }

  const data = body as Record<string, unknown>;

  // Required fields
  if (!data.eventType || typeof data.eventType !== "string") {
    return { valid: false, error: "eventType is required" };
  }
  if (!VALID_EVENT_TYPES.includes(data.eventType as EventType)) {
    return { valid: false, error: `eventType must be one of: ${VALID_EVENT_TYPES.join(", ")}` };
  }
  if (!data.industrySlug || typeof data.industrySlug !== "string") {
    return { valid: false, error: "industrySlug is required" };
  }
  if (!data.stageSlug || typeof data.stageSlug !== "string") {
    return { valid: false, error: "stageSlug is required" };
  }
  if (!data.sessionId || typeof data.sessionId !== "string") {
    return { valid: false, error: "sessionId is required" };
  }

  // Validate slug formats (alphanumeric + hyphens only)
  const slugPattern = /^[a-z0-9-]+$/;
  if (!slugPattern.test(data.industrySlug)) {
    return { valid: false, error: "Invalid industrySlug format" };
  }
  if (!slugPattern.test(data.stageSlug)) {
    return { valid: false, error: "Invalid stageSlug format" };
  }

  // Rating validation
  if (data.eventType === "rating") {
    if (typeof data.ratingValue !== "number" || data.ratingValue < 1 || data.ratingValue > 5) {
      return { valid: false, error: "ratingValue must be a number between 1 and 5 for rating events" };
    }
  }

  // Optional field validation with length limits
  if (data.category !== undefined) {
    if (typeof data.category !== "string") {
      return { valid: false, error: "category must be a string" };
    }
    if (data.category.length > 120) {
      return { valid: false, error: "category must be 120 characters or less" };
    }
  }
  if (data.searchTerm !== undefined) {
    if (typeof data.searchTerm !== "string") {
      return { valid: false, error: "searchTerm must be a string" };
    }
    if (data.searchTerm.length > 500) {
      return { valid: false, error: "searchTerm must be 500 characters or less" };
    }
  }

  // Validate slug lengths
  if (data.industrySlug.length > 64 || data.stageSlug.length > 64) {
    return { valid: false, error: "slug values must be 64 characters or less" };
  }
  if (data.sessionId.length > 128) {
    return { valid: false, error: "sessionId must be 128 characters or less" };
  }

  return {
    valid: true,
    data: {
      eventType: data.eventType as EventType,
      industrySlug: data.industrySlug,
      stageSlug: data.stageSlug,
      category: data.category as string | undefined,
      ratingValue: data.ratingValue as number | undefined,
      searchTerm: data.searchTerm as string | undefined,
      sessionId: data.sessionId,
    },
  };
}

/**
 * Build CORS headers for a request
 */
function buildCorsHeaders(request: NextRequest): HeadersInit {
  const origin = getCorsOrigin(request);
  const headers: HeadersInit = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (origin) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

/**
 * POST /api/analytics/event
 * Records an analytics event for k-anonymity aggregation
 */
export async function POST(request: NextRequest) {
  const corsHeaders = buildCorsHeaders(request);

  // Rate limiting (defense-in-depth, primary limit should be at Cloudflare WAF)
  const clientIP = getClientIP(request.headers);
  const rateLimitResult = checkRateLimit(clientIP);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          ...corsHeaders,
          ...buildRateLimitHeaders(rateLimitResult),
          "Retry-After": Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  // Reject requests from non-allowed origins
  const origin = getCorsOrigin(request);
  if (!origin && request.headers.get("origin")) {
    return NextResponse.json(
      { error: "Origin not allowed" },
      { status: 403, headers: corsHeaders }
    );
  }

  try {
    const db = getDb();
    if (!db) {
      // Silently succeed if no database - analytics are optional
      return NextResponse.json({ success: true, stored: false }, { headers: corsHeaders });
    }

    const body = await request.json();
    const validation = validateRequest(body);

    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400, headers: corsHeaders });
    }

    const { data } = validation;

    // Hash identifiers for privacy
    const sessionHash = hashSessionId(data.sessionId);
    const searchTermHash = data.searchTerm ? hashSearchTerm(data.searchTerm) : null;

    // Insert the event
    await db.insert(pseoAnalyticsEvents).values({
      sessionHash,
      eventType: data.eventType,
      industrySlug: data.industrySlug,
      stageSlug: data.stageSlug,
      category: data.category ?? null,
      ratingValue: data.ratingValue ?? null,
      searchTermHash,
      eventAt: new Date(),
    });

    return NextResponse.json({ success: true, stored: true }, { headers: corsHeaders });
  } catch (error) {
    console.error("[Analytics API] Error recording event:", error);
    // Don't expose internal errors, but still indicate failure
    return NextResponse.json({ error: "Failed to record event" }, { status: 500, headers: corsHeaders });
  }
}

/**
 * OPTIONS handler for CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  const corsHeaders = buildCorsHeaders(request);
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}
