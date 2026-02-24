# Auth – Backend i plotë & çfarë është bërë në frontend

## Status: 39 dhe 42 – 100% të përfunduara (backend)

| Story | Përshkrim | Status backend |
|-------|-----------|----------------|
| **39** | Authenticated user can access protected endpoints (JWT në header → 401 pa/me token të pavlefshëm) | ✅ E përfunduar |
| **42** | Admin role is enforced (endpoint-et Admin → 403 për jo-admin; JWT me Role; policy "AdminOnly") | ✅ E përfunduar |

---

## 1. Çfarë është bërë në backend (komplet)

### 1.1 Autentifikim (Login / Register)
- **POST /api/auth/register** – Regjistrim (username, email, password, role). Kthen 201 + JWT. Email unik, BCrypt, Admin nuk lejohet në signup.
- **POST /api/auth/login** – Login (email, password). Kthen 200 + JWT ose 401 për kredenciale të gabuara.
- JWT përmban: `Id`, `Username`, `Email`, **Role** (ClaimTypes.Role).

### 1.2 Mbrojtja e endpoint-eve (Story 39)
- Të gjitha endpoint-et kërkojnë JWT. Pa token ose token i pavlefshëm → **401**.
- Vetëm Register dhe Login kanë `[AllowAnonymous]`.

### 1.3 Roli Admin (Story 42)
- Policy "AdminOnly", `[Authorize(Roles = "Admin")]` në AdminController.
- GET /api/admin me token User/BusinessOwner → **403**; me token Admin → **200**.

---

## 2. Çfarë është bërë në frontend

### 2.1 Register & Login (tashmë)
- Formë Register: username, email, password, roli (Përdorues / Pronar Biznesi). POST `/api/auth/register` me `{ username, email, password, role }`.
- Formë Login: email, password. POST `/api/auth/login` me `{ email, password }`.
- Pas suksesit: ruajtje e `token`, `role`, `id`, `username`, `email` (localStorage + cookie).
- Redirect sipas rolit: role 0 → `/dashboard-user`, role 1 → `/dashboard-business`, role 2 → `/dashboard-admin`.
- Gabime: 400/401 të treguara në UI.

### 2.2 Endpoint-et e mbrojtura (obligative) – të implementuara
- **`lib/api/client.ts`** – `authenticatedFetch(path, options)`:
  - Shton **`Authorization: Bearer <token>`** në çdo kërkesë kur ka token (lexon nga `getToken()` / localStorage `token`).
  - **401:** thërret `clearSessionAndRedirect()` (fshin token/role/cookies, ridrejton në `/login`).
  - **403:** hedh `Error("Nuk ke të drejtë.")`.
- **`lib/auth/session.ts`** – `clearSessionAndRedirect()`: fshin të gjitha të dhënat e sesionit dhe bën `window.location.href = "/login"`.
- Për çdo thirrje te API-t e mbrojtura (p.sh. submit business, edit business, admin), përdorni `authenticatedFetch` ose `authenticatedJson` në vend të `fetch` të zakonshëm.

### 2.3 Rrugët e mbrojtura
- Middleware kontrollon cookie `token` për `/dashboard-user`, `/dashboard-business`, `/dashboard-admin`; pa token ridrejton në `/login`.
- Dashboard-et kontrollojnë rolin dhe ridrejtojnë në dashboard-in e duhur (p.sh. User te `/dashboard-business` → ridrejtohet në `/dashboard-user`).

### 2.4 Logout
- `logoutUser()` në AuthContext thërret `clearSessionAndRedirect()`, që fshin sesionin dhe ridrejton në login.

---

## 3. Si të përdorësh API-t e mbrojtura

```ts
import { authenticatedFetch, authenticatedJson } from "@/lib/api/client";

// GET me token
const data = await authenticatedJson<MyType>("/api/businesses");

// POST me token
await authenticatedFetch("/api/businesses", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "..." }),
});

// Nëse nuk do token (endpoint publik)
const res = await authenticatedFetch("/api/public", { requireAuth: false });
```

- Në **401** përdoruesi ridrejtohet automatikisht në `/login`.
- Në **403** merrni `throw new Error("Nuk ke të drejtë.")` – mund ta kapni dhe të shfaqni mesazh ose të ridrejtoni.

---

## 4. CORS (konfigurohet në backend)

Kur frontend është në **http://localhost:3000** dhe backend në **http://localhost:5003**, shfletuesi bën *cross-origin* request. Pa CORS të aktivizuar në backend, request-et (p.sh. register/login) **dështojnë** (red X në Network, "Provisional headers are shown").

**Backend duhet të:**

- Lejojë origin: `http://localhost:3000` (ose `*` vetëm për dev).
- Përgjigjet në **OPTIONS** (preflight) me header-at:
  - `Access-Control-Allow-Origin: http://localhost:3000`
  - `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`
  - `Access-Control-Allow-Headers: Content-Type, Authorization`
- Për përgjigjet e request-ave reale (POST/GET), të përfshijë të paktën `Access-Control-Allow-Origin: http://localhost:3000`.

Në ASP.NET Core, zakonisht mjafton shtimi i CORS në `Program.cs` (ose `Startup.cs`) me `AllowAnyOrigin()` / `WithOrigins("http://localhost:3000")` dhe `AllowAnyHeader()` / `WithHeaders("Content-Type", "Authorization")`, dhe `UseCors()` në pipeline.

---

## 5. URL dhe body (referencë)

- **Base URL (dev):** `http://localhost:5003` (ose `NEXT_PUBLIC_API_URL`).
- **Register:** `POST /api/auth/register` → `{ "username", "email", "password", "role": 0|1 }`.
- **Login:** `POST /api/auth/login` → `{ "email", "password" }`.
- **Përgjigja auth:** `{ "token", "id", "username", "email", "role" }`.
- **Admin (shembull):** `GET /api/admin` me header `Authorization: Bearer <token>`.
