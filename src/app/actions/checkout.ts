"use server";

export async function getPaymentIntent(orderId: string, bizId: string) {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

  const res = await fetch(`${BASE_URL}/v1/orders/${orderId}/payment-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-BIZID": bizId,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || body.title || "Failed to create payment intent");
  }

  const json = await res.json();
  return {
    clientSecret: json.data.client_secret as string,
    publishableKey: json.data.publishable_key as string,
  };
}
