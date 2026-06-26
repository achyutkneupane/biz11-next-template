<!-- BEGIN:nextjs-agent-rules -->

EcomKit-powered Next.js front app.

## Stack

| Layer       | Choice                                                        |
|-------------|---------------------------------------------------------------|
| Framework   | Next.js 16.2.9 App Router                                     |
| React       | 19.2.4                                                        |
| TypeScript  | 5 strict, `@biz11/*` → `./src/*`                              |
| CSS         | Tailwind v4 (`@import "tailwindcss"`, `@theme inline` syntax) |
| Client data | TanStack Query                                                |
| Data tables | Mantine React Table                                           |
| Icons       | react-icons                                                   |
| Toasts      | react-toastify                                                |
| Class utils | clsx + tailwind-merge                                         |
| Dates       | dayjs                                                         |
| Linting     | ESLint 10 flat config (`eslint.config.mjs`)                   |
| Testing     | Not installed                                                 |
| Node        | v20 (no `.nvmrc`)                                             |
| PM          | bun (bun.lock also present)                                   |

## Commands

```bash
npm run dev      # next dev -p 3010 (project-specific port)
npm run build    # next build
npm run start    # next start (prod)
npm run lint     # eslint (ESLint 10, NOT next lint)
```

### Dev server with custom domain
```bash
npm run dev                         # starts on :3010
herd proxy ecom-front.test http://localhost:3010   # Herd nginx → port 3010
```
Open [http://ecom-front.test](http://ecom-front.test) in browser.

### Notes

- **Restart dev server after changing Server Actions** (`app/actions/*.ts`) — they are cached in compiled chunks until a full restart.
- Local `.test` domains use self-signed SSL. Server-side fetch calls use HTTP automatically. If an API shows `fetch failed` → restart dev server.

## Project Layout

**Important:** There are two `.agents/rules/` files that define the architecture:

1. **`folder-structure.md`** — prescribes a `src/`-based architecture with strict separation of global vs route-specific
   logic. This is the active structure.
2. **`frontend-guideline.md`** — also describes structure under `src/` dir.

All code goes under `src/`. Import using `@biz11/*` alias (e.g., `@biz11/components/ui/Button`).

### Structure (`folder-structure.md`)

```
.
src/
  app/           # Route groups (public), (dashboard), role-based sub-groups
  components/    # Global shared UI only. Flat or 1-level deep. PascalCase.
  Hooks/         # Domain-driven subdirs (auth/, products/, etc.). camelCase with use- prefix.
                 # NOTE: capitalized 'H' — not 'hooks'
  Types/         # All TS interfaces, types, enums. No `any`.
  Schema/        # Validation schemas (Zod, etc.)
  Contexts/      # React Context definitions
  Variables/     # Global constants, URL maps
  Utils/         # Pure functions, helpers, formatters
  Wrappers/      # Providers & layout guards. WrappersHandler.tsx composes them.
  Pages/         # Massive container components (not page.tsx files)
```

### Conventions (`frontend-guideline.md`)

- Route groups: `(public)/` (no auth), `(dashboard)/` (auth required for order tracking and history only)
- Route-colocated components: route-specific UI stays in the route folder
- `proxy.ts` replaces `middleware.ts` in Next.js 16
- Async APIs required: `params`, `searchParams`, `cookies()`, `headers()` are all async
- `page.tsx` and `route.ts` cannot coexist in same directory
- Env vars: prefix with `NEXT_PUBLIC_` for client-exposed, unprefixed for server-only
- No `"use client"` in Server Actions
- Server Components by default — only add `'use client'` for interactivity
- Keep Client Components at leaf level; push interactivity down
- Use `next/image` for images with known dimensions
- Use `next/font` with Geist (already configured)

## API — EcomKit

Full reference in `.agents/rules/frontend-guideline.md`. Key facts:

### Two-phase consumption

1. **Bootstrap** — `GET /api/v1/business` (no auth, host-based tenant resolution). Returns `nanoId`.
2. **Authenticated** — all other endpoints. Every request needs `Authorization: Bearer {token}` + `X-BIZID: {nanoId}`.

### Auth flow

Sanctum plain-text tokens. No refresh mechanism. Store in httpOnly cookie or memory (never localStorage in production).
Auth endpoints (`login`, `logout`, `me`) don't need `X-BIZID`.

### Endpoints

Read [api.json](.agents/rules/api-docs.json) for OpenApi JSON format.

### Data layer

- Server Component `fetch()` for read-only page data
- Server Actions for mutations (`app/*/actions.ts`)
- TanStack Query v5 for client-side data fetching/mutations
- Use `'use cache'` / `cacheLife()` / `cacheTag()` for reusable cached data

### Pagination

Cursor-based on all list endpoints. Request: `?cursor=...&perPage=50`. Response:
`{ data: [...], meta: { nextCursor, prevCursor, perPage, hasMore } }`.

### Error format

RFC 9457 Problem Details: `{ type, title, status, detail }`.

### Resource shapes

Business, Brand, Category (recursive children), Product, Sku — all typed in `frontend-guideline.md` section 3.3.

## Visitor Integration — Signed Guest Token

Every device/browser gets a signed visitor token on the first API call for cart, checkout, orders, and addresses **without requiring login**.

### Bootstrap

`GET /api/v1/business` returns visitor tokens in the JSON body:

```json
{
  "data": {
    "nanoId": "...",
    "name": "...",
    "currency": "...",
    "timezone": "...",
    "visitorId": "r56Wf8qAiMKS...",
    "visitorSignature": "a1b2c3d4e5..."
  }
}
```

Both are stored in the zustand business slice alongside `bizId`.

### Headers

Every API call includes:
- `X-BIZID` — from zustand (`selectBizId`)
- `X-Visitor-Id` — from zustand (`selectVisitorId`)
- `X-Visitor-Signature` — from zustand (`selectVisitorSignature`)
- `Authorization: Bearer {token}` — only when logged in (`selectToken`)

### Flow

```
1. Page load → GET /v1/business → store bizId + visitor tokens in zustand
2. All subsequent calls include X-BIZID + X-Visitor-Id + X-Visitor-Signature
3. Backend verifies HMAC-SHA256 signature against visitor ID
4. Guest cart/orders are scoped to the visitor
5. On login → backend merges guest data into authenticated user automatically
```

### Persistence

Visitor tokens are stored in **both** zustand (runtime) and **sessionStorage** (cross-reload).

- **zustand**: Used by `getHeaders()` for all API calls during the current session.
- **sessionStorage**: Persists across page reloads. On reload, the bootstrap reads stored tokens from sessionStorage and sends them on the `/business` call. The backend reuses the existing guest identity instead of creating a new one.

```
1. First visit → /business (no visitor headers) → backend creates guest
                 → store visitorId/visitorSignature in zustand + sessionStorage
2. Page reload → read from sessionStorage → /business (with visitor headers)
                 → backend reuses same guest → cart/orders preserved
3. New tab    → no sessionStorage (tab-scoped) → /business → new guest
```

**Why sessionStorage not localStorage:** Each tab gets a fresh guest identity. Cart is ephemeral — merged on login anyway.

## Skills (load from `.agents/skills/`)

| Skill                           | Load when                                                                                 |
|---------------------------------|-------------------------------------------------------------------------------------------|
| `next-best-practices`           | Every task — file conventions, RSC, async, metadata, error handling, routes, images/fonts |
| `next-cache-components`         | Using `'use cache'`, `cacheLife()`, `cacheTag()`, `updateTag()`                           |
| `vercel-react-best-practices`   | Writing React components — 70 perf rules across 8 categories                              |
| `vercel-react-view-transitions` | Page transitions or `<ViewTransition>`                                                    |
| `frontend-design`               | Visual/design decisions — typography, palette, layout                                     |
| `ui-ux-pro-max`                 | Python-based design system generator for design tokens                                    |
| `web-design-guidelines`         | Before shipping UI — compliance checker                                                   |
| `writing-guidelines`            | Writing docs or prose                                                                     |
| `atomic-semantics-commits`      | Every commit — strict conventional commit format                                          |
| `zustand`	                      | For global state management                                                               | 

## Coding Standards

- **Components:** PascalCase files (e.g., `DashboardSidebar.tsx`, `Button.tsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `usePagination.ts`). Note: the target directory is `src/Hooks/` (capital
  H).
- **Types:** Always import from `src/Types/`. Never use `any`. API responses typed via `src/Types/Response.ts`
- **Validation:** Centralize in `src/Schema/` (Zod)
- **Global/root hooks:** API wrappers like `useApiQuery`, `useApiMutation` at root of `src/Hooks/`
- **Domain hooks:** Group by feature domain (`auth/`, `products/`, etc.)
- **Shared components:** Flat or max 1 level deep in `src/components/`
- **Route-specific components:** Colocated in the route folder, NOT in global `components/`
- **Providers:** Compose via `WrappersHandler.tsx` in `src/Wrappers/`
- **No component library** — build UI from scratch using existing packages (Mantine React Table, react-icons,
  react-toastify)
- **Component size:** Extract sub-components when they manage their own state or form a distinct visual section.
  Route-colocated sub-components use `_ComponentName.tsx` prefix. Each component file should tell one clear story.
- **Commit format:** `type: verb in third-person present` — no scopes, ≤72 char title, no emojis. See
  `atomic-semantics-commits` skill.

## Current State

- All code under `src/` with `(public)` route group active
- **Landing page** (`/`): Hero with headline + featured products grid
- **Product listing** (`/products`): Search bar, Featured/Latest/Popular sort toggle, sidebar filters (category tree +
  brand checkboxes), mobile filter drawer
- **Product detail** (`/products/[slug]`): Image, brand/categories, price, description, +/- quantity (min 1 / max
  stock), specs table, Add to Cart, related products
- **Cart drawer**: Slide-over panel accessible from navbar cart icon
- **Search**: Filters products by name, brand, and description text
- **Shared components**: `Button` (5 variants), `Input`, `ProductCard`, `QuantityInput`
- **Layout**: PublicNavbar, Footer, CartDrawer
- **Filtering**: CategoryTree (recursive, collapsible), BrandFilter (checkbox list)
- **Mock data**: 12 products across 5 brands, 3 category groups (nested), business info
- **Hooks** (`src/Hooks/`): `useBusiness`, `useBrands`, `useCategories`, `useProducts`, `useProduct`,
  `useRelatedProducts` — structured for future TanStack Query migration
- **Types** (`src/Types/`): `Api.ts` + `Response.ts` — exact shapes from OpenAPI spec
- **No auth**, **no dashboard**, **no API integration** yet
- **Proxy/middleware**: Not implemented

## References

- [Frontend guideline](./.agents/rules/frontend-guideline.md)
- [Folder Structure](./.agents/rules/folder-structure.md)
- [Skills](./.agents/skills)
