# Business Directory Frontend

Next.js + React frontend for the Business Directory project.

## Requirements
- Node.js 22+
- npm 10+

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file:
   ```bash
   cp .env.example .env
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```

## Environment
- `NEXT_PUBLIC_API_URL`: backend base URL (example: `https://itconnect.it.com`)

## Scripts
- `npm run dev`: start development server
- `npm run build`: create production build
- `npm run start`: run production server
- `npm run lint`: lint codebase
- `npm run format`: apply Prettier formatting
- `npm run format:check`: verify formatting
- `npm test`: run unit/component tests

## Key Routes
- `/homepage`: marketing + listings
- `/business/[id]`: public business details
- `/opendays?businessId=<id>`: open days view
- `/offers`: offers/promotions view
- `/login`, `/register`: auth
- `/dashboard-user`, `/dashboard-business`, `/dashboard-admin`: role dashboards

## Deployment
- Docker image build uses [`Dockerfile`](./Dockerfile)
- Kubernetes manifests are under `k8s/dev/`
- CI workflow: `.github/workflows/node.js.yml`
- CD workflow: `.github/workflows/cd-frontend.yml`

## Notes
- API/domain helpers live in `lib/api/*`
- Shared types live in `lib/types/*`
- Validation schemas live in `lib/validation/*`
