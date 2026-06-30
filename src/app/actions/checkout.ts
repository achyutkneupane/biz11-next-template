"use server";

import { cookies } from "next/headers";
import { apiUrl } from "@biz11/lib/api-url";

export async function getPaymentIntent(orderId: string, bizId: string) {
  const cookieStore = await cookies();
  const visitorId = cookieStore.get("visitor_id")?.value;
  const visitorSig = cookieStore.get("visitor_signature")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-BIZID": bizId,
  };

  if (visitorId) headers["X-Visitor-Id"] = visitorId;
  if (visitorSig) headers["X-Visitor-Signature"] = visitorSig;

  const url = apiUrl(`v1/orders/${orderId}/payment-intent`);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || body.title || "Failed to create payment intent");
  }

  const json = await res.json();
  return decodeURIComponent(json.data.client_secret as string);
}
