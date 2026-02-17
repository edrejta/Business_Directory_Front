# ROLE_SIGNUP_TDD_TASKS.md

## Çfarë duhet ditur nga front për animacionin e Login (pa kod)

Faqja e hyrjes (login) është një ekran i vetëm ku përdoruesi fut email dhe fjalëkalim dhe shtyp butonin për të hyrë. E gjithë faqja përdor një layout të përbashkët me faqen e regjistrimit: sfond me pamje qyteti, një shtresë e errët për të lexueshëm teksti dhe një kartë qendrore ku shfaqen titulli "Hyr", formulari dhe lidhja "Regjistrohu".

Çfarë ka në ekran: një titull ("Hyr"), dy fusha (email dhe fjalëkalim), një buton hyrjeje dhe një teksti në fund që thotë "Nuk ke llogari? Regjistrohu". Kur përdoruesi dërgon formularin, butoni mund të tregojë se është duke u ngarkuar (për shembull teksti "Duke u ngarkuar" ose një spinner). Nëse ka gabim (email/fjalëkalim i gabuar), shfaqet një mesazh gabimi mbi ose nën fushat.

Për animacionin e login-it është e rëndësishme të kihet parasysh këto gjendje: faqja sapo u hap (elementet mund të dalin me fade-in ose slide); përdoruesi klikon "Hyr" dhe fillon ngarkimi (butoni ndryshon, mund të bllokohet); përdoruesi merr përgjigje të suksesshme dhe ridrejtohet në dashboard (mund të shtohet një dalje e shkurtër para se të ndryshojë faqja); nëse ka gabim, shfaqet mesazhi i gabimit (mund të ketë një animacion të vogël për ta sjellë në ekran). Asnjë kod nuk kërkohet në këtë përshkrim — vetëm konteksti vizual dhe gjendjet që front duhet të dijë për të konceptuar ose implementuar animacionin e login-it.

---

## Rregullat për rol gjatë regjistrimit

### Admin nuk lejohet në signup

- **User (0)** dhe **BusinessOwner (1)** janë të vetmet rol që mund të zgjidhen gjatë regjistrimit.
- **Admin (2)** nuk lejohet – caktohet vetëm nga një admin ekzistues (në të ardhmen).

---

## Backend – AuthService.cs

Nëse klienti dërgon `role: 2` (Admin) gjatë regjistrimit, backend e vendos automatikisht si User (0):

```csharp
// Admin nuk lejohet gjatë signup – vetëm User ose BusinessOwner
var role = dto.Role == UserRole.Admin ? UserRole.User : dto.Role;
```

Vetëm User dhe BusinessOwner mund të regjistrohen nga përdoruesit. Admin caktohet vetëm nga një admin ekzistues.

---

## Frontend – Implementimi aktual

### Konstanta: SIGNUP_ROLES

- Skedar: `lib/constants/roles.ts`
- `SIGNUP_ROLES` përmban vetëm `{ value: 0, label: "Përdorues" }` dhe `{ value: 1, label: "Pronar Biznesi" }`.
- Admin (2) nuk përfshihet.

### Schema Zod

- Skedar: `lib/validation/auth.ts`
- `registerSchema` pranon vetëm `role: 0 | 1`.
- Validimi: `z.union([z.literal(0), z.literal(1)])`.

### UI

- Dropdown me vetëm "Përdorues" dhe "Pronar Biznesi".
- Komponenti: `components/RegisterForm.tsx`.

### Redirect pas signup / login

Backend kthen `role` (0, 1, 2) në përgjigje. Pas signup ose login të suksesshëm, frontend ruaj token dhe `data.role`, pastaj ridrejton:

| Role | Redirect        |
|------|-----------------|
| 0 (User)         | `/dashboard-user`    |
| 1 (BusinessOwner)| `/dashboard-business`|
| 2 (Admin)        | `/dashboard-admin`   |

- Funksioni: `lib/auth/redirect.ts` → `getRedirectPath(role)`.
- Faqet e regjistrimit dhe hyrjes përdorin `router.push(getRedirectPath(response.role))` pas përgjigjes së suksesshme.

---

## CORS – Çfarë ndryshohet në backend për të funksionuar

Për të zgjidhur gabimin **"Failed to fetch"** dhe **preflight (failed)**:

1. Aktivizo CORS në backend për origjinën e frontend (`http://localhost:3000` gjatë zhvillimit).
2. Shto header-at e nevojshme: `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, `Access-Control-Allow-Headers`.
3. Lejo metodën `OPTIONS` për kërkesat preflight.

Shembull për ASP.NET Core:

```csharp
// Program.cs ose Startup.cs
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});
// ...
app.UseCors();
```
