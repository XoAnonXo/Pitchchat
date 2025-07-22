// Pricing configuration with 10x margin on OpenAI costs

export interface PricingConfig {
  // OpenAI base costs per 1K tokens
  openaiCosts: {
    gpt4o: {
      input: 0.005,   // $0.005 per 1K input tokens
      output: 0.015,  // $0.015 per 1K output tokens
      average: 0.01   // $0.01 average per 1K tokens
    },
    embedding: 0.00013 // $0.00013 per 1K tokens
  },
  
  // Platform pricing with 10x margin
  platformPricing: {
    gpt4o: {
      input: 0.05,    // $0.05 per 1K input tokens
      output: 0.15,   // $0.15 per 1K output tokens
      average: 0.10   // $0.10 average per 1K tokens
    },
    embedding: 0.0013, // $0.0013 per 1K tokens
    
    // Platform credits/dollars
    creditsPerDollar: 100, // 100 credits = $1
    minimumCredits: 1000,  // Minimum purchase
    starterCredits: 500    // Free credits for new users
  }
}

export const pricing: PricingConfig = {
  openaiCosts: {
    gpt4o: {
      input: 0.005,
      output: 0.015,
      average: 0.01
    },
    embedding: 0.00013
  },
  
  platformPricing: {
    gpt4o: {
      input: 0.05,
      output: 0.15,
      average: 0.10
    },
    embedding: 0.0013,
    creditsPerDollar: 100,
    minimumCredits: 1000,
    starterCredits: 500
  }
};

// Calculate platform cost in dollars for tokens
export function calculatePlatformCost(tokens: number, model: 'gpt4o' | 'embedding' = 'gpt4o'): number {
  const tokensInThousands = tokens / 1000;
  
  if (model === 'embedding') {
    return tokensInThousands * pricing.platformPricing.embedding;
  }
  
  // For GPT-4o, use average cost
  return tokensInThousands * pricing.platformPricing.gpt4o.average;
}

// Convert dollars to platform credits
export function dollarsToCredits(dollars: number): number {
  return Math.round(dollars * pricing.platformPricing.creditsPerDollar);
}

// Convert platform credits to dollars
export function creditsToDollars(credits: number): number {
  return credits / pricing.platformPricing.creditsPerDollar;
}

// Calculate cost per message in cents
export function calculateMessageCostInCents(tokens: number, model: 'gpt4o' | 'embedding' = 'gpt4o'): number {
  const costInDollars = calculatePlatformCost(tokens, model);
  return Math.ceil(costInDollars * 100); // Convert to cents and round up
}

// Format credits for display
export function formatCredits(credits: number): string {
  if (credits >= 1000000) {
    return `${(credits / 1000000).toFixed(2)}M`;
  }
  if (credits >= 1000) {
    return `${(credits / 1000).toFixed(1)}K`;
  }
  return credits.toString();
}

// Format dollars for display
export function formatDollars(dollars: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(dollars);
}

// Get pricing breakdown for display
export function getPricingBreakdown() {
  return {
    chatMessage: {
      estimatedTokens: 100,
      costInCents: calculateMessageCostInCents(100),
    },
    embedding: {
      estimatedTokens: 1000,
      costInCents: calculateMessageCostInCents(1000, 'embedding'),
    },
  };
}

// Subscription pricing for link-based model
export const SUBSCRIPTION_PRICING = {
  monthly: {
    priceId: process.env.STRIPE_MONTHLY_PRICE_ID || 'price_monthly', // Stripe price ID
    price: 2900, // $29 in cents
    links: 'unlimited', // Unlimited links
    label: "Monthly Plan",
    description: "Create unlimited pitch links",
  },
  annual: {
    priceId: process.env.STRIPE_ANNUAL_PRICE_ID || 'price_annual', // Stripe price ID
    price: 27840, // $278.40 in cents (20% discount)
    links: 'unlimited', // Unlimited links
    label: "Annual Plan",
    monthlyEquivalent: 2320, // $23.20/month
    description: "Create unlimited pitch links + 20% savings",
  },
};