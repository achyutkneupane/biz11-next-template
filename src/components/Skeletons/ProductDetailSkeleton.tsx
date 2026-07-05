export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 h-4 w-64 animate-pulse rounded bg-border-light" />

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-3xl bg-border-light" />

        <div className="flex flex-col gap-6">
          <div>
            <div className="mb-2 h-3 w-20 animate-pulse rounded bg-border-light" />
            <div className="mb-2 h-8 w-3/4 animate-pulse rounded bg-border-light" />
            <div className="flex gap-2">
              <div className="h-6 w-20 animate-pulse rounded-full bg-border-light" />
              <div className="h-6 w-24 animate-pulse rounded-full bg-border-light" />
            </div>
          </div>

          <div className="h-10 w-32 animate-pulse rounded bg-border-light" />

          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-border-light" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-border-light" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-border-light" />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4">
            <div className="h-10 w-10 animate-pulse rounded-xl bg-border-light" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-40 animate-pulse rounded bg-border-light" />
              <div className="h-3 w-24 animate-pulse rounded bg-border-light" />
            </div>
          </div>

          <div className="h-10 w-36 animate-pulse rounded bg-border-light" />

          <div className="rounded-2xl border border-border bg-surface p-6">
            <div className="mb-4 h-4 w-28 animate-pulse rounded bg-border-light" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i}>
                  <div className="mb-1 h-3 w-16 animate-pulse rounded bg-border-light" />
                  <div className="h-4 w-24 animate-pulse rounded bg-border-light" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <div className="h-12 flex-1 animate-pulse rounded-xl bg-border-light" />
            <div className="h-12 flex-1 animate-pulse rounded-xl bg-border-light" />
          </div>
        </div>
      </div>
    </div>
  );
}
