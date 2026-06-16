import Link from "next/link";
import { clsx } from "clsx";
import type { ProductResource } from "@biz11/Types/Api";
import { formatPrice, getBusiness } from "@biz11/lib/business-mock";

const currency = getBusiness().currency;

type ProductCardProps = {
  product: ProductResource;
  variant?: "default" | "featured";
};

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
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
          variant === "featured"
            ? "h-64 w-full shrink-0 sm:h-auto sm:w-72"
            : "h-56 w-full",
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
      <div className={clsx("flex flex-1 flex-col gap-2 p-5", variant === "featured" ? "sm:justify-center sm:p-8" : "")}>
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
          {product.brand.name}
        </span>
        <h3 className="font-bold text-foreground transition-colors duration-200 group-hover:text-primary">
          {product.name}
        </h3>
        <p className="text-sm leading-relaxed text-muted line-clamp-2">
          {product.description}
        </p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-xl font-bold tracking-tight text-primary">
            {formatPrice(product.defaultSku.price, currency)}
          </span>
          <span className="rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
            {product.categories[0]?.name}
          </span>
        </div>
      </div>
    </Link>
  );
}
