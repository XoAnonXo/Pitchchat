import { PseoBreadcrumbs, type BreadcrumbItem } from "@/components/pseo/PseoBreadcrumbs";
import { PseoCtaButton } from "@/components/pseo/PseoCtaButton";
import { PseoInternalLinks } from "@/components/pseo/PseoInternalLinks";
import { PseoJsonLd } from "@/components/pseo/PseoJsonLd";
import { PseoPageTracker } from "@/components/pseo/PseoPageTracker";
import { labelForIndustry, labelForStage } from "@/data/labelUtils";
import type { PseoAnalyticsContext } from "@/lib/analytics";
import { getSiteUrl } from "@/lib/site";
import { buildPseoPageUrl } from "@/lib/pseoRoutes";

type Metric = {
  label: string;
  value: string;
  note?: string;
};

export type MetricsBenchmarksPageData = {
  title: string;
  summary: string;
  metrics: Metric[];
  ctaText: string;
  context: PseoAnalyticsContext;
};

export function MetricsBenchmarksTemplate({
  data,
}: {
  data: MetricsBenchmarksPageData;
}) {
  const pageUrl = buildPseoPageUrl(data.context);
  const industryLabel = labelForIndustry(data.context.industry);
  const stageLabel = labelForStage(data.context.stage);
  const metricsCount = data.metrics.length;
  const breadcrumbItems: BreadcrumbItem[] = [
    { label: "Investor Questions", href: "/investor-questions/" },
    { label: industryLabel, href: `/investor-questions/industries/${data.context.industry}/` },
    { label: stageLabel, href: `/investor-questions/stages/${data.context.stage}/` },
    { label: data.title },
  ];
  if (metricsCount === 0) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <PseoPageTracker context={data.context} />
        <PseoBreadcrumbs items={breadcrumbItems} />
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Pitchchat metrics benchmarks
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-neutral-900">{data.title}</h1>
        <p className="mt-4 text-base text-neutral-800">
          Benchmark data is being validated for {industryLabel} {stageLabel} teams.
          Check back soon for target ranges and investor expectations.
        </p>
        <PseoInternalLinks context={data.context} />
      </main>
    );
  }
  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: data.title,
    description: data.summary,
    url: pageUrl,
    creator: {
      "@type": "Organization",
      name: "Pitchchat",
      url: getSiteUrl(),
    },
    variableMeasured: data.metrics.map((metric) => metric.label),
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <PseoJsonLd schema={datasetSchema} />
      <PseoPageTracker context={data.context} />
      <PseoBreadcrumbs items={breadcrumbItems} />
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Pitchchat metrics benchmarks
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-neutral-900">{data.title}</h1>
      <p className="mt-4 text-base text-neutral-800">
        This page lists {metricsCount} fundraising benchmarks for {industryLabel} {stageLabel}{" "}
        startups and explains how investors interpret each one.
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
              Metrics
            </dt>
            <dd className="mt-1 font-medium text-neutral-900">{metricsCount}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Data type
            </dt>
            <dd className="mt-1 font-medium text-neutral-900">Benchmarks</dd>
          </div>
        </dl>
      </section>

      {metricsCount > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-neutral-900">Benchmark metrics</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Metric</th>
                  <th className="px-5 py-3 font-semibold">Target</th>
                  <th className="px-5 py-3 font-semibold">Why it matters</th>
                </tr>
              </thead>
              <tbody>
                {data.metrics.map((metric, index) => (
                  <tr key={`${metric.label}-${index}`} className="border-t border-neutral-100">
                    <td className="px-5 py-4 font-medium text-neutral-900">
                      {metric.label}
                    </td>
                    <td className="px-5 py-4 text-neutral-700">{metric.value}</td>
                    <td className="px-5 py-4 text-neutral-600">{metric.note ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Benchmark metrics</h2>
          <p className="mt-3 text-sm text-neutral-700">
            Benchmark metrics are being validated for this segment. Check back soon.
          </p>
        </section>
      )}

      <section className="mt-12 rounded-3xl border border-neutral-200 bg-neutral-50 p-8 text-center">
        <h2 className="text-xl font-semibold text-neutral-900">Share your metrics with confidence</h2>
        <p className="mt-3 text-sm text-neutral-700">
          Pitchchat keeps your metrics organized and investor-ready in one place.
        </p>
        <PseoCtaButton label={data.ctaText} context={data.context} />
      </section>

      <PseoInternalLinks context={data.context} />
    </main>
  );
}
