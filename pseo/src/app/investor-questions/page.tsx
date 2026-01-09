import type { Metadata } from "next";
import Link from "next/link";

import pilotConfig from "@/data/pilot-config.json";

export const metadata: Metadata = {
  title: "Investor Questions Hub - Pitchchat",
  description: "Browse investor questions, deck outlines, benchmarks, and diligence checklists.",
  alternates: {
    canonical: "/investor-questions/",
  },
  openGraph: {
    title: "Investor Questions Hub - Pitchchat",
    description: "Browse investor questions, deck outlines, benchmarks, and diligence checklists.",
    url: "/investor-questions/",
    type: "website",
    // OG image inherited from root opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: "Investor Questions Hub - Pitchchat",
    description: "Browse investor questions, deck outlines, benchmarks, and diligence checklists.",
    // Twitter image inherited from root opengraph-image.tsx
  },
};

export default function InvestorQuestionsIndexPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Investor questions hub</h1>
      <p className="mt-4 text-base text-neutral-700">
        Browse Pitchchat programmatic pages by industry, stage, or page type.
      </p>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">Industries</h2>
          <ul className="mt-4 space-y-2 text-sm text-neutral-700">
            {pilotConfig.industries.map((industry) => (
              <li key={industry.slug}>
                <Link
                  className="hover:text-neutral-900"
                  href={`/investor-questions/industries/${industry.slug}/`}
                >
                  {industry.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-900">Stages</h2>
          <ul className="mt-4 space-y-2 text-sm text-neutral-700">
            {pilotConfig.stages.map((stage) => (
              <li key={stage.slug}>
                <Link
                  className="hover:text-neutral-900"
                  href={`/investor-questions/stages/${stage.slug}/`}
                >
                  {stage.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">Page types</h2>
        <div className="mt-4 flex flex-wrap gap-3 text-sm text-neutral-700">
          {pilotConfig.pageTypes.map((pageType) => (
            <span
              key={pageType.slug}
              className="rounded-full border border-neutral-200 px-3 py-1"
            >
              {pageType.label}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs text-neutral-500">
          These pages are available for each industry and stage under
          `/investor-questions/`.
        </p>
      </section>
    </main>
  );
}
