import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getApprovedBusinessById } from "@/lib/api/public";

export const revalidate = 60;

const isNotFoundApiError = (value: unknown): value is { status: number } =>
  typeof value === "object" &&
  value !== null &&
  "status" in value &&
  typeof (value as { status?: unknown }).status === "number" &&
  (value as { status: number }).status === 404;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const business = await getApprovedBusinessById(resolvedParams.id);
    return {
      title: `${business.name} | Business Directory`,
      description: business.description ?? "Approved business details.",
    };
  } catch {
    return {
      title: "Business | Business Directory",
    };
  }
}

export default async function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  let business: Awaited<ReturnType<typeof getApprovedBusinessById>>;

  try {
    business = await getApprovedBusinessById(resolvedParams.id);
  } catch (err) {
    if (isNotFoundApiError(err)) {
      notFound();
    }
    throw err;
  }

  return (
    <main className="min-h-screen px-4 py-8 md:px-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-2xl border border-oak/35 bg-paper/90 p-6 shadow-panel">
          <p className="text-xs font-semibold uppercase tracking-wide text-espresso/70">Approved Business</p>
          <h1 className="mt-2 text-2xl font-bold text-espresso md:text-3xl">{business.name}</h1>
          <p className="mt-3 text-sm text-espresso/80">
            {business.city ?? "Unknown city"} · {business.businessType ?? "General"} · {business.status ?? "Approved"}
          </p>
          <p className="mt-4 text-sm leading-6 text-espresso/85">
            {business.description ?? "No description provided yet."}
          </p>
        </section>

        <section>
          <Link className="text-sm font-semibold underline" href="/businesses">
            ← Back to businesses
          </Link>
        </section>
      </div>
    </main>
  );
}
