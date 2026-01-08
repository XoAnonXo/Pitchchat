import { PseoBreadcrumbs, type BreadcrumbItem } from "@/components/pseo/PseoBreadcrumbs";
import { PseoCtaButton } from "@/components/pseo/PseoCtaButton";
import { PseoInternalLinks } from "@/components/pseo/PseoInternalLinks";
import { PseoJsonLd } from "@/components/pseo/PseoJsonLd";
import { PseoPageTracker } from "@/components/pseo/PseoPageTracker";
import { labelForIndustry, labelForStage } from "@/data/labelUtils";
import type { PseoAnalyticsContext } from "@/lib/analytics";
import { getSiteUrl } from "@/lib/site";
import { buildPseoPageUrl } from "@/lib/pseoRoutes";

type UpdateSection = {
  section: string;
  content: string;
};

export type InvestorUpdatePageData = {
  title: string;
  summary: string;
  sections: UpdateSection[];
  ctaText: string;
  context: PseoAnalyticsContext;
};

export function InvestorUpdateTemplate({ data }: { data: InvestorUpdatePageData }) {
  const pageUrl = buildPseoPageUrl(data.context);
  const industryLabel = labelForIndustry(data.context.industry);
  const stageLabel = labelForStage(data.context.stage);
  const sectionsCount = data.sections.length;
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Investor Questions", href: "/investor-questions/" },
    { label: industryLabel, href: `/investor-questions/industries/${data.context.industry}/` },
    { label: stageLabel, href: `/investor-questions/stages/${data.context.stage}/` },
    { label: data.title },
  ];
  if (sectionsCount === 0) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <PseoPageTracker context={data.context} />
        <PseoBreadcrumbs items={breadcrumbItems} />
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Pitchchat investor update
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-neutral-900">{data.title}</h1>
        <p className="mt-4 text-base text-neutral-800">
          Investor update sections are being prepared for {industryLabel} {stageLabel} founders.
          Check back soon for a full template.
        </p>
        <PseoInternalLinks context={data.context} />
      </main>
    );
  }
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: data.title,
    description: data.summary,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    author: {
      "@type": "Organization",
      name: "Pitchchat",
      url: getSiteUrl(),
    },
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <PseoJsonLd schema={articleSchema} />
      <PseoPageTracker context={data.context} />
      <PseoBreadcrumbs items={breadcrumbItems} />
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Pitchchat investor update
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-neutral-900">{data.title}</h1>
      <p className="mt-4 text-base text-neutral-800">
        This update template includes {sectionsCount} sections tailored to {industryLabel}{" "}
        {stageLabel} founders, with prompts to keep investors aligned.
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
              Sections
            </dt>
            <dd className="mt-1 font-medium text-neutral-900">{sectionsCount}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Cadence
            </dt>
            <dd className="mt-1 font-medium text-neutral-900">Monthly or quarterly</dd>
          </div>
        </dl>
      </section>

      {sectionsCount > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-neutral-900">Update structure</h2>
          <div className="mt-6 space-y-4">
            {data.sections.map((section, index) => (
              <div
                key={`${section.section}-${index}`}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-neutral-900">
                  {index + 1}. {section.section}
                </h3>
                <p className="mt-2 text-sm text-neutral-700">{section.content}</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Update structure</h2>
          <p className="mt-3 text-sm text-neutral-700">
            Update sections are being finalized for this segment. Check back soon.
          </p>
        </section>
      )}

      <section className="mt-12 rounded-3xl border border-neutral-200 bg-neutral-50 p-8 text-center">
        <h2 className="text-xl font-semibold text-neutral-900">Keep investors in the loop</h2>
        <p className="mt-3 text-sm text-neutral-700">
          Pitchchat makes sharing updates effortless and trackable.
        </p>
        <PseoCtaButton label={data.ctaText} context={data.context} />
      </section>

      <PseoInternalLinks context={data.context} />
    </main>
  );
}
