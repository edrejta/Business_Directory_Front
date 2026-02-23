# Frontend Baseline (Team Standard)

This project uses a single shared frontend stack:

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

## Minimal Structure

```txt
app/
  layout.tsx
  page.tsx
  login/page.tsx
  dashboard-admin/page.tsx
components/
context/
lib/
  api/
  auth/
  types/
middleware.ts
```

## Rules

1. All routes/pages go in `app/`.
2. All backend calls go through `lib/api/*` services.
3. Keep shared types in `lib/types/*`.
4. Use `context/AuthContext.tsx` for auth state (no duplicate auth stores).
5. Use Tailwind as the styling framework for all new UI.

## Environment

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Scripts

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run test`
