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
npm run dev      # next dev
npm run build    # next build
npm run start    # next start (prod)
npm run lint     # eslint (ESLint 10, NOT next lint)
```

## Project Layout

**Important:** There are two `.agents/rules/` files that define the architecture:

1. **`folder-structure.md`** — prescribes a `src/`-based architecture with strict separation of global vs route-specific logic. This is the *target* structure.
2. **`frontend-guideline.md`** — describes a root-level structure `src/` dir. And `app/`, `lib/`, `types/`, `components/`, `hooks/` inside it.

**When creating new files/directories, prefer `folder-structure.md` conventions (under `src/`).** The root-level layout is the starting point; migrate toward the `src/` architecture as the app grows.

The path alias `@biz11/*` already resolves to `./src/*`, so imports from `src/` work immediately once the directory exists.

### Target structure (`folder-structure.md`)

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
Sanctum plain-text tokens. No refresh mechanism. Store in httpOnly cookie or memory (never localStorage in production). Auth endpoints (`login`, `logout`, `me`) don't need `X-BIZID`.

### Endpoints
`POST /auth/login`, `POST /auth/logout`, `GET /auth/me`, `GET /brands`, `GET /categories`, `GET /products`, `GET /products/{product}/skus`.

### Data layer
- Server Component `fetch()` for read-only page data
- Server Actions for mutations (`app/*/actions.ts`)
- TanStack Query v5 for client-side data fetching/mutations
- Use `'use cache'` / `cacheLife()` / `cacheTag()` for reusable cached data

### Pagination
Cursor-based on all list endpoints. Request: `?cursor=...&perPage=50`. Response: `{ data: [...], meta: { nextCursor, prevCursor, perPage, hasMore } }`.

### Error format
RFC 9457 Problem Details: `{ type, title, status, detail }`.

### Resource shapes
Business, Brand, Category (recursive children), Product, Sku — all typed in `frontend-guideline.md` section 3.3.

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

## Coding Standards

- **Components:** PascalCase files (e.g., `DashboardSidebar.tsx`, `Button.tsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `usePagination.ts`). Note: the target directory is `src/Hooks/` (capital H).
- **Types:** Always import from `src/Types/`. Never use `any`. API responses typed via `src/Types/Response.ts`
- **Validation:** Centralize in `src/Schema/` (Zod)
- **Global/root hooks:** API wrappers like `useApiQuery`, `useApiMutation` at root of `src/Hooks/`
- **Domain hooks:** Group by feature domain (`auth/`, `products/`, etc.)
- **Shared components:** Flat or max 1 level deep in `src/components/`
- **Route-specific components:** Colocated in the route folder, NOT in global `components/`
- **Providers:** Compose via `WrappersHandler.tsx` in `src/Wrappers/`
- **No component library** — build UI from scratch using existing packages (Mantine React Table, react-icons, react-toastify)
- **Commit format:** `type: verb in third-person present` — no scopes, ≤72 char title, no emojis. See `atomic-semantics-commits` skill.
