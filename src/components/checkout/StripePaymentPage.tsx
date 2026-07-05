"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { loadStripe, type Stripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useStore } from "@biz11/store";
import { selectBizId, selectStripeKey } from "@biz11/store/business/selectors";
import { getPaymentIntent } from "@biz11/lib/api-client";
import { StripePaymentForm } from "@biz11/components/checkout/StripePaymentForm";
import { ProductDetailSkeleton } from "@biz11/components/Skeletons/ProductDetailSkeleton";
import { Button } from "@biz11/components/ui/Button";

const stripePromises = new Map<string, Promise<Stripe | null>>();

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
  const publishableKey = useStore(selectStripeKey);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchIntent = useCallback(() => {
    if (!bizId) return;

    setLoading(true);
    setError(null);

    getPaymentIntent(orderId)
      .then((res) => {
        setClientSecret(decodeURIComponent(res.data.client_secret));
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to initialize payment");
        setLoading(false);
      });
  }, [orderId, bizId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial fetch of Stripe payment intent on mount
    fetchIntent();
  }, [fetchIntent]);

  const stripePromise = useMemo(() => {
    if (!publishableKey) return null;
    return getStripe(publishableKey);
  }, [publishableKey]);

  const options: StripeElementsOptions | undefined = useMemo(() => {
    if (!clientSecret) return undefined;
    return { clientSecret, appearance };
  }, [clientSecret]);

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (!publishableKey) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-xl font-bold text-primary">Configuration Error</h2>
        <p className="mt-1 text-sm text-muted">Payment system is not configured.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="mb-5 rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <span className="text-5xl">!</span>
        </div>
        <h2 className="text-xl font-bold text-primary">Payment Error</h2>
        <p className="mt-1 mb-6 text-sm text-muted">{error}</p>
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
