# Team Start Here

This project is organized for a simple rule:
business logic in `lib/api/*`, UI in `app/*` and `components/*`, types in `lib/types/*`.

## Rendering Strategy

- `app/businesses/page.tsx`: public list page, server rendered with `revalidate = 60` (ISR).
- `app/businesses/[id]/page.tsx`: public details page, server rendered with `revalidate = 60` (ISR).
- `app/login/page.tsx`, `app/register/page.tsx`: client-side forms (CSR), because they are interactive.
- `app/dashboard-*`: authenticated app area (CSR + API calls with Bearer token).

## Where To Add Endpoints

- Public endpoints: `lib/api/public.ts`
- Auth endpoints: `lib/api/auth.ts`
- Authenticated user business endpoints: `lib/api/businesses.ts`
- User profile endpoints: `lib/api/users.ts`
- Comment endpoints: `lib/api/comments.ts`
- Admin endpoints: `lib/api/admin.ts`

## Adding A New Feature (Checklist)

1. Add request/response types in `lib/types/*`.
2. Add API function in the correct `lib/api/*.ts` file.
3. For protected endpoints, use `authenticatedJson` from `lib/api/client.ts`.
4. Use API function from your page/component.
5. Add tests near logic (`*.test.ts` or `*.test.tsx`).

## Shared Rules

- API base URL comes from `lib/api/config.ts`.
- Do not add duplicate API modules for the same endpoint group.
- Keep `/auth` (`app/auth/page.tsx`) as the project map/guide page for the team.
