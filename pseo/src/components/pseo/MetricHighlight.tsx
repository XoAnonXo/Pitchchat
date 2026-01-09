type MetricHighlightProps = {
  label: string;
  value: string;
  note?: string;
  /** Optional benchmark comparison text (e.g., "vs. 80% industry avg") */
  benchmark?: string;
};

/**
 * A visually appealing card component for displaying key metrics.
 * Features subtle hover animation with scale and shadow effects.
 */
export function MetricHighlight({
  label,
  value,
  note,
  benchmark,
}: MetricHighlightProps) {
  return (
    <div className="group relative rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:scale-[1.02] hover:border-neutral-300 hover:shadow-md">
      {/* Subtle gradient accent on hover */}
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      {/* Metric label */}
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {label}
      </p>

      {/* Metric value - prominent display */}
      <p className="mt-2 text-2xl font-bold text-neutral-900">{value}</p>

      {/* Benchmark comparison (if provided) */}
      {benchmark && (
        <p className="mt-1 text-xs font-medium text-neutral-400">{benchmark}</p>
      )}

      {/* Note/explanation */}
      {note && (
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">{note}</p>
      )}
    </div>
  );
}

type MetricHighlightGridProps = {
  metrics: Array<{
    label: string;
    value: string;
    note?: string;
    benchmark?: string;
  }>;
  /** Number of columns on larger screens (default: 3) */
  columns?: 2 | 3 | 4;
};

/**
 * A grid layout for displaying multiple MetricHighlight cards.
 * Responsive: 1 column on mobile, configurable columns on larger screens.
 */
export function MetricHighlightGrid({
  metrics,
  columns = 3,
}: MetricHighlightGridProps) {
  const columnClasses = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid gap-4 ${columnClasses[columns]}`}>
      {metrics.map((metric, index) => (
        <MetricHighlight
          key={`${metric.label}-${index}`}
          label={metric.label}
          value={metric.value}
          note={metric.note}
          benchmark={metric.benchmark}
        />
      ))}
    </div>
  );
}

type FeaturedMetricProps = {
  label: string;
  value: string;
  note?: string;
  /** Icon component to display (optional) */
  icon?: React.ReactNode;
};

/**
 * A larger, more prominent metric display for key/featured metrics.
 * Centered layout with optional icon.
 */
export function FeaturedMetric({
  label,
  value,
  note,
  icon,
}: FeaturedMetricProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-50 p-8 text-center shadow-sm transition-all duration-300 hover:shadow-lg">
      {/* Background decoration */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-neutral-100 opacity-50 transition-transform duration-300 group-hover:scale-110" />
      <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-neutral-100 opacity-30 transition-transform duration-300 group-hover:scale-110" />

      <div className="relative">
        {/* Optional icon */}
        {icon && (
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-600 transition-colors duration-200 group-hover:bg-neutral-200">
            {icon}
          </div>
        )}

        {/* Label */}
        <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          {label}
        </p>

        {/* Value - extra prominent */}
        <p className="mt-3 text-4xl font-bold text-neutral-900">{value}</p>

        {/* Note */}
        {note && (
          <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-neutral-600">
            {note}
          </p>
        )}
      </div>
    </div>
  );
}

// Simple inline icons for common metric types
export function TrendUpIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path d="M23 6l-9.5 9.5-5-5L1 18" />
      <path d="M17 6h6v6" />
    </svg>
  );
}

export function TargetIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export function ChartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path d="M18 20V10" />
      <path d="M12 20V4" />
      <path d="M6 20v-6" />
    </svg>
  );
}
