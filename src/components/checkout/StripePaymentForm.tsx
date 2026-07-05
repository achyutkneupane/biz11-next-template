"use client";

import { useState, FormEvent } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@biz11/components/ui/Button";

export function StripePaymentForm({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success?orderId=${orderId}`,
      },
    });

    if (confirmError) {
      setError(confirmError.message ?? "Payment failed");
      setIsProcessing(false);
    }
  };

  if (!stripe || !elements) {
    return (
      <div className="space-y-4">
        <div className="h-12 w-full animate-pulse rounded-xl bg-border-light" />
        <div className="h-12 w-3/4 animate-pulse rounded-xl bg-border-light" />
        <div className="h-12 w-full animate-pulse rounded-xl bg-border-light" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />

      {error && (
        <div className="mt-4 rounded-xl border border-danger/20 bg-danger/5 p-4 text-sm text-danger">
          {error}
        </div>
      )}

      <Button
        variant="primary"
        size="lg"
        className="mt-6 w-full"
        disabled={isProcessing}
        type="submit"
      >
        {isProcessing ? "Processing..." : `Pay Now`}
      </Button>
    </form>
  );
}
