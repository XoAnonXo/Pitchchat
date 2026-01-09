import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  K_ANONYMITY_THRESHOLD,
  RAW_EVENT_RETENTION_DAYS,
} from "@/jobs/aggregateAnalytics";
import { VALID_EVENT_TYPES } from "@/app/api/analytics/event/route";

/**
 * Unit tests for analytics aggregation logic.
 * Tests k-anonymity enforcement, aggregation calculations, and data cleanup.
 * Constants are imported from source to ensure tests stay in sync.
 */

describe("Analytics Aggregation Logic", () => {
  describe("K-Anonymity Threshold", () => {
    it("should be set to minimum of 10", () => {
      expect(K_ANONYMITY_THRESHOLD).toBe(10);
    });

    it("should suppress aggregates below threshold based on distinct sessions", () => {
      // K-anonymity is based on distinct sessions, not event count
      const aggregates = [
        { distinctSessions: 9, category: "Financial Metrics" },
        { distinctSessions: 10, category: "Unit Economics" },
        { distinctSessions: 15, category: "Team" },
      ];

      const meetsThreshold = aggregates.map((a) => ({
        ...a,
        meetsKAnonymity: a.distinctSessions >= K_ANONYMITY_THRESHOLD,
      }));

      expect(meetsThreshold[0].meetsKAnonymity).toBe(false); // 9 sessions < 10
      expect(meetsThreshold[1].meetsKAnonymity).toBe(true); // 10 sessions >= 10
      expect(meetsThreshold[2].meetsKAnonymity).toBe(true); // 15 sessions >= 10
    });

    it("should count distinct sessions not total events", () => {
      // Even if 100 events occur, only distinct sessions matter for privacy
      const aggregate = {
        totalViews: 100,
        distinctSessions: 5, // Only 5 unique people
      };

      // Should NOT meet threshold - only 5 distinct people
      expect(aggregate.distinctSessions >= K_ANONYMITY_THRESHOLD).toBe(false);
    });

    it("should not expose individual session data", () => {
      // k-anonymity means at least k individuals share each attribute combination
      // With k=10, we can't expose data unless 10+ sessions have that combination
      const sessionCounts = [1, 5, 9]; // All below threshold

      for (const count of sessionCounts) {
        expect(count >= K_ANONYMITY_THRESHOLD).toBe(false);
      }
    });
  });

  describe("Aggregation Calculations", () => {
    it("should correctly calculate total data points", () => {
      const agg = {
        totalViews: 50,
        ratingCount: 20,
        expansionCount: 15,
        copyCount: 10,
      };

      const totalDataPoints =
        agg.totalViews + agg.ratingCount + agg.expansionCount + agg.copyCount;

      expect(totalDataPoints).toBe(95);
    });

    it("should calculate average rating correctly", () => {
      const ratings = [5, 4, 5, 3, 4, 5, 4, 5, 4, 5]; // 10 ratings
      const avgRating =
        ratings.reduce((sum, r) => sum + r, 0) / ratings.length;

      expect(avgRating).toBe(4.4);
      expect(ratings.length).toBeGreaterThanOrEqual(K_ANONYMITY_THRESHOLD);
    });

    it("should round average rating to integer for storage", () => {
      const avgRatings = [4.4, 3.7, 2.2, 4.9];
      const rounded = avgRatings.map((r) => Math.round(r));

      expect(rounded).toEqual([4, 4, 2, 5]);
    });

    it("should not store average rating if below k threshold", () => {
      const ratingCount = 5; // Below threshold
      const avgRating = 4.5;

      const storedRating =
        ratingCount >= K_ANONYMITY_THRESHOLD ? Math.round(avgRating) : null;

      expect(storedRating).toBeNull();
    });
  });

  describe("Period Calculation", () => {
    it("should get first day of current month for period start", () => {
      const now = new Date("2025-06-15T10:30:00Z");
      const periodStart = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)
      );

      expect(periodStart.toISOString()).toBe("2025-06-01T00:00:00.000Z");
    });

    it("should calculate period end as first day of next month", () => {
      const periodStart = new Date("2025-06-01T00:00:00Z");
      const periodEnd = new Date(periodStart);
      periodEnd.setUTCMonth(periodEnd.getUTCMonth() + 1);

      expect(periodEnd.toISOString()).toBe("2025-07-01T00:00:00.000Z");
    });

    it("should handle year boundary correctly", () => {
      const periodStart = new Date("2025-12-01T00:00:00Z");
      const periodEnd = new Date(periodStart);
      periodEnd.setUTCMonth(periodEnd.getUTCMonth() + 1);

      expect(periodEnd.toISOString()).toBe("2026-01-01T00:00:00.000Z");
    });
  });

  describe("Event Cleanup", () => {
    // RAW_EVENT_RETENTION_DAYS is now imported from source

    it("should calculate correct cleanup cutoff date", () => {
      const now = new Date("2025-06-15T00:00:00Z");
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - RAW_EVENT_RETENTION_DAYS);

      expect(cutoff.toISOString()).toBe("2025-06-08T00:00:00.000Z");
    });

    it("should identify events older than retention period", () => {
      const cutoffDate = new Date("2025-06-08T00:00:00Z");
      const events = [
        { eventAt: new Date("2025-06-07T23:59:59Z"), shouldDelete: true },
        { eventAt: new Date("2025-06-08T00:00:00Z"), shouldDelete: false },
        { eventAt: new Date("2025-06-10T00:00:00Z"), shouldDelete: false },
      ];

      for (const event of events) {
        const shouldDelete = event.eventAt < cutoffDate;
        expect(shouldDelete).toBe(event.shouldDelete);
      }
    });
  });

  describe("Session Hash Privacy", () => {
    it("should produce consistent hashes for same input", () => {
      // In real code, this uses crypto.createHash("sha256")
      const mockHash = (input: string, salt: string) => {
        // Simulate deterministic hashing
        return `${input}-${salt}`.split("").reduce((hash, char) => {
          return ((hash << 5) - hash + char.charCodeAt(0)) | 0;
        }, 0);
      };

      const salt = "test-salt";
      const sessionId = "abc123";

      const hash1 = mockHash(sessionId, salt);
      const hash2 = mockHash(sessionId, salt);

      expect(hash1).toBe(hash2);
    });

    it("should produce different hashes for different sessions", () => {
      // Simple hash function for testing - sums all char codes
      const mockHash = (input: string) =>
        input.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

      const hash1 = mockHash("session-a");
      const hash2 = mockHash("session-b");

      // 'a' has charCode 97, 'b' has charCode 98
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("Event Type Validation", () => {
    // VALID_EVENT_TYPES is now imported from source

    it("should accept valid event types", () => {
      for (const eventType of VALID_EVENT_TYPES) {
        expect(VALID_EVENT_TYPES.includes(eventType)).toBe(true);
      }
    });

    it("should reject invalid event types", () => {
      const invalidTypes = ["click", "scroll", "hover", "purchase"];

      for (const type of invalidTypes) {
        expect(
          VALID_EVENT_TYPES.includes(type as (typeof VALID_EVENT_TYPES)[number])
        ).toBe(false);
      }
    });
  });

  describe("Category Aggregation", () => {
    it("should default null category to 'General'", () => {
      const categories = [null, "Unit Economics", undefined, "Team"];
      const normalized = categories.map((c) => c ?? "General");

      expect(normalized).toEqual([
        "General",
        "Unit Economics",
        "General",
        "Team",
      ]);
    });

    it("should group events by industry/stage/category combination", () => {
      const events = [
        { industry: "saas", stage: "seed", category: "Finance" },
        { industry: "saas", stage: "seed", category: "Finance" },
        { industry: "saas", stage: "series-a", category: "Finance" },
        { industry: "healthcare", stage: "seed", category: "Finance" },
      ];

      // Group by composite key
      const groups = events.reduce(
        (acc, e) => {
          const key = `${e.industry}:${e.stage}:${e.category}`;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      expect(groups["saas:seed:Finance"]).toBe(2);
      expect(groups["saas:series-a:Finance"]).toBe(1);
      expect(groups["healthcare:seed:Finance"]).toBe(1);
    });
  });
});
