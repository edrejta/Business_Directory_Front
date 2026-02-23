# Ndryshimet – Frontend Login & Register (TDD)

Dokument që përshkruan të gjitha ndryshimet e bëra për detyrën Login & Register.

---

## Faza 0: Setup

| Task | Çfarë u bë |
|------|------------|
| 0.1–0.2 | Shtuar varësitë: `zod`, `axios`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`, `@vitejs/plugin-react` |
| 0.4 | Krijuar `vitest.config.ts` (globals, jsdom, setupFiles) dhe `vitest.setup.ts` |
| 0.5 | `.env.local.example` ekzistonte tashmë me `NEXT_PUBLIC_API_URL=https://api.yourdomain.com` |
| 0.6 | Shtuar script `"test": "vitest"` në `package.json` |

---

## Faza 1: Auth API Layer

| Skedar | Përshkrim |
|--------|-----------|
| **`lib/api/auth.ts`** | Funksionet `register()` dhe `login()` me fetch; përpunim gabimesh 400/401 |
| **`lib/types/auth.ts`** | Interfaces: `RegisterInput`, `LoginInput`, `AuthResponse` |
| **`lib/api/auth.test.ts`** | 4 teste TDD për register/login dhe gabimet 400/401 |

---

## Faza 2: Auth Storage & Redirect

| Skedar | Përshkrim |
|--------|-----------|
| **`lib/auth/storage.ts`** | `saveToken()`, `getToken()`, `clearAuth()` – çelësi `auth_token` në localStorage |
| **`lib/auth/redirect.ts`** | `getRedirectPath(role)` → 0→`/dashboard-user`, 1→`/dashboard-owner`, 2→`/dashboard-admin` |
| **`lib/auth/storage.test.ts`** | 4 teste për storage |
| **`lib/auth/redirect.test.ts`** | 3 teste për redirect path |

---

## Faza 3: Validimi (Zod)

| Skedar | Përshkrim |
|--------|-----------|
| **`lib/validation/auth.ts`** | `registerSchema` (username, email, password min 8), `loginSchema` (email, password) |
| **`lib/validation/auth.test.ts`** | 7 teste për validim |

---

## Faza 4: Komponentët e Formës

| Skedar | Përshkrim |
|--------|-----------|
| **`components/LoginForm.tsx`** | Input Email, Password (type="password"), butoni "Hyr", onSubmit, error, isLoading, password toggle, fieldErrors inline |
| **`components/RegisterForm.tsx`** | Username, Email, Password, butoni "Regjistrohu", të njëjtat props |
| **`components/LoginForm.test.tsx`** | 4 teste për render, submit, error, loading |
| **`components/RegisterForm.test.tsx`** | 4 teste për render, submit, error, loading |

---

## Faza 5–6: AuthContext, Faqet, Routing

| Skedar | Ndryshim |
|--------|----------|
| **`context/AuthContext.tsx`** | Integrim me `saveToken`/`getToken`/`clearAuth`; shtuar `login()`, `register()`, `getRedirectPath`, `isAuthenticated`; `logout` ridrejton në `/login` |
| **`app/login/page.tsx`** | Faqe e re – `LoginForm`, `useAuth().login`, validim Zod, link "Nuk ke llogari? Regjistrohu" → `/register` |
| **`app/register/page.tsx`** | Faqe e re – `RegisterForm`, `useAuth().register`, link "Ke llogari? Hyr" → `/login` |
| **`components/ProtectedRoute.tsx`** | Komponent i ri – ridrejton në `/login` nëse nuk ka përdorues |
| **`middleware.ts`** | Ridrejton në `/login` (në vend të `/auth`) kur nuk ka token |
| **`app/auth/page.tsx`** | Zëvendësuar – tani vetëm redirect në `/login` |
| **`app/page.tsx`** | Ndryshuar redirect nga `/auth` në `/login` |

---

## Faza 7–8: Dashboards, Stilizim, UX

| Skedar | Ndryshim |
|--------|----------|
| **`app/dashboard-user/page.tsx`** | Titull "Mirë se erdhe, {username}."; redirect në `/login` |
| **`app/dashboard-owner/page.tsx`** | Titull "Mirë se erdhe, {username}."; redirect në `/login` |
| **`app/dashboard-admin/page.tsx`** | Titull "Mirë se erdhe, {username}."; redirect në `/login` |
| **`components/Navbar.tsx`** | Butoni "Dil" në vend të "Logout"; "Hyr" në vend të "Login"; link të rinj `/login` |
| **`components/LoginForm.tsx`** | Password visibility toggle (👁/🙈); gabime inline me `fieldErrors` |
| **`components/RegisterForm.tsx`** | Njëjtë si LoginForm |

---

## Skedarë të rinj

```
lib/
├── api/
│   ├── auth.ts
│   └── auth.test.ts
├── auth/
│   ├── storage.ts
│   ├── storage.test.ts
│   ├── redirect.ts
│   └── redirect.test.ts
├── types/
│   └── auth.ts
└── validation/
    ├── auth.ts
    └── auth.test.ts

components/
├── LoginForm.tsx
├── LoginForm.test.tsx
├── RegisterForm.tsx
├── RegisterForm.test.tsx
└── ProtectedRoute.tsx

app/
├── login/
│   └── page.tsx
└── register/
    └── page.tsx

vitest.config.ts
vitest.setup.ts
```

---

## Komanda

- **Teste:** `npm run test`
- **Dev:** `npm run dev`
- **Rrugët:** `/login`, `/register`, `/dashboard-user`, `/dashboard-owner`, `/dashboard-admin`, `/` (redirect → `/login`)
