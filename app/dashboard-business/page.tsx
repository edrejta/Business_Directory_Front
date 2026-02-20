"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import StatusBadge from "@/components/StatusBadge";
import BusinessForm from "@/components/BusinessForm";
import { useAuth } from "@/context/AuthContext";
import type { OwnerBusiness, UpsertBusinessInput } from "@/lib/types/business";
import * as ownerApi from "@/lib/api/ownerBusinesses";

type ViewState =
  | { mode: "list" }
  | { mode: "create" }
  | { mode: "edit"; business: OwnerBusiness };

export default function DashboardBusinessOwner() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<OwnerBusiness[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<ViewState>({ mode: "list" });
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    // role: 1 = BusinessOwner
    if (user.role !== 1) {
      if (user.role === 0) router.replace("/dashboard-user");
      else if (user.role === 2) router.replace("/dashboard-admin");
    }
  }, [isLoading, router, user]);

  async function load() {
    setError(null);
    setLoadingList(true);
    try {
      const res = await ownerApi.getMyBusinesses();
      setData(res);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ndodhi një gabim.");
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => {
    if (isLoading || !user) return;
    if (user.role === 1) load();
  }, [isLoading, user]);

  const headerText = useMemo(() => user?.username ?? "biznes", [user]);

  if (isLoading || !user) return null;

  async function handleCreate(input: UpsertBusinessInput) {
    await ownerApi.createBusiness(input);
    setView({ mode: "list" });
    await load();
  }

  async function handleEdit(id: string | number, input: UpsertBusinessInput) {
    await ownerApi.updateBusiness(id, input);
    setView({ mode: "list" });
    await load();
  }

  async function openEdit(b: OwnerBusiness) {
    setEditError(null);
    setLoadingEdit(true);

    try {
      const fresh = await ownerApi.getBusinessById(b.id);
      setView({ mode: "edit", business: fresh });
    } catch (e) {
      setEditError(e instanceof Error ? e.message : "Ndodhi një gabim.");
    } finally {
      setLoadingEdit(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="mx-auto max-w-5xl p-4 md:p-8">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Mirë se erdhe, {headerText}.</h1>
            <p className="mt-1 text-sm text-gray-600">
              Këtu menaxhon bizneset dhe listimet e tua.
            </p>
          </div>

          {view.mode === "list" && (
            <button
              onClick={() => setView({ mode: "create" })}
              className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              + Shto biznes
            </button>
          )}
        </header>

        {(error || editError) && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error ?? editError}
          </div>
        )}

        {loadingEdit && (
          <div className="mb-4 rounded-lg border bg-white px-3 py-2 text-sm text-gray-700">
            Duke hapur biznesin për edit...
          </div>
        )}

        {view.mode === "create" && (
          <BusinessForm
            mode="create"
            onCancel={() => setView({ mode: "list" })}
            onSubmit={handleCreate}
          />
        )}

        {view.mode === "edit" && (
          <BusinessForm
            mode="edit"
            initial={view.business}
            onCancel={() => setView({ mode: "list" })}
            onSubmit={(input) => handleEdit(view.business.id, input)}
          />
        )}

        {view.mode === "list" && (
          <section className="rounded-xl border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b p-4">
              <h2 className="text-lg font-semibold">My Businesses</h2>
              <button
                onClick={load}
                className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-60"
                disabled={loadingList}
              >
                {loadingList ? "Duke rifreskuar..." : "Rifresko"}
              </button>
            </div>

            <div className="p-4">
              {loadingList ? (
                <div className="text-sm text-gray-600">Duke ngarkuar...</div>
              ) : data.length === 0 ? (
                <div className="text-sm text-gray-600">
                  Nuk ke ende biznese. Kliko “Shto biznes”.
                </div>
              ) : (
                <div className="grid gap-3">
                  {data.map((b) => (
                    <div
                      key={String(b.id)}
                      className="flex flex-col justify-between gap-3 rounded-lg border p-4 md:flex-row md:items-center"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="truncate text-base font-semibold">
                            {b.businessName}
                          </h3>
                          <StatusBadge status={b.status} />
                        </div>

                        {b.description && (
                          <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                            {b.description}
                          </p>
                        )}

                        {(b.address || b.city || b.email || b.phoneNumber) && (
                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600">
                            {b.address && <span>📍 {b.address}</span>}
                            {b.city && <span>🏙️ {b.city}</span>}
                            {b.email && <span>✉️ {b.email}</span>}
                            {b.phoneNumber && <span>📞 {b.phoneNumber}</span>}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => openEdit(b)}
                          disabled={loadingEdit}
                          className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-60"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </>
  );
}