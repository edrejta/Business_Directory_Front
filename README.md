## Business Directory Frontend (Next.js)

Auth frontend i lidhur me backend API:

- `POST /api/auth/register`
- `POST /api/auth/login`

### Setup

```bash
npm install
npm run dev
```

Aplikacioni hapet ne `http://localhost:3000`.

### Environment

Krijo `.env.local` dhe vendos:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5003
```

### Routes

- `/` -> redirects to `/auth`
- `/auth` (Project start guide)
- `/businesses` (public ISR list)
- `/businesses/[id]` (public ISR details)
- `/login`
- `/register`
- `/dashboard-user`
- `/dashboard-business`
- `/dashboard-admin`

### Team guide

- `docs/TEAM_START_HERE.md`

CD test trigger change: 2026-02-23
