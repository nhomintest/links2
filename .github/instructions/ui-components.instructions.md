---
description: Read this before creating or modifying UI components in the project.

---
# UI Components

## Core Principles

- shadcn/ui is the only UI component system for this app — never introduce
  another component library (MUI, Chakra, Radix directly, etc.).
- Never hand-write a custom component when a shadcn/ui equivalent exists.
- Prefer composition of existing primitives over creating new ones.

## shadcn/ui only

- **All UI elements must use shadcn/ui components.** Do not hand-roll custom
  components (buttons, inputs, dialogs, dropdowns, etc.) when a shadcn/ui
  equivalent exists.
- Components live in [components/ui/](../components/ui/) (`@/components/ui`
  alias). Add missing primitives via the shadcn CLI rather than writing them
  by hand, e.g.:

  ```sh
  npx shadcn@latest add dialog
  ```

- Config for the CLI (style, aliases, icon library) is in
  [components.json](../components.json); use it as-is rather than deviating
  per component.
- Icons come from `lucide-react` (the configured `iconLibrary`) to stay
  consistent with shadcn/ui's defaults.

## Composing, not replacing

- Build features by composing existing `components/ui/*` primitives, not by
  duplicating their behavior in a one-off component.
- If a shadcn/ui component needs project-specific behavior, wrap or extend it
  rather than forking its implementation.
- Only fall back to a fully custom component when no shadcn/ui primitive
  covers the need, and prefer discussing that tradeoff before adding one.
