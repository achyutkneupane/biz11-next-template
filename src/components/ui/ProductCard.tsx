import Link from "next/link";
import { clsx } from "clsx";
import type { Product } from "@biz11/lib/mock-data";

type ProductCardProps = {
  product: Product;
  variant?: "default" | "featured";
};

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className={clsx(
        "group flex flex-col rounded-xl border-2 border-border bg-surface",
        "transition-colors duration-200 cursor-pointer",
        "hover:border-primary-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        variant === "featured" ? "sm:flex-row" : "",
      )}
    >
      <div
        className={clsx(
          "flex items-center justify-center bg-border-light",
          variant === "featured"
            ? "h-56 w-full sm:h-auto sm:w-56"
            : "h-48 w-full",
        )}
      >
        <span className="text-5xl text-muted-light">{product.emoji}</span>
      </div>
      <div className={clsx("flex flex-col gap-1.5 p-4", variant === "featured" ? "sm:justify-center sm:p-6" : "")}>
        <span className="text-xs font-medium uppercase tracking-wider text-muted">
          {product.brand}
        </span>
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>
        <p className="text-sm text-muted line-clamp-2">{product.description}</p>
        <span className="mt-1.5 text-lg font-bold text-primary">
          ${product.price.toFixed(2)}
        </span>
      </div>
    </Link>
  );
}
