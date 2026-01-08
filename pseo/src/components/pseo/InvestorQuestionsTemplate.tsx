import { PseoCtaButton } from "@/components/pseo/PseoCtaButton";
import { PseoInternalLinks } from "@/components/pseo/PseoInternalLinks";
import { PseoJsonLd } from "@/components/pseo/PseoJsonLd";
import { PseoPageTracker } from "@/components/pseo/PseoPageTracker";
import { labelForIndustry, labelForStage } from "@/data/labelUtils";
import type { PseoAnalyticsContext } from "@/lib/analytics";
import { buildPseoPageUrl } from "@/lib/pseoRoutes";

type InvestorQuestion = {
  category: string;
  question: string;
  answer: string;
};

type Metric = {
  label: string;
  value: string;
  note?: string;
};

type Objection = {
  objection: string;
  response: string;
};

export type InvestorQuestionsPageData = {
  title: string;
  summary: string;
  questions: InvestorQuestion[];
  metrics?: Metric[];
  objections?: Objection[];
  ctaText: string;
  context: PseoAnalyticsContext;
};

export function InvestorQuestionsTemplate({ data }: { data: InvestorQuestionsPageData }) {
  const pageUrl = buildPseoPageUrl(data.context);
  const industryLabel = labelForIndustry(data.context.industry);
  const stageLabel = labelForStage(data.context.stage);
  const metrics = data.metrics ?? [];
  const objections = data.objections ?? [];
  const questionsCount = data.questions.length;
  const objectionsCount = objections.length;
  const metricsCount = metrics.length;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    name: data.title,
    description: data.summary,
    url: pageUrl,
    mainEntity: data.questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <PseoJsonLd schema={faqSchema} />
      <PseoPageTracker context={data.context} />
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        Pitchchat investor Q&A
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-neutral-900">{data.title}</h1>
      <p className="mt-4 text-base text-neutral-800">
        This page lists {questionsCount} investor questions, {objectionsCount} common objections,
        and {metricsCount} key metrics for {industryLabel} {stageLabel} fundraising.
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
              Questions
            </dt>
            <dd className="mt-1 font-medium text-neutral-900">{questionsCount}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Objections
            </dt>
            <dd className="mt-1 font-medium text-neutral-900">{objectionsCount}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Metrics
            </dt>
            <dd className="mt-1 font-medium text-neutral-900">{metricsCount}</dd>
          </div>
        </dl>
      </section>

      {questionsCount > 0 ? (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-neutral-900">Top investor questions</h2>
          <div className="mt-6 space-y-6">
            {data.questions.map((item, index) => (
              <div key={`${item.question}-${index}`} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  {item.category}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-neutral-900">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm text-neutral-700">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Top investor questions</h2>
          <p className="mt-3 text-sm text-neutral-700">
            Investor questions are being curated for this segment. Check back soon for the full
            list.
          </p>
        </section>
      )}

      {metricsCount > 0 ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-neutral-900">Metrics to be ready for</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Metric</th>
                  <th className="px-5 py-3 font-semibold">What to show</th>
                  <th className="px-5 py-3 font-semibold">Why it matters</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric, index) => (
                  <tr key={`${metric.label}-${index}`} className="border-t border-neutral-100">
                    <td className="px-5 py-4 font-medium text-neutral-900">{metric.label}</td>
                    <td className="px-5 py-4 text-neutral-700">{metric.value}</td>
                    <td className="px-5 py-4 text-neutral-600">{metric.note ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <section className="mt-12 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Metrics to be ready for</h2>
          <p className="mt-3 text-sm text-neutral-700">
            Metrics guidance is being finalized for this segment. Check back soon for benchmark
            targets.
          </p>
        </section>
      )}

      {objectionsCount > 0 ? (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-neutral-900">Common objections to prepare for</h2>
          <div className="mt-4 space-y-4">
            {objections.map((item, index) => (
              <div key={`${item.objection}-${index}`} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-neutral-900">{item.objection}</p>
                <p className="mt-2 text-sm text-neutral-700">{item.response}</p>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-12 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900">Common objections to prepare for</h2>
          <p className="mt-3 text-sm text-neutral-700">
            Objection handling notes are being curated for this segment. Check back soon.
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
