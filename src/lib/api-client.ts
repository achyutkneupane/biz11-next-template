import { useStore } from "@biz11/store";
import { selectBizId } from "@biz11/store/business/selectors";
import { apiUrl } from "@biz11/lib/api-url";
import type { CartItemResource, OrderResource, AddressResource, AddressInput, CheckoutInput, CheckoutResponse, UserResource, RegisterRequest } from "@biz11/Types/Api";

function resolveUrl(path: string): URL {
  return apiUrl(path);
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public title: string,
    public detail: string,
    public errors?: Record<string, string[]>,
  ) {
    super(title);
    this.name = "ApiError";
  }
}

const isServer = typeof window === "undefined";

async function getHeaders(): Promise<Record<string, string>> {
  const headersObj: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  if (isServer) {
    try {
      const { headers: getNextHeaders } = await import("next/headers");
      const nextHeaders = await getNextHeaders();
      const visitorId = nextHeaders.get("x-visitor-id");
      const visitorSig = nextHeaders.get("x-visitor-signature");
      const bizId = nextHeaders.get("x-bizid");

      if (visitorId) headersObj["X-Visitor-Id"] = visitorId;
      if (visitorSig) headersObj["X-Visitor-Signature"] = visitorSig;
      if (bizId) headersObj["X-BIZID"] = bizId;
    } catch (e) {
      console.warn("Could not read headers on server:", e);
    }
  } else {
    const state = useStore.getState();
    const bizId = selectBizId(state);
    const visitorId = state.visitorId;
    const visitorSignature = state.visitorSignature;

    if (bizId) headersObj["X-BIZID"] = bizId;
    if (visitorId) headersObj["X-Visitor-Id"] = visitorId;
    if (visitorSignature) headersObj["X-Visitor-Signature"] = visitorSignature;
  }

  return headersObj;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
}

let csrfPromise: Promise<void> | null = null;
let hasFetchedCsrf = false;

async function ensureCsrf() {
  if (isServer) return;
  const token = getCookie("XSRF-TOKEN");
  if (token) return;
  if (hasFetchedCsrf) return;

  if (csrfPromise) return csrfPromise;

  const url = resolveUrl("/sanctum/csrf-cookie");
  csrfPromise = fetch(url.toString(), {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  })
    .then((res) => {
      hasFetchedCsrf = true;
      if (!res.ok) throw new Error("CSRF cookie bootstrap failed");
    })
    .finally(() => {
      csrfPromise = null;
    });

  return csrfPromise;
}

const fetchOpts: RequestInit = { credentials: "include" };

async function executeRequest(
  path: string,
  init: RequestInit & { json?: unknown },
): Promise<Response> {
  const method = (init.method ?? "GET").toUpperCase();
  const isStateful = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  if (isServer) {
    const { serverFetch } = await import("next-sanctum/server");
    const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost";
    const headers = {
      ...(await getHeaders()),
      ...Object.fromEntries(new Headers(init.headers).entries()),
    };

    return serverFetch(path, {
      ...init,
      baseUrl,
      headers,
    });
  } else {
    if (isStateful) {
      await ensureCsrf();
    }

    const url = resolveUrl(path);
    const headers = {
      ...(await getHeaders()),
      ...Object.fromEntries(new Headers(init.headers).entries()),
    };

    const token = getCookie("XSRF-TOKEN");
    if (token && !headers["X-XSRF-TOKEN"]) {
      headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
    }

    return fetch(url.toString(), {
      ...fetchOpts,
      ...init,
      headers,
      body: init.json ? JSON.stringify(init.json) : init.body,
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- res.json() is untyped
async function handleResponse(res: Response): Promise<any> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      body.title || "Request failed",
      body.detail || res.statusText,
      body.errors,
    );
  }
  return res.json();
}

export async function apiGet<T>(
  path: string,
  options?: { params?: Record<string, string | number | undefined> },
): Promise<{ data: T; meta?: { nextCursor?: string; prevCursor?: string; perPage: number; hasMore: boolean; total?: number } }> {
  const url = resolveUrl(path);

  if (options?.params) {
    Object.entries(options.params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const pathWithSearch = path + url.search;
  const res = await executeRequest(pathWithSearch, { method: "GET" });
  return handleResponse(res);
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
): Promise<{ data: T }> {
  const res = await executeRequest(path, {
    method: "POST",
    json: body,
  });
  return handleResponse(res);
}

export async function apiPatch<T>(
  path: string,
  body: unknown,
): Promise<{ data: T }> {
  const res = await executeRequest(path, {
    method: "PATCH",
    json: body,
  });
  return handleResponse(res);
}

export async function apiDelete(
  path: string,
): Promise<void> {
  const res = await executeRequest(path, {
    method: "DELETE",
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      body.title || "Request failed",
      body.detail || res.statusText,
      body.errors,
    );
  }
}

// Cart

export function getCart() {
  return apiGet<CartItemResource[]>("/v1/cart");
}

export function addToCart(skuNanoId: string, quantity: number = 1) {
  return apiPost<CartItemResource>("/v1/cart/items", { sku_nano_id: skuNanoId, quantity });
}

export function updateCartItem(id: number, quantity: number) {
  return apiPatch<CartItemResource>(`/v1/cart/items/${id}`, { quantity });
}

export function removeCartItem(id: number) {
  return apiDelete(`/v1/cart/items/${id}`);
}

// Checkout & Orders

export function checkout(body: CheckoutInput) {
  return apiPost<CheckoutResponse>("/v1/checkout", body);
}

export function getPaymentIntent(orderId: string) {
  return apiPost<{ id: string; client_secret: string; publishable_key: string }>(`/v1/orders/${orderId}/payment-intent`);
}

export function getOrders(page: number = 1) {
  return apiGet<OrderResource[]>(`/v1/orders`, { params: { page } });
}

export function getOrder(nanoId: string) {
  return apiGet<OrderResource>(`/v1/orders/${nanoId}`);
}

// Addresses

export function getAddresses() {
  return apiGet<AddressResource[]>("/v1/addresses");
}

export function createAddress(data: AddressInput) {
  return apiPost<AddressResource>("/v1/addresses", data);
}

// Auth

export function login(email: string, password: string) {
  return apiPost<{ user: UserResource }>("/v1/auth/login", { email, password });
}

export function register(data: RegisterRequest) {
  return apiPost<{ user: UserResource }>("/v1/auth/register", data);
}

export function logout() {
  return apiPost<null>("/v1/auth/logout");
}

export async function getMe() {
  try {
    const res = await executeRequest("/v1/auth/me", { method: "GET" });
    if (res.status === 401) return { data: null };
    return handleResponse(res);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return { data: null };
    }
    throw error;
  }
}

