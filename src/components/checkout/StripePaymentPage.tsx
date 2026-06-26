"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useStore } from "@biz11/store";
import { selectBizId } from "@biz11/store/business/selectors";
import { getPaymentIntent } from "@biz11/app/actions/checkout";
import { StripePaymentForm } from "@biz11/components/checkout/StripePaymentForm";
import { ProductDetailSkeleton } from "@biz11/components/Skeletons/ProductDetailSkeleton";
import { Button } from "@biz11/components/ui/Button";

const stripePromises = new Map<string, Promise<any>>();

function getStripe(publishableKey: string) {
  if (!stripePromises.has(publishableKey)) {
    stripePromises.set(publishableKey, loadStripe(publishableKey));
  }
  return stripePromises.get(publishableKey)!;
}

const appearance: StripeElementsOptions["appearance"] = {
  theme: "stripe",
  variables: {
    colorPrimary: "#CA8A04",
    colorBackground: "#FFFFFF",
    colorText: "#292524",
    colorDanger: "#DC2626",
    fontFamily: "Geist, -apple-system, sans-serif",
    borderRadius: "12px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": {
      border: "2px solid #E7E5E4",
      fontSize: "14px",
      padding: "12px",
    },
    ".Input:focus": {
      borderColor: "#CA8A04",
      boxShadow: "0 0 0 1px #CA8A04",
    },
    ".Label": {
      fontSize: "14px",
      fontWeight: "500",
      color: "#292524",
    },
    ".Tab": {
      border: "2px solid #E7E5E4",
    },
    ".Tab--selected": {
      borderColor: "#CA8A04",
    },
  },
};

export function StripePaymentPage({ orderId }: { orderId: string }) {
  const bizId = useStore(selectBizId);
  const [state, setState] = useState<{
    clientSecret: string | null;
    publishableKey: string | null;
    error: string | null;
    loading: boolean;
  }>({ clientSecret: null, publishableKey: null, error: null, loading: true });

  const fetchIntent = useCallback(() => {
    if (!bizId) return;

    setState((s) => ({ ...s, loading: true, error: null }));

    getPaymentIntent(orderId, bizId)
      .then((result) => {
        setState({
          clientSecret: result.clientSecret,
          publishableKey: result.publishableKey,
          error: null,
          loading: false,
        });
      })
      .catch((err: unknown) => {
        setState({
          clientSecret: null,
          publishableKey: null,
          error: err instanceof Error ? err.message : "Failed to initialize payment",
          loading: false,
        });
      });
  }, [orderId, bizId]);

  useEffect(() => {
    fetchIntent();
  }, [fetchIntent]);

  const stripePromise = useMemo(() => {
    if (!state.publishableKey) return null;
    return getStripe(state.publishableKey);
  }, [state.publishableKey]);

  const options: StripeElementsOptions | undefined = useMemo(() => {
    if (!state.clientSecret) return undefined;
    return { clientSecret: state.clientSecret, appearance };
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
        <p className="mt-1 mb-6 text-sm text-muted">{state.error}</p>
        <Button variant="primary" size="lg" onClick={fetchIntent}>
          Try Again
        </Button>
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
