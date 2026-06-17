"use client";

import { clsx } from "clsx";
import { formatPrice } from "@biz11/lib/helpers";
import type { SkuResource } from "@biz11/Types/Api";

function SkuLabel({ sku }: { sku: SkuResource }) {
  if (sku.variantAttributes && Object.keys(sku.variantAttributes).length > 0) {
    return <>{Object.values(sku.variantAttributes).join(" / ")}</>;
  }
  return <>{sku.skuCode}</>;
}

export function SkuSelector({
  skus,
  selectedIndex,
  currency,
  onChange,
}: {
  skus: SkuResource[];
  selectedIndex: number;
  currency: string;
  onChange: (index: number) => void;
}) {
  if (skus.length <= 1) return null;

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-foreground">Options</p>
      <div className="flex flex-wrap gap-3">
        {skus.map((sku, i) => {
          const inStock = sku.quantity > 0;
          const selected = i === selectedIndex;
          return (
            <button
              key={sku.nanoId ?? sku.skuCode}
              onClick={() => onChange(i)}
              className={clsx(
                "rounded-xl border-2 px-5 py-3 text-left text-sm transition-all duration-200 cursor-pointer",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
                selected
                  ? "border-accent bg-accent/5 shadow-sm"
                  : "border-border bg-surface hover:border-muted-light hover:shadow-sm",
                !inStock && "opacity-50",
              )}
            >
              <span className="font-semibold text-foreground">
                <SkuLabel sku={sku} />
              </span>
              <div className="mt-1">
                <span className="font-bold text-primary">{formatPrice(sku.price, currency)}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
