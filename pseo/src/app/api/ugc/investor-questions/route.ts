import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { and, eq, gte } from "drizzle-orm";

import { getDb } from "@/db/client";
import { pseoUgcSubmissions } from "@/db/schema";
import { buildRateLimitHeaders, checkRateLimit, getClientIP } from "@/lib/rateLimit";

const CATEGORY_MAX_LENGTH = 120;
const QUESTION_MAX_LENGTH = 500;
const ANSWER_MAX_LENGTH = 1600;
const EMAIL_MAX_LENGTH = 200;
const URL_MAX_LENGTH = 256;

const UGC_RATE_LIMIT = { limit: 5, windowMs: 60 * 60 * 1000 };
const SLUG_PATTERN = /^[a-z0-9-]+$/;

type UgcRequest = {
  industrySlug: string;
  stageSlug: string;
  category?: string;
  question: string;
  answer: string;
  contactEmail?: string;
  consent: boolean;
  sourceUrl?: string;
  website?: string;
};

function hashIp(ip: string): string {
  const salt = process.env.PSEO_UGC_SALT ?? process.env.ANALYTICS_SALT;
  if (!salt && process.env.NODE_ENV === "production") {
    throw new Error("PSEO_UGC_SALT is required in production.");
  }
  return createHash("sha256")
    .update(`${ip}:${salt ?? "dev-ugc-salt-not-for-production"}`)
    .digest("hex")
    .slice(0, 64);
}

function validateRequest(
  body: unknown
): { valid: true; data: UgcRequest } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be an object" };
  }

  const data = body as Record<string, unknown>;
  if (typeof data.industrySlug !== "string" || !data.industrySlug) {
    return { valid: false, error: "industrySlug is required" };
  }
  if (typeof data.stageSlug !== "string" || !data.stageSlug) {
    return { valid: false, error: "stageSlug is required" };
  }
  if (typeof data.question !== "string" || !data.question.trim()) {
    return { valid: false, error: "question is required" };
  }
  if (typeof data.answer !== "string" || !data.answer.trim()) {
    return { valid: false, error: "answer is required" };
  }
  if (data.consent !== true) {
    return { valid: false, error: "consent is required" };
  }

  if (!SLUG_PATTERN.test(data.industrySlug)) {
    return { valid: false, error: "Invalid industrySlug format" };
  }
  if (!SLUG_PATTERN.test(data.stageSlug)) {
    return { valid: false, error: "Invalid stageSlug format" };
  }
  if (data.industrySlug.length > 64 || data.stageSlug.length > 64) {
    return { valid: false, error: "slug values must be 64 characters or less" };
  }

  if (data.category !== undefined) {
    if (typeof data.category !== "string") {
      return { valid: false, error: "category must be a string" };
    }
    if (data.category.length > CATEGORY_MAX_LENGTH) {
      return { valid: false, error: "category must be 120 characters or less" };
    }
  }

  if (data.question.length > QUESTION_MAX_LENGTH) {
    return { valid: false, error: "question is too long" };
  }
  if (data.answer.length > ANSWER_MAX_LENGTH) {
    return { valid: false, error: "answer is too long" };
  }

  if (data.contactEmail !== undefined) {
    if (typeof data.contactEmail !== "string") {
      return { valid: false, error: "contactEmail must be a string" };
    }
    if (data.contactEmail.length > EMAIL_MAX_LENGTH) {
      return { valid: false, error: "contactEmail is too long" };
    }
  }

  if (data.sourceUrl !== undefined) {
    if (typeof data.sourceUrl !== "string") {
      return { valid: false, error: "sourceUrl must be a string" };
    }
    if (data.sourceUrl.length > URL_MAX_LENGTH) {
      return { valid: false, error: "sourceUrl is too long" };
    }
  }

  return {
    valid: true,
    data: {
      industrySlug: data.industrySlug,
      stageSlug: data.stageSlug,
      category: data.category as string | undefined,
      question: data.question,
      answer: data.answer,
      contactEmail: data.contactEmail as string | undefined,
      consent: true,
      sourceUrl: data.sourceUrl as string | undefined,
      website: data.website as string | undefined,
    },
  };
}

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request.headers);
  const rateLimitResult = checkRateLimit(clientIP, UGC_RATE_LIMIT);
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      {
        status: 429,
        headers: {
          ...buildRateLimitHeaders(rateLimitResult),
          "Retry-After": Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const validation = validateRequest(payload);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const data = validation.data;

  // Honeypot field for bots
  if (data.website) {
    return NextResponse.json({ success: true }, { status: 200 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const ipHash = hashIp(clientIP);
  const cutoff = new Date(Date.now() - 60 * 60 * 1000);
  const recent = await db
    .select({ id: pseoUgcSubmissions.id })
    .from(pseoUgcSubmissions)
    .where(
      and(gte(pseoUgcSubmissions.submittedAt, cutoff), eq(pseoUgcSubmissions.ipHash, ipHash))
    )
    .limit(1);

  if (recent.length > 0) {
    return NextResponse.json(
      { error: "Please wait before submitting another question." },
      { status: 429 }
    );
  }

  await db.insert(pseoUgcSubmissions).values({
    industrySlug: data.industrySlug,
    stageSlug: data.stageSlug,
    category: data.category?.trim() || null,
    question: data.question.trim(),
    answer: data.answer.trim(),
    contactEmail: data.contactEmail?.trim() || null,
    consent: true,
    sourceUrl: data.sourceUrl?.trim() || null,
    status: "pending",
    ipHash,
    userAgent: request.headers.get("user-agent") ?? null,
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
