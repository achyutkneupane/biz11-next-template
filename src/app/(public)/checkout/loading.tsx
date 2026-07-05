export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="mb-6 inline-flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-border-light" />
      <div className="mx-auto mb-3 h-10 w-64 animate-pulse rounded bg-border-light" />
      <div className="mx-auto mb-8 h-4 w-80 animate-pulse rounded bg-border-light" />
      <div className="mx-auto mb-8 h-20 w-80 animate-pulse rounded-xl bg-border-light" />
      <div className="mx-auto flex max-w-sm justify-center gap-4">
        <div className="h-12 w-36 animate-pulse rounded-xl bg-border-light" />
        <div className="h-12 w-44 animate-pulse rounded-xl bg-border-light" />
      </div>
    </div>
  );
}
