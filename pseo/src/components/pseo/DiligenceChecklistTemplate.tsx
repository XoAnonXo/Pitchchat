import { AuthorAttribution, getAuthorAttributionProps } from "@/components/pseo/AuthorAttribution";
import { PseoBreadcrumbs, type BreadcrumbItem } from "@/components/pseo/PseoBreadcrumbs";
import { PseoCtaButton } from "@/components/pseo/PseoCtaButton";
import { PseoInternalLinks } from "@/components/pseo/PseoInternalLinks";
import { PseoJsonLd } from "@/components/pseo/PseoJsonLd";
import { PseoPageTracker } from "@/components/pseo/PseoPageTracker";
import { labelForIndustry, labelForStage } from "@/data/labelUtils";
import type { PseoAnalyticsContext } from "@/lib/analytics";
import { buildPseoPageUrl } from "@/lib/pseoRoutes";

type ChecklistItem = {
  item: string;
  rationale?: string;
};

export type DiligenceChecklistPageData = {
  title: string;
  summary: string;
  items: ChecklistItem[];
  ctaText: string;
  context: PseoAnalyticsContext;
};

export function DiligenceChecklistTemplate({
  data,
}: {
  data: DiligenceChecklistPageData;
}) {
  const pageUrl = buildPseoPageUrl(data.context);
  const industryLabel = labelForIndustry(data.context.industry);
  const stageLabel = labelForStage(data.context.stage);
  const itemsCount = data.items.length;
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Investor Questions", href: "/investor-questions/" },
    { label: industryLabel, href: `/investor-questions/industries/${data.context.industry}/` },
    { label: stageLabel, href: `/investor-questions/stages/${data.context.stage}/` },
    { label: data.title },
  ];
  if (itemsCount === 0) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <PseoPageTracker context={data.context} />
        <PseoBreadcrumbs items={breadcrumbItems} />
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Pitchchat diligence checklist
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-neutral-900">{data.title}</h1>
        <p className="mt-4 text-base text-neutral-800">
          Diligence items are being finalized for {industryLabel} {stageLabel} rounds.
          Check back soon for a full checklist and rationale.
        </p>
        <PseoInternalLinks context={data.context} />
      </main>
    );
  }
  const steps = data.items.map((item, index) => ({
    "@type": "HowToStep",
    position: index + 1,
    name: item.item,
    text: item.rationale ?? item.item,
  }));

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: data.title,
    description: data.summary,
    url: pageUrl,
    step: steps,
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <PseoJsonLd schema={howToSchema} />
      <PseoPageTracker context={data.context} />
      <PseoBreadcrumbs items={breadcrumbItems} />
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Pitchchat diligence checklist
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-neutral-900">{data.title}</h1>
      <p className="mt-4 text-base text-neutral-800">
        This checklist covers {itemsCount} diligence items investors expect from {industryLabel}{" "}
        {stageLabel} startups, with rationale for each document.
      </p>
      <p className="mt-3 text-sm text-neutral-700">{data.summary}</p>
      <section className="mt-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          At a glance
        </h2>
        <dl className="mt-3 grid gap-4 rounded-2xl border border-neutral-200 bg-white p-5 text-sm shadow-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Round
            </dt>
            <dd className="mt-1 font-medium text-neutral-900">{stageLabel}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Industry
            </dt>
            <dd className="mt-1 font-medium text-neutral-900">{industryLabel}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Checklist items
            </dt>
            <dd className="mt-1 font-medium text-neutral-900">{itemsCount}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Format
            </dt>
            <dd className="mt-1 font-medium text-neutral-900">Step-by-step</dd>
          </div>
        </dl>
      </section>

      <AuthorAttribution
        stageLabel={stageLabel}
        industryLabel={industryLabel}
        {...getAuthorAttributionProps("checklist", stageLabel, industryLabel)}
      />

      {itemsCount > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-neutral-900">Readiness checklist</h2>
          <div className="mt-6 space-y-4">
            {data.items.map((item, index) => (
              <div
                key={`${item.item}-${index}`}
                className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-semibold text-neutral-900">
                  {index + 1}. {item.item}
                </p>
                {item.rationale ? (
                  <p className="mt-2 text-sm text-neutral-700">{item.rationale}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Readiness checklist</h2>
          <p className="mt-3 text-sm text-neutral-700">
            Checklist items are being finalized for this segment. Check back soon.
          </p>
        </section>
      )}

      <section className="mt-12 rounded-3xl border border-neutral-200 bg-neutral-50 p-8 text-center">
        <h2 className="text-xl font-semibold text-neutral-900">Share diligence docs with clarity</h2>
        <p className="mt-3 text-sm text-neutral-700">
          Pitchchat keeps every diligence asset organized for fast investor review.
        </p>
        <PseoCtaButton label={data.ctaText} context={data.context} />
      </section>

      <PseoInternalLinks context={data.context} />
    </main>
  );
}
