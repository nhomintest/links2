# Agent Instructions

This file is the entry point for AI coding agents (Copilot, Claude, etc.) working in this
repository. Read it fully before making changes. Detailed, topic-specific rules live in

## Project overview

- **links2** is a Next.js 16 (App Router) application using React 19 and TypeScript in strict mode.
- Auth is handled by Clerk. Data persistence uses Drizzle ORM against a Neon serverless Postgres
  database. UI components are shadcn/ui built on `@base-ui/react` primitives, styled with Tailwind CSS v4.
- The project is an early-stage scaffold — much of the boilerplate from `create-next-app` is still
  present and expected to be replaced incrementally. Don't assume existing sample code (e.g.
  `app/page.tsx`) is final; feel free to replace it when implementing real features.



## General rules for agents

1. **Don't over-engineer.** Only implement what's asked. Don't add abstractions, config, or
   dependencies "just in case."
2. **Match existing conventions** in the file you're editing before applying general rules from
   this doc set.
3. **Use the `@/*` path alias** (maps to the repo root) for imports instead of relative paths that
   climb more than one directory, e.g. `@/lib/utils` not `../../lib/utils`.
4. **Run `npm run lint`** after non-trivial changes and fix any new warnings/errors you introduce.
5. **Never commit secrets.** `.env*` files are git-ignored; keep it that way and never print their
   contents back verbatim in chat.
6. **Prefer editing existing files** over creating new ones. Only add new files/folders when the
   change genuinely doesn't belong in an existing one.
7. When a rule here conflicts with a topic doc in [docs/](docs/), the topic doc wins for that area.
