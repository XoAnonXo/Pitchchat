import type { Metadata } from "next";
import Link from "next/link";

import pilotConfig from "@/data/pilot-config.json";

export const metadata: Metadata = {
  title: "Stages - Pitchchat Investor Questions",
  description: "Browse investor guidance and playbooks by fundraising stage.",
  alternates: {
    canonical: "/investor-questions/stages/",
  },
  openGraph: {
    title: "Stages - Pitchchat Investor Questions",
    description: "Browse investor guidance and playbooks by fundraising stage.",
    url: "/investor-questions/stages/",
    type: "website",
    // OG image inherited from root opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: "Stages - Pitchchat Investor Questions",
    description: "Browse investor guidance and playbooks by fundraising stage.",
    // Twitter image inherited from root opengraph-image.tsx
  },
};

export default function InvestorQuestionsStagesPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Stages</h1>
      <p className="mt-4 text-base text-neutral-700">
        Browse investor guidance by fundraising stage.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {pilotConfig.stages.map((stage) => (
          <Link
            key={stage.slug}
            className="rounded-2xl border border-neutral-200 bg-white p-5 text-sm font-semibold text-neutral-900 shadow-sm hover:border-neutral-300"
            href={`/investor-questions/stages/${stage.slug}/`}
          >
            {stage.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
