import { ProductCardSkeleton } from "@biz11/components/Skeletons/ProductCardSkeleton";

type ProductGridSkeletonProps = {
  count?: number;
  variant?: "default" | "compact";
};

export function ProductGridSkeleton({ count = 6, variant = "default" }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} variant={variant} />
      ))}
    </div>
  );
}
