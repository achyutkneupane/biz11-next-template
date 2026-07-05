import { clsx } from "clsx";

type ProductCardSkeletonProps = {
  variant?: "default" | "compact";
};

export function ProductCardSkeleton({ variant = "default" }: ProductCardSkeletonProps) {
  return (
    <div
      className={clsx(
        "flex flex-col overflow-hidden rounded-2xl border border-border bg-surface",
        variant === "compact" ? "" : "shadow-sm",
      )}
    >
      <div
        className={clsx(
          "animate-pulse bg-border-light",
          variant === "default" && "h-56 w-full",
          variant === "compact" && "h-40 w-full",
        )}
      />
      <div className={clsx("flex flex-col gap-2", variant === "default" ? "p-5" : "p-3")}>
        <div className="h-3 w-16 animate-pulse rounded bg-border-light" />
        <div className={clsx("h-4 animate-pulse rounded bg-border-light", variant === "default" ? "w-3/4" : "w-2/3")} />
        {variant !== "compact" && (
          <>
            <div className="h-3 w-full animate-pulse rounded bg-border-light" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-border-light" />
          </>
        )}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className={clsx("h-5 animate-pulse rounded bg-border-light", variant === "default" ? "w-20" : "w-14")} />
          <div className={clsx("h-5 w-14 animate-pulse rounded-full bg-border-light")} />
        </div>
      </div>
    </div>
  );
}
