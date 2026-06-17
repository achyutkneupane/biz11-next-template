# Frontend Guideline — Next.js

## 1. Project Baseline

- **Next.js 16** with `bun` package manager
- **Tailwind CSS v4** (`@tailwindcss/postcss`)
- **TypeScript** strict mode, path alias `@biz11/*` → `./src/*`
- **No component library** — BYO or build from scratch
- **No testing framework** installed yet

---

## 2. Installed Skills (Must Follow)

The `.agents/skills/` directory contains authoritative rules for code generation. Load the relevant skill before working in that domain.

| Skill | When to Load |
|-------|-------------|
| `next-best-practices` | Every task — file conventions, RSC boundaries, async patterns, route handlers, metadata, images, fonts |
| `next-cache-components` | When using `'use cache'`, `cacheLife()`, `cacheTag()`, `updateTag()` |
| `vercel-react-best-practices` | When writing React components — 70 performance rules across 8 categories |
| `vercel-react-view-transitions` | When implementing page transitions or `<ViewTransition>` |
| `frontend-design` | When making visual/design decisions — typography, palette, layout |
| `ui-ux-pro-max` | Python-based design system generator — run when defining design tokens |
| `web-design-guidelines` | Before shipping UI — compliance checker |
| `writing-guidelines` | When writing documentation or prose |
| `atomic-semantics-commits` | Every commit — strict conventional commit format |

---

## 3. API Consumption — EcomKit

### 3.1 Endpoint Conventions

All requests go to the EcomKit backend. Two distinct phases:

**Phase 1 — Bootstrap (no auth, no tenant):**

```
GET /api/v1/business                     → { data: { nanoId, name, currency, timezone } }
```

- **No auth required.** No `X-BIZID` header. The backend resolves the tenant from the request host (subdomain or domain match).
- Call this once at app startup (or on first visit) to discover the business identity.
- Store the returned `nanoId` — it is the **Business ID** for all subsequent requests.

**Phase 2 — Authenticated + Tenanted (all other endpoints):**

```
POST   /api/v1/auth/login                → { data: { token, user } }
POST   /api/v1/auth/logout
GET    /api/v1/auth/me                   → { data: { id, name, email, role } }
GET    /api/v1/brands                    → { data: [BrandResource], meta: { ... } }
GET    /api/v1/brands/{brand}
GET    /api/v1/categories                → { data: [CategoryResource], meta: { ... } }
GET    /api/v1/categories/{category}
GET    /api/v1/products                  → { data: [ProductResource], meta: { ... } }
GET    /api/v1/products/{product}
GET    /api/v1/products/{product}/skus   → { data: [SkuResource], meta: { ... } }
GET    /api/v1/products/{product}/skus/{sku}
```

- **Every request after login** requires two headers:
  - `Authorization: Bearer {token}`
  - `X-BIZID: {nanoId}` (the value returned from `/business`)
- Auth endpoints (`login`, `logout`, `me`) do **not** require `X-BIZID`, but login returns the user which is tied to a tenant.

### 3.2 Auth Flow

```
1. User opens app                        → GET /api/v1/business (host-based)
2. Business resolved, nanoId stored      → Show login page
3. User submits credentials              → POST /api/v1/auth/login
4. Token + user returned                 → Store token (cookie/localStorage)
5. All subsequent API calls              → Authorization + X-BIZID headers
6. Logout                                → POST /api/v1/auth/logout, clear stored token
```

- Tokens are **Sanctum plain-text tokens** with no expiration (configurable later).
- No refresh token mechanism currently — if the token is lost, re-login.
- Token should be stored securely (httpOnly cookie or memory, never localStorage for production).

### 3.3 Resource Shapes

```typescript
// BusinessResource
{
  nanoId: string;      // 12-char unique business identifier
  name: string;
  currency: string;    // e.g. "NPR", "USD"
  timezone: string;    // e.g. "Asia/Kathmandu"
}

// BrandResource
{
  id: number;
  nanoId: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  logoUrl: string | null;
  createdAt: string;
}

// CategoryResource
{
  id: number;
  nanoId: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  depth: number;
  parentId: number | null;
  children: CategoryResource[];  // recursive
  createdAt: string;
}

// ProductResource
{
  id: number;
  nanoId: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;           // "draft" | "published" | "archived"
  isFeatured: boolean;
  publishedAt: string | null;
  sortOrder: number;
  specifications: Record<string, unknown> | null;
  coverUrl: string | null;
  brand: BrandResource | null;
  categories: CategoryResource[];
  createdAt: string;
}

// SkuResource
{
  id: number;
  nanoId: string;
  skuCode: string;
  barcode: string | null;
  price: string;            // decimal string, e.g. "1200.00"
  stock: number;            // computed sum of stock items
  isDefault: boolean;
  status: string;           // "active" | "inactive" | "discontinued"
  sortOrder: number;
  variantAttributes: Record<string, string> | null;
  coverUrl: string | null;
  gallery: string[];        // array of URLs
  createdAt: string;
}
```

### 3.4 Error Format (RFC 9457)

All errors follow the Problem Details format:

```json
{
  "type": "about:blank",
  "title": "Missing Business ID",
  "status": 401,
  "detail": "The X-BIZID header is required."
}
```

| Status | Title | Meaning |
|--------|-------|---------|
| 401 | Missing Business ID | No `X-BIZID` header |
| 401 | Invalid Business ID | `X-BIZID` doesn't match any tenant |
| 401 | Unauthenticated | Missing/invalid `Authorization` token |
| 422 | Validation Failed | Invalid input (login form, etc.) |
| 404 | Business Not Found | Host doesn't match any tenant |

### 3.5 Pagination

List endpoints use **cursor pagination**:

```json
{
  "data": [ ... ],
  "meta": {
    "nextCursor": "eyJpZCI6...",   // pass as ?cursor= to get next page
    "prevCursor": null,
    "perPage": 20,
    "hasMore": true
  }
}
```

Request: `GET /api/v1/products?cursor=eyJpZCI6...&perPage=50`

---

## 4. Routing Architecture (Suggested)

```
app/
├── (public)/               # Route group — no auth required
│   ├── page.tsx            # Landing / splash
│   └── login/
│       └── page.tsx        # Login page
├── (dashboard)/            # Route group — auth required
│   ├── layout.tsx          # Protected layout (auth check, sidebar)
│   ├── page.tsx            # Dashboard home
│   ├── products/
│   ├── brands/
│   ├── categories/
│   └── profile/
├── layout.tsx              # Root layout (fonts, metadata)
├── globals.css
├── not-found.tsx
├── error.tsx
└── loading.tsx
```

- Use **route groups `()`** for logical separation without affecting URL structure.
- Keep **page-level data fetching** in Server Components.
- Use **Client Components** only when interactivity is needed (forms, filters, modals).
- Follow `next-best-practices` conventions for async `params`, `searchParams`, `cookies()`, `headers()`.

---

## 5. Data Fetching Strategy

### 5.1 Recommended Approach

| Layer | When to Use | Location |
|-------|-------------|----------|
| **Server Component fetch()** | Read-only page-level data | `app/*/page.tsx`, `app/*/layout.tsx` |
| **Server Actions** | Mutations (create, update, delete) | `app/*/actions.ts` or `@/lib/actions` |
| **Route Handlers** | External webhooks, Next.js API | `app/api/*/route.ts` |
| **'use cache'** | Reusable cached data across pages | Any Server Component |

### 5.2 API Client

Create a thin API client in `@/lib/api.ts`:

```typescript
// @/lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

function headers() {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-BIZID': getStoredBizId(), // from cookie/state
    ...(getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {}),
  };
}

export async function apiGet<T>(path: string, options?: { cursor?: string; perPage?: number }) {
  const url = new URL(path, BASE_URL);
  if (options?.cursor) url.searchParams.set('cursor', options.cursor);
  if (options?.perPage) url.searchParams.set('perPage', String(options.perPage));

  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new ApiError(await res.json(), res.status);
  return res.json() as { data: T; meta?: PaginationMeta };
}

export async function apiPost<T>(path: string, body: unknown) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new ApiError(await res.json(), res.status);
  return res.json() as { data: T };
}
```

### 5.3 Server-Side Fetch in Server Components

```typescript
// app/(dashboard)/products/page.tsx
import { apiGet } from '@/lib/api';
import type { ProductResource } from '@/types/api';

export default async function ProductsPage() {
  const products = await apiGet<ProductResource[]>('/api/v1/products', { perPage: 20 });

  return <ProductList products={products.data} pagination={products.meta} />;
}
```

### 5.4 Client-Side Mutations via Server Actions

```typescript
// app/(dashboard)/products/actions.ts
'use server';

import { revalidateTag } from 'next/cache';
import { apiPost } from '@/lib/api';

export async function createProduct(formData: FormData) {
  const data = {
    name: formData.get('name'),
    category_id: Number(formData.get('category_id')),
  };

  await apiPost('/api/v1/products', data);
  revalidateTag('products');
}
```

---

## 6. Auth Implementation

### 6.1 Login Page (Client Component)

```typescript
'use client';

export default function LoginPage() {
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { data } = await apiPost('/api/v1/auth/login', {
      email: form.email,
      password: form.password,
    });
    // Store token in httpOnly cookie (via Server Action)
    // Or store in memory for SPA-like flow
    setAuthToken(data.token);
    router.push('/');
  }

  return <LoginForm onSubmit={handleSubmit} />;
}
```

### 6.2 Protecting Routes

Use middleware (`proxy.ts` in Next.js 16) to check auth status:

```typescript
// proxy.ts
import { proxy } from 'next/proxy';

export default proxy((req) => {
  const token = req.cookies.get('auth_token');
  if (!token && !req.nextUrl.pathname.startsWith('/login')) {
    return Response.redirect('/login');
  }
});
```

Or use a **layout-level check** in the protected group:

```typescript
// app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');
  if (!token) redirect('/login');

  return <>{children}</>;
}
```

---

## 7. Directory Structure (Recommended)

```
app/
  (public)/
    login/
      page.tsx
  (dashboard)/
    layout.tsx
    page.tsx                     # Dashboard home
    products/
      page.tsx                   # Product list (Server Component)
      actions.ts                 # Product CRUD Server Actions
      [slug]/
        page.tsx                 # Product detail
    brands/
      page.tsx
      [slug]/
        page.tsx
    categories/
      page.tsx
      [slug]/
        page.tsx
    profile/
      page.tsx
  layout.tsx
  globals.css
  not-found.tsx
  error.tsx
  loading.tsx
lib/
  api.ts                         # API client
  auth.ts                        # Token storage helpers
  utils.ts                       # Shared utilities
types/
  api.ts                         # TypeScript interfaces for Resource shapes
  index.ts                       # Global types
hooks/
  useAuth.ts                     # Auth context hook
  useProducts.ts                 # Data fetching hooks
  usePagination.ts               # Cursor pagination state
components/
  ui/                            # Primitive UI components (Button, Input, Card, etc.)
  layout/                        # Navbar, Sidebar, Footer
  products/                      # ProductCard, ProductGrid, ProductFilters
  brands/
  categories/
public/
  images/
  fonts/
proxy.ts                         # Next.js 16 middleware (renamed from middleware.ts)
next.config.ts
```

---

## 8. Key Conventions

- **Server Components by default.** Only add `'use client'` when interactivity is required.
- **Async APIs are required** in Next.js 15+: `params`, `searchParams`, `cookies()`, `headers()` are all async.
- **Use `'use cache'`** for data that can be stale up to a defined lifetime — avoids redundant API calls.
- **No `middleware.ts`** — use `proxy.ts` in Next.js 16.
- **`page.tsx` and `route.ts` cannot coexist** in the same directory.
- **Env variables:** Prefix with `NEXT_PUBLIC_` for client-exposed vars; keep server-only vars unprefixed.
- **Cursor pagination** for all list endpoints — no page-based pagination.
- **No `"use client"` in Server Actions** — Server Actions must be server-only.

---

## 9. Performance Rules (from `vercel-react-best-practices`)

1. Avoid waterfalls — fetch data in parallel at the route level.
2. Keep Client Components at the leaf level — push interactivity down.
3. Use `next/image` for all images with known dimensions.
4. Use `next/font` with `display=swap` (Geist is already configured).
5. Prefer `fetch()` with `next: { revalidate }` over client-side `useEffect` for data.
6. Wrap search params access in `<Suspense>` to avoid CSR bailout.

---

## 10. Testing (Future)

No testing framework installed yet. When adding:
- **Vitest** for unit/integration (recommended by Next.js docs)
- **Playwright** for E2E (recommended by Next.js docs)
- Place tests in `__tests__/` directory alongside components or in `tests/` root
