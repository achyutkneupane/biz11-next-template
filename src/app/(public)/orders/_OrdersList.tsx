"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useStore } from "@biz11/store";
import { selectIsBizLoaded } from "@biz11/store/business/selectors";
import { getOrders } from "@biz11/lib/api-client";
import { formatPrice } from "@biz11/lib/helpers";
import { OrdersListSkeleton } from "@biz11/components/Skeletons/OrdersListSkeleton";
import type { OrderStatus } from "@biz11/Types/Api";

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-warning/10 text-warning",
  confirmed: "bg-primary-light/10 text-primary",
  processing: "bg-accent/10 text-accent",
  shipped: "bg-accent/10 text-accent",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-danger/10 text-danger",
};

export function _OrdersList() {
  const [page, setPage] = useState(1);
  const isBizLoaded = useStore(selectIsBizLoaded);

  const { data, isLoading, isPending } = useQuery({
    queryKey: ["orders", page],
    queryFn: () => getOrders(page),
    enabled: isBizLoaded,
  });

  const orders = data?.data ?? [];
  const meta = data?.meta as
    | { currentPage: number; lastPage: number; perPage: number; total: number }
    | undefined;

  if (isPending || isLoading) return <OrdersListSkeleton />;

  return (
    <div>
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h2 className="text-xl font-bold text-primary">No orders yet</h2>
          <p className="mt-1 text-sm text-muted">You haven&apos;t placed any orders.</p>
          <Link href="/products" className="mt-6 text-sm font-semibold text-accent hover:text-accent-dark">
            Start Shopping &rarr;
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.nanoId}
              href={`/orders/${order.nanoId}`}
              className="flex items-center justify-between rounded-2xl border border-border bg-surface p-5 shadow-sm transition-colors duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">
                    #{order.orderNumber ?? order.nanoId.slice(0, 8)}
                  </span>
                  <span className={`rounded-full px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusColors[order.status] || "bg-border-light text-muted"}`}>
                    {order.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""} &middot;{" "}
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <span className="shrink-0 text-lg font-bold text-primary">
                {formatPrice(String(order.summary?.total ?? order.total ?? "0"), order.currency ?? "USD")}
              </span>
            </Link>
          ))}
        </div>
      )}

      {meta && meta.lastPage > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-muted-light hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-muted">
            Page {meta.currentPage} of {meta.lastPage}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
            disabled={page >= meta.lastPage}
            className="rounded-xl border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:border-muted-light hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
