<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# EduWings — working notes

Read `README.md` first; it explains the six architectural decisions that everything else follows
from. These are the rules that are easy to break without noticing.

## Version-specific gotchas already hit in this repo

- **`proxy.ts`, not `middleware.ts`.** Next 16 deprecated the middleware convention. The exported
  function is `proxy`.
- **Supabase types must be `type`, not `interface`.** An interface has no implicit index signature,
  so it fails `Record<string, unknown>` and every query silently resolves to `never`. This is why
  `src/lib/supabase/database.types.ts` uses type aliases throughout.
- **Generic table access needs `dynamicTable()`.** PostgREST infers columns from a _literal_ table
  name; a union intersects every table's columns to nothing. `src/lib/supabase/dynamic.ts` is the
  one sanctioned escape hatch — do not scatter `as never` instead.
- **The React Compiler lint rules are on.** No `setState` synchronously inside an effect body, no
  component bindings created during render, no `Date.now()` in render. Existing solutions:
  `useIsMounted()`, deriving state from `pathname`, `<Icon name=…>` with `createElement`, and
  `requestTime()`.
- **Zod schemas must not use `.default()` or `z.coerce`.** Both make input and output types diverge,
  which breaks `useForm`'s single generic. Defaults belong in `defaultValues`; numbers use
  `valueAsNumber`.

## Non-negotiables

- **The site must build and run with an empty `.env`.** Anything that would make Supabase, email or
  analytics mandatory is a regression. Add a capability flag in `src/lib/env.ts` instead.
- **Never use the service-role client for anything a signed-in user initiates.** It bypasses RLS.
  It is for anonymous form writes and nothing else.
- **New public form?** Define its schema in `src/lib/validation/schemas.ts` and build the route with
  `createFormRoute()`. Do not hand-roll a route handler.
- **New CMS resource?** Add an entry to `src/lib/admin/resources.ts`. Do not create a directory.
- **Never pass a function to a Client Component.** `AdminResource.publicPath` is why
  `toResourceView()` exists.
- **No bare `console.*`.** Use `logger` from `src/lib/logger.ts`.
- **Internal links go through `src/config/routes.ts`**, never string literals.

## Before pushing

```bash
npm run verify   # typecheck + lint + build
```

All three must be clean. Lint has zero errors and zero warnings today; keep it that way.

## Content accuracy

Career pages state real entry requirements and salary bands that Kenyan students act on. If you
change one, verify it — an out-of-date grade requirement is worse than no page at all.
