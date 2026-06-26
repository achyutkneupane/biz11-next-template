import { headers } from "next/headers";
import type { BusinessResource } from "@biz11/Types/Api";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

export type ServerBootstrapResult =
  | { data: BusinessResource; visitorId: string; visitorSignature: string }
  | { error: string };

export async function serverFetchBusiness(): Promise<ServerBootstrapResult> {
  try {
    const reqHeaders = await headers();

    const fetchHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const visitorId = reqHeaders.get("x-visitor-id");
    const visitorSig = reqHeaders.get("x-visitor-signature");
    if (visitorId && visitorSig) {
      fetchHeaders["X-Visitor-Id"] = visitorId;
      fetchHeaders["X-Visitor-Signature"] = visitorSig;
    }

    const base = BASE_URL.endsWith("/") ? BASE_URL : BASE_URL + "/";
    const url = new URL("v1/business", base);

    const res = await fetch(url.toString(), { headers: fetchHeaders });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { error: body.detail || body.title || `Business fetch failed (${res.status})` };
    }

    const json: { data: BusinessResource } = await res.json();

    return {
      data: json.data,
      visitorId: json.data.visitorId,
      visitorSignature: json.data.visitorSignature,
    };
  } catch {
    return { error: "Server bootstrap unavailable" };
  }
}
