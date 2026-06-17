type SpecItem = { key: string; value: string };

export function SpecificationsTable({
  title = "Specifications",
  items,
}: {
  title?: string;
  items: SpecItem[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-bold tracking-wide text-primary">{title}</h3>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
        {items.map((item, i) => (
          <div key={i}>
            <dt className="text-xs font-semibold uppercase tracking-wider text-muted">{item.key}</dt>
            <dd className="mt-0.5 text-sm font-medium text-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
