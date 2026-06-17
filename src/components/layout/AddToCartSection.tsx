"use client";

import { useState } from "react";
import { Button } from "@biz11/components/ui/Button";
import { QuantityInput } from "@biz11/components/ui/QuantityInput";
import { useStore } from "@biz11/store";
import { selectCurrency } from "@biz11/store/business/selectors";

function formatPrice(price: string, currency: string): string {
  const symbols: Record<string, string> = { USD: "$", EUR: "\u20AC", GBP: "\u00A3", NPR: "\u20A8" };
  return `${symbols[currency] || "$"}${price}`;
}

type AddToCartSectionProps = {
  nanoId: string;
  name: string;
  price: string;
  coverUrl: string;
  skuCode: string;
  quantity: number;
};

export function AddToCartSection(props: AddToCartSectionProps) {
  const [qty, setQty] = useState(1);
  const addItem = useStore((s) => s.addItem);
  const currency = useStore(selectCurrency);

  return (
    <>
      {props.quantity > 0 && (
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-foreground">Quantity:</span>
          <QuantityInput max={props.quantity} onChange={setQty} />
        </div>
      )}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <Button
          variant="primary"
          size="lg"
          className="flex-1"
          disabled={props.quantity === 0}
          onClick={() =>
            addItem({
              nanoId: props.nanoId,
              name: props.name,
              price: props.price,
              quantity: qty,
              coverUrl: props.coverUrl,
              skuCode: props.skuCode,
            })
          }
        >
          Add to Cart &mdash;{" "}
          {formatPrice((parseFloat(props.price) * qty).toFixed(2), currency)}
        </Button>
        <Button variant="outline" size="lg" className="flex-1">
          Add to Wishlist
        </Button>
      </div>
    </>
  );
}
