import type { Metadata } from "next";
import Link from "next/link";

import { PseoBreadcrumbSchema } from "@/components/pseo/PseoBreadcrumbSchema";
import pilotConfig from "@/data/pilot-config.json";
import { labelForStage, descriptionForStage } from "@/data/labelUtils";

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
      // OG image inherited from root opengraph-image.tsx
    },
    twitter: {
      card: "summary_large_image",
      title: `${stageLabel} Investor Resources - Pitchchat`,
      description: `Investor questions, deck outlines, and benchmarks for ${stageLabel} startups.`,
      // Twitter image inherited from root opengraph-image.tsx
    },
  };
}

export default function InvestorQuestionsStagePage({
  params,
}: {
  params: PageParams;
}) {
  const stageLabel = labelForStage(params.stage);
  const stageDesc = descriptionForStage(params.stage);

  const breadcrumbItems = [
    { name: "Investor Questions", path: "/investor-questions" },
    { name: `${stageLabel} Stage`, path: `/investor-questions/stages/${params.stage}` },
  ];

  return (
    <>
      <PseoBreadcrumbSchema items={breadcrumbItems} />
      <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Stage hub
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-neutral-900">
        {stageLabel} investor resources
      </h1>

      {stageDesc && (
        <>
          <p className="mt-4 text-base text-neutral-700">{stageDesc.intro}</p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Typical round characteristics
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                {stageDesc.typical.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                Investor expectations
              </h2>
              <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                {stageDesc.expectations.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-neutral-900">
          Resources by industry
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          Select an industry to access targeted investor questions, deck outlines, and benchmarks.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
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
      </section>
      </main>
    </>
  );
}
