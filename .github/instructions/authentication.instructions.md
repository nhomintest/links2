---
description: Read this before implementing or modifying authentication in the project.
---


# Authentication

## Provider

- **Clerk (`@clerk/nextjs`) is the only authentication method.** Do not introduce
  NextAuth, custom JWT/session handling, or any other auth library.
- `ClerkProvider` wraps the app in [app/layout.tsx](../app/layout.tsx). Use Clerk's
  components/hooks (`Show`, `SignInButton`, `SignUpButton`, `UserButton`, `auth()`,
  `currentUser()`, etc.) for all auth-related UI and logic.

## Protected routes

- `/dashboard` (and everything under it) requires a signed-in user.
- Enforce this with `clerkMiddleware` + `createRouteMatcher` in a root-level
  `proxy.ts` (Next.js 16 renamed the `middleware.ts` convention to `proxy.ts`;
  using `middleware.ts` causes a fatal "missing expected function export name"
  error), calling `auth.protect()` for matched routes:

  ```ts
  import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

  const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

  export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect();
  });

  export const config = {
    matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
  };
  ```

- New protected routes must be added to the matcher rather than checking auth
  state ad-hoc inside page components.

## Homepage redirect

- If a signed-in user visits `/` (the homepage), redirect them to `/dashboard`.
- Prefer performing this check server-side in [app/page.tsx](../app/page.tsx) (e.g.
  via `auth()` from `@clerk/nextjs/server` and Next's `redirect()`), not with a
  client-side effect.

## Sign in / sign up UX

- `SignInButton` and `SignUpButton` must always use `mode="modal"` so auth opens
  in a modal overlay instead of navigating to a hosted Clerk page:

  ```tsx
  <SignInButton mode="modal" />
  <SignUpButton mode="modal" />
  ```

- Never link to `/sign-in` or `/sign-up` routes/pages for these flows.
- Always pass `forceRedirectUrl="/dashboard"` on `SignInButton`/`SignUpButton`.
  Without it, Clerk only closes the modal on success and relies on the
  surrounding page to notice the new auth state — which the server-rendered
  homepage redirect doesn't do until the next full navigation/refresh.
  `forceRedirectUrl` makes Clerk navigate to `/dashboard` itself as soon as
  auth completes:

  ```tsx
  <SignInButton mode="modal" forceRedirectUrl="/dashboard" />
  <SignUpButton mode="modal" forceRedirectUrl="/dashboard" />
  ```
