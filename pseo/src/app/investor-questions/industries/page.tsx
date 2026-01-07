import type { Metadata } from "next";
import Link from "next/link";

import pilotConfig from "@/data/pilot-config.json";

export const metadata: Metadata = {
  title: "Industries - Pitchchat Investor Questions",
  description: "Explore investor question playbooks and fundraising guidance by industry.",
  alternates: {
    canonical: "/investor-questions/industries/",
  },
  openGraph: {
    title: "Industries - Pitchchat Investor Questions",
    description: "Explore investor question playbooks and fundraising guidance by industry.",
    url: "/investor-questions/industries/",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Industries - Pitchchat Investor Questions",
    description: "Explore investor question playbooks and fundraising guidance by industry.",
  },
};

export default function InvestorQuestionsIndustriesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Industries</h1>
      <p className="mt-4 text-base text-neutral-700">
        Explore investor question playbooks by industry.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {pilotConfig.industries.map((industry) => (
          <Link
            key={industry.slug}
            className="rounded-2xl border border-neutral-200 bg-white p-5 text-sm font-semibold text-neutral-900 shadow-sm hover:border-neutral-300"
            href={`/investor-questions/industries/${industry.slug}/`}
          >
            {industry.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
