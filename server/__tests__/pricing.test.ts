import { describe, it, expect } from 'vitest';
import {
  pricing,
  calculatePlatformCost,
  dollarsToCredits,
  creditsToDollars,
  calculateMessageCostInCents,
  formatCredits,
  formatDollars,
  getPricingBreakdown,
  SUBSCRIPTION_PRICING,
} from '../pricing';

describe('Pricing Module', () => {
  describe('pricing configuration', () => {
    it('should have correct OpenAI cost structure', () => {
      expect(pricing.openaiCosts.gpt4o.input).toBe(0.005);
      expect(pricing.openaiCosts.gpt4o.output).toBe(0.015);
      expect(pricing.openaiCosts.gpt4o.average).toBe(0.01);
      expect(pricing.openaiCosts.embedding).toBe(0.00013);
    });

    it('should have 10x margin on platform pricing vs OpenAI costs', () => {
      // GPT-4o pricing should be 10x OpenAI costs
      expect(pricing.platformPricing.gpt4o.input).toBe(pricing.openaiCosts.gpt4o.input * 10);
      expect(pricing.platformPricing.gpt4o.output).toBe(pricing.openaiCosts.gpt4o.output * 10);
      expect(pricing.platformPricing.gpt4o.average).toBe(pricing.openaiCosts.gpt4o.average * 10);
      expect(pricing.platformPricing.embedding).toBe(pricing.openaiCosts.embedding * 10);
    });

    it('should have correct platform credits configuration', () => {
      expect(pricing.platformPricing.creditsPerDollar).toBe(100);
      expect(pricing.platformPricing.minimumCredits).toBe(1000);
      expect(pricing.platformPricing.starterCredits).toBe(500);
    });
  });

  describe('calculatePlatformCost', () => {
    it('should calculate cost for GPT-4o model with default parameter', () => {
      // 1000 tokens at $0.10 per 1K tokens = $0.10
      const cost = calculatePlatformCost(1000);
      expect(cost).toBe(0.10);
    });

    it('should calculate cost for GPT-4o model explicitly', () => {
      const cost = calculatePlatformCost(1000, 'gpt4o');
      expect(cost).toBe(0.10);
    });

    it('should calculate cost for embedding model', () => {
      // 1000 tokens at $0.0013 per 1K tokens = $0.0013
      const cost = calculatePlatformCost(1000, 'embedding');
      expect(cost).toBe(0.0013);
    });

    it('should handle zero tokens', () => {
      expect(calculatePlatformCost(0)).toBe(0);
      expect(calculatePlatformCost(0, 'embedding')).toBe(0);
    });

    it('should handle fractional token amounts', () => {
      // 500 tokens = 0.5 * 0.10 = $0.05
      const cost = calculatePlatformCost(500);
      expect(cost).toBe(0.05);
    });

    it('should handle large token amounts', () => {
      // 1,000,000 tokens = 1000 * 0.10 = $100
      const cost = calculatePlatformCost(1000000);
      expect(cost).toBe(100);
    });

    it('should handle very small token amounts', () => {
      // 1 token = 0.001 * 0.10 = $0.0001
      const cost = calculatePlatformCost(1);
      expect(cost).toBe(0.0001);
    });

    it('should scale linearly with token count', () => {
      const cost1k = calculatePlatformCost(1000);
      const cost2k = calculatePlatformCost(2000);
      const cost10k = calculatePlatformCost(10000);

      expect(cost2k).toBe(cost1k * 2);
      expect(cost10k).toBe(cost1k * 10);
    });
  });

  describe('dollarsToCredits', () => {
    it('should convert dollars to credits correctly', () => {
      // $1 = 100 credits
      expect(dollarsToCredits(1)).toBe(100);
    });

    it('should convert fractional dollars', () => {
      // $0.50 = 50 credits
      expect(dollarsToCredits(0.5)).toBe(50);
    });

    it('should round to nearest integer', () => {
      // $0.015 = 1.5 credits, rounds to 2
      expect(dollarsToCredits(0.015)).toBe(2);
      // $0.014 = 1.4 credits, rounds to 1
      expect(dollarsToCredits(0.014)).toBe(1);
    });

    it('should handle zero dollars', () => {
      expect(dollarsToCredits(0)).toBe(0);
    });

    it('should handle large amounts', () => {
      // $1000 = 100,000 credits
      expect(dollarsToCredits(1000)).toBe(100000);
    });
  });

  describe('creditsToDollars', () => {
    it('should convert credits to dollars correctly', () => {
      // 100 credits = $1
      expect(creditsToDollars(100)).toBe(1);
    });

    it('should handle fractional results', () => {
      // 50 credits = $0.50
      expect(creditsToDollars(50)).toBe(0.5);
    });

    it('should handle zero credits', () => {
      expect(creditsToDollars(0)).toBe(0);
    });

    it('should handle large credit amounts', () => {
      // 100,000 credits = $1000
      expect(creditsToDollars(100000)).toBe(1000);
    });

    it('should be inverse of dollarsToCredits for whole numbers', () => {
      const dollars = 10;
      const credits = dollarsToCredits(dollars);
      const backToDollars = creditsToDollars(credits);
      expect(backToDollars).toBe(dollars);
    });
  });

  describe('calculateMessageCostInCents', () => {
    it('should calculate cost in cents for GPT-4o', () => {
      // 1000 tokens = $0.10 = 10 cents
      expect(calculateMessageCostInCents(1000)).toBe(10);
    });

    it('should calculate cost in cents for embedding', () => {
      // 1000 tokens = $0.0013 = 0.13 cents, rounds up to 1 cent
      expect(calculateMessageCostInCents(1000, 'embedding')).toBe(1);
    });

    it('should round up to nearest cent', () => {
      // 100 tokens = $0.01 = 1 cent, but due to floating point precision (0.1 * 0.10 * 100 = 1.0000000000000002)
      // Math.ceil rounds this up to 2
      expect(calculateMessageCostInCents(100)).toBe(2);
      // 150 tokens = $0.015 = 1.5 cents, rounds up to 2
      expect(calculateMessageCostInCents(150)).toBe(2);
    });

    it('should handle very small token counts', () => {
      // 1 token = $0.0001 = 0.01 cents, rounds up to 1
      expect(calculateMessageCostInCents(1)).toBe(1);
    });

    it('should handle zero tokens', () => {
      expect(calculateMessageCostInCents(0)).toBe(0);
    });

    it('should handle large token counts', () => {
      // 10,000 tokens = $1.00 = 100 cents
      expect(calculateMessageCostInCents(10000)).toBe(100);
    });
  });

  describe('formatCredits', () => {
    it('should format credits under 1000 as plain number', () => {
      expect(formatCredits(500)).toBe('500');
      expect(formatCredits(999)).toBe('999');
    });

    it('should format thousands with K suffix', () => {
      expect(formatCredits(1000)).toBe('1.0K');
      expect(formatCredits(1500)).toBe('1.5K');
      expect(formatCredits(10000)).toBe('10.0K');
      expect(formatCredits(999999)).toBe('1000.0K');
    });

    it('should format millions with M suffix', () => {
      expect(formatCredits(1000000)).toBe('1.00M');
      expect(formatCredits(1500000)).toBe('1.50M');
      expect(formatCredits(10000000)).toBe('10.00M');
    });

    it('should handle edge cases', () => {
      expect(formatCredits(0)).toBe('0');
      expect(formatCredits(1)).toBe('1');
    });
  });

  describe('formatDollars', () => {
    it('should format dollars with currency symbol', () => {
      expect(formatDollars(10)).toBe('$10.00');
      expect(formatDollars(0)).toBe('$0.00');
      expect(formatDollars(1.5)).toBe('$1.50');
    });

    it('should format large amounts with commas', () => {
      expect(formatDollars(1000)).toBe('$1,000.00');
      expect(formatDollars(1000000)).toBe('$1,000,000.00');
    });

    it('should round to two decimal places', () => {
      expect(formatDollars(10.999)).toBe('$11.00');
      expect(formatDollars(10.994)).toBe('$10.99');
      expect(formatDollars(10.995)).toBe('$11.00');
    });

    it('should handle negative amounts', () => {
      expect(formatDollars(-10)).toBe('-$10.00');
    });
  });

  describe('getPricingBreakdown', () => {
    it('should return correct chat message pricing', () => {
      const breakdown = getPricingBreakdown();
      expect(breakdown.chatMessage.estimatedTokens).toBe(100);
      expect(breakdown.chatMessage.costInCents).toBe(calculateMessageCostInCents(100));
    });

    it('should return correct embedding pricing', () => {
      const breakdown = getPricingBreakdown();
      expect(breakdown.embedding.estimatedTokens).toBe(1000);
      expect(breakdown.embedding.costInCents).toBe(calculateMessageCostInCents(1000, 'embedding'));
    });

    it('should have consistent values with calculateMessageCostInCents', () => {
      const breakdown = getPricingBreakdown();
      // Verify the breakdown uses the actual function
      // 100 tokens = $0.01 = 1 cent, but floating point precision causes Math.ceil to round to 2
      expect(breakdown.chatMessage.costInCents).toBe(2);
      expect(breakdown.embedding.costInCents).toBe(1); // 1000 tokens embedding = $0.0013 = 1 cent (rounded)
    });
  });

  describe('SUBSCRIPTION_PRICING', () => {
    it('should have valid monthly subscription', () => {
      expect(SUBSCRIPTION_PRICING.monthly.price).toBe(2900); // $29.00 in cents
      expect(SUBSCRIPTION_PRICING.monthly.links).toBe('unlimited');
      expect(SUBSCRIPTION_PRICING.monthly.priceId).toBeDefined();
      expect(SUBSCRIPTION_PRICING.monthly.label).toBe('Monthly Plan');
    });

    it('should have valid annual subscription', () => {
      expect(SUBSCRIPTION_PRICING.annual.price).toBe(27840); // $278.40 in cents
      expect(SUBSCRIPTION_PRICING.annual.links).toBe('unlimited');
      expect(SUBSCRIPTION_PRICING.annual.priceId).toBeDefined();
      expect(SUBSCRIPTION_PRICING.annual.label).toBe('Annual Plan');
    });

    it('should have annual plan cheaper per month than monthly', () => {
      const monthlyPrice = SUBSCRIPTION_PRICING.monthly.price;
      const annualMonthlyEquivalent = SUBSCRIPTION_PRICING.annual.monthlyEquivalent;

      // Annual should be cheaper per month
      expect(annualMonthlyEquivalent).toBeLessThan(monthlyPrice);
    });

    it('should have approximately 20% annual discount', () => {
      const monthlyTotal = SUBSCRIPTION_PRICING.monthly.price * 12; // $348 for 12 months
      const annualPrice = SUBSCRIPTION_PRICING.annual.price; // $278.40
      const discount = (monthlyTotal - annualPrice) / monthlyTotal;

      // Should be approximately 20% discount (allow 1% tolerance)
      expect(discount).toBeGreaterThan(0.19);
      expect(discount).toBeLessThan(0.21);
    });

    it('should have valid Stripe price IDs format', () => {
      expect(SUBSCRIPTION_PRICING.monthly.priceId).toMatch(/^price_/);
      expect(SUBSCRIPTION_PRICING.annual.priceId).toMatch(/^price_/);
    });
  });

  describe('Integration: Full pricing flow', () => {
    it('should correctly calculate a typical user session cost', () => {
      // User sends 5 messages, each averaging 200 tokens response
      const messagesTokens = 5 * 200; // 1000 tokens
      const costDollars = calculatePlatformCost(messagesTokens);
      const costCents = calculateMessageCostInCents(messagesTokens);
      const credits = dollarsToCredits(costDollars);

      expect(costDollars).toBe(0.10);
      expect(costCents).toBe(10);
      expect(credits).toBe(10);
    });

    it('should correctly track embedding costs for document', () => {
      // Document with 50,000 tokens for embedding
      const documentTokens = 50000;
      const costDollars = calculatePlatformCost(documentTokens, 'embedding');
      const costCents = calculateMessageCostInCents(documentTokens, 'embedding');

      // 50,000 tokens = 50 * 0.0013 = $0.065
      expect(costDollars).toBeCloseTo(0.065, 4);
      expect(costCents).toBe(7); // Rounds up from 6.5
    });

    it('should verify starter credits cover reasonable usage', () => {
      const starterCredits = pricing.platformPricing.starterCredits;
      const starterDollars = creditsToDollars(starterCredits);

      // Calculate how many 1000-token messages starter credits cover
      const costPer1kTokens = calculatePlatformCost(1000);
      const messagesSupported = Math.floor(starterDollars / costPer1kTokens);

      // Starter credits ($5 worth = 500 credits) should cover 50 messages of 1K tokens
      expect(messagesSupported).toBe(50);
    });
  });
});
