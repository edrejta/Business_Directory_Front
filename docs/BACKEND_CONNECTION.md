# Lidhja Frontend – Backend: çfarë i duhet backend-it

Ky dokument përshkruan **çfarë duhet të ketë backend-i (Business_Directory)** që frontendi **Business_Directory_Front** të lidhet me të pa gabime.

---

## 1. Adresa e API (dev)

- Frontendi e thirr API-n në: **`http://localhost:5003`** (konfigurohet me `NEXT_PUBLIC_API_URL` në frontend).
- Backend duhet të dëgjojë në **portin 5003** (ose të përputhet me këtë URL).

---

## 2. CORS (obligativ – pa këtë lidhja nuk funksionon)

Request-et vijnë nga **http://localhost:3000** (frontend) drejt **http://localhost:5003** (backend), pra janë *cross-origin*. Pa CORS të konfiguruar në backend:

- Shfletuesi bllokon request-et.
- Në UI shfaqet **"Failed to fetch"**.
- Në Network tab: requesti me **X të kuq**, **"Provisional headers are shown"**.

**Backend duhet:**

| Kërkesa | Detaj |
|--------|--------|
| **Origin i lejuar** | `http://localhost:3000` (ose për dev mund të përdoret `*`) |
| **OPTIONS (preflight)** | Të përgjigjet me header-at: `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers` |
| **Request-et reale (POST/GET)** | Të përfshijnë `Access-Control-Allow-Origin: http://localhost:3000` në response |

**Header-at që frontendi dërgon / pret:**

- **Request:** `Content-Type: application/json`, `Authorization: Bearer <token>` (për endpoint-et e mbrojtura).
- **Preflight:** shfletuesi dërgon `Access-Control-Request-Method: POST` dhe `Access-Control-Request-Headers: content-type` — backend duhet t’i lejojë.

**Shembull ASP.NET Core (`Program.cs`):**

```csharp
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// ... (Build)

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
```

---

## 3. Endpoint-et e auth (pa token)

### 3.1 Regjistrim

| | |
|--|--|
| **URL** | `POST http://localhost:5003/api/auth/register` |
| **Headers** | `Content-Type: application/json` |
| **Body (JSON)** | `{ "username": string, "email": string, "password": string, "role": number }` |
| **role** | `0` = Përdorues, `1` = Pronar biznesi (Admin nuk lejohet në signup) |
| **Sukses** | 201, body: `{ "token", "id", "username", "email", "role" }` |
| **Gabim** | 400/409 etj. — frontendi lexon `res.text()` dhe e tregon në UI |

### 3.2 Login

| | |
|--|--|
| **URL** | `POST http://localhost:5003/api/auth/login` |
| **Headers** | `Content-Type: application/json` |
| **Body (JSON)** | `{ "email": string, "password": string }` |
| **Sukses** | 200, body: `{ "token", "id", "username", "email", "role" }` |
| **Gabim** | 401 — kredenciale të gabuara |

**Formati i përgjigjes së auth (të njëjtë për register dhe login):**

```json
{
  "token": "eyJ...",
  "id": "guid-ose-id",
  "username": "emri",
  "email": "email@example.com",
  "role": 0
}
```

Frontendi ruan `token` në localStorage dhe e dërgon në header për request-et e mbrojtura.

**Frontend:** `lib/api/auth.ts` dërgon një objekt të destrukturuar në body: `JSON.stringify({ username, email, password, role })`, pra vlerat janë gjithmonë string (username, email, password) dhe number (role). Nëse më parë dërgohej `"username": { ... }` (StartObject), shkaku ishte thirrja e gabuar me një argument të vetëm objekt; tani `register(input)` merr objektin dhe e ndan para se ta dërgojë.

---

## 4. Endpoint-et e mbrojtura (me token)

- **Header i detyrueshëm:** `Authorization: Bearer <token>`
- **Pa token ose token i pavlefshëm:** backend duhet të kthejë **401**.
- **Token i vlefshëm por pa të drejtë (p.sh. jo Admin):** backend duhet të kthejë **403**.

Frontendi:

- Në **401**: fshin sesionin dhe ridrejton në `/login`.
- Në **403**: tregon mesazh “Nuk ke të drejtë.” (ose të ngjashëm).

---

## 5. Përmbledhje e shkurtër

| Çfarë | Ku (backend) |
|------|----------------|
| **Port / URL** | API në `http://localhost:5003` |
| **CORS** | Lejoni origin `http://localhost:3000`, metodat e nevojshme, header-at `Content-Type`, `Authorization`; përgjigjuni OPTIONS dhe shtoni CORS header-at në response |
| **Register** | `POST /api/auth/register` → body JSON me username, email, password, role; përgjigje me token, id, username, email, role |
| **Login** | `POST /api/auth/login` → body JSON me email, password; përgjigje e njëjtë si register |
| **Endpoint të tjerë** | Pranoni `Authorization: Bearer <token>`; 401 për të pa autorizuar, 403 për të pa të drejtë |

Pas konfigurimit të CORS dhe të këtyre kontratave, lidhja ndërmjet **Business_Directory_Front** dhe **Business_Directory** duhet të funksionojë; "Failed to fetch" zhduket kur CORS është aktiv në backend.

---

## 5.1 Kur fetch dështon ("Provisional headers", X e kuqe) – a duhet Docker?

**Jo.** Nuk ke nevojë të ekzekutosh me Docker që fetch të funksionojë. Problemi është zakonisht një nga këto:

| Shkak | Çfarë të kontrollosh |
|-------|----------------------|
| **Backend nuk po nis** | Në folder-in e backend-it (Business_Directory): `dotnet run`. Kontrollo që në konsol shkruhet se dëgjon në `http://localhost:5003`. |
| **CORS** | Backend duhet të ketë CORS si në seksionin 2 dhe `app.UseCors()` **para** `UseAuthentication()`. Pa këtë, shfletuesi bllokon request-in dhe shfaqen "Provisional headers". |
| **OPTIONS nuk përgjigjet** | Në Network tab, shiko nëse ka një request **OPTIONS** për `register` (preflight). Nëse OPTIONS dështon ose nuk kthen header-at CORS, POST nuk dërgohet. |

**Docker:** E dobishme nëse do mjedis të njëjtë (port, variabla) ose deploy. **Docker vetë nuk rregullon CORS** – e njëjta konfigurim CORS duhet të jetë në kod. Nëse i vë të dyjat (frontend + backend) pas një reverse proxy me të njëjtin origin, atëherë nuk ke më cross-origin dhe CORS nuk nevojitet – por për dev lokal (frontend 3000, backend 5003) mjafton CORS i saktë në backend dhe backend i nisur në 5003.

---

## 6. Status – konfigurimi i aplikuar në backend

Backend-i (Business_Directory) është përputhur me këtë dokument:

| Pika | Konfigurimi |
|------|--------------|
| **Port 5003** | `Properties/launchSettings.json` → profili "http" me `applicationUrl`: `http://localhost:5003`. Nisni me `dotnet run` ose profilin "http". |
| **CORS** | `Program.cs`: **DefaultPolicy** me `WithOrigins("http://localhost:3000")`, `AllowAnyMethod()`, `AllowAnyHeader()`. Në pipeline: `app.UseCors()` **para** `UseAuthentication()` dhe `UseAuthorization()` (që preflight OPTIONS të marrë 200 me header-at e duhur). |
| **Auth** | `POST /api/auth/register` dhe `POST /api/auth/login` me `[AllowAnonymous]`; body dhe përgjigje si në seksionet 3.1 dhe 3.2. |
| **Endpoint të mbrojtura** | Autorizim global (401 pa token). `Authorization: Bearer <token>` pranohet nga CORS (`AllowAnyHeader()`). AdminController me `[Authorize(Roles = "Admin")]` → 403 për jo-admin. |

**Frontend:** mbani `NEXT_PUBLIC_API_URL=http://localhost:5003` në `.env.local` dhe përdorni URL të plota (p.sh. `${API_BASE}/api/auth/login`), siç bën tashmë `lib/api/auth.ts` dhe `lib/api/client.ts`. Pas këtyre ndryshimeve, lidhja duhet të funksionojë pa "Failed to fetch" për shkak të CORS.
