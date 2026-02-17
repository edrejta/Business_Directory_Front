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

- `/auth`
- `/dashboard-user`
- `/dashboard-owner`
- `/dashboard-admin`
