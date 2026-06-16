"use client";

import { useEffect, useCallback } from "react";
import { clsx } from "clsx";
import { HiOutlineXMark } from "react-icons/hi2";
import { Button } from "@biz11/components/ui/Button";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  emoji: string;
};

const cartItems: CartItem[] = [
  { id: 1, name: "Wireless Headphones Pro", price: 129.99, quantity: 1, emoji: "\uD83C\uDFA7" },
  { id: 5, name: "Leather Crossbody Bag", price: 89.99, quantity: 2, emoji: "\uD83D\uDC5C" },
  { id: 11, name: "Portable Bluetooth Speaker", price: 59.99, quantity: 1, emoji: "\uD83D\uDD0A" },
];

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
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

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-50 bg-black/40 transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={clsx(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l-2 border-border bg-surface transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b-2 border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">
            Cart ({cartItems.length})
          </h2>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground transition-colors duration-200 hover:bg-border-light cursor-pointer"
            aria-label="Close cart"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 border-b border-border-light py-4 last:border-none"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-border-light text-2xl">
                {item.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.name}
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  Qty: {item.quantity}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-primary">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t-2 border-border px-6 py-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">Subtotal</span>
            <span className="text-lg font-bold text-primary">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <p className="mb-4 text-xs text-muted">Shipping and taxes calculated at checkout</p>
          <Button variant="primary" size="lg" className="w-full">
            Checkout
          </Button>
        </div>
      </div>
    </>
  );
}
