# Coding Standards

## Core rules
- Keep business logic in `lib/*`; keep UI rendering in `app/*` and `components/*`.
- Prefer small pure helpers for data normalization and fallback rules.
- Reuse shared API wrappers before creating new fetch logic.
- Keep changes incremental and non-destructive.

## Naming
- Use `camelCase` for variables/functions and `PascalCase` for React components/types.
- Prefer explicit names (`selectedBusinessId`) over short ambiguous names (`id2`, `tmp`).

## Errors and messages
- Use one language per user-facing surface.
- Prefer short, actionable messages (example: `Unable to reach backend.`).
- Preserve backend `message` when available.

## Comments
- Add comments only for non-obvious intent or fallbacks.
- Avoid line-by-line comments for straightforward code.

## Styling
- Tailwind is the primary CSS framework.
- CSS modules/global CSS are allowed for page-specific presentation.
- Avoid introducing additional CSS frameworks.

## Tests
- Add focused tests for normalization and fallback logic.
- Run `npm run lint && npm test` for every small refactor.
