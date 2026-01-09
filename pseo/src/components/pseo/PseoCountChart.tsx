type PseoCountChartItem = {
  label: string;
  value: number;
  target?: number;
  note?: string;
};

type PseoCountChartProps = {
  title?: string;
  caption?: string;
  items: PseoCountChartItem[];
};

function formatTarget(item: PseoCountChartItem) {
  if (typeof item.target !== "number") {
    return `${item.value}`;
  }
  return `${item.value} / ${item.target}`;
}

function getRatio(item: PseoCountChartItem, fallbackMax: number) {
  const denom = item.target ?? fallbackMax;
  if (!denom) return 0;
  return Math.min(item.value / denom, 1);
}

export function PseoCountChart({ title, caption, items }: PseoCountChartProps) {
  const maxValue = Math.max(
    1,
    ...items.map((item) => item.target ?? item.value ?? 0)
  );

  return (
    <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      {title && (
        <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          {title}
        </h3>
      )}
      <div className="mt-4 space-y-4">
        {items.map((item, index) => {
          const ratio = getRatio(item, maxValue);
          return (
            <div key={`${item.label}-${index}`}>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-neutral-500">
                <span>{item.label}</span>
                <span>{formatTarget(item)}</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-neutral-200">
                <div
                  className="h-2 rounded-full bg-neutral-800 transition-all"
                  style={{ width: `${Math.round(ratio * 100)}%` }}
                />
              </div>
              {item.note && (
                <p className="mt-2 text-xs text-neutral-500">{item.note}</p>
              )}
            </div>
          );
        })}
      </div>
      {caption && <p className="mt-4 text-xs text-neutral-500">{caption}</p>}
    </section>
  );
}
