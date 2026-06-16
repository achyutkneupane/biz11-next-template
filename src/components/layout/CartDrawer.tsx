"use client";

import { useEffect, useCallback } from "react";
import { clsx } from "clsx";
import { HiOutlineXMark } from "react-icons/hi2";
import { Button } from "@biz11/components/ui/Button";

type CartItem = {
  id: number;
  name: string;
  price: string;
  quantity: number;
  coverUrl: string;
};

const cartItems: CartItem[] = [
  {
    id: 1,
    name: "Wireless Headphones Pro",
    price: "129.99",
    quantity: 1,
    coverUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80",
  },
  {
    id: 5,
    name: "Leather Crossbody Bag",
    price: "89.99",
    quantity: 2,
    coverUrl:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=100&q=80",
  },
  {
    id: 11,
    name: "Portable Bluetooth Speaker",
    price: "59.99",
    quantity: 1,
    coverUrl:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100&q=80",
  },
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

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0,
  );

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
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-muted transition-all duration-200 hover:bg-border-light hover:text-foreground cursor-pointer"
            aria-label="Close cart"
          >
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
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
                <p className="mt-0.5 text-sm text-muted">
                  Qty: {item.quantity}
                </p>
                <p className="mt-1 text-base font-bold text-accent">
                  ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border px-6 py-5">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm text-muted">Subtotal</span>
            <span className="text-xl font-black text-primary">
              ${subtotal.toFixed(2)}
            </span>
          </div>
          <p className="mb-5 text-xs text-muted-light">
            Shipping and taxes calculated at checkout
          </p>
          <Button variant="primary" size="lg" className="w-full">
            Checkout &mdash; ${subtotal.toFixed(2)}
          </Button>
        </div>
      </div>
    </>
  );
}
