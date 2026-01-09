/**
 * Quality score constants and utilities for pSEO content.
 *
 * Quality scores range from 0-100 and are used to gate publishing:
 * - 0-49: Draft quality, not suitable for indexing
 * - 50-69: Minimum viable quality, may have thin content
 * - 70-84: Good quality, recommended for publishing
 * - 85-100: High quality, excellent content depth
 */

/** Minimum quality score required for a page to be published and indexed */
export const MINIMUM_QUALITY_THRESHOLD = 70;

/** Score weights for different quality signals */
const QUALITY_WEIGHTS = {
  /** Base score for having any content at all */
  hasContent: 20,
  /** Score for meeting minimum answer length (50+ words) */
  answerDepth: 25,
  /** Score for having 5+ questions/items */
  contentBreadth: 20,
  /** Score for having benchmark metrics */
  hasMetrics: 15,
  /** Score for having complete metadata (title, summary) */
  hasMetadata: 10,
  /** Score for content uniqueness (no generic placeholders) */
  contentQuality: 10,
} as const;

export type ContentForScoring = {
  title: string;
  summary: string | null;
  questions: Array<{ answer: string }>;
  benchmarks: Array<{ metric: string }>;
  deckSections: Array<{ guidance: string | null }>;
  checklistItems: Array<{ item: string }>;
  investorUpdates: Array<{ content: string }>;
};

/**
 * Calculate a quality score for pSEO content based on depth and completeness.
 * Returns a score from 0-100.
 */
export function calculateQualityScore(content: ContentForScoring): number {
  let score = 0;

  // Check if page has any substantive content
  const hasAnyContent =
    content.questions.length > 0 ||
    content.deckSections.length > 0 ||
    content.checklistItems.length > 0 ||
    content.investorUpdates.length > 0;

  if (!hasAnyContent) {
    return 0;
  }

  score += QUALITY_WEIGHTS.hasContent;

  // Check answer depth - answers should be 50+ words on average
  if (content.questions.length > 0) {
    const avgAnswerWords =
      content.questions.reduce((sum, q) => sum + countWords(q.answer), 0) /
      content.questions.length;
    if (avgAnswerWords >= 50) {
      score += QUALITY_WEIGHTS.answerDepth;
    } else if (avgAnswerWords >= 30) {
      score += QUALITY_WEIGHTS.answerDepth * 0.5;
    }
  } else if (content.deckSections.length > 0) {
    // For pitch deck pages, check guidance depth
    const avgGuidanceWords =
      content.deckSections.reduce(
        (sum, s) => sum + countWords(s.guidance ?? ""),
        0
      ) / content.deckSections.length;
    if (avgGuidanceWords >= 40) {
      score += QUALITY_WEIGHTS.answerDepth;
    } else if (avgGuidanceWords >= 20) {
      score += QUALITY_WEIGHTS.answerDepth * 0.5;
    }
  } else if (content.checklistItems.length > 0) {
    // Checklist items should have rationales
    const itemsWithRationale = content.checklistItems.filter(
      (item) => item.item && item.item.length > 20
    ).length;
    if (itemsWithRationale >= content.checklistItems.length * 0.8) {
      score += QUALITY_WEIGHTS.answerDepth;
    } else if (itemsWithRationale >= content.checklistItems.length * 0.5) {
      score += QUALITY_WEIGHTS.answerDepth * 0.5;
    }
  } else if (content.investorUpdates.length > 0) {
    const avgContentWords =
      content.investorUpdates.reduce((sum, u) => sum + countWords(u.content), 0) /
      content.investorUpdates.length;
    if (avgContentWords >= 30) {
      score += QUALITY_WEIGHTS.answerDepth;
    }
  }

  // Check content breadth - should have 5+ items
  const primaryContentCount = Math.max(
    content.questions.length,
    content.deckSections.length,
    content.checklistItems.length,
    content.investorUpdates.length
  );
  if (primaryContentCount >= 5) {
    score += QUALITY_WEIGHTS.contentBreadth;
  } else if (primaryContentCount >= 3) {
    score += QUALITY_WEIGHTS.contentBreadth * 0.5;
  }

  // Check for benchmark metrics
  if (content.benchmarks.length >= 3) {
    score += QUALITY_WEIGHTS.hasMetrics;
  } else if (content.benchmarks.length >= 1) {
    score += QUALITY_WEIGHTS.hasMetrics * 0.5;
  }

  // Check metadata completeness
  if (content.title && content.title.length >= 10 && content.summary && content.summary.length >= 50) {
    score += QUALITY_WEIGHTS.hasMetadata;
  } else if (content.title && content.title.length >= 10) {
    score += QUALITY_WEIGHTS.hasMetadata * 0.5;
  }

  // Check content quality (no placeholder text)
  const hasPlaceholders = detectPlaceholderContent(content);
  if (!hasPlaceholders) {
    score += QUALITY_WEIGHTS.contentQuality;
  }

  return Math.min(100, Math.round(score));
}

/**
 * Check if a quality score meets the minimum threshold for publishing.
 */
export function meetsQualityThreshold(score: number | null | undefined): boolean {
  if (score === null || score === undefined) {
    return false;
  }
  return score >= MINIMUM_QUALITY_THRESHOLD;
}

/**
 * Get a human-readable quality rating based on score.
 */
export function getQualityRating(score: number): "draft" | "minimum" | "good" | "excellent" {
  if (score < 50) return "draft";
  if (score < 70) return "minimum";
  if (score < 85) return "excellent";
  return "excellent";
}

function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function detectPlaceholderContent(content: ContentForScoring): boolean {
  const placeholderPatterns = [
    /\[.*?\]/,
    /TODO/i,
    /placeholder/i,
    /lorem ipsum/i,
    /sample text/i,
    /insert here/i,
  ];

  const allText = [
    content.title,
    content.summary ?? "",
    ...content.questions.map((q) => q.answer),
    ...content.deckSections.map((s) => s.guidance ?? ""),
    ...content.checklistItems.map((i) => i.item),
    ...content.investorUpdates.map((u) => u.content),
  ].join(" ");

  return placeholderPatterns.some((pattern) => pattern.test(allText));
}
