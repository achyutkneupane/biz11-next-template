# Folder Structure
You are an Expert Next.js Architect and AI Coding Agent. Your objective is to scaffold, structure, and maintain Next.js (App Router) projects adhering strictly to the custom modular architecture defined below.

# Project Architecture Overview
This project strictly separates global/shared logic from feature-specific/route-specific logic. The primary architectural philosophy is **Route-Based Component Colocation** combined with **Domain-Driven Hooks**.

## Directory Structure Rules

You must organize the `src/` directory exactly as follows:

### 1. `src/app/` (The Routing Layer)
- **Route Groups:** Extensively use route groups `(group-name)` to organize flows without affecting the URL path (e.g., `(auth)`, `(landing-pages)`, `(dashboards)`, `(common)`).
- **Role-Based Dashboards:** If the app has different user roles, separate their views using sub-directories inside a main dashboard folder (e.g., `dashboard/(admin)`, `dashboard/(user-role-a)`).
- **Colocation (CRITICAL):** If a React component is *only* used within a specific route, it **must** live inside that route's folder alongside `page.tsx`. Do not pollute the global `src/components/` folder with route-specific UI.

### 2. `src/components/` (Global Shared UI)
- This folder is strictly for **reusable, generic UI components** used across multiple routes.
- Examples include: `Button.tsx`, `Navbar.tsx`, `PaginationComponent.tsx`, `Tooltip.tsx`.
- Group highly related generic components into subdirectories (e.g., `Inputs/` for all form fields, `Skeletons/` for all loading states).

### 3. `src/Hooks/` (Domain-Driven Custom Hooks)
- Do not dump all hooks into the root of this folder.
- Organize hooks by **Feature Domain** (e.g., `auth/`, `transactions/`, `users/`, `support/`).
- This includes both state-management hooks and API data-fetching/mutation hooks (e.g., TanStack Query wrappers).
- Global API wrappers (e.g., `useApiMutation.ts`, `useApiQuery.ts`) remain at the root of `src/Hooks/`.

### 4. Logic & Data Integrity Directories
- **`src/Types/`**: All TypeScript interfaces, types, and Enums must live here. Separate files by context (e.g., `Enums.ts`, `Payload.ts`, `Response.ts`, `PageProps.ts`).
- **`src/Schema/`**: All validation schemas (Zod, Yup, etc.) must be centralized here.
- **`src/Contexts/`**: React Context definitions (e.g., `AuthContext.tsx`).
- **`src/Variables/`**: Global constants and URL maps (e.g., `URLs.ts`).
- **`src/Utils/`**: Pure functions, helpers, and formatters (e.g., `helpers.tsx`, `EnumVariables.ts`).

### 5. `src/Wrappers/` (Providers & Layout Guards)
- Centralize all High-Order Components (HOCs), Context Providers, and Role-Based view guards here.
- Examples: `AuthContextWrapper.tsx`, `RoleView.tsx`, `QueryProviderWrapper.tsx`.
- Use a `WrappersHandler.tsx` to cleanly compose these providers before wrapping the application in the main `layout.tsx`.

### 6. `src/Pages/` (Top-Level Container Components)
- Use this directory *only* for massive container components that orchestrate highly complex pages (like a dynamic `LandingPage.tsx`), keeping the actual `app/.../page.tsx` file clean and focused on server-side data fetching or metadata.

## Coding Standards
1. **Component Naming:** Always use PascalCase for component files (e.g., `DashboardSidebar.tsx`, `Button.tsx`).
2. **Hook Naming:** Always use camelCase starting with "use" for hooks (e.g., `usePagination.ts`, `useAuth.ts`).
3. **No Deep Nesting of Shared Components:** Keep the `src/components/` folder flat or maximally one level deep.
4. **Enforce Type Safety:** Never use `any`. Always import types from the `src/Types/` directory. Ensure API responses are typed via `src/Types/Response.ts`.