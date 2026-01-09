import { eq, and, gte } from "drizzle-orm";

import { getDb } from "@/db/client";
import {
  pseoBenchmarks,
  pseoChecklistItems,
  pseoDeckSections,
  pseoIndustries,
  pseoInvestorQuestions,
  pseoInvestorUpdates,
  pseoObjections,
  pseoPageTypes,
  pseoPages,
  pseoStages,
} from "@/db/schema";
import { MINIMUM_QUALITY_THRESHOLD } from "@/lib/qualityScore";

export type PseoPageData = {
  pageType: string;
  industry: string;
  stage: string;
  title: string;
  summary: string | null;
  ctaText: string | null;
  isPublished: boolean;
  dataQualityScore: number | null;
  updatedAt: Date | null;
  questions: Array<{ category: string | null; question: string; answer: string }>;
  benchmarks: Array<{ metric: string; value: string; notes: string | null }>;
  deckSections: Array<{ title: string; guidance: string | null; goal: string | null }>;
  checklistItems: Array<{ item: string; rationale: string | null }>;
  investorUpdates: Array<{ section: string; content: string }>;
  objections: Array<{ objection: string; response: string }>;
};

export async function getPseoPageBySlug(slug: string): Promise<PseoPageData | null> {
  try {
    const db = getDb();
    if (!db) {
      return null;
    }

    const page = await db
      .select()
      .from(pseoPages)
      .where(eq(pseoPages.slug, slug))
      .limit(1);

    if (page.length === 0) {
      return null;
    }

    const pageRecord = page[0];

    const [industry] = await db
      .select({ slug: pseoIndustries.slug })
      .from(pseoIndustries)
      .where(eq(pseoIndustries.id, pageRecord.industryId))
      .limit(1);

    const [stage] = await db
      .select({ slug: pseoStages.slug })
      .from(pseoStages)
      .where(eq(pseoStages.id, pageRecord.stageId))
      .limit(1);

    const [pageType] = await db
      .select({ slug: pseoPageTypes.slug })
      .from(pseoPageTypes)
      .where(eq(pseoPageTypes.id, pageRecord.pageTypeId))
      .limit(1);

    const questions = await db
      .select({
        category: pseoInvestorQuestions.category,
        question: pseoInvestorQuestions.question,
        answer: pseoInvestorQuestions.answer,
      })
      .from(pseoInvestorQuestions)
      .where(eq(pseoInvestorQuestions.pageId, pageRecord.id))
      .orderBy(pseoInvestorQuestions.sortOrder);

    const benchmarks = await db
      .select({
        metric: pseoBenchmarks.metric,
        value: pseoBenchmarks.value,
        notes: pseoBenchmarks.notes,
      })
      .from(pseoBenchmarks)
      .where(eq(pseoBenchmarks.pageId, pageRecord.id))
      .orderBy(pseoBenchmarks.sortOrder);

    const deckSections = await db
      .select({
        title: pseoDeckSections.title,
        guidance: pseoDeckSections.guidance,
        goal: pseoDeckSections.goal,
      })
      .from(pseoDeckSections)
      .where(eq(pseoDeckSections.pageId, pageRecord.id))
      .orderBy(pseoDeckSections.sortOrder);

    const checklistItems = await db
      .select({
        item: pseoChecklistItems.item,
        rationale: pseoChecklistItems.rationale,
      })
      .from(pseoChecklistItems)
      .where(eq(pseoChecklistItems.pageId, pageRecord.id))
      .orderBy(pseoChecklistItems.sortOrder);

    const investorUpdates = await db
      .select({
        section: pseoInvestorUpdates.section,
        content: pseoInvestorUpdates.content,
      })
      .from(pseoInvestorUpdates)
      .where(eq(pseoInvestorUpdates.pageId, pageRecord.id))
      .orderBy(pseoInvestorUpdates.sortOrder);

    const objections = await db
      .select({
        objection: pseoObjections.objection,
        response: pseoObjections.response,
      })
      .from(pseoObjections)
      .where(eq(pseoObjections.pageId, pageRecord.id))
      .orderBy(pseoObjections.sortOrder);

    return {
      pageType: pageType?.slug ?? "unknown",
      industry: industry?.slug ?? "unknown",
      stage: stage?.slug ?? "unknown",
      title: pageRecord.title,
      summary: pageRecord.summary,
      ctaText: pageRecord.ctaText,
      isPublished: pageRecord.isPublished,
      dataQualityScore: pageRecord.dataQualityScore,
      updatedAt: pageRecord.updatedAt,
      questions,
      benchmarks,
      deckSections,
      checklistItems,
      investorUpdates,
      objections,
    };
  } catch {
    return null;
  }
}

export type SitemapPageEntry = {
  slug: string;
  updatedAt: Date | null;
};

/**
 * Get all published pSEO pages for sitemap generation.
 * Returns slug and updatedAt for each published page.
 * Only includes pages that are published AND meet the minimum quality threshold.
 */
export async function getPublishedPagesForSitemap(): Promise<SitemapPageEntry[]> {
  try {
    const db = getDb();
    if (!db) {
      return [];
    }

    const pages = await db
      .select({
        slug: pseoPages.slug,
        updatedAt: pseoPages.updatedAt,
      })
      .from(pseoPages)
      .where(
        and(
          eq(pseoPages.isPublished, true),
          gte(pseoPages.dataQualityScore, MINIMUM_QUALITY_THRESHOLD)
        )
      );

    return pages;
  } catch {
    return [];
  }
}
