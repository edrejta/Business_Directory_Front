import Link from "next/link";

const endpointGroups = [
  {
    title: "Public",
    path: "lib/api/public.ts",
    items: ["GET /health", "GET /api/businesses/public", "GET /api/cities"],
  },
  {
    title: "Auth",
    path: "lib/api/auth.ts",
    items: ["POST /api/auth/register", "POST /api/auth/login"],
  },
  {
    title: "User (JWT)",
    path: "lib/api/businesses.ts, lib/api/users.ts, lib/api/comments.ts",
    items: [
      "POST|PUT|DELETE /api/businesses",
      "GET /api/businesses/mine",
      "GET /api/users/me, GET|PUT /api/users/{id}",
      "POST|PUT|DELETE /api/comments",
    ],
  },
  {
    title: "Admin",
    path: "lib/api/admin.ts",
    items: [
      "GET /api/admin/dashboard",
      "GET /api/admin/users",
      "PATCH /api/admin/users/{id}/role",
      "GET /api/admin/audit-logs?take=100",
      "DELETE /api/admin/users/{id}?reason=...",
      "GET /api/admin/businesses*",
      "PATCH /api/admin/businesses/{id}/approve|reject|suspend",
    ],
  },
];

export default function AuthPage() {
  return (
    <main className="min-h-screen px-4 py-8 md:px-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-2xl border border-oak/35 bg-paper/90 p-6 shadow-panel">
          <h1 className="text-2xl font-bold text-espresso md:text-3xl">Project Start Guide</h1>
          <p className="mt-2 text-espresso/80">
            This page is the base map for where new code should go. Keep auth/admin logic in API files, not in demo
            pages.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Link className="rounded-full border border-oak/40 px-4 py-2 font-semibold text-espresso" href="/businesses">
              Browse Businesses
            </Link>
            <Link className="rounded-full bg-espresso px-4 py-2 font-semibold text-paper" href="/login">
              Go to Login
            </Link>
            <Link className="rounded-full border border-oak/40 px-4 py-2 font-semibold text-espresso" href="/register">
              Go to Register
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-oak/30 bg-white/90 p-5">
          <h2 className="text-lg font-semibold text-espresso">When Adding A New Feature</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-espresso/85">
            <li>Add request/response types in `lib/types/*`.</li>
            <li>Add API call in the correct file under `lib/api/*`.</li>
            <li>If endpoint needs JWT, call via `authenticatedJson` from `lib/api/client.ts`.</li>
            <li>Use API function from a page/component in `app/*` or `components/*`.</li>
            <li>Add or update tests next to logic (`*.test.ts` / `*.test.tsx`).</li>
          </ol>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {endpointGroups.map((group) => (
            <article key={group.title} className="rounded-2xl border border-oak/30 bg-white/90 p-5">
              <h3 className="text-base font-semibold text-espresso">{group.title}</h3>
              <p className="mt-1 text-xs text-espresso/70">Add code in: {group.path}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-espresso/85">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-oak/30 bg-white/90 p-5 text-sm text-espresso/85">
          <h2 className="text-lg font-semibold text-espresso">Current Rule</h2>
          <p className="mt-2">
            `app/auth/page.tsx` is now a guide page only. Real login/register API behavior lives in
            `lib/api/auth.ts`, tested in `lib/api/auth.test.ts`, and admin behavior lives in `lib/api/admin.ts`.
          </p>
          <p className="mt-2">
            Team handbook: `docs/TEAM_START_HERE.md`.
          </p>
        </section>
      </div>
    </main>
  );
}
