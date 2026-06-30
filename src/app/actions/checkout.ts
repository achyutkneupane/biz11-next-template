"use server";

import { apiUrl } from "@biz11/lib/api-url";

export async function getPaymentIntent(orderId: string, bizId: string) {
  const url = apiUrl(`v1/orders/${orderId}/payment-intent`);

  const res = await fetch(url.toString(), {
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
  return decodeURIComponent(json.data.client_secret as string);
}
