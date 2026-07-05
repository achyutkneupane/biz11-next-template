export function CategoryTreeSkeleton() {
  const items = [
    { width: "w-full", children: true },
    { width: "w-3/4", children: false },
    { width: "w-5/6", children: true },
    { width: "w-2/3", children: false },
    { width: "w-4/5", children: false },
  ];

  return (
    <div>
      <div className="mb-3 h-3 w-20 animate-pulse rounded bg-border-light px-3" />
      <div className="space-y-1">
        <div className="h-9 w-full animate-pulse rounded-xl bg-border-light" />
        {items.map((item, i) => (
          <div
            key={i}
            className="flex h-9 items-center gap-2 rounded-xl px-3"
          >
            {item.children && <div className="h-3.5 w-3.5 animate-pulse rounded bg-border-light" />}
            <div className={`h-3.5 animate-pulse rounded bg-border-light ${item.width}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
