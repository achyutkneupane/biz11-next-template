"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getOrder } from "@biz11/lib/api-client";
import { formatPrice } from "@biz11/lib/helpers";
import { Breadcrumbs } from "@biz11/components/ui/Breadcrumbs";
import { ProductDetailSkeleton } from "@biz11/components/Skeletons/ProductDetailSkeleton";
import type { OrderStatus } from "@biz11/Types/Api";

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-warning/10 text-warning",
  confirmed: "bg-primary-light/10 text-primary",
  processing: "bg-accent/10 text-accent",
  shipped: "bg-accent/10 text-accent",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-danger/10 text-danger",
};

const currencySymbols: Record<string, string> = { USD: "$", EUR: "\u20AC", GBP: "\u00A3", NPR: "\u20A8" };
const sym = (c: string) => currencySymbols[c] || "$";

export function _OrderDetail({ nanoId }: { nanoId: string }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["order", nanoId],
    queryFn: () => getOrder(nanoId),
  });

  const order = data?.data;

  if (isLoading) return <ProductDetailSkeleton />;

  if (isError || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-xl font-bold text-primary">Order not found</h2>
        <p className="mt-1 text-sm text-muted">This order does not exist or has been removed.</p>
        <Link href="/" className="mt-6 text-sm font-semibold text-accent hover:text-accent-dark">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Order" },
          { label: `#${order.nanoId.slice(0, 8)}` },
        ]}
      />

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-primary sm:text-4xl">Order #{order.nanoId.slice(0, 8)}</h1>
          <p className="mt-1 text-sm text-muted">{new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        <span className={`rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${statusColors[order.status] || "bg-border-light text-muted"}`}>
          {order.status}
        </span>
      </div>

      {order.notes && (
        <div className="mb-8 rounded-2xl border border-border bg-surface p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Notes</p>
          <p className="mt-1 text-sm text-foreground">{order.notes}</p>
        </div>
      )}

      <div className="rounded-2xl border border-border bg-surface shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">Items</h2>
        </div>

        <div className="divide-y divide-border-light">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-border-light">
                {item.coverUrl && <img src={item.coverUrl} alt={item.productName} className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{item.productName}</p>
                <p className="text-xs text-muted">{item.skuCode} &times; {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-foreground">{formatPrice(item.subtotal, order.currency)}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-border px-6 py-5 space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted">Subtotal</span>
            <span className="font-medium text-foreground">{formatPrice(order.subtotal, order.currency)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted">Tax</span>
            <span className="font-medium text-foreground">{formatPrice(order.tax, order.currency)}</span>
          </div>
          {order.discount !== "0" && (
            <div className="flex items-center justify-between">
              <span className="text-muted">Discount</span>
              <span className="font-medium text-success">&minus;{formatPrice(order.discount, order.currency)}</span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-border pt-2 text-base">
            <span className="font-bold text-foreground">Total</span>
            <span className="font-black text-primary">{formatPrice(order.total, order.currency)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/products" className="text-sm font-semibold text-accent hover:text-accent-dark">
          Continue Shopping &rarr;
        </Link>
      </div>
    </div>
  );
}
