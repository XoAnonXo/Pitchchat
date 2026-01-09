import type { Metadata } from "next";
import Link from "next/link";

import { PseoBreadcrumbSchema } from "@/components/pseo/PseoBreadcrumbSchema";
import pilotConfig from "@/data/pilot-config.json";
import { labelForIndustry, descriptionForIndustry } from "@/data/labelUtils";

type PageParams = {
  industry: string;
};

export function generateStaticParams() {
  return pilotConfig.industries.map((industry) => ({
    industry: industry.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: PageParams;
}): Metadata {
  const industryLabel = labelForIndustry(params.industry);
  const canonical = `/investor-questions/industries/${params.industry}/`;
  return {
    title: `${industryLabel} Investor Resources - Pitchchat`,
    description: `Investor questions, deck outlines, and benchmarks for ${industryLabel} startups.`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${industryLabel} Investor Resources - Pitchchat`,
      description: `Investor questions, deck outlines, and benchmarks for ${industryLabel} startups.`,
      url: canonical,
      type: "website",
      // OG image inherited from root opengraph-image.tsx
    },
    twitter: {
      card: "summary_large_image",
      title: `${industryLabel} Investor Resources - Pitchchat`,
      description: `Investor questions, deck outlines, and benchmarks for ${industryLabel} startups.`,
      // Twitter image inherited from root opengraph-image.tsx
    },
  };
}

export default function InvestorQuestionsIndustryPage({
  params,
}: {
  params: PageParams;
}) {
  const industryLabel = labelForIndustry(params.industry);
  const industryDesc = descriptionForIndustry(params.industry);

  const breadcrumbItems = [
    { name: "Investor Questions", path: "/investor-questions" },
    { name: industryLabel, path: `/investor-questions/industries/${params.industry}` },
  ];

  return (
    <>
      <PseoBreadcrumbSchema items={breadcrumbItems} />
      <main className="mx-auto max-w-4xl px-6 py-16">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Industry hub
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-neutral-900">
          {industryLabel} investor resources
        </h1>

        {industryDesc && (
          <>
            <p className="mt-4 text-base text-neutral-700">{industryDesc.intro}</p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                  Key focus areas
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                  {industryDesc.focus.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                  Metrics investors track
                </h2>
                <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                  {industryDesc.keyMetrics.map((item) => (
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
            Resources by funding stage
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Select a stage to access targeted investor questions, deck outlines, and benchmarks.
          </p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {pilotConfig.stages.map((stage) => (
              <div
                key={stage.slug}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-neutral-900">{stage.label}</h3>
                <ul className="mt-4 space-y-2 text-sm text-neutral-700">
                  {pilotConfig.pageTypes.map((pageType) => (
                    <li key={pageType.slug}>
                      <Link
                        className="hover:text-neutral-900 hover:underline"
                        href={`/investor-questions/${params.industry}/${stage.slug}/${pageType.slug}/`}
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
