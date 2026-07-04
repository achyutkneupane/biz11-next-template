import { apiUrl } from "@biz11/lib/api-url";
import type { BusinessResource } from "@biz11/Types/Api";

if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

export type ServerBootstrapResult =
  | { data: BusinessResource }
  | { error: string };

export async function serverFetchBusiness(): Promise<ServerBootstrapResult> {
  try {
    const fetchHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    try {
      const { headers: getNextHeaders } = await import("next/headers");
      const nextHeaders = await getNextHeaders();
      const host = nextHeaders.get("host") || nextHeaders.get("x-forwarded-host");
      if (host) {
        // BusinessController checks Origin header first
        fetchHeaders["Origin"] = host;
      }
    } catch (e) {
      // ignore
    }

    const url = apiUrl("v1/business");

    const res = await fetch(url.toString(), { headers: fetchHeaders });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { error: body.detail || body.title || `Business fetch failed (${res.status})` };
    }

    const json: { data: BusinessResource } = await res.json();

    return { data: json.data };
  } catch {
    return { error: "Server bootstrap unavailable" };
  }
}
