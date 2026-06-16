"use client";

import { useState } from "react";
import { Button } from "@biz11/components/ui/Button";
import { QuantityInput } from "@biz11/components/ui/QuantityInput";
import { formatPrice, getBusiness } from "@biz11/lib/business-mock";

type AddToCartSectionProps = {
  price: string;
  quantity: number;
  skuCode: string;
};

export function AddToCartSection({
  price,
  quantity,
  skuCode,
}: AddToCartSectionProps) {
  const [qty, setQty] = useState(1);
  const currency = getBusiness().currency;

  return (
    <>
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {quantity > 0
              ? `In Stock (${quantity} available)`
              : "Out of Stock"}
          </p>
          <p className="text-xs text-muted">SKU: {skuCode}</p>
        </div>
      </div>

      {quantity > 0 && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-foreground">
            Quantity:
          </span>
          <QuantityInput max={quantity} onChange={setQty} />
        </div>
      )}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          disabled={quantity === 0}
        >
          Add to Cart &mdash;{" "}
          {formatPrice((parseFloat(price) * qty).toFixed(2), currency)}
        </Button>
        <Button variant="outline" size="lg" className="flex-1">
          Add to Wishlist
        </Button>
      </div>
    </>
  );
}
