"use client";

import Image from "next/image";
import { useStore } from "@biz11/store";
import { selectCartItems, selectCartSubtotal } from "@biz11/store/cart/selectors";
import { selectCurrency } from "@biz11/store/business/selectors";
import { formatPrice } from "@biz11/lib/helpers";

export function OrderSummary() {
  const items = useStore(selectCartItems);
  const subtotal = useStore(selectCartSubtotal);
  const currency = useStore(selectCurrency);

  return (
    <section>
      <h2 className="mb-4 text-lg font-bold text-foreground">Order Summary</h2>
      <div className="rounded-xl border border-border bg-surface divide-y divide-border">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 px-4 py-3">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-border-light">
              {item.coverUrl && (
                <Image src={item.coverUrl} alt={item.productName} width={48} height={48} className="h-12 w-12 object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{item.productName}</p>
              <p className="text-xs text-muted-light">{item.skuCode}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-foreground">
                {formatPrice(item.subtotal, currency)}
              </p>
              <p className="text-xs text-muted">
                {formatPrice(item.unitPrice, currency)} x {item.quantity}
              </p>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm font-semibold text-foreground">Total</span>
          <span className="text-xl font-black text-primary">
            {formatPrice(subtotal.toFixed(2), currency)}
          </span>
        </div>
      </div>
    </section>
  );
}
