import { useStore } from "@biz11/store";
import { selectBizId, selectToken } from "@biz11/store/business/selectors";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost";

function resolveUrl(path: string): URL {
  const base = BASE_URL.endsWith("/") ? BASE_URL : BASE_URL + "/";
  const clean = path.startsWith("/") ? path.slice(1) : path;
  return new URL(clean, base);
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public title: string,
    public detail: string,
  ) {
    super(title);
    this.name = "ApiError";
  }
}

function getHeaders(authenticated = true): Record<string, string> {
  const state = useStore.getState();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (authenticated) {
    const bizId = selectBizId(state);
    if (bizId) headers["X-BIZID"] = bizId;

    const token = selectToken(state);
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export async function apiGet<T>(
  path: string,
  options?: { params?: Record<string, string | number | undefined>; authenticated?: boolean },
): Promise<{ data: T; meta?: { nextCursor?: string; prevCursor?: string; perPage: number; hasMore: boolean; total?: number } }> {
  const url = resolveUrl(path);

  if (options?.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const res = await fetch(url.toString(), {
    headers: getHeaders(options?.authenticated ?? true),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      body.title || "Request failed",
      body.detail || res.statusText,
    );
  }

  return res.json();
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  options?: { authenticated?: boolean },
): Promise<{ data: T }> {
  const url = resolveUrl(path);

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: getHeaders(options?.authenticated ?? true),
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      body.title || "Request failed",
      body.detail || res.statusText,
    );
  }

  return res.json();
}

export async function apiPatch<T>(
  path: string,
  body: unknown,
  options?: { authenticated?: boolean },
): Promise<{ data: T }> {
  const url = resolveUrl(path);

  const res = await fetch(url.toString(), {
    method: "PATCH",
    headers: getHeaders(options?.authenticated ?? true),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      body.title || "Request failed",
      body.detail || res.statusText,
    );
  }

  return res.json();
}

export async function apiDelete(
  path: string,
  options?: { authenticated?: boolean },
): Promise<void> {
  const url = resolveUrl(path);

  const res = await fetch(url.toString(), {
    method: "DELETE",
    headers: getHeaders(options?.authenticated ?? true),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      body.title || "Request failed",
      body.detail || res.statusText,
    );
  }
}
