import type { Metadata } from "next";
import Link from "next/link";

import pilotConfig from "@/data/pilot-config.json";
import { labelForStage } from "@/data/labelUtils";

type PageParams = {
  stage: string;
};

export function generateStaticParams() {
  return pilotConfig.stages.map((stage) => ({
    stage: stage.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: PageParams;
}): Metadata {
  const stageLabel = labelForStage(params.stage);
  const canonical = `/investor-questions/stages/${params.stage}/`;
  return {
    title: `${stageLabel} Investor Resources - Pitchchat`,
    description: `Investor questions, deck outlines, and benchmarks for ${stageLabel} startups.`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${stageLabel} Investor Resources - Pitchchat`,
      description: `Investor questions, deck outlines, and benchmarks for ${stageLabel} startups.`,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${stageLabel} Investor Resources - Pitchchat`,
      description: `Investor questions, deck outlines, and benchmarks for ${stageLabel} startups.`,
    },
  };
}

export default function InvestorQuestionsStagePage({
  params,
}: {
  params: PageParams;
}) {
  const stageLabel = labelForStage(params.stage);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Stage hub
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-neutral-900">
        {stageLabel} investor resources
      </h1>
      <p className="mt-4 text-base text-neutral-700">
        Choose an industry and page type to get focused investor guidance.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {pilotConfig.industries.map((industry) => (
          <div
            key={industry.slug}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-neutral-900">{industry.label}</h2>
            <ul className="mt-4 space-y-2 text-sm text-neutral-700">
              {pilotConfig.pageTypes.map((pageType) => (
                <li key={pageType.slug}>
                  <Link
                    className="hover:text-neutral-900"
                    href={`/investor-questions/${industry.slug}/${params.stage}/${pageType.slug}/`}
                  >
                    {pageType.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
}
