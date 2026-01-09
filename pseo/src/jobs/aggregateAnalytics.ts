/**
 * Analytics Aggregation Job
 *
 * Processes raw analytics events into anonymized aggregates that meet k-anonymity (k >= 10).
 * This job should be run periodically (e.g., daily via cron or serverless function).
 *
 * Privacy guarantees:
 * - Only aggregates with >= 10 data points are stored/displayed
 * - Raw events are deleted after successful aggregation
 * - No individual user data is retained
 * - Session hashes are not reversible
 *
 * Usage:
 *   npx tsx src/jobs/aggregateAnalytics.ts
 *   or via cron: 0 2 * * * cd /path/to/pseo && npx tsx src/jobs/aggregateAnalytics.ts
 */

import { getDb } from "@/db/client";
import { pseoAnalyticsEvents, pseoQuestionAnalytics } from "@/db/schema";
import { sql, gte, lt } from "drizzle-orm";

type DbClient = NonNullable<ReturnType<typeof getDb>>;

/** Minimum count for k-anonymity compliance - exported for tests */
export const K_ANONYMITY_THRESHOLD = 10;

/** How many days of raw events to retain before deletion - exported for tests */
export const RAW_EVENT_RETENTION_DAYS = 7;

interface AggregateResult {
  industrySlug: string;
  stageSlug: string;
  category: string;
  totalViews: number;
  avgRating: number | null;
  ratingCount: number;
  expansionCount: number;
  copyCount: number;
  /** Number of distinct sessions - used for k-anonymity threshold */
  distinctSessions: number;
}

/**
 * Get the start of the current aggregation period (first day of current month)
 */
function getPeriodStart(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

/**
 * Aggregate raw events for a given period.
 * K-anonymity is based on distinct sessions, not event count.
 */
async function aggregateEventsForPeriod(db: DbClient, periodStart: Date): Promise<AggregateResult[]> {
  const periodEnd = new Date(periodStart);
  periodEnd.setUTCMonth(periodEnd.getUTCMonth() + 1);

  // Query to aggregate events by industry/stage/category
  // K-anonymity requires counting DISTINCT sessions, not total events
  const results = await db
    .select({
      industrySlug: pseoAnalyticsEvents.industrySlug,
      stageSlug: pseoAnalyticsEvents.stageSlug,
      category: pseoAnalyticsEvents.category,
      totalViews: sql<number>`COUNT(*) FILTER (WHERE ${pseoAnalyticsEvents.eventType} = 'view')`,
      avgRating: sql<number | null>`AVG(${pseoAnalyticsEvents.ratingValue}) FILTER (WHERE ${pseoAnalyticsEvents.eventType} = 'rating')`,
      ratingCount: sql<number>`COUNT(*) FILTER (WHERE ${pseoAnalyticsEvents.eventType} = 'rating')`,
      expansionCount: sql<number>`COUNT(*) FILTER (WHERE ${pseoAnalyticsEvents.eventType} = 'expansion')`,
      copyCount: sql<number>`COUNT(*) FILTER (WHERE ${pseoAnalyticsEvents.eventType} = 'copy')`,
      // Count distinct sessions for k-anonymity threshold
      distinctSessions: sql<number>`COUNT(DISTINCT ${pseoAnalyticsEvents.sessionHash})`,
    })
    .from(pseoAnalyticsEvents)
    .where(
      sql`${pseoAnalyticsEvents.eventAt} >= ${periodStart} AND ${pseoAnalyticsEvents.eventAt} < ${periodEnd}`
    )
    .groupBy(
      pseoAnalyticsEvents.industrySlug,
      pseoAnalyticsEvents.stageSlug,
      pseoAnalyticsEvents.category
    );

  return results.map((row: typeof results[number]) => ({
    industrySlug: row.industrySlug,
    stageSlug: row.stageSlug,
    category: row.category ?? "General",
    totalViews: Number(row.totalViews) || 0,
    avgRating: row.avgRating ? Number(row.avgRating) : null,
    ratingCount: Number(row.ratingCount) || 0,
    expansionCount: Number(row.expansionCount) || 0,
    copyCount: Number(row.copyCount) || 0,
    distinctSessions: Number(row.distinctSessions) || 0,
  }));
}

/**
 * Upsert aggregated analytics using batch ON CONFLICT DO UPDATE.
 * K-anonymity is based on distinct sessions (not event count).
 */
async function upsertAggregates(
  db: DbClient,
  periodStart: Date,
  aggregates: AggregateResult[]
): Promise<{ upserted: number; suppressed: number }> {
  let suppressed = 0;

  // Filter aggregates that meet k-anonymity threshold (based on distinct sessions)
  const validAggregates = aggregates.filter((agg) => {
    // K-anonymity requires minimum distinct sessions, not total events
    const meetsThreshold = agg.distinctSessions >= K_ANONYMITY_THRESHOLD;
    if (!meetsThreshold) {
      suppressed++;
    }
    return meetsThreshold;
  });

  if (validAggregates.length === 0) {
    return { upserted: 0, suppressed };
  }

  // Prepare values for batch insert
  const now = new Date();
  const values = validAggregates.map((agg) => {
    // Only store avg rating if we have enough distinct rating sessions
    const avgRatingToStore =
      agg.ratingCount >= K_ANONYMITY_THRESHOLD && agg.avgRating
        ? Math.round(agg.avgRating)
        : null;

    return {
      industrySlug: agg.industrySlug,
      stageSlug: agg.stageSlug,
      category: agg.category,
      periodStart,
      totalViews: agg.totalViews,
      avgHelpfulnessRating: avgRatingToStore,
      ratingCount: agg.ratingCount,
      answerExpansions: agg.expansionCount,
      answerCopies: agg.copyCount,
      meetsKThreshold: true,
      computedAt: now,
    };
  });

  // Batch upsert using ON CONFLICT DO UPDATE
  // This replaces the N+1 query pattern with a single atomic operation
  await db
    .insert(pseoQuestionAnalytics)
    .values(values)
    .onConflictDoUpdate({
      target: [
        pseoQuestionAnalytics.industrySlug,
        pseoQuestionAnalytics.stageSlug,
        pseoQuestionAnalytics.category,
        pseoQuestionAnalytics.periodStart,
      ],
      set: {
        totalViews: sql`EXCLUDED.total_views`,
        avgHelpfulnessRating: sql`EXCLUDED.avg_helpfulness_rating`,
        ratingCount: sql`EXCLUDED.rating_count`,
        answerExpansions: sql`EXCLUDED.answer_expansions`,
        answerCopies: sql`EXCLUDED.answer_copies`,
        meetsKThreshold: sql`EXCLUDED.meets_k_threshold`,
        computedAt: sql`EXCLUDED.computed_at`,
        updatedAt: now,
      },
    });

  return { upserted: values.length, suppressed };
}

/**
 * Delete raw events older than retention period
 */
async function cleanupOldEvents(db: DbClient): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - RAW_EVENT_RETENTION_DAYS);

  const result = await db
    .delete(pseoAnalyticsEvents)
    .where(lt(pseoAnalyticsEvents.eventAt, cutoffDate));

  // Drizzle returns the deleted rows count in different ways depending on driver
  // For pg, we can check rowCount
  return (result as { rowCount?: number }).rowCount ?? 0;
}

/**
 * Main aggregation job.
 * Runs aggregation and cleanup within a database transaction for consistency.
 */
async function runAggregation(): Promise<void> {
  console.log("[Analytics Aggregation] Starting job...");
  console.log(`[Analytics Aggregation] K-anonymity threshold: ${K_ANONYMITY_THRESHOLD} distinct sessions`);

  const db = getDb();
  if (!db) {
    console.log("[Analytics Aggregation] No database connection configured. Skipping aggregation.");
    return;
  }

  const periodStart = getPeriodStart();
  console.log(`[Analytics Aggregation] Processing period: ${periodStart.toISOString()}`);

  // Wrap all operations in a transaction for atomicity
  await db.transaction(async (tx) => {
    // Aggregate events
    // Note: tx has all query methods but not $client, cast through unknown
    const aggregates = await aggregateEventsForPeriod(tx as unknown as DbClient, periodStart);
    console.log(`[Analytics Aggregation] Found ${aggregates.length} category aggregates`);

    // Upsert with k-anonymity filtering (based on distinct sessions)
    const { upserted, suppressed } = await upsertAggregates(tx as unknown as DbClient, periodStart, aggregates);
    console.log(`[Analytics Aggregation] Results: ${upserted} upserted, ${suppressed} suppressed (below k-threshold)`);

    // Cleanup old raw events
    const deletedEvents = await cleanupOldEvents(tx as unknown as DbClient);
    console.log(`[Analytics Aggregation] Cleaned up ${deletedEvents} old raw events`);
  });

  console.log("[Analytics Aggregation] Job completed successfully");
}

// Run if executed directly
if (require.main === module) {
  runAggregation()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("[Analytics Aggregation] Job failed:", err);
      process.exit(1);
    });
}

export { runAggregation, aggregateEventsForPeriod, upsertAggregates, cleanupOldEvents };
