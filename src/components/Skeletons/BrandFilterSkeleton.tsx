export function BrandFilterSkeleton() {
  return (
    <div>
      <div className="mb-3 h-3 w-14 animate-pulse rounded bg-border-light px-3" />
      <div className="space-y-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex h-9 items-center gap-3 rounded-xl px-3">
            <div className="h-4 w-4 animate-pulse rounded bg-border-light" />
            <div className="h-3.5 w-24 animate-pulse rounded bg-border-light" />
          </div>
        ))}
      </div>
    </div>
  );
}
