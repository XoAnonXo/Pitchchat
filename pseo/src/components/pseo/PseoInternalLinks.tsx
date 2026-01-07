import Link from "next/link";

import pilotConfig from "@/data/pilot-config.json";
import industryNeighbors from "@/data/industry-neighbors.json";
import { labelForIndustry, labelForStage } from "@/data/labelUtils";
import {
  buildIndustryHubPath,
  buildPseoPagePath,
  buildStageHubPath,
} from "@/lib/pseoRoutes";

type PseoLinkContext = {
  industry: string;
  stage: string;
  pageType: string;
};

type LinkItem = {
  label: string;
  href: string;
};

function rotateList<T extends { slug: string }>(items: T[], slug: string) {
  const index = items.findIndex((item) => item.slug === slug);
  if (index === -1) return items;
  return [...items.slice(index + 1), ...items.slice(0, index)];
}

export function PseoInternalLinks({ context }: { context: PseoLinkContext }) {
  const { industry, stage, pageType } = context;

  const pageTypeLabel =
    pilotConfig.pageTypes.find((type) => type.slug === pageType)?.label ?? "Guides";
  const otherPageTypes = pilotConfig.pageTypes.filter(
    (type) => type.slug !== pageType
  );

  const otherStages = pilotConfig.stages.filter((item) => item.slug !== stage);

  const neighborSlugs = industryNeighbors[industry as keyof typeof industryNeighbors] ?? [];
  const neighborIndustries = neighborSlugs
    .map((slug) => pilotConfig.industries.find((item) => item.slug === slug))
    .filter((item): item is (typeof pilotConfig.industries)[number] => Boolean(item))
    .slice(0, 3);
  const relatedIndustries =
    neighborIndustries.length > 0
      ? neighborIndustries
      : rotateList(pilotConfig.industries, industry).slice(0, 3);
  const alternateStage = otherStages[0]?.slug;

  const pageTypeLinks: LinkItem[] = otherPageTypes.map((type) => ({
    label: `${type.label} for ${labelForIndustry(industry)} ${labelForStage(stage)}`,
    href: buildPseoPagePath({
      industry,
      stage,
      pageType: type.slug,
    }),
  }));

  const industryLinks: LinkItem[] = relatedIndustries.map((item) => ({
    label: `${labelForIndustry(item.slug)} ${labelForStage(stage)} ${
      pageTypeLabel
    }`,
    href: buildPseoPagePath({
      industry: item.slug,
      stage,
      pageType,
    }),
  }));

  const stageLinks: LinkItem[] = otherStages.map((item) => ({
    label: `${labelForIndustry(industry)} ${labelForStage(item.slug)} ${
      pageTypeLabel
    }`,
    href: buildPseoPagePath({
      industry,
      stage: item.slug,
      pageType,
    }),
  }));

  const comboLinks: LinkItem[] = alternateStage
    ? relatedIndustries.map((item) => ({
        label: `${labelForIndustry(item.slug)} ${labelForStage(alternateStage)} ${
          pageTypeLabel
        }`,
        href: buildPseoPagePath({
          industry: item.slug,
          stage: alternateStage,
          pageType,
        }),
      }))
    : [];

  const hubLinks: LinkItem[] = [
    {
      label: "All investor questions",
      href: "/investor-questions/",
    },
    {
      label: "All industries",
      href: "/investor-questions/industries/",
    },
    {
      label: "All stages",
      href: "/investor-questions/stages/",
    },
  ];

  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold text-neutral-900">Keep exploring</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-neutral-900">More page types</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-700">
            {pageTypeLinks.map((link) => (
              <li key={link.href}>
                <Link className="hover:text-neutral-900" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-neutral-900">Related industries</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-700">
            {industryLinks.map((link) => (
              <li key={link.href}>
                <Link className="hover:text-neutral-900" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-neutral-900">Other stages</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-700">
            {stageLinks.map((link) => (
              <li key={link.href}>
                <Link className="hover:text-neutral-900" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-xs text-neutral-500">
            <Link className="hover:text-neutral-700" href={buildIndustryHubPath(industry)}>
              Browse {labelForIndustry(industry)} hubs
            </Link>
            {" · "}
            <Link className="hover:text-neutral-700" href={buildStageHubPath(stage)}>
              Browse {labelForStage(stage)} hubs
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-neutral-900">Related combinations</p>
          <ul className="mt-3 space-y-2 text-sm text-neutral-700">
            {comboLinks.map((link) => (
              <li key={link.href}>
                <Link className="hover:text-neutral-900" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 text-xs text-neutral-500">
            {hubLinks.map((link, index) => (
              <span key={link.href}>
                <Link className="hover:text-neutral-700" href={link.href}>
                  {link.label}
                </Link>
                {index < hubLinks.length - 1 ? " · " : null}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
