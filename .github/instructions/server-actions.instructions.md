---
description: Read this before implementing or modifying data mutations (server actions) in the project.
---

# Server Actions

## Location & naming

- ALL data mutations MUST be done via server actions (`"use server"`), called from Client
  Components.
- Server action files MUST be named `actions.ts` and colocated in the directory of the
  component that calls them.

## Typing & validation

- ALL data passed into a server action must have explicit TypeScript types. NEVER use the
  `FormData` type for action arguments.
- ALL data MUST be validated inside the server action using `zod` before any further
  processing.

## Auth check

- EVERY server action MUST first verify there is a logged-in user (via Clerk's `auth()`/
  `currentUser()`) before performing any database operation. Return early with an error
  result if there is no authenticated user (see Error handling below).

## Error handling

- Server actions must NEVER `throw` errors. Instead, return an object with a `success` or
  `error` property so the caller can handle it without a try/catch, e.g.
  `{ success: true, data }` or `{ error: "message" }`.
- This applies to auth failures, validation failures, and database errors alike.

## Database access

- Server actions must NOT call Drizzle queries directly.
- ALL database operations must go through helper functions in the `/data` directory that
  wrap the Drizzle queries.

## Order of operations in an action

1. Check for authenticated user; return an error result if absent.
2. Validate input with `zod`; return an error result if invalid.
3. Call the relevant `/data` helper function to perform the database operation.
4. Return a success result (or an error result if the operation failed).
