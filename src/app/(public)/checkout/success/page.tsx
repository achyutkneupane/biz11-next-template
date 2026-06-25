import Link from "next/link";
import { Button } from "@biz11/components/ui/Button";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
        <svg className="h-10 w-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="mb-3 text-3xl font-black text-primary sm:text-4xl">
        Payment Successful!
      </h1>
      <p className="mb-2 text-muted">
        Thank you for your order. Your payment has been processed.
      </p>

      {orderId && (
        <div className="mx-auto mb-8 max-w-sm rounded-xl border border-border bg-surface p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">Order</p>
          <p className="mt-0.5 text-lg font-bold text-foreground">#{orderId.slice(0, 8)}</p>
        </div>
      )}

      <div className="flex items-center justify-center gap-4">
        <Link href={orderId ? `/orders/${orderId}` : "/"}>
          <Button variant="primary" size="lg">
            View Order
          </Button>
        </Link>
        <Link href="/products">
          <Button variant="outline" size="lg">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
