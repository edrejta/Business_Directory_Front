# PR Checklist

- Naming is explicit and consistent (`camelCase` / `PascalCase`).
- Complex logic is decomposed into small pure helpers.
- Non-obvious fallback behavior has intent-level comments.
- User-facing errors follow shared message constants.
- No new CSS framework introduced; Tailwind remains primary.
- Added/updated tests for changed logic and edge cases.
- `npm run lint` and `npm test` pass locally.
