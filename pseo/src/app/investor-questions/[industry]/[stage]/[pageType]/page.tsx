import type { Metadata } from "next";

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
  params: PageParams;
}): Promise<Metadata> {
  const industryLabel = labelForIndustry(params.industry);
  const stageLabel = labelForStage(params.stage);
  const pageTypeLabel =
    pilotConfig.pageTypes.find((type) => type.slug === params.pageType)?.label ??
    formatSlug(params.pageType);
  const slugPath = buildPseoPagePath({
    industry: params.industry,
    stage: params.stage,
    pageType: params.pageType,
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
  params: PageParams;
}) {
  const context = {
    industry: params.industry,
    stage: params.stage,
    pageType: params.pageType,
  };
  const slugPath = `/investor-questions/${params.industry}/${params.stage}/${params.pageType}/`;
  const dbPage = await getPseoPageBySlug(slugPath);

  if (params.pageType === "investor-questions") {
    if (dbPage && dbPage.questions.length > 0) {
      return (
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
      );
    }

    const data = getInvestorQuestionsSeed(params.industry, params.stage);
    return <InvestorQuestionsTemplate data={data} />;
  }

  if (params.pageType === "pitch-deck") {
    if (dbPage && dbPage.deckSections.length > 0) {
      return (
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
      );
    }

    const data = getPitchDeckSeed(params.industry, params.stage);
    return <PitchDeckTemplate data={data} />;
  }

  if (params.pageType === "metrics-benchmarks") {
    if (dbPage && dbPage.benchmarks.length > 0) {
      return (
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
      );
    }

    const data = getMetricsBenchmarksSeed(params.industry, params.stage);
    return <MetricsBenchmarksTemplate data={data} />;
  }

  if (params.pageType === "diligence-checklist") {
    if (dbPage && dbPage.checklistItems.length > 0) {
      return (
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
      );
    }

    const data = getDiligenceChecklistSeed(params.industry, params.stage);
    return <DiligenceChecklistTemplate data={data} />;
  }

  if (params.pageType === "investor-update") {
    if (dbPage && dbPage.investorUpdates.length > 0) {
      return (
        <InvestorUpdateTemplate
          data={{
            title: dbPage.title,
            summary: dbPage.summary ?? "",
            sections: dbPage.investorUpdates,
            ctaText: dbPage.ctaText ?? "Create your PitchChat room",
            context,
          }}
        />
      );
    }

    const data = getInvestorUpdateSeed(params.industry, params.stage);
    return <InvestorUpdateTemplate data={data} />;
  }

  const industry = formatSlug(params.industry);
  const stage = formatSlug(params.stage);
  const pageType = formatSlug(params.pageType);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Pitchchat Programmatic SEO
      </p>
      <h1 className="mt-3 text-3xl font-semibold">
        {pageType} for {industry} {stage} startups
      </h1>
      <p className="mt-4 text-base text-neutral-700">
        This template is being wired next. Data will render here once the
        ingestion pipeline is connected.
      </p>
      <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <dl className="grid gap-3 text-sm text-neutral-700">
          <div className="flex items-center justify-between">
            <dt className="font-medium text-neutral-500">Industry</dt>
            <dd>{industry}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="font-medium text-neutral-500">Stage</dt>
            <dd>{stage}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="font-medium text-neutral-500">Page type</dt>
            <dd>{pageType}</dd>
          </div>
        </dl>
      </div>
    </main>
  );
}
