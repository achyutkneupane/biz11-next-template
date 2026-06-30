# Project Description — Biz11 / EcomKit Frontend

> Authoritative, **up-to-date** description of the codebase as of writing.
> Supersedes the older `AGENTS.md` summary sections where they conflict.
> Detailed conventions still live in `.agents/rules/folder-structure.md`,
> `.agents/rules/frontend-guideline.md`, and the skill files.

---

## 0. TL;DR for an AI Agent

- **What this is:** Next.js 16 storefront that talks to a Laravel 13 multi-tenant
  commerce API (`EcomKit`) over `/api/v1/...`. All business data — products,
  orders, cart, addresses — lives on the backend. The frontend is a pure
  presentation + interaction layer.
- **The two apps are siblings, not the same repo:**
	- Frontend: `htdocs/next/fishtail` (this repo) — Next.js 16.2.9, React 19, TS 5.
	- Backend: `htdocs/laravel13/EcomKit` — Laravel 13, PHP 8.4, Filament 5 admin.
	- MCP server `backend-laravel-boost` (defined in `opencode.json`) is wired to
	  the backend's `php artisan boost:mcp` and gives direct schema/docs access.
- **Multi-tenancy is the point:** the business (tenant) is resolved from the
  request host. Each call needs `X-BIZID: {nanoId}`. Auth is Sanctum tokens
  (`Authorization: Bearer {token}`) for users and a **signed visitor token**
  (`X-Visitor-Id` + `X-Visitor-Signature`) for guests.
- **Auth and catalog are separate:** the business bootstrap is the only call
  that does NOT need `X-BIZID`. Login also doesn't need it; everything else does.
- **Tailwind v4, no UI library.** Build everything from scratch using the design
  tokens declared in `src/app/globals.css` (`@theme inline`).
- **Zustand slices + TanStack Query v5** are the state layer. No SWR, no Redux.
- **Stripe is the only payment provider.** Embedded `<PaymentElement>` (Checkout
  Sessions with `ui_mode: custom`, exposed via PaymentIntent `client_secret`).

---

## 1. Stack

| Layer        | Choice                                                                 |
|--------------|------------------------------------------------------------------------|
| Framework    | Next.js **16.2.9** App Router (Turbopack by default in dev)            |
| Runtime      | React **19.2.4**                                                       |
| Language     | TypeScript **5**, `strict: true`, paths `@biz11/*` → `./src/*`         |
| CSS          | Tailwind v4 (`@import "tailwindcss"`, `@theme inline` in `globals.css`) |
| Fonts        | `Geist` + `Geist_Mono` via `next/font/google` (already wired)          |
| Data         | TanStack Query **v5**                                                  |
| State        | Zustand **v5** (composed slices, see §6)                               |
| Forms / UI   | Hand-built. NO component library                                       |
| Toasts       | `react-toastify`                                                       |
| Icons        | `react-icons` (HiOutline2 set)                                         |
| Class utils  | `clsx` + `tailwind-merge` (currently only `clsx` is used in `Button`)   |
| Tables       | `mantine-react-table` (available, not yet used in UI)                  |
| Dates        | `dayjs` (declared, not yet used)                                       |
| Payments     | `@stripe/stripe-js` + `@stripe/react-stripe-js`                         |
| Linting      | ESLint **10** flat config (`eslint.config.mjs`)                        |
| Package mgr  | `bun` (also `bun.lock` + `package-lock.json` present)                  |
| Node         | v20 (no `.nvmrc`)                                                      |
| Dev port     | **3010** (project-specific — `--experimental-https`)                   |
| Dev domain   | `https://ecom-front.test` (proxied via Herd)                           |
| Backend API  | `https://ecomkit.test/api` (`NEXT_PUBLIC_API_URL`)                     |

### Backend (for context)

- **Laravel 13.14.0**, **PHP 8.4**
- MySQL with single-database multi-tenancy (`tenant_id` global scope on every
  tenant-scoped model)
- Filament 5 admin (multi-panel: Platform, Tenant, Vendor)
- Sanctum 4 for API auth
- Pennant 1 for feature flags
- Eloquent API Resources (custom shape — see §7)
- Stripe SDK direct (no Laravel Cashier)

---

## 2. Repository Layout

### Frontend

```
src/
  app/                            # App Router
    layout.tsx                    # Root: fonts, body, <html>
    globals.css                   # Tailwind v4 + design tokens
    actions/                      # Server Actions (cached — restart dev to refresh)
      checkout.ts                 # getPaymentIntent (server-side, no X-BIZID wait)
    (public)/                     # Route group — public storefront
      layout.tsx                  # SSR business fetch → store hydration → chrome
      page.tsx                    # Landing (Client Component)
      loading.tsx                 # Route-level skeleton
      error.tsx                   # Route-level error boundary
      not-found.tsx
      products/
        page.tsx                  # Listing (Client)
        _ProductToolbar.tsx       # Route-colocated helper
        _ProductSearch.tsx
        _ActiveFilters.tsx
        _ProductPagination.tsx
        _MobileFilterDrawer.tsx
        [slug]/
          page.tsx                # Server Component shell → <ProductDetail/>
      orders/
        page.tsx                  # Server shell
        _OrdersList.tsx           # Client list
        [nanoId]/
          page.tsx                # Server shell
          _OrderDetail.tsx        # Client detail
      checkout/
        page.tsx                  # Client — shipping form + order summary
        loading.tsx
        _ShippingForm.tsx
        _OrderSummary.tsx
        [orderId]/
          payment/
            page.tsx              # Server shell → <StripePaymentPage/>
        success/
          page.tsx                # Server — reads orderId from searchParams
      login/
        page.tsx                  # Server shell
        _LoginForm.tsx            # Client
      register/
        page.tsx                  # Server shell
        _RegisterForm.tsx         # Client
  components/                     # Global, reusable, max 1 level deep
    layout/                       # PublicNavbar, Footer, CartDrawer,
                                  #   ProductDetail, ProductImageGallery,
                                  #   SkuSelector, AddToCartSection,
                                  #   CategoryTree, BrandFilter
    ui/                           # Button, Input, ProductCard, QuantityInput,
                                  #   CartItemRow, CartSummary, Breadcrumbs,
                                  #   SpecificationsTable
    checkout/                     # StripePaymentPage, StripePaymentForm
    Skeletons/                    # All loading skeletons (one file per kind)
    ServerBusinessHydrator.tsx    # Client comp that hydrates Zustand from server data
  Hooks/                          # Domain-grouped (capital H by repo convention)
    useBusiness.ts                # Reads biz selectors
    useDebounce.ts
    auth/useAuth.ts               # useLogin, useRegister, useLogout
    brands/useBrands.ts           # useBrands, useBrand
    cart/useCart.ts               # useCart, useAddToCart, useUpdateCartItem,
                                  #   useRemoveCartItem
    cart/useCheckout.ts           # useCheckout → router.push to /payment
    cart/useOptimisticCart.ts     # Composition of cart hooks + zustand
    categories/useCategories.ts   # useCategories, useCategory
    products/useProducts.ts       # useAllProducts, useFeaturedProducts,
                                  #   useLatestProducts, useProduct,
                                  #   useRelatedProducts
  lib/
    api-client.ts                 # apiGet/apiPost/apiPatch/apiDelete + business fns
    server-bootstrap.ts           # SSR fetch of /v1/business (no zustand)
    helpers.ts                    # formatPrice(price, currency)
  store/                          # Zustand
    index.ts                      # Composes slices
    business/
      initialState.ts             # nanoId, name, currency, timezone, isLoaded,
                                  #   token, visitorId, visitorSignature,
                                  #   stripePublishableKey
      action.ts                   # setBusiness, setToken, clearAuth
      selectors.ts                # selectBizId, selectCurrency, ... 8 selectors
    cart/
      initialState.ts             # items: CartItem[]
      action.ts                   # addItem, removeItem, updateQuantity,
                                  #   clearCart, setCartItems
      selectors.ts                # selectCartItems, selectCartCount, selectCartSubtotal
  Types/
    Api.ts                        # BusinessResource, BrandResource,
                                  #   CategoryResource, ProductResource, SkuResource,
                                  #   CartItemResource, OrderResource, OrderItem,
                                  #   AddressResource, UserResource, CheckoutResponse,
                                  #   getDefaultSku() helper
    Response.ts                   # PaginationMeta, DataResponse, ApiError
    types.ts                      # LayoutProps
  Wrappers/
    WrappersHandler.tsx           # <TSQWrapper> → <BusinessBootstrap> → <ToastProvider>
    TSQWrapper.tsx                # QueryClientProvider (5 min staleTime)
    BusinessBootstrap.tsx         # Client side /v1/business via TanStack Query
    ToastProvider.tsx             # react-toastify container
```

### Backend (EcomKit)

```
app/
  Http/
    Controllers/
      BusinessController.php
      ServeMediaController.php
      Auth/AuthController.php
      Addresses/{Index,Store}Controller.php
      Brands/BrandController.php
      Cart/{GetCart,AddItem,UpdateItem,RemoveItem}Controller.php
      Categories/CategoryController.php
      Orders/{Index,Store,Show,GetPaymentIntent}Controller.php
      Products/ProductController.php
      Skus/SkuController.php
      Webhooks/StripeWebhookController.php
    Middleware/
      ResolveVisitor.php          # Verifies X-Visitor-Id + X-Visitor-Signature
      ResolveTenantForApi.php     # X-BIZID → Tenant
      InitializeTenant.php        # Web tenant resolver (host-based)
    Resources/                    # Eloquent API Resources — wire format
      BusinessResource, BrandResource, CategoryResource, ProductResource,
      SkuResource, CartItemResource, CartItemCollection, OrderResource,
      AddressResource
  Models/
    Tenant.php, Brand.php, Category.php, Product.php, Sku.php, CartItem.php,
    Order.php, OrderItem.php, Address.php, Customer.php, Guest.php, User.php,
    PaymentGatewayConfig.php, Transaction.php, Stock.php, StockItem.php,
    TenantSetting.php, TenantUser.php, CategoryProduct.php
  Actions/
    Cart/{AddItem,UpdateItem,RemoveItem}.php
    Orders/{CreateOrder,ExportOrders,RefundOrder}.php
    Brands/, Categories/, Inventory/, Products/, Skus/, Users/
  Enums/                          # Backed string enums, all implement
                                  #   Filament HasColor/HasIcon/HasLabel
    OrderStatus (pending|confirmed|processing|shipped|delivered|cancelled)
    OrderChannel, PaymentProvider, PaymentStatus (pending|paid|failed|
                                                  refunded|partially_refunded)
    ProductStatus (draft|active|archived)
    SkuStatus (active|inactive|out_of_stock)
    InventoryLevel, StockMovementReason, TenantSettingType,
    TenantUserRole, TransactionStatus, UserRole (developer|admin|user)
  Services/
    Payment/StripePaymentService.php
    VisitorService.php            # CyrildeWit\EloquentViewable impl
    UploadPathGenerator.php, UploadURLGenerator.php
  Tenancy/TenantContext.php       # Cached per-tenant settings
  Facades/Tenancy.php
  Filament/                       # Admin panels
  Notifications/, Providers/, Observers/, Settings/, Traits/
  Models/Concerns/BelongsToTenant.php  # Global scope + auto-fill tenant_id
  Models/Scopes/{TenantScope, CategoryDepthScope}.php
database/migrations/              # See §9 for full table inventory
routes/
  api.php                         # All /api/v1/* routes (see §5)
  web.php                         # /invoices/orders/{nanoId} (Blade), /webhooks/stripe
  media.php                       # /uploads/{modelType}/{...}/...
  console.php
```

---

## 3. Commands

```bash
# Frontend
bun run dev      # next dev -p 3010 --experimental-https
bun run build    # next build
bun run start    # next start
bun run lint     # eslint (ESLint 10 flat config, NOT next lint)

# Domain proxy
herd proxy ecom-front.test http://localhost:3010

# Backend
cd /Users/achyutkneupane/htdocs/laravel13/EcomKit
php artisan serve
php artisan route:list --path=api
php artisan test --compact
vendor/bin/pint --dirty --format agent
```

### Gotchas

- **Restart dev server** after editing anything in `app/actions/*.ts` — Server
  Actions are cached in compiled chunks until a full restart.
- **`.test` domains use self-signed SSL.** Server-side `fetch()` calls switch
  to HTTP automatically. If a server call shows `fetch failed` → restart dev.
- The `(public)` route group is `ƒ` (dynamic) because the layout calls
  `headers()` from `next/headers` for the server-side `/v1/business` call.
  This is intentional — that bootstrap never appears in the browser's Network
  tab.

---

## 4. Multi-Tenancy — How a Tenant is Resolved

The tenant (business) is resolved by **host**, not by URL path.

```
1. Browser hits https://ecom-front.test
2. Frontend calls GET /api/v1/business
3. Laravel's BusinessController::show:
     - Strips protocol from Origin/schemeAndHttpHost
     - Looks up Tenant by `domain` column first
     - Falls back to first DNS label as `slug`
     - 404 if nothing matches
4. Tenancy::set($tenant) → global scope TenantScope kicks in
5. ResolveVisitor middleware verifies or generates visitor token
6. BusinessResource returns nanoId, name, currency, timezone,
   visitorId, visitorSignature, stripePublishableKey
```

**Tenant-scoped models** (every model that touches customer data) use the
`BelongsToTenant` trait → applies a global `TenantScope` and auto-fills
`tenant_id = Tenancy::currentId()` on `creating`. Models that have it:
`Brand`, `Category`, `Product`, `Sku`, `CartItem`, `Order`, `OrderItem`,
`Address`, `Transaction`, `PaymentGatewayConfig`, `Stock`, `StockItem`,
`TenantSetting`.

The **only** models WITHOUT the trait: `Tenant` (it IS the tenant),
`User` (cross-tenant admin/owner), `Guest` (cross-tenant identity),
`PersonalAccessToken` (Sanctum).

---

## 5. API — Full Endpoint Reference

Base: `${NEXT_PUBLIC_API_URL}` = `https://ecomkit.test/api`. All paths begin
with `/v1/`. Everything is under the `visitor` middleware; everything except
`/business` and `/auth/login` is under the `tenant` middleware; logout and
me are under `auth:sanctum` on top of that.

| Method   | Path                              | Auth   | Purpose                                          |
|----------|-----------------------------------|--------|--------------------------------------------------|
| `GET`    | `/v1/business`                    | none   | Bootstrap — returns `nanoId`, `visitorId`, etc.  |
| `POST`   | `/v1/auth/login`                  | none   | Sanctum token                                    |
| `POST`   | `/v1/auth/logout`                 | sanctum| Revoke current token                             |
| `GET`    | `/v1/auth/me`                     | sanctum| Current user                                     |
| `GET`    | `/v1/brands?perPage=&cursor=`     | tenant | List active brands (cursor)                      |
| `GET`    | `/v1/brands/{brand:slug}`         | tenant | Show brand                                       |
| `GET`    | `/v1/categories`                  | tenant | Active category tree (depth-limited per tenant)  |
| `GET`    | `/v1/categories/{category:slug}`  | tenant | Show category                                    |
| `GET`    | `/v1/products?perPage=&cursor=&brand_id=&category_id=&search=` | tenant | List published (cursor) — server-side filters |
| `GET`    | `/v1/products/featured?perPage=&cursor=` | tenant | Featured published (cursor)               |
| `GET`    | `/v1/products/latest?perPage=&cursor=`   | tenant | Latest published (cursor)                |
| `GET`    | `/v1/products/{product:slug}`     | tenant | Show product (with skus)                         |
| `GET`    | `/v1/products/{product:slug}/skus?perPage=&cursor=` | tenant | List SKUs (cursor)                    |
| `GET`    | `/v1/products/{product:slug}/skus/{sku}`   | tenant | Show SKU                                |
| `GET`    | `/v1/cart`                        | tenant | Current cart for the visitor/user                |
| `POST`   | `/v1/cart/items`                  | tenant | `{ sku_nano_id, quantity }` → 201                |
| `PATCH`  | `/v1/cart/items/{cartItem}`       | tenant | `{ quantity }`                                   |
| `DELETE` | `/v1/cart/items/{cartItem}`       | tenant | Remove line item                                 |
| `POST`   | `/v1/checkout`                    | tenant | Convert cart → order. Body: `notes?`, `billing_address_id?`, `shipping_address_id?`, `customer_name?`, `customer_email?`, `customer_phone?` → `{ data: { order, paymentIntent } }` |
| `GET`    | `/v1/orders?page=N`               | tenant | Page-based pagination (15 per page)              |
| `GET`    | `/v1/orders/{order:nanoId}`       | tenant | Show order (only if owner)                       |
| `POST`   | `/v1/orders/{order:nanoId}/payment-intent` | tenant | Retrieve PaymentIntent (`client_secret` + `publishable_key`) |
| `GET`    | `/v1/addresses`                   | tenant | Current visitor/user addresses                   |
| `POST`   | `/v1/addresses`                   | tenant | Create address (`country` defaults to `NP`)      |

### Out-of-band (web) routes

| Method   | Path                                            | Purpose                            |
|----------|-------------------------------------------------|------------------------------------|
| `GET`    | `/invoices/orders/{order:nanoId}`               | Blade-rendered invoice             |
| `POST`   | `/webhooks/stripe`                              | Stripe webhook (CSRF exempt)       |
| `GET`    | `/uploads/{modelType}/{collection}/{conversion}/{mediaUuid}/{slug}.{ext}` | Signed media URL  |

### Required Headers

```
X-BIZID:               {tenant nanoId}            (except /business and /auth/login)
X-Visitor-Id:          {visitor token}             (always — re-issued by /business)
X-Visitor-Signature:   {HMAC-SHA256(visitorId)}    (always)
Authorization: Bearer  {sanctum token}             (only when logged in)
Content-Type:          application/json
Accept:                application/json
```

### Response shape (everywhere)

```jsonc
// Success
{ "data": <T>, "meta": { "nextCursor", "prevCursor", "perPage", "hasMore", "total"? } }

// Error (RFC 9457 Problem Details)
{ "type": "about:blank", "title": "Invalid Business ID", "status": 404, "detail": "..." }
```

---

## 6. Visitor Token System (signed guest)

This is the trick that lets carts work pre-login. Every browser/device gets a
unique visitor identity, HMAC-signed by the backend.

### Bootstrap (per visit, no `X-BIZID`)

```
GET /api/v1/business
→ ResolveVisitor middleware reads X-Visitor-Id + X-Visitor-Signature
  - If both present and HMAC matches: visitor_id stashed on request
  - Otherwise: missing → controller generates new visitorId, signs it
→ Returns BusinessResource including visitorId + visitorSignature
```

### Signature

```php
// Backend (ResolveVisitor.php + BusinessController.php)
$expected = hash_hmac('sha256', $visitorId, config('app.key'));
hash_equals($expected, $signature);
```

`config('app.key')` is the Laravel `APP_KEY` — same one used for encryption.
`config:show app.key` to read it.

### Frontend persistence (why sessionStorage, not localStorage)

```
1. First visit    → POST /business (no visitor headers) → backend issues pair
                    → store in zustand business slice + sessionStorage
2. Page reload    → BusinessBootstrap reads sessionStorage → sends on /business
                    → backend reuses same guest → cart/orders preserved
3. New tab        → no sessionStorage (tab-scoped) → fresh guest identity
```

Each tab gets a fresh guest. Cart is ephemeral — merged into the user on
`/auth/login` (see AuthController::mergeGuestData).

The frontend stores tokens in **two places**:

- **Zustand `business` slice** (`useStore` → `selectVisitorId`,
  `selectVisitorSignature`) — read synchronously by `getHeaders()` in
  `api-client.ts` for every client-side API call.
- **`sessionStorage`** under keys `visitor_id` and `visitor_signature` —
  persists across reloads. Read/written by both `BusinessBootstrap` (client)
  and `ServerBusinessHydrator` (from server-rendered bootstrap data).

---

## 7. Wire Format — TS Types vs. Laravel Resources

The TS types in `src/Types/Api.ts` are the **single source of truth on the
frontend** and must stay in sync with the Eloquent Resources in
`app/Http/Resources/`. Confirmed matches and known mismatches:

### ✅ Match

- `BusinessResource` ✅ (TS has all 7 fields, optional `stripePublishableKey`)
- `BrandResource` ✅
- `CategoryResource` ✅
- `SkuResource` ✅
- `CartItemResource` ✅ (TS omits the optional `sku` nested resource)
- `AddressResource` ✅
- `ProductResource` — partial: see below.

### ⚠️ Drift

- **`ProductResource` (frontend)** declares `defaultSku?: DefaultSku` but
  `ProductResource` (backend) does NOT send `defaultSku` — only `skus[]` (when
  loaded). The TS helper `getDefaultSku(product)` already handles both shapes
  by preferring `skus[0]` and falling back to `defaultSku`. **Don't add
  `defaultSku` to the backend payload**; let `getDefaultSku` continue to be
  the abstraction. Optionally expose it in a future backend serializer if
  we need to avoid the helper's fallback path.
- **`OrderResource` (frontend vs backend)** — these are **substantially
  different**. See §14 "Known Drift".

---

## 8. State Management

### Zustand Store

```ts
// src/store/index.ts
type Store = CartState & CartAction & BusinessState & BusinessAction;

useStore = create<Store>()((...a) => ({
  ...initialCartState,
  ...createCartSlice(...a),
  ...initialBusinessState,
  ...createBusinessSlice(...a),
}));
```

**Slice pattern** (zustand skill): `initialState.ts` exports the state
interface + defaults, `action.ts` exports the action interface and a
`createXxxSlice` `StateCreator`. `selectors.ts` exports pure `(state) => T`
selectors that components consume.

### Business slice state

```ts
{
  nanoId: string | null,
  name: string,                    // default "Biz11"
  currency: string,                // default "USD"
  timezone: string,                // default "UTC"
  isLoaded: boolean,
  token: string | null,            // Sanctum token
  visitorId: string,               // signed guest id
  visitorSignature: string,
  stripePublishableKey: string,    // from /business
}
```

Actions: `setBusiness(BusinessResource)`, `setToken(string)`, `clearAuth()`.

### Cart slice state

```ts
{
  items: CartItem[]
}
```

Actions: `addItem`, `removeItem(id)`, `updateQuantity(id, qty)`,
`clearCart`, `setCartItems(items)`.

Note: the cart slice only tracks a *local optimistic* copy. The **source of
truth** is the backend — fetched via `useCart()` and re-invalidated after
every mutation. `useOptimisticCart` composes both.

### Hydration flow

```
Server:
  (public)/layout.tsx (RSC)
    → serverFetchBusiness()  // direct fetch, no zustand
    → <ServerBusinessHydrator data visitorId visitorSignature/>
        // Client Component, sets zustand during initial render
    → <WrappersHandler>
        → <TSQWrapper>
        → <BusinessBootstrap>      // Client — calls /v1/business via TanStack Query
                                    // (skip because isLoaded=true after server hydrate)
        → <ToastProvider>
        → {children}

Client (after hydration):
  any component → useStore(selector) → React subscribes
```

---

## 9. Backend Data Model (MySQL)

Single database, all tenant-scoped tables carry `tenant_id` with a global
scope. Confirmed tables (from `database-schema` MCP tool):

| Table                  | Key columns                                                                                         | Notes                                              |
|------------------------|-----------------------------------------------------------------------------------------------------|----------------------------------------------------|
| `tenants`              | id, nanoId (12), name, slug, domain, is_active                                                      | Multi-tenant root; nanoId used in `X-BIZID`        |
| `tenant_user`          | tenant_id, user_id, role                                                                            | Pivot, role per tenant                             |
| `tenant_settings`      | tenant_id, key, type, value                                                                         | Per-tenant config (currency, timezone, depth)      |
| `users`                | id, name, email, role, password, deleted_at                                                         | Cross-tenant admins (no tenant_id)                 |
| `brands`               | id, nanoId, tenant_id, name, slug, is_active, sort_order, logo (media)                               |                                                    |
| `categories`           | id, tenant_id, parent_id, name, slug, depth, is_active, sort_order, cover (media)                   | Recursive via parent_id, scoped depth              |
| `category_product`     | tenant_id, category_id, product_id                                                                  | Pivot                                              |
| `products`             | id, nanoId, tenant_id, brand_id, name, slug, description, specifications (json), status, is_featured | JSON specs, Spatie media `cover`                   |
| `skus`                 | id, nanoId, tenant_id, product_id, sku_code, barcode, variant_attributes (json), price, quantity, is_default, status, sort_order, cover + gallery (media) | Has computed `quantity` (sum of stockItems)        |
| `stocks`               | tenant_id, quantity                                                                                 | Current balance                                    |
| `stock_items`          | tenant_id, stock_id, sku_id, quantity_change, reason, lot_number, expiry_date, cost_price, sell_price, reference_type, reference_id | Append-only ledger                                 |
| `media`                | model_type, model_id, uuid, collection_name, file_name, mime_type, disk, conversions_disk, size, … | Spatie MediaLibrary                                |
| `guests`               | id, visitor_id, name, email                                                                         | Cross-tenant — Visitor identity                    |
| `customers`            | tenant_id, name, email, phone, password, guest_id, deleted_at                                       | Promoted from Guest on checkout (optional)         |
| `cart_items`           | tenant_id, customer_type (polymorphic), customer_id, sku_id, product_name, sku_code, cover_url, unit_price, quantity | Polymorphic to User or Guest                       |
| `orders`               | id, order_number, nanoId, tenant_id, customer_type, customer_id, status, subtotal, tax, discount, total, payment_status, channel, stripe_payment_intent_id, paid_at, currency, notes, status_history (json), billing_address_id, shipping_address_id | Polymorphic customer, JSON status history          |
| `order_items`          | tenant_id, order_id, sku_id, product_name, sku_code, cover_url, unit_price, quantity                | Snapshot of cart at checkout                       |
| `addresses`            | tenant_id, customer_type, customer_id, label, name, phone, line1, line2, city, state, postal_code, country, is_default | Polymorphic customer, default flag                 |
| `payment_gateway_configs` | tenant_id, provider, is_active, credentials (encrypted)                                          | Stripe creds encrypted at rest                     |
| `transactions`         | tenant_id, order_id, provider, provider_payment_id, amount, currency, status, payload (json)         | Audit log of payment attempts                      |
| `personal_access_tokens` | tokenable_type, tokenable_id, token (64)                                                            | Sanctum                                            |
| `features`             | name, scope, value                                                                                  | Pennant                                            |
| `settings`             | group, name, locked, payload (json)                                                                 | Spatie Laravel Settings                            |

### Polymorphic Customer pattern

`User` (registered) and `Guest` (anonymous, by `visitor_id`) both have
`cartItems`, `orders`, and `addresses` as `morphMany` — the column pairs
`customer_type` + `customer_id` on the child tables are the polymorphic
identifiers. The Cart/Order/Address controllers use `$request->customer()`
which is resolved by the `visitor` middleware: if a Sanctum-authenticated
`User` is present, return it; otherwise return (or create) the `Guest`
matching the visitor id.

### Customer promotion (CreateOrder::resolveCustomer)

On checkout, if the customer is a `Guest` and `customer_name`/`customer_email`
are supplied, a `Customer` row is `firstOrCreate`'d with `guest_id` set, and
the order is attached to that. This is the bridge for "guest checkout with
optional account creation" on the frontend.

### Stock movement on checkout

`App\Actions\Orders\CreateOrder` writes a `StockItem` per cart line with
`quantity_change = -qty`, `reason = Sale`, `reference_type = 'order'`.
This is append-only — `stocks.quantity` is the current balance, `stock_items`
is the ledger.

---

## 10. Auth Flow

```
Landing (SSR):
  layout.tsx (RSC) → serverFetchBusiness → hydrates store
  no /auth/me call

[Optional] register via /register:
  POST /v1/auth/register      ← ⚠ NOT in routes/api.php (see §14)
  → on success: setToken(data.token) + redirect to "/"

Login via /login:
  POST /v1/auth/login { email, password }
  → on success: setToken(data.token) + redirect to "/"
  → backend AuthController::login runs mergeGuestData:
      - looks up Guest by visitor_id
      - re-points all that guest's cartItems/orders/addresses
        to the User
      - deletes the Guest row

Logout (from PublicNavbar):
  POST /v1/auth/logout
  → on success: clearAuth() + invalidate all queries
```

Token storage: **in-memory only** (zustand runtime). Not httpOnly cookie, not
localStorage. Trade-off: a hard refresh logs the user out (but visitor
session resumes, and `mergeGuestData` won't re-run because the Guest is
gone). A real production app should move to httpOnly cookies; this is
intentional for the current dev workflow.

---

## 11. Cart → Checkout → Payment Flow

```
[Browse]    /products/[slug] → AddToCartSection → useOptimisticCart.add()
              ├─ addItem() to zustand (optimistic, with negative-id temp row)
              └─ POST /v1/cart/items { sku_nano_id, quantity }
                  → invalidates ["cart"] query
                  → toast.success("Added to cart")

[Drawer]    PublicNavbar cart icon → CartDrawer (slide-over)
              ├─ source of truth: useCart() → GET /v1/cart
              ├─ optimistic items shown until server reconciles
              └─ per-row debounced quantity update (400 ms)
                  → useOptimisticCart.update()
                  ├─ updateQuantity() in zustand
                  └─ PATCH /v1/cart/items/{id} { quantity }
                     onError: rolls back to previous quantity

[Checkout]  /checkout (Client)
              ├─ GET /v1/addresses → prefills shipping form if any saved
              ├─ _ShippingForm captures: name, phone, line1, line2,
              │   city, state, postalCode, [createAccount: boolean, email, password]
              └─ _OrderSummary.placeOrder():
                  1. POST /v1/addresses (shipping)
                  2. if createAccount: POST /v1/auth/register → setToken
                     ⚠ register endpoint missing (see §14)
                  3. POST /v1/checkout (uses /v1/orders → CreateOrder action)
                       ↳ resolves Customer, writes Order + OrderItems,
                         decrements stock via StockItems, creates Stripe
                         PaymentIntent via StripePaymentService
                       ↳ clears cartItems
                  4. onSuccess: invalidate ["cart"] + router.push
                     to /checkout/{orderId}/payment

[Payment]   /checkout/[orderId]/payment
              └─ <StripePaymentPage>
                 ├─ Server Action: getPaymentIntent(orderId, bizId)
                 │    POST /v1/orders/{nanoId}/payment-intent
                 │    → { id, client_secret, publishable_key }
                 ├─ memoize loadStripe(publishableKey) per-key
                 ├─ <Elements options={{ clientSecret, appearance }}>
                 │   └─ <StripePaymentForm>
                 │       └─ <PaymentElement/> + submit
                 │           → stripe.confirmPayment({ return_url: .../success })
                 └─ on success → /checkout/success?orderId=...
                                (success page is Server Component, reads
                                 orderId from searchParams)
```

### Stripe — current state (June 2026)

- Backend creates a **raw `PaymentIntent`** via
  `StripePaymentService::createPaymentIntent()`.
- Stored as `orders.stripe_payment_intent_id = "pi_..."`.
- `GetPaymentIntentController` returns the same `client_secret` for both
  `pi_...` and `cs_...` IDs (it auto-detects), so it's safe to migrate to
  Checkout Sessions later without breaking the frontend.
- See `docs/backend-stripe-migration.md` for the planned upgrade.
- Frontend uses `appearance.theme: "stripe"` with custom `--colorPrimary:
  #CA8A04` (accent), `--colorBackground: #FFFFFF`, Geist font.

### Order states

Backend enums: `OrderStatus` (pending|confirmed|processing|shipped|delivered|
cancelled), `PaymentStatus` (pending|paid|failed|refunded|partially_refunded),
`OrderChannel`. The frontend orders page renders the status badge from a
hardcoded color map (see `_OrdersList.tsx` and `_OrderDetail.tsx`).

---

## 12. Current Feature State

### ✅ Implemented

- **Landing** (`/`): hero, latest 8, featured 8, per-category sections
  (filtering featured by category).
- **Product listing** (`/products`): sort modes (All / Featured / Latest),
  debounced search, recursive category tree, brand checkboxes, mobile
  filter drawer, cursor pagination.
- **Product detail** (`/products/[slug]`): gallery (SKU-aware), SKU
  selector (single SKU case hidden), quantity stepper, Add to Cart
  with optimistic add, related products (same-category, top 3).
- **Auth**: login, register (form exists; backend endpoint missing — §14),
  logout from navbar.
- **Cart**: drawer with debounced quantity updates, remove, totals,
  empty/loading states, escape-key + overlay to close.
- **Checkout**: address form (with optional "create account"), order
  summary, place order → Stripe payment.
- **Payment**: Stripe `<PaymentElement>` with branded theme, success
  redirect.
- **Orders**: paginated list (`/orders`), detail page with status badge,
  line items, totals.
- **Multi-tenancy**: host → tenant resolution, `X-BIZID` propagation,
  visitor token signing, guest → user merge on login.
- **Design system**: stone-toned palette (primary `#1C1917`, accent
  `#CA8A04`), Geist font, `Button` (5 variants × 3 sizes), `Input`,
  `QuantityInput`, `Breadcrumbs`, `SpecificationsTable`, skeletons for
  every async view.
- **No SSR auth gate yet**, but the SSR `headers()` call forces the
  `(public)` group to be dynamic so the bootstrap is always fresh.

### 🚧 Known Gaps (see §14 for details)

- `register` endpoint is missing in `routes/api.php` but used by frontend.
- `OrderResource` shape mismatch (frontend uses old flat fields; backend
  returns nested `summary` + `timeline` + `transactions` + `customer`).
- `ProductResource` does not include `defaultSku` (frontend helper handles).
- `proxy.ts` (Next 16 middleware) is not implemented.
- The cart-drawer shared-element morph CSS is wired (see `globals.css`),
  but `viewTransition` API + `useTransition` is not yet used in routes.
- Tests are not installed (no Vitest / Playwright on frontend; Pest is
  configured on backend but no test files have been written yet).

---

## 13. Conventions (summary)

The complete convention docs are in:

- **`.agents/rules/folder-structure.md`** — `src/` layout, file purpose
- **`.agents/rules/frontend-guideline.md`** — Next.js, RSC, async APIs,
  data layer, auth pattern, `proxy.ts`

Highlights worth restating:

### Code style
- **Components:** PascalCase, one per file. Route-colocated helpers use the
  `_ComponentName.tsx` underscore prefix (e.g., `_ProductToolbar.tsx`).
- **Hooks:** camelCase with `use` prefix. Domain-grouped
  (`Hooks/cart/useCheckout.ts`). Capital **H** directory.
- **Types:** always import from `src/Types/`. Never `any`. Add a new type
  there before using it.
- **Validation:** none on the frontend yet. When added, centralize in
  `src/Schema/` (Zod).
- **Tailwind v4 tokens** live in `src/app/globals.css` `@theme inline` —
  do not redefine colors inline, use the tokens (`bg-primary`, `text-accent`,
  `border-border`, etc.).

### Component rules
- Server Components by default. Add `'use client'` only for interactivity
  (forms, hooks, browser APIs).
- Push `'use client'` to the **leaf** — `page.tsx` should be Server when
  possible, and delegate to a Client child for interactivity.
- Never put `'use client'` in a Server Action. Server Actions are
  server-only.
- Async APIs in Next 15+ — `params`, `searchParams`, `cookies()`,
  `headers()` are all async (`Promise<...>`).
- `page.tsx` and `route.ts` cannot coexist in the same directory.
- `proxy.ts` (not `middleware.ts`) in Next 16.

### Data fetching
- **Read-only page data** → Server Component `fetch()` (e.g.,
  `server-bootstrap.ts`).
- **Mutations** → Server Actions in `app/actions/*.ts` OR
  `useMutation` from TanStack Query on the client (current code uses
  the latter for everything except `getPaymentIntent`).
- **Client reads** → TanStack Query. All hooks are gated on
  `isBizLoaded` from the store so we never call the API without the
  tenant id.
- **Cursor pagination** for all list endpoints except `/v1/orders` (which
  is page-based — see `Orders/IndexController.php`).

### Performance (from `vercel-react-best-practices`)
- Avoid waterfalls. The (public) layout does its bootstrap in parallel
  with children.
- Client Components at the leaf.
- `next/image` for all images with known dimensions (config allows
  `images.unsplash.com` and `ecomkit.test`).
- `next/font` is already configured for Geist.
- `useTransition` / `<ViewTransition>` not used yet — but the cart-drawer
  morph is set up via `::view-transition-group(cart)` in `globals.css` and
  `style={{ viewTransitionName: "cart" }}` on the navbar cart button.
- Use the `next-best-practices`, `next-cache-components`,
  `vercel-react-best-practices` skills before writing performance-sensitive
  code.

### Commit format (`atomic-semantics-commits` skill)
- `type: verb in third-person present` — no scopes, ≤72-char title, no
  emojis, no trailing period. Examples that match this repo's style:
  `feat: adds order detail skeleton`,
  `fix: corrects visitor signature on session storage`,
  `chore: bumps next to 16.2.9`.

---

## 14. Known Drift / Issues to Resolve

These are real mismatches between frontend and backend, **not** in the
codebase on purpose — they will trip up an AI agent that doesn't read this
file.

### 1. `POST /v1/auth/register` is missing

`src/lib/api-client.ts` calls `register()` → `POST /v1/auth/register`,
used by `useRegister()` and also by the checkout flow's "create account"
checkbox in `_OrderSummary.tsx`. But `routes/api.php` only declares:

```php
Route::post('/auth/login',  [AuthController::class, 'login']);
Route::post('/auth/logout', [AuthController::class, 'logout']);
Route::get('/auth/me',      [AuthController::class, 'me']);
```

**Fix path:** add a `register` action and route, and have it merge guest
data (same as login). Until then, the register form and the "create
account" path will 404.

### 2. `OrderResource` shape mismatch

The backend's `App\Http\Resources\OrderResource` now returns:

```jsonc
{
  "orderNumber": ...,
  "nanoId": "...",
  "status": "pending",
  "paymentStatus": "pending",
  "channel": "web",
  "currency": "USD",
  "summary": { "subtotal": "0.00", "tax": "0.00", "discount": "0.00", "total": "0.00" },
  "paidAt": null,
  "notes": null,
  "timeline": [{ "label", "timestamp", "status" }],
  "customer": { "name", "email" },
  "items": [{ "productName", "skuCode", "coverUrl", "unitPrice", "quantity", "subtotal" }],
  "transactions": [...],
  "createdAt": "..."
}
```

But `src/Types/Api.ts` declares a **flat** shape:

```ts
{
  nanoId, status, subtotal, tax, discount, total,  // FLAT
  currency, paymentStatus, paidAt, notes, items, createdAt
}
```

`_OrdersList.tsx` reads `order.subtotal / order.total / order.tax / order.discount`
and renders them flat. `_OrderDetail.tsx` does the same. So the UI breaks
against the live backend.

**Fix path:** update `OrderResource` in `Api.ts` to match the new shape
(nested `summary`, separate `timeline`, optional `customer`, optional
`transactions`). Update both `_OrdersList.tsx` and `_OrderDetail.tsx` to
read from `order.summary.subtotal` etc. and to render the timeline.

### 3. `ProductResource` missing `defaultSku`

Already handled by the `getDefaultSku()` helper in `Types/Api.ts`. Leave
as-is unless we add a backend serializer.

### 4. `proxy.ts` not implemented

No `proxy.ts` at the repo root. The `(public)` group is reachable without
any auth gate — but that's intentional for a public storefront. If we
ever add protected areas (e.g. dashboard, account), use `proxy.ts` (not
`middleware.ts`) per the Next.js 16 convention.

### 5. No tests

Backend: Pest is installed and configured (`pestphp/pest` v4) but no test
files exist yet. The codebase AGENTS.md says "every change must be
programmatically tested" — honor that on backend work.
Frontend: no test framework installed. When adding, use Vitest + React
Testing Library; place tests next to components in `__tests__/`.

### 6. The `(public)/checkout` flow assumes `/v1/auth/register` works

Beyond the 404 issue: when the user opts to "create an account" on
checkout, the form sends `name + email + password` to `/v1/auth/register`,
and on success calls `setToken`. If/when register is added, the route
should be `POST /v1/auth/register` and follow the Sanctum + mergeGuestData
pattern from `AuthController::login`.

### 7. Hardcoded shipping flat rate in `_OrderSummary.tsx`

```ts
const shipping_ = 12.99;
const total = subtotal + shipping_;
```

The backend does NOT currently compute shipping. Either remove the
surcharge, make it env-driven, or move to a backend endpoint that
estimates shipping.

### 8. `related` products computed client-side from `/v1/products`

`useRelatedProducts()` fetches the first 50 products and filters in
memory. This won't scale. Eventually add a `?category_in=` filter
or a dedicated `GET /v1/products/{slug}/related` endpoint.

### 9. Tax is always 0

`orders.tax` and `orders.discount` are always 0 in `CreateOrder`. The
checkout UI shows them only when `discount !== "0"`. The backend has no
tax engine yet — when one is added, both UI and resource need updates.

---

## 15. Skills — When to Load

| Skill                         | When                                                                                  |
|-------------------------------|---------------------------------------------------------------------------------------|
| `next-best-practices`         | **Every task.** File conventions, RSC, async, metadata, error handling, routes, images/fonts. |
| `next-cache-components`       | When using `'use cache'`, `cacheLife()`, `cacheTag()`, `updateTag()`.                  |
| `vercel-react-best-practices` | **Every React component.** 70 perf rules.                                              |
| `vercel-react-view-transitions` | When adding page transitions or `<ViewTransition>`.                                 |
| `frontend-design`             | Visual/design decisions (typography, palette, layout).                                  |
| `ui-ux-pro-max`               | Python-based design-token generator — run when defining tokens.                          |
| `web-design-guidelines`       | Before shipping UI — compliance checker.                                                |
| `writing-guidelines`          | Writing docs or prose.                                                                 |
| `atomic-semantics-commits`    | **Every commit.** Strict conventional format, no scopes.                                |
| `zustand`                     | Editing `src/store/**` — slice organization, selectors, action patterns.                |
| `autonomous-loop-engineering` | For self-correcting, tool-driven iteration.                                            |
| Stripe skills (`stripe-best-practices`, `upgrade-stripe`, `stripe-projects`, `stripe-directory`) | Whenever Stripe flows are touched — even small tweaks. |

User-level skills (`cavecrew`, `caveman*`) are available in the user's
`~/.agents/skills/` — use them when explicitly asked.

---

## 16. Critical Rules for an AI Agent

1. **Never assume the API is mock or that endpoints don't exist.** The
   backend at `https://ecomkit.test` is live (when dev server is running)
   and the routes in `routes/api.php` are the truth. Read this file,
   the OpenAPI JSON (`.agents/rules/api-docs.json`), and the resource
   classes before adding new types.

2. **Never hardcode business data** (products, brands, categories, currency,
   timezone, Stripe key, payment config). Everything comes from `/v1/business`
   and lives in the zustand `business` slice.

3. **Never put `X-BIZID`, `X-Visitor-Id`, `X-Visitor-Signature`, or
   `Authorization` headers inline.** Always go through `getHeaders()` in
   `src/lib/api-client.ts`, which reads from the zustand store.

4. **Always gate TanStack Query hooks on `isBizLoaded`.** Otherwise the
   query fires before `/business` returns and we 401.

5. **Never use `any`.** Add a new interface in `src/Types/Api.ts` or
   `src/Types/Response.ts` first.

6. **Restart the dev server after editing `app/actions/*.ts`.** Server
   Actions are cached in compiled chunks.

7. **Component naming:** global reusable in `src/components/`, route
   specific in the route folder with `_ComponentName.tsx`. Never
   import a route-colocated component from a different route.

8. **Tailwind:** use the tokens from `globals.css`. Don't inline hex
   colors. The accent is `#CA8A04`, the primary text is `#1C1917`.

9. **Stripe:** never log or hardcode the secret key. The publishable key
   is fine (it's client-safe) and it comes from `/v1/business`. Memoize
   `loadStripe` calls (see `stripePromises` map in
   `src/components/checkout/StripePaymentPage.tsx`).

10. **Commits:** `type: verb in third-person present`. No scopes. ≤72 char
    title. No emojis. Run `bun run lint` first.

11. **When working on backend:** use the `backend-laravel-boost` MCP
    tools (`application-info`, `database-schema`, `database-query`,
    `search-docs`, `get-absolute-url`, `last-error`, `read-log-entries`,
    `browser-logs`) instead of shell + raw reads. The skill is wired
    in `opencode.json`.

12. **When in doubt about a tenant/visitor flow,** trace it through this
    doc first — §4 (tenancy), §6 (visitor), §10 (auth), §11 (checkout)
    cover the real call sequences, not the way the *code looks like*
    it should work.

---

## 17. References

- Frontend conventions: [`.agents/rules/folder-structure.md`](./.agents/rules/folder-structure.md)
- Next.js guidance: [`.agents/rules/frontend-guideline.md`](./.agents/rules/frontend-guideline.md)
- API OpenAPI JSON: [`.agents/rules/api-docs.json`](./.agents/rules/api-docs.json)
- Backend overview: `/Users/achyutkneupane/htdocs/laravel13/EcomKit/AGENTS.md`
- Backend Laravel conventions: `/Users/achyutkneupane/htdocs/laravel13/EcomKit/AGENTS.md`
- Skills: [`.agents/skills/`](./.agents/skills)
- Stripe migration plan: [`docs/backend-stripe-migration.md`](./docs/backend-stripe-migration.md)
- MCP server config: [`opencode.json`](./opencode.json)
