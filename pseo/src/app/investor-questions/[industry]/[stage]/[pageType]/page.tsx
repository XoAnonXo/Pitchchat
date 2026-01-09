import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PseoBreadcrumbSchema } from "@/components/pseo/PseoBreadcrumbSchema";
import { DiligenceChecklistTemplate } from "@/components/pseo/DiligenceChecklistTemplate";
import { InvestorQuestionsTemplate } from "@/components/pseo/InvestorQuestionsTemplate";
import { InvestorUpdateTemplate } from "@/components/pseo/InvestorUpdateTemplate";
import { MetricsBenchmarksTemplate } from "@/components/pseo/MetricsBenchmarksTemplate";
import { PitchDeckTemplate } from "@/components/pseo/PitchDeckTemplate";
import pilotConfig from "@/data/pilot-config.json";
import { labelForIndustry, labelForStage } from "@/data/labelUtils";
import { getIndustryStageContent } from "@/data/content/contentMatrix";
import { getDiligenceChecklistSeed } from "@/data/diligenceChecklistSeed";
import { getInvestorQuestionsSeed } from "@/data/investorQuestionsSeed";
import { getInvestorUpdateSeed } from "@/data/investorUpdateSeed";
import { getMetricsBenchmarksSeed } from "@/data/metricsBenchmarksSeed";
import { getPitchDeckSeed } from "@/data/pitchDeckSeed";
import { getPseoPageBySlug } from "@/db/queries";
import { buildPseoPagePath } from "@/lib/pseoRoutes";
import { meetsQualityThreshold } from "@/lib/qualityScore";

type PageParams = {
  industry: string;
  stage: string;
  pageType: string;
};

function formatSlug(value?: string) {
  if (!value) return "";
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/**
 * Generate page-type-specific meta descriptions to differentiate keyword intent
 * and reduce cannibalization between page types targeting similar industries/stages.
 */
function getDefaultDescription(industry: string, stage: string, pageType: string): string {
  const industryLabel = labelForIndustry(industry);
  const stageLabel = labelForStage(stage);

  const descriptions: Record<string, string> = {
    "investor-questions": `Top questions ${stageLabel} investors ask ${industryLabel} founders, with proven answers. Prepare for your pitch meetings and due diligence calls.`,
    "pitch-deck": `${stageLabel} pitch deck structure for ${industryLabel} startups. Slide-by-slide guidance covering problem, solution, traction, team, and ask.`,
    "metrics-benchmarks": `Key metrics and benchmarks ${stageLabel} investors expect from ${industryLabel} companies. Know your target numbers before fundraising.`,
    "diligence-checklist": `Due diligence checklist for ${industryLabel} ${stageLabel} rounds. Documents, financials, and materials investors request before term sheets.`,
    "investor-update": `Investor update template for ${industryLabel} ${stageLabel} founders. Structure and cadence guidance to keep your investors engaged.`,
  };

  return descriptions[pageType] ?? `Investor-ready guidance for ${industryLabel} startups at the ${stageLabel} stage.`;
}

function getBreadcrumbItems(
  industry: string,
  stage: string,
  pageType: string
) {
  const industryLabel = labelForIndustry(industry);
  const stageLabel = labelForStage(stage);
  const pageTypeLabel =
    pilotConfig.pageTypes.find((type) => type.slug === pageType)?.label ??
    formatSlug(pageType);

  return [
    { name: "Investor Questions", path: "/investor-questions" },
    { name: industryLabel, path: `/investor-questions/industries/${industry}` },
    {
      name: `${stageLabel} Stage`,
      path: `/investor-questions/stages/${stage}`,
    },
    {
      name: pageTypeLabel,
      path: `/investor-questions/${industry}/${stage}/${pageType}`,
    },
  ];
}

/**
 * Build-time validation: Fail the build if any content files are missing.
 * This prevents the fallback from ever being reached in production.
 */
export function generateStaticParams() {
  const params: Array<{ industry: string; stage: string; pageType: string }> = [];
  const missingContent: string[] = [];

  for (const industry of pilotConfig.industries) {
    for (const stage of pilotConfig.stages) {
      // Validate content exists at build time
      const content = getIndustryStageContent(industry.slug, stage.slug);

      if (!content) {
        missingContent.push(`${industry.slug}/${stage.slug}`);
        continue;
      }

      for (const pageType of pilotConfig.pageTypes) {
        params.push({
          industry: industry.slug,
          stage: stage.slug,
          pageType: pageType.slug,
        });
      }
    }
  }

  // FAIL BUILD if content is missing - fallback should never be reached in production
  if (missingContent.length > 0) {
    throw new Error(
      `[BUILD FAILED] Missing content files for:\n${missingContent.join("\n")}\n` +
        `Create files in pseo/src/data/content/{industry}/{stage}.ts and register in contentMatrix.ts`
    );
  }

  console.log(`[generateStaticParams] Validated ${params.length} pages with content`);
  return params;
}

// Prevent runtime generation of pages without validated content
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { industry, stage, pageType } = await params;
  const industryLabel = labelForIndustry(industry);
  const stageLabel = labelForStage(stage);
  const pageTypeLabel =
    pilotConfig.pageTypes.find((type) => type.slug === pageType)?.label ??
    formatSlug(pageType);
  const slugPath = buildPseoPagePath({
    industry,
    stage,
    pageType,
  });

  const dbPage = await getPseoPageBySlug(slugPath);

  // Don't index unpublished or low-quality pages
  if (dbPage && (!dbPage.isPublished || !meetsQualityThreshold(dbPage.dataQualityScore))) {
    return {
      robots: { index: false, follow: false },
    };
  }

  const baseTitle =
    dbPage?.title ?? `${pageTypeLabel} for ${industryLabel} ${stageLabel}`;
  const title = baseTitle.includes("Pitchchat")
    ? baseTitle
    : `${baseTitle} - Pitchchat`;
  // Use page-type-specific descriptions to differentiate keyword intent
  const description =
    dbPage?.summary?.trim() ||
    getDefaultDescription(industry, stage, pageType);

  return {
    title,
    description,
    alternates: {
      canonical: slugPath,
    },
    openGraph: {
      title,
      description,
      url: slugPath,
      type: "website",
      // OG image is automatically generated by opengraph-image.tsx in this route
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      // Twitter image is automatically generated by opengraph-image.tsx in this route
    },
  };
}

export default async function InvestorQuestionsPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { industry, stage, pageType } = await params;
  const context = {
    industry,
    stage,
    pageType,
  };
  const slugPath = `/investor-questions/${industry}/${stage}/${pageType}/`;
  const dbPage = await getPseoPageBySlug(slugPath);

  // Gate unpublished or low-quality pages - return 404 if page exists in DB but not ready
  if (dbPage && (!dbPage.isPublished || !meetsQualityThreshold(dbPage.dataQualityScore))) {
    notFound();
  }

  const breadcrumbItems = getBreadcrumbItems(industry, stage, pageType);

  if (pageType === "investor-questions") {
    if (dbPage && dbPage.questions.length > 0) {
      return (
        <>
          <PseoBreadcrumbSchema items={breadcrumbItems} />
          <InvestorQuestionsTemplate
            data={{
              title: dbPage.title,
              summary: dbPage.summary ?? "",
              questions: dbPage.questions.map((item) => ({
                category: item.category ?? "General",
                question: item.question,
                answer: item.answer,
              })),
              metrics: dbPage.benchmarks.map((metric) => ({
                label: metric.metric,
                value: metric.value,
                note: metric.notes ?? undefined,
              })),
              objections: dbPage.objections.map((item) => ({
                objection: item.objection,
                response: item.response,
              })),
              ctaText: dbPage.ctaText ?? "Create your PitchChat room",
              context,
            }}
          />
        </>
      );
    }

    const data = getInvestorQuestionsSeed(industry, stage);
    return (
      <>
        <PseoBreadcrumbSchema items={breadcrumbItems} />
        <InvestorQuestionsTemplate data={data} />
      </>
    );
  }

  if (pageType === "pitch-deck") {
    if (dbPage && dbPage.deckSections.length > 0) {
      return (
        <>
          <PseoBreadcrumbSchema items={breadcrumbItems} />
          <PitchDeckTemplate
            data={{
              title: dbPage.title,
              summary: dbPage.summary ?? "",
              sections: dbPage.deckSections.map((section) => ({
                title: section.title,
                guidance: section.guidance ?? undefined,
                goal: section.goal ?? undefined,
              })),
              ctaText: dbPage.ctaText ?? "Create your PitchChat room",
              context,
            }}
          />
        </>
      );
    }

    const data = getPitchDeckSeed(industry, stage);
    return (
      <>
        <PseoBreadcrumbSchema items={breadcrumbItems} />
        <PitchDeckTemplate data={data} />
      </>
    );
  }

  if (pageType === "metrics-benchmarks") {
    if (dbPage && dbPage.benchmarks.length > 0) {
      return (
        <>
          <PseoBreadcrumbSchema items={breadcrumbItems} />
          <MetricsBenchmarksTemplate
            data={{
              title: dbPage.title,
              summary: dbPage.summary ?? "",
              metrics: dbPage.benchmarks.map((metric) => ({
                label: metric.metric,
                value: metric.value,
                note: metric.notes ?? undefined,
              })),
              ctaText: dbPage.ctaText ?? "Create your PitchChat room",
              context,
            }}
          />
        </>
      );
    }

    const data = getMetricsBenchmarksSeed(industry, stage);
    return (
      <>
        <PseoBreadcrumbSchema items={breadcrumbItems} />
        <MetricsBenchmarksTemplate data={data} />
      </>
    );
  }

  if (pageType === "diligence-checklist") {
    if (dbPage && dbPage.checklistItems.length > 0) {
      return (
        <>
          <PseoBreadcrumbSchema items={breadcrumbItems} />
          <DiligenceChecklistTemplate
            data={{
              title: dbPage.title,
              summary: dbPage.summary ?? "",
              items: dbPage.checklistItems.map((item) => ({
                item: item.item,
                rationale: item.rationale ?? undefined,
              })),
              ctaText: dbPage.ctaText ?? "Create your PitchChat room",
              context,
            }}
          />
        </>
      );
    }

    const data = getDiligenceChecklistSeed(industry, stage);
    return (
      <>
        <PseoBreadcrumbSchema items={breadcrumbItems} />
        <DiligenceChecklistTemplate data={data} />
      </>
    );
  }

  if (pageType === "investor-update") {
    if (dbPage && dbPage.investorUpdates.length > 0) {
      return (
        <>
          <PseoBreadcrumbSchema items={breadcrumbItems} />
          <InvestorUpdateTemplate
            data={{
              title: dbPage.title,
              summary: dbPage.summary ?? "",
              sections: dbPage.investorUpdates,
              ctaText: dbPage.ctaText ?? "Create your PitchChat room",
              context,
            }}
          />
        </>
      );
    }

    const data = getInvestorUpdateSeed(industry, stage);
    return (
      <>
        <PseoBreadcrumbSchema items={breadcrumbItems} />
        <InvestorUpdateTemplate data={data} />
      </>
    );
  }

  const industryLabel = formatSlug(industry);
  const stageLabel = formatSlug(stage);
  const pageTypeLabel = formatSlug(pageType);

  return (
    <>
      <PseoBreadcrumbSchema items={breadcrumbItems} />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Pitchchat Programmatic SEO
        </p>
        <h1 className="mt-3 text-3xl font-semibold">
          {pageTypeLabel} for {industryLabel} {stageLabel} startups
        </h1>
        <p className="mt-4 text-base text-neutral-700">
          This template is being wired next. Data will render here once the
          ingestion pipeline is connected.
        </p>
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <dl className="grid gap-3 text-sm text-neutral-700">
            <div className="flex items-center justify-between">
              <dt className="font-medium text-neutral-500">Industry</dt>
              <dd>{industryLabel}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="font-medium text-neutral-500">Stage</dt>
              <dd>{stageLabel}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="font-medium text-neutral-500">Page type</dt>
              <dd>{pageTypeLabel}</dd>
            </div>
          </dl>
        </div>
      </main>
    </>
  );
}
