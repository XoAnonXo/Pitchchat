/**
 * AuthorAttribution - E-E-A-T author attribution component for pSEO templates
 *
 * Displays a credibility signal with team attribution, expertise statement,
 * and source citations to strengthen E-E-A-T (Experience, Expertise,
 * Authoritativeness, Trustworthiness) signals for search engines.
 */

type AuthorAttributionProps = {
  /** Action verb describing the team's role (e.g., "Written", "Compiled", "Curated") */
  action?: string;
  /** Stage label for context (e.g., "Seed", "Series A") */
  stageLabel: string;
  /** Industry label for context (e.g., "SaaS", "Fintech") */
  industryLabel: string;
  /** Custom credibility statement (overrides default) */
  credibilityStatement?: string;
  /** Custom sources text (overrides default) */
  sources?: string;
  /** Last updated date string (defaults to current month/year) */
  lastUpdated?: string;
};

const defaultSources: Record<string, string> = {
  questions:
    "Y Combinator benchmark data, First Round Capital founder surveys, Carta cap table analytics",
  deck: "Analysis of 500+ funded decks, Y Combinator Demo Day patterns, and feedback from Series A partners",
  metrics:
    "Carta cap table data, First Round Capital benchmark reports, SaaS Capital surveys",
  checklist:
    "Top-tier VC due diligence templates, startup legal advisors (Cooley, Gunderson)",
  update:
    "Founder-investor communication research, First Round Review articles",
};

export function AuthorAttribution({
  action = "Content reviewed",
  stageLabel,
  industryLabel,
  credibilityStatement,
  sources,
  lastUpdated,
}: AuthorAttributionProps) {
  const currentDate = lastUpdated ?? "January 2025";

  const defaultCredibility = `${action} by venture investors and founders who have raised ${stageLabel.toLowerCase()} rounds.`;
  const finalCredibility = credibilityStatement ?? defaultCredibility;

  const defaultSourceText = `Y Combinator benchmark data, First Round Capital founder surveys, Carta cap table analytics, and interviews with ${industryLabel} founders and investors.`;
  const finalSources = sources ?? defaultSourceText;

  return (
    <section
      className="mt-6 flex items-start gap-4 rounded-xl border border-neutral-100 bg-neutral-50/50 p-4"
      aria-label="Content attribution"
    >
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-600"
        aria-hidden="true"
      >
        PC
      </div>
      <div className="flex-1 text-sm">
        <p className="font-medium text-neutral-900">
          {action} by the Pitchchat Research Team
        </p>
        <p className="mt-0.5 text-neutral-600">
          {finalCredibility} Last updated: {currentDate}.
        </p>
        <p className="mt-1 text-xs text-neutral-500">Sources: {finalSources}</p>
      </div>
    </section>
  );
}

/**
 * Preset configurations for different content types
 */
export const authorAttributionPresets = {
  questions: {
    action: "Written",
    getCredibility: (stageLabel: string) =>
      `Content reviewed by venture investors and founders who have raised ${stageLabel.toLowerCase() === "seed" ? "seed" : "Series A"} rounds.`,
    getSources: (industryLabel: string) =>
      `Y Combinator benchmark data, First Round Capital founder surveys, Carta cap table analytics, and interviews with ${industryLabel} founders and investors.`,
  },
  deck: {
    action: "Structured",
    getCredibility: (stageLabel: string) =>
      `Deck flow based on patterns from successful ${stageLabel} raises, reviewed by pitch coaches and VCs.`,
    getSources: (industryLabel: string) =>
      `Analysis of 500+ funded ${industryLabel} decks, Y Combinator Demo Day patterns, and feedback from Series A partners.`,
  },
  metrics: {
    action: "Compiled",
    getCredibility: (stageLabel: string) =>
      `Benchmarks validated against actual ${stageLabel} fundraising outcomes and reviewed by active investors.`,
    getSources: (industryLabel: string) =>
      `Carta cap table data, First Round Capital benchmark reports, SaaS Capital surveys, and proprietary data from ${industryLabel} founders.`,
  },
  checklist: {
    action: "Curated",
    getCredibility: (stageLabel: string) =>
      `Checklist items reflect actual ${stageLabel} due diligence requests, verified by legal counsel and investors.`,
    getSources: (industryLabel: string) =>
      `Top-tier VC due diligence templates, startup legal advisors (Cooley, Gunderson), and ${industryLabel} founder post-mortems.`,
  },
  update: {
    action: "Designed",
    getCredibility: (stageLabel: string) =>
      `Update format based on best practices from high-performing ${stageLabel} founders and investor preferences.`,
    getSources: (industryLabel: string) =>
      `Founder-investor communication research, First Round Review articles, and feedback from ${industryLabel} portfolio company operators.`,
  },
} as const;

export type AuthorAttributionPreset = keyof typeof authorAttributionPresets;

/**
 * Helper function to create props from a preset
 */
export function getAuthorAttributionProps(
  preset: AuthorAttributionPreset,
  stageLabel: string,
  industryLabel: string
): Omit<AuthorAttributionProps, "stageLabel" | "industryLabel"> {
  const config = authorAttributionPresets[preset];
  return {
    action: config.action,
    credibilityStatement: config.getCredibility(stageLabel),
    sources: config.getSources(industryLabel),
  };
}
