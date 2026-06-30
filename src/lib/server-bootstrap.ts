import { apiUrl } from "@biz11/lib/api-url";
import type { BusinessResource } from "@biz11/Types/Api";

export type ServerBootstrapResult =
  | { data: BusinessResource }
  | { error: string };

export async function serverFetchBusiness(): Promise<ServerBootstrapResult> {
  try {
    const fetchHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

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
