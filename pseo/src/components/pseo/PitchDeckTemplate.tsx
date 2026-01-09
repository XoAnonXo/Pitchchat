import { AuthorAttribution, getAuthorAttributionProps } from "@/components/pseo/AuthorAttribution";
import { PseoBreadcrumbs, type BreadcrumbItem } from "@/components/pseo/PseoBreadcrumbs";
import { PseoCtaButton } from "@/components/pseo/PseoCtaButton";
import { PseoInternalLinks } from "@/components/pseo/PseoInternalLinks";
import { PseoJsonLd } from "@/components/pseo/PseoJsonLd";
import { PseoPageTracker } from "@/components/pseo/PseoPageTracker";
import { labelForIndustry, labelForStage } from "@/data/labelUtils";
import type { PseoAnalyticsContext } from "@/lib/analytics";
import { buildPseoPageUrl } from "@/lib/pseoRoutes";

type DeckSection = {
  title: string;
  guidance?: string;
  goal?: string;
};

export type PitchDeckPageData = {
  title: string;
  summary: string;
  sections: DeckSection[];
  ctaText: string;
  context: PseoAnalyticsContext;
};

export function PitchDeckTemplate({ data }: { data: PitchDeckPageData }) {
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
          Pitchchat pitch deck outline
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-neutral-900">{data.title}</h1>
        <p className="mt-4 text-base text-neutral-800">
          This deck outline is being finalized. Check back soon for a complete
          section-by-section guide.
        </p>
        <PseoInternalLinks context={data.context} />
      </main>
    );
  }
  const steps = data.sections.map((section, index) => {
    const textParts = [section.goal, section.guidance].filter(Boolean);
    const text = textParts.length > 0 ? textParts.join(" ") : section.title;
    return {
      "@type": "HowToStep",
      position: index + 1,
      name: section.title,
      text,
    };
  });

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
        Pitchchat pitch deck outline
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-neutral-900">{data.title}</h1>
      <p className="mt-4 text-base text-neutral-800">
        This outline includes {sectionsCount} sections that investors expect in a {industryLabel}{" "}
        {stageLabel} deck, with goals and guidance for each slide.
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
              Format
            </dt>
            <dd className="mt-1 font-medium text-neutral-900">Outline + guidance</dd>
          </div>
        </dl>
      </section>

      <AuthorAttribution
        stageLabel={stageLabel}
        industryLabel={industryLabel}
        {...getAuthorAttributionProps("deck", stageLabel, industryLabel)}
      />

      {sectionsCount > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-neutral-900">Suggested deck flow</h2>
          <div className="mt-6 space-y-4">
            {data.sections.map((section, index) => (
              <div
                key={`${section.title}-${index}`}
                className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-neutral-900">
                  {index + 1}. {section.title}
                </h3>
                {section.goal ? (
                  <p className="mt-2 text-sm font-medium text-neutral-700">
                    Goal: {section.goal}
                  </p>
                ) : null}
                {section.guidance ? (
                  <p className="mt-2 text-sm text-neutral-700">{section.guidance}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Suggested deck flow</h2>
          <p className="mt-3 text-sm text-neutral-700">
            Deck sections are being finalized for this segment. Check back soon.
          </p>
        </section>
      )}

      <section className="mt-12 rounded-3xl border border-neutral-200 bg-neutral-50 p-8 text-center">
        <h2 className="text-xl font-semibold text-neutral-900">Turn your deck into a pitch room</h2>
        <p className="mt-3 text-sm text-neutral-700">
          Pitchchat turns your documents into an interactive AI room that answers investor questions.
        </p>
        <PseoCtaButton label={data.ctaText} context={data.context} />
      </section>

      <PseoInternalLinks context={data.context} />
    </main>
  );
}
