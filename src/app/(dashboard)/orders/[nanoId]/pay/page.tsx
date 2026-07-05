"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useMemo } from "react";
import { getPaymentIntent, getOrder } from "@biz11/lib/api-client";
import { useStore } from "@biz11/store";
import { selectIsBizLoaded } from "@biz11/store/business/selectors";
import { formatPrice } from "@biz11/lib/helpers";

function CheckoutForm({ amount, currency }: { amount: string; currency: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const params = useParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders/${params.nanoId as string}`,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? "An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-lg rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-border sm:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-foreground">Complete Payment</h2>
        <p className="mt-1 text-sm text-muted">
          Amount due: <strong className="text-primary">{formatPrice(amount, currency)}</strong>
        </p>
      </div>

      <PaymentElement />

      {errorMessage && (
        <div className="mt-4 rounded-xl bg-error/10 p-4 text-sm text-error">
          {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="mt-8 flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-content shadow-sm transition-all duration-200 hover:bg-primary-dark hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isProcessing ? "Processing..." : `Pay ${formatPrice(amount, currency)}`}
      </button>
    </form>
  );
}

export default function PayOrderPage() {
  const params = useParams();
  const nanoId = params.nanoId as string;
  const isBizLoaded = useStore(selectIsBizLoaded);
  const router = useRouter();

  const { data: orderData, isLoading: isLoadingOrder } = useQuery({
    queryKey: ["order", nanoId],
    queryFn: () => getOrder(nanoId),
    enabled: !!nanoId && isBizLoaded,
  });

  const { data: intentData, isLoading: isLoadingIntent, isError } = useQuery({
    queryKey: ["payment_intent", nanoId],
    queryFn: () => getPaymentIntent(nanoId),
    enabled: !!nanoId && isBizLoaded,
  });

  const publishableKey = intentData?.data?.publishable_key;
  const stripePromise = useMemo(() => {
    if (publishableKey) {
      return loadStripe(publishableKey);
    }
    return null;
  }, [publishableKey]);

  if (isLoadingOrder || isLoadingIntent) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (isError || !orderData?.data || !intentData?.data) {
    return (
      <div className="mx-auto max-w-xl py-24 text-center">
        <h2 className="text-2xl font-bold text-error">Payment Error</h2>
        <p className="mt-2 text-muted">Unable to load payment details for this order. It may have expired or already been paid.</p>
        <button
          onClick={() => router.push(`/orders/${nanoId}`)}
          className="mt-6 inline-flex rounded-xl bg-surface px-5 py-2.5 text-sm font-semibold text-foreground ring-1 ring-inset ring-border transition-colors hover:bg-surface-hover"
        >
          Return to Order
        </button>
      </div>
    );
  }

  const order = orderData.data;

  if (order.paymentStatus === "paid" || order.status === "cancelled") {
    return (
      <div className="mx-auto max-w-xl py-24 text-center">
        <h2 className="text-2xl font-bold text-primary">Order Status</h2>
        <p className="mt-2 text-muted">
          This order is {order.paymentStatus === "paid" ? "already paid" : "cancelled"} and cannot be paid again.
        </p>
        <button
          onClick={() => router.push(`/orders/${nanoId}`)}
          className="mt-6 inline-flex rounded-xl bg-surface px-5 py-2.5 text-sm font-semibold text-foreground ring-1 ring-inset ring-border transition-colors hover:bg-surface-hover"
        >
          View Order
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      {stripePromise && intentData.data.client_secret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: intentData.data.client_secret,
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#000000",
                borderRadius: "12px",
              },
            },
          }}
        >
          <CheckoutForm 
            amount={String(order.summary?.total ?? order.total ?? "0")} 
            currency={order.currency ?? "USD"} 
          />
        </Elements>
      )}
    </div>
  );
}
