Plasmic integration (scaffold)
================================

This folder contains a minimal scaffold and instructions to integrate Plasmic with this Next.js app.

Steps to enable Plasmic visually-managed pages/components:

1. Create a Plasmic project at https://www.plasmic.app and design pages/components.

2. Add environment variables in `.env.local` (project root). You can copy the provided example:

```bash
cp .env.local.example .env.local
# then edit `.env.local` and fill the values
```

Example `.env.local` contents:

```
NEXT_PUBLIC_PLASMIC_PROJECT_ID=your_project_id_here
PLASMIC_API_TOKEN=your_plasmic_api_token_here
```

Important:
- `NEXT_PUBLIC_PLASMIC_PROJECT_ID` is safe to be public (used by client code).
- `PLASMIC_API_TOKEN` is a secret; keep it only in `.env.local` (do NOT commit it).
- `.env.local` is gitignored by default in Next apps — verify `.gitignore` contains `.env.local`.

3. Install the required packages:

```bash
npm install @plasmicapp/loader @plasmicapp/loader-nextjs @plasmicapp/react-web
# or with pnpm/yarn
```

4. Pull components (optional) using `plasmic` CLI (install globally or npx):

```bash
npx plasmic sync --project-id $NEXT_PUBLIC_PLASMIC_PROJECT_ID --token $PLASMIC_API_TOKEN
```

5. Run your app and open the Plasmic editor or authored pages.

Files in this scaffold:
- `lib/plasmic/loader.ts` — example loader initialization.
- `app/plasmic/[[...plasmic]]/page.tsx` — example catch-all route to render Plasmic pages.

Notes:
- The sample code references Plasmic libraries and will require installing the packages above.
- The exact rendering approach can vary depending on whether you prefer codegen (sync) or runtime loading. See Plasmic docs for details.
