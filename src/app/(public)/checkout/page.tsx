"use client";

import Link from "next/link";
import { HiOutlineCreditCard, HiOutlineTruck, HiOutlineShieldCheck } from "react-icons/hi2";
import { Button } from "@biz11/components/ui/Button";
import { Input } from "@biz11/components/ui/Input";
import { useStore } from "@biz11/store";
import { selectCartItems, selectCartSubtotal } from "@biz11/store/cart/selectors";
import { getBusiness } from "@biz11/lib/business-mock";
import { formatPrice } from "@biz11/lib/business-mock";

export default function CheckoutPage() {
  const items = useStore(selectCartItems);
  const subtotal = useStore(selectCartSubtotal);
  const currency = getBusiness().currency;
  const shipping = 12.99;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm">
        <Link
          href="/"
          className="font-medium text-muted transition-colors duration-200 hover:text-primary"
        >
          Home
        </Link>
        <span className="mx-2 text-muted-light">/</span>
        <span className="font-semibold text-primary">Checkout</span>
      </nav>

      <div className="mb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
          Secure checkout
        </span>
        <h1 className="mt-1 text-3xl font-black text-primary sm:text-4xl">
          Complete Your Order
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
        <div className="space-y-10 lg:col-span-3">
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <HiOutlineTruck className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Shipping Information
                </h2>
                <p className="text-xs text-muted">
                  Where should we send your order?
                </p>
              </div>
            </div>
            <div className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="First Name" placeholder="John" />
                <Input label="Last Name" placeholder="Doe" />
              </div>
              <Input label="Email Address" type="email" placeholder="john@example.com" />
              <Input label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" />
              <Input label="Street Address" placeholder="123 Main Street" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input label="City" placeholder="New York" />
                <Input label="State" placeholder="NY" />
                <Input label="ZIP Code" placeholder="10001" />
              </div>
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <HiOutlineCreditCard className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Payment Information
                </h2>
                <p className="text-xs text-muted">
                  We accept all major credit cards
                </p>
              </div>
            </div>
            <div className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <Input label="Card Number" placeholder="4242 4242 4242 4242" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Expiry Date" placeholder="MM/YY" />
                <Input label="CVC" placeholder="123" />
              </div>
            </div>
          </section>

          <div className="flex items-center gap-2 text-xs text-muted">
            <HiOutlineShieldCheck className="h-4 w-4 text-accent" />
            Your information is encrypted and secure
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-bold text-foreground">
              Order Summary
            </h2>

            <div className="space-y-4">
              {items.length === 0 ? (
                <p className="text-sm text-muted">Your cart is empty</p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.nanoId}
                    className="flex items-center gap-3 border-b border-border-light pb-4 last:border-none last:pb-0"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-border-light">
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
                      <p className="text-xs text-muted">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      {formatPrice(
                        (parseFloat(item.price) * item.quantity).toFixed(2),
                        currency,
                      )}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-medium text-foreground">
                  {formatPrice(subtotal.toFixed(2), currency)}
                </span>
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
                  {formatPrice(
                    (subtotal > 0 ? total : 0).toFixed(2),
                    currency,
                  )}
                </span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="mt-6 w-full"
              disabled={items.length === 0}
            >
              Place Order &mdash;{" "}
              {formatPrice(
                (subtotal > 0 ? total : 0).toFixed(2),
                currency,
              )}
            </Button>

            <p className="mt-3 text-center text-xs text-muted-light">
              By placing this order, you agree to our Terms of Service
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
