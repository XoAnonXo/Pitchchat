import type { Metadata } from "next";
import Link from "next/link";

import pilotConfig from "@/data/pilot-config.json";
import { labelForIndustry } from "@/data/labelUtils";

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
    },
    twitter: {
      card: "summary",
      title: `${industryLabel} Investor Resources - Pitchchat`,
      description: `Investor questions, deck outlines, and benchmarks for ${industryLabel} startups.`,
    },
  };
}

export default function InvestorQuestionsIndustryPage({
  params,
}: {
  params: PageParams;
}) {
  const industryLabel = labelForIndustry(params.industry);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Industry hub
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-neutral-900">
        {industryLabel} investor resources
      </h1>
      <p className="mt-4 text-base text-neutral-700">
        Choose a stage and page type to get focused investor guidance.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {pilotConfig.stages.map((stage) => (
          <div
            key={stage.slug}
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-neutral-900">{stage.label}</h2>
            <ul className="mt-4 space-y-2 text-sm text-neutral-700">
              {pilotConfig.pageTypes.map((pageType) => (
                <li key={pageType.slug}>
                  <Link
                    className="hover:text-neutral-900"
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
    </main>
  );
}
