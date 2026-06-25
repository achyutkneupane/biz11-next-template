"use client";

import { useEffect, useState, useMemo } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useStore } from "@biz11/store";
import { selectBizId } from "@biz11/store/business/selectors";
import { getPaymentIntent } from "@biz11/app/actions/checkout";
import { StripePaymentForm } from "@biz11/components/checkout/StripePaymentForm";
import { ProductDetailSkeleton } from "@biz11/components/Skeletons/ProductDetailSkeleton";

export function StripePaymentPage({ orderId }: { orderId: string }) {
  const bizId = useStore(selectBizId);
  const [state, setState] = useState<{
    clientSecret: string | null;
    publishableKey: string | null;
    error: string | null;
    loading: boolean;
  }>({ clientSecret: null, publishableKey: null, error: null, loading: true });

  useEffect(() => {
    if (!bizId) return;

    let cancelled = false;

    getPaymentIntent(orderId, bizId).then((result) => {
      if (cancelled) return;
      setState({
        clientSecret: result.clientSecret,
        publishableKey: result.publishableKey,
        error: null,
        loading: false,
      });
    }).catch((err: unknown) => {
      if (cancelled) return;
      setState({
        clientSecret: null,
        publishableKey: null,
        error: err instanceof Error ? err.message : "Failed to initialize payment",
        loading: false,
      });
    });

    return () => { cancelled = true; };
  }, [orderId, bizId]);

  const stripePromise = useMemo(() => {
    if (!state.publishableKey) return null;
    return loadStripe(state.publishableKey);
  }, [state.publishableKey]);

  const options: StripeElementsOptions | undefined = useMemo(() => {
    if (!state.clientSecret) return undefined;
    return { clientSecret: state.clientSecret };
  }, [state.clientSecret]);

  if (state.loading) {
    return <ProductDetailSkeleton />;
  }

  if (state.error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-5 rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <span className="text-5xl">!</span>
        </div>
        <h2 className="text-xl font-bold text-primary">Payment Error</h2>
        <p className="mt-1 text-sm text-muted">{state.error}</p>
      </div>
    );
  }

  if (!stripePromise || !options) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-xl font-bold text-primary">Configuration Error</h2>
        <p className="mt-1 text-sm text-muted">Payment system is not configured.</p>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripePaymentForm orderId={orderId} />
    </Elements>
  );
}
