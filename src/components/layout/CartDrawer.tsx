"use client";

import { useEffect, useCallback } from "react";
import { clsx } from "clsx";
import { HiOutlineXMark } from "react-icons/hi2";
import { useStore } from "@biz11/store";
import { selectCartItems } from "@biz11/store/cart/selectors";
import { selectCurrency } from "@biz11/store/business/selectors";
import { formatPrice } from "@biz11/lib/helpers";
import { useCart, useUpdateCartItem, useRemoveCartItem } from "@biz11/Hooks/cart/useCart";
import { CartItemRow } from "@biz11/components/ui/CartItemRow";
import { CartSummary } from "@biz11/components/ui/CartSummary";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { data: cartData } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeCartItem = useRemoveCartItem();
  const currency = useStore(selectCurrency);

  const items = useStore(selectCartItems);
  const cartItems = cartData?.data ?? items;

  const subtotal = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
  const fp = (p: string) => formatPrice(p, currency);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-50 bg-black/50 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={clsx(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-surface shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="text-lg font-bold text-foreground">
            Cart <span className="text-muted">({cartItems.length})</span>
          </h2>
          <button onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-all duration-200 hover:bg-border-light hover:text-foreground cursor-pointer"
            aria-label="Close cart"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-muted">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <CartItemRow
                key={item.id}
                coverUrl={item.coverUrl}
                productName={item.productName}
                skuCode={item.skuCode}
                subtotal={item.subtotal}
                quantity={item.quantity}
                formatPrice={fp}
                onUpdateQuantity={(qty) => updateCartItem.mutate({ id: item.id, quantity: qty })}
                onRemove={() => removeCartItem.mutate(item.id)}
              />
            ))
          )}
        </div>

        <CartSummary
          subtotal={subtotal.toFixed(2)}
          itemCount={cartItems.length}
          formatPrice={fp}
          onClose={onClose}
        />
      </div>
    </>
  );
}
