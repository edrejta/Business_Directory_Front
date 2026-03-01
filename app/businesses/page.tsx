import type { Metadata } from "next";
import Link from "next/link";
import { getApprovedBusinesses } from "@/lib/api/public";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Businesses | Business Directory",
  description: "Explore approved businesses by city, type, or name.",
};

type SearchParamValue = string | string[] | undefined;

const getSearchValue = (value: SearchParamValue) => (Array.isArray(value) ? value[0] : value) ?? "";

export default async function BusinessesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: SearchParamValue; city?: SearchParamValue; type?: SearchParamValue }>;
}) {
  const params = await searchParams;
  const search = getSearchValue(params.search);
  const city = getSearchValue(params.city);
  const type = getSearchValue(params.type);

  let error: string | null = null;
  let businesses = [] as Awaited<ReturnType<typeof getApprovedBusinesses>>;

  try {
      businesses = await getApprovedBusinesses({
        search: search || undefined,
        city: city || undefined,
        type: type || undefined,
      });
  } catch (err) {
    error = err instanceof Error ? err.message : "Ndodhi një gabim.";
  }

  return (
    <main className="min-h-screen px-4 py-8 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl border border-oak/35 bg-paper/90 p-6 shadow-panel">
          <h1 className="text-2xl font-bold text-espresso md:text-3xl">Businesses</h1>
          <p className="mt-2 text-espresso/80">Public list of approved businesses from your backend.</p>

          <form className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4" method="GET">
            <input
              className="rounded-lg border border-oak/45 bg-white/80 px-3 py-2 text-sm outline-none focus:border-espresso"
              defaultValue={search}
              name="search"
              placeholder="Search name..."
            />
            <input
              className="rounded-lg border border-oak/45 bg-white/80 px-3 py-2 text-sm outline-none focus:border-espresso"
              defaultValue={city}
              name="city"
              placeholder="City..."
            />
            <input
              className="rounded-lg border border-oak/45 bg-white/80 px-3 py-2 text-sm outline-none focus:border-espresso"
              defaultValue={type}
              name="type"
              placeholder="Business type..."
            />
            <button
              className="rounded-lg bg-espresso px-4 py-2 text-sm font-semibold text-paper transition hover:bg-[#2d1f15]"
              type="submit"
            >
              Filter
            </button>
          </form>
        </section>

        {error && (
          <section className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">{error}</section>
        )}

        {!error && businesses.length === 0 && (
          <section className="rounded-xl border border-oak/25 bg-white/85 p-5 text-sm text-espresso/80">
            No approved businesses found for this filter.
          </section>
        )}

        {!error && businesses.length > 0 && (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {businesses.map((business) => (
              <article key={business.id} className="rounded-2xl border border-oak/30 bg-white/90 p-5">
                <h2 className="text-lg font-semibold text-espresso">{business.name}</h2>
                <p className="mt-1 text-sm text-espresso/75">
                  {business.city ?? "Unknown city"} · {business.type ?? "General"}
                </p>
                <p className="mt-3 text-sm text-espresso/80">
                  {business.description ?? "No description provided yet."}
                </p>
                <Link className="mt-4 inline-block text-sm font-semibold underline" href={`/businesses/${business.id}`}>
                  View details
                </Link>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
