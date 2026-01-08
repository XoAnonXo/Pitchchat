import type { Metadata } from "next";

import { PseoBreadcrumbSchema } from "@/components/pseo/PseoBreadcrumbSchema";
import { DiligenceChecklistTemplate } from "@/components/pseo/DiligenceChecklistTemplate";
import { InvestorQuestionsTemplate } from "@/components/pseo/InvestorQuestionsTemplate";
import { InvestorUpdateTemplate } from "@/components/pseo/InvestorUpdateTemplate";
import { MetricsBenchmarksTemplate } from "@/components/pseo/MetricsBenchmarksTemplate";
import { PitchDeckTemplate } from "@/components/pseo/PitchDeckTemplate";
import pilotConfig from "@/data/pilot-config.json";
import { labelForIndustry, labelForStage } from "@/data/labelUtils";
import { getDiligenceChecklistSeed } from "@/data/diligenceChecklistSeed";
import { getInvestorQuestionsSeed } from "@/data/investorQuestionsSeed";
import { getInvestorUpdateSeed } from "@/data/investorUpdateSeed";
import { getMetricsBenchmarksSeed } from "@/data/metricsBenchmarksSeed";
import { getPitchDeckSeed } from "@/data/pitchDeckSeed";
import { getPseoPageBySlug } from "@/db/queries";
import { buildPseoPagePath } from "@/lib/pseoRoutes";

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

export function generateStaticParams() {
  const params = [];

  for (const industry of pilotConfig.industries) {
    for (const stage of pilotConfig.stages) {
      for (const pageType of pilotConfig.pageTypes) {
        params.push({
          industry: industry.slug,
          stage: stage.slug,
          pageType: pageType.slug,
        });
      }
    }
  }

  return params;
}

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
  const baseTitle =
    dbPage?.title ?? `${pageTypeLabel} for ${industryLabel} ${stageLabel}`;
  const title = baseTitle.includes("Pitchchat")
    ? baseTitle
    : `${baseTitle} - Pitchchat`;
  const description =
    dbPage?.summary?.trim() ||
    `Investor-ready guidance for ${industryLabel} startups at the ${stageLabel} stage.`;

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
    },
    twitter: {
      card: "summary",
      title,
      description,
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
