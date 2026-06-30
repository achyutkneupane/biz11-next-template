export function OrdersListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between rounded-2xl border border-border bg-surface p-5">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-4 w-20 animate-pulse rounded bg-border-light" />
              <div className="h-5 w-20 animate-pulse rounded-full bg-border-light" />
            </div>
            <div className="h-3 w-48 animate-pulse rounded bg-border-light" />
          </div>
          <div className="h-6 w-20 animate-pulse rounded bg-border-light" />
        </div>
      ))}
    </div>
  );
}
