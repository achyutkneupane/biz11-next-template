"use client";

import Link from "next/link";
import { clsx } from "clsx";
import type { ProductResource } from "@biz11/Types/Api";
import { getDefaultSku } from "@biz11/Types/Api";
import { useStore } from "@biz11/store";
import { selectCurrency } from "@biz11/store/business/selectors";
import { formatPrice } from "@biz11/lib/helpers";

type ProductCardProps = {
  product: ProductResource;
  variant?: "default" | "featured" | "compact";
};

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const currency = useStore(selectCurrency);

  return (
    <Link
      href={`/products/${product.slug}`}
      className={clsx(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface",
        "shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        variant === "featured" ? "sm:flex-row" : "",
      )}
    >
      <div
        className={clsx(
          "relative overflow-hidden bg-border-light",
          variant === "featured" && "h-64 w-full shrink-0 sm:h-auto sm:w-72",
          variant === "default" && "h-56 w-full",
          variant === "compact" && "h-40 w-full",
        )}
      >
        <img
          src={product.coverUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div
        className={clsx(
          "flex flex-1 flex-col gap-1.5",
          variant === "featured" ? "justify-center gap-2 p-6 sm:p-8" : "",
          variant === "default" ? "gap-2 p-5" : "",
          variant === "compact" ? "p-3" : "",
        )}
      >
        <span
          className={clsx(
            "font-semibold uppercase tracking-[0.12em] text-accent",
            variant === "compact" ? "text-[10px]" : "text-xs",
          )}
        >
          {product.brand.name}
        </span>
        <h3
          className={clsx(
            "font-bold text-foreground transition-colors duration-200 group-hover:text-primary",
            variant === "compact" ? "text-sm" : "",
          )}
        >
          {product.name}
        </h3>
        {variant !== "compact" && (
          <p className="text-sm leading-relaxed text-muted line-clamp-2">
            {product.description}
          </p>
        )}
        <div
          className={clsx(
            "mt-auto flex items-center justify-between",
            variant === "compact" ? "pt-1" : "pt-3",
          )}
        >
          <span
            className={clsx(
              "font-bold tracking-tight text-primary",
              variant === "compact" ? "text-base" : "text-xl",
            )}
          >
            {formatPrice(getDefaultSku(product).price, currency)}
          </span>
          <span
            className={clsx(
              "rounded-full bg-accent/10 px-3 py-1 font-semibold uppercase tracking-wider text-accent",
              variant === "compact" ? "text-[10px]" : "text-[11px]",
            )}
          >
            {product.categories[0]?.name}
          </span>
        </div>
      </div>
    </Link>
  );
}
