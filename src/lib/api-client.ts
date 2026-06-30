import { useStore } from "@biz11/store";
import { selectBizId, selectToken, selectVisitorId, selectVisitorSignature } from "@biz11/store/business/selectors";
import type { CartItemResource, OrderResource, AddressResource, AddressInput, CheckoutResponse, UserResource } from "@biz11/Types/Api";

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

function getHeaders(): Record<string, string> {
  const state = useStore.getState();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const bizId = selectBizId(state);
  if (bizId) headers["X-BIZID"] = bizId;

  const visitorId = selectVisitorId(state);
  const visitorSignature = selectVisitorSignature(state);
  if (visitorId) headers["X-Visitor-Id"] = visitorId;
  if (visitorSignature) headers["X-Visitor-Signature"] = visitorSignature;

  const token = selectToken(state);
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return headers;
}

async function handleResponse(res: Response): Promise<any> {
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

  const res = await fetch(url.toString(), { headers: getHeaders() });
  return handleResponse(res);
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
): Promise<{ data: T }> {
  const url = resolveUrl(path);
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: getHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  return handleResponse(res);
}

export async function apiPatch<T>(
  path: string,
  body: unknown,
): Promise<{ data: T }> {
  const url = resolveUrl(path);
  const res = await fetch(url.toString(), {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function apiDelete(
  path: string,
): Promise<void> {
  const url = resolveUrl(path);
  const res = await fetch(url.toString(), {
    method: "DELETE",
    headers: getHeaders(),
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

export function checkout(body?: { notes?: string; billing_address_id?: number; shipping_address_id?: number }) {
  return apiPost<CheckoutResponse>("/v1/checkout", body);
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
  return apiPost<{ token: string; user: UserResource }>("/v1/auth/login", { email, password });
}

export function logout() {
  return apiPost<null>("/v1/auth/logout");
}

export function getMe() {
  return apiGet<UserResource>("/v1/auth/me");
}

export function register(name: string, email: string, password: string) {
  return apiPost<{ token: string; user: UserResource }>("/v1/auth/register", {
    name,
    email,
    password,
    password_confirmation: password,
  });
}
