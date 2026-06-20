"use client";

import { Button } from "@biz11/components/ui/Button";
import { useStore } from "@biz11/store";
import { selectCartItems } from "@biz11/store/cart/selectors";
import { selectCurrency } from "@biz11/store/business/selectors";
import { formatPrice } from "@biz11/lib/helpers";
import { useCart } from "@biz11/Hooks/cart/useCart";
import { useCheckout } from "@biz11/Hooks/cart/useCheckout";

export function _OrderSummary() {
  const { data: cartData } = useCart();
  const checkout = useCheckout();
  const currency = useStore(selectCurrency);

  const items = cartData?.data ?? useStore(selectCartItems);
  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
  const shipping = 12.99;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    checkout.mutate(undefined);
  };

  return (
    <div className="sticky top-24 rounded-2xl border border-border bg-surface p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-bold text-foreground">Order Summary</h2>

      <div className="space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-muted">Your cart is empty</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 border-b border-border-light pb-4 last:border-none last:pb-0">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-border-light">
                {item.coverUrl && <img src={item.coverUrl} alt={item.productName} className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{item.productName}</p>
                <p className="text-xs text-muted">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-foreground">
                {formatPrice(item.subtotal, currency)}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-muted">Subtotal</span>
          <span className="font-medium text-foreground">{formatPrice(subtotal.toFixed(2), currency)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">Shipping</span>
          <span className="font-medium text-foreground">
            {subtotal > 0 ? formatPrice(shipping.toFixed(2), currency) : formatPrice("0.00", currency)}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-2 text-base">
          <span className="font-bold text-foreground">Total</span>
          <span className="font-black text-primary">
            {formatPrice((subtotal > 0 ? total : 0).toFixed(2), currency)}
          </span>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        className="mt-6 w-full"
        disabled={items.length === 0 || checkout.isPending}
        onClick={handlePlaceOrder}
      >
        {checkout.isPending ? "Processing..." : `Place Order \u2014 ${formatPrice((subtotal > 0 ? total : 0).toFixed(2), currency)}`}
      </Button>

      <p className="mt-3 text-center text-xs text-muted-light">
        By placing this order, you agree to our Terms of Service
      </p>
    </div>
  );
}
