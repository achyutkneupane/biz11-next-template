# Biz11 — Multi-Tenant E-Commerce Frontend

Next.js 16 storefront for EcomKit, a multi-tenant commerce API built on Laravel.

## Prerequisites

- Node v20
- [bun](https://bun.sh)
- Herd (for local `.test` domain proxy)

## Getting Started

```bash
bun install
bun run dev       # starts on https://localhost:3010
```

For the custom domain:

```bash
herd proxy ecom-front.test http://localhost:3010
open https://ecom-front.test
```

## Environment

```bash
# .env
NEXT_PUBLIC_API_URL="https://ecomkit.test/api"
```

The `NEXT_PUBLIC_API_URL` points to the EcomKit backend at `https://ecomkit.test/api`.

## Dev Notes

- **Server Actions are cached** after compilation — restart `bun run dev` after
  editing any file under `src/app/actions/`.
- **`.test` domains use self-signed SSL.** `NODE_TLS_REJECT_UNAUTHORIZED=0` is
  set in the dev script so server-side fetches work. This is dev-only.
- The `(public)` route group is intentionally dynamic (`ƒ`) — the SSR layout
  calls `headers()` for the per-request business bootstrap on every navigation.

## Architecture

See [`project-description-latest.md`](./project-description-latest.md) for the
full architecture, API reference, data flow, and conventions.

## Linting & Type Checking

```bash
bun run lint     # ESLint 10 flat config
npx tsc --noEmit # TypeScript check
```

## Backend

The companion backend lives at `../laravel13/EcomKit` — a Laravel 13 multi-tenant
API with Filament 5 admin. Connect to it via the `backend-laravel-boost` MCP
server defined in `opencode.json`.
