import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  checkRateLimit,
  buildRateLimitHeaders,
  getClientIP,
  DEFAULT_CONFIG,
} from "./rateLimit";

describe("Rate Limiter", () => {
  beforeEach(() => {
    // Reset time mocking
    vi.useRealTimers();
  });

  describe("checkRateLimit", () => {
    it("should allow requests under the limit", () => {
      const key = `test-ip-${Date.now()}`;
      const config = { limit: 5, windowMs: 60000 };

      for (let i = 0; i < 5; i++) {
        const result = checkRateLimit(key, config);
        expect(result.success).toBe(true);
        expect(result.remaining).toBe(config.limit - i - 1);
      }
    });

    it("should block requests over the limit", () => {
      const key = `test-ip-block-${Date.now()}`;
      const config = { limit: 3, windowMs: 60000 };

      // Use up the limit
      for (let i = 0; i < 3; i++) {
        checkRateLimit(key, config);
      }

      // Next request should be blocked
      const result = checkRateLimit(key, config);
      expect(result.success).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it("should reset after window expires", async () => {
      vi.useFakeTimers();
      const key = `test-ip-reset-${Date.now()}`;
      const config = { limit: 2, windowMs: 1000 };

      // Use up the limit
      checkRateLimit(key, config);
      checkRateLimit(key, config);
      expect(checkRateLimit(key, config).success).toBe(false);

      // Advance time past the window
      vi.advanceTimersByTime(1100);

      // Should be allowed again
      const result = checkRateLimit(key, config);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(1);
    });

    it("should track different IPs separately", () => {
      const config = { limit: 2, windowMs: 60000 };
      const ip1 = `ip1-${Date.now()}`;
      const ip2 = `ip2-${Date.now()}`;

      // Use up limit for ip1
      checkRateLimit(ip1, config);
      checkRateLimit(ip1, config);
      expect(checkRateLimit(ip1, config).success).toBe(false);

      // ip2 should still be allowed
      const result = checkRateLimit(ip2, config);
      expect(result.success).toBe(true);
    });

    it("should use default config when not provided", () => {
      const key = `test-default-${Date.now()}`;
      const result = checkRateLimit(key);

      expect(result.limit).toBe(DEFAULT_CONFIG.limit);
      expect(result.remaining).toBe(DEFAULT_CONFIG.limit - 1);
    });
  });

  describe("buildRateLimitHeaders", () => {
    it("should return correct headers", () => {
      const result = {
        success: true,
        limit: 100,
        remaining: 50,
        resetAt: 1700000000000,
      };

      const headers = buildRateLimitHeaders(result);

      expect(headers["X-RateLimit-Limit"]).toBe("100");
      expect(headers["X-RateLimit-Remaining"]).toBe("50");
      expect(headers["X-RateLimit-Reset"]).toBe("1700000000");
    });
  });

  describe("getClientIP", () => {
    it("should extract Cloudflare IP", () => {
      const headers = new Headers();
      headers.set("cf-connecting-ip", "1.2.3.4");
      headers.set("x-forwarded-for", "5.6.7.8");

      expect(getClientIP(headers)).toBe("1.2.3.4");
    });

    it("should extract Vercel IP when Cloudflare not present", () => {
      const headers = new Headers();
      headers.set("x-vercel-forwarded-for", "2.3.4.5, 1.1.1.1");
      headers.set("x-forwarded-for", "5.6.7.8");

      expect(getClientIP(headers)).toBe("2.3.4.5");
    });

    it("should extract x-forwarded-for when others not present", () => {
      const headers = new Headers();
      headers.set("x-forwarded-for", "3.4.5.6, 1.1.1.1, 2.2.2.2");

      expect(getClientIP(headers)).toBe("3.4.5.6");
    });

    it("should extract x-real-ip as fallback", () => {
      const headers = new Headers();
      headers.set("x-real-ip", "4.5.6.7");

      expect(getClientIP(headers)).toBe("4.5.6.7");
    });

    it("should return unknown when no IP headers present", () => {
      const headers = new Headers();
      expect(getClientIP(headers)).toBe("unknown");
    });
  });
});
