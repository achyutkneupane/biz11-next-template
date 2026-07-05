export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 h-4 w-48 animate-pulse rounded bg-border-light" />
      <div className="mb-8 h-8 w-64 animate-pulse rounded bg-border-light" />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <div className="h-48 w-full animate-pulse bg-border-light" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-16 animate-pulse rounded bg-border-light" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-border-light" />
              <div className="h-3 w-full animate-pulse rounded bg-border-light" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-border-light" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
