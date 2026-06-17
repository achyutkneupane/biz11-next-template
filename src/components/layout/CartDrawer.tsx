"use client";

import Link from "next/link";
import { useEffect, useCallback } from "react";
import { clsx } from "clsx";
import { HiOutlineXMark, HiOutlineTrash } from "react-icons/hi2";
import { Button } from "@biz11/components/ui/Button";
import { QuantityInput } from "@biz11/components/ui/QuantityInput";
import { useStore } from "@biz11/store";
import { selectCartItems, selectCartSubtotal } from "@biz11/store/cart/selectors";
import { selectCurrency } from "@biz11/store/business/selectors";
import { formatPrice } from "@biz11/lib/helpers";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useStore(selectCartItems);
  const subtotal = useStore(selectCartSubtotal);
  const removeItem = useStore((s) => s.removeItem);
  const updateQuantity = useStore((s) => s.updateQuantity);
  const currency = useStore(selectCurrency);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
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
            Cart{" "}
            <span className="text-muted">
              ({items.reduce((s, i) => s + i.quantity, 0)})
            </span>
          </h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-all duration-200 hover:bg-border-light hover:text-foreground cursor-pointer"
            aria-label="Close cart"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-muted">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.nanoId}
                className="flex items-center gap-4 border-b border-border-light py-5 last:border-none"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-border-light">
                  <img
                    src={item.coverUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {item.name}
                  </p>
                  <p className="mt-1.5 text-xs text-muted">{item.skuCode}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <QuantityInput
                      value={item.quantity}
                      max={999}
                      onChange={(qty) => updateQuantity(item.nanoId, qty)}
                    />
                    <p className="text-base font-bold text-accent">
                      {formatPrice(
                        (parseFloat(item.price) * item.quantity).toFixed(2),
                        currency,
                      )}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeItem(item.nanoId)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-light transition-colors duration-200 hover:bg-border-light hover:text-danger cursor-pointer"
                  aria-label={`Remove ${item.name}`}
                >
                  <HiOutlineTrash className="h-4 w-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-border px-6 py-5">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm text-muted">Subtotal</span>
            <span className="text-xl font-black text-primary">
              {formatPrice(subtotal.toFixed(2), currency)}
            </span>
          </div>
          <p className="mb-5 text-xs text-muted-light">
            Shipping and taxes calculated at checkout
          </p>
          {items.length > 0 ? (
            <Link href="/checkout" onClick={onClose}>
              <Button variant="primary" size="lg" className="w-full">
                Checkout &mdash; {formatPrice(subtotal.toFixed(2), currency)}
              </Button>
            </Link>
          ) : (
            <Button variant="primary" size="lg" className="w-full" disabled>
              Checkout &mdash; {formatPrice(subtotal.toFixed(2), currency)}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
