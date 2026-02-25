"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

import type { Business, CreateBusinessInput, UpdateBusinessInput } from "@/lib/types/business";
import { getMyBusinesses, createBusiness, updateBusiness } from "@/lib/api/businesses";
import { createBusinessSchema, updateBusinessSchema, normalizeUrl } from "@/lib/validation/business";

type DealForm = {
  title: string;
  description: string;
  category: "Discounts" | "FlashSales" | "EarlyAccess";
  originalPrice: string;
  discountedPrice: string;
  expiresAt: string;
};

type OpenDaysForm = {
  mondayOpen: boolean;
  tuesdayOpen: boolean;
  wednesdayOpen: boolean;
  thursdayOpen: boolean;
  fridayOpen: boolean;
  saturdayOpen: boolean;
  sundayOpen: boolean;
};

type BusinessFormState = {
  name: string;
  city: string;
  type: string;
  description: string;
  address: string;
  businessNumber: string;
  businessUrl: string;
  phoneNumber: string;
  imageUrl: string;
};

type BusinessView =
  | { mode: "list" }
  | { mode: "create" }
  | { mode: "edit"; business: Business };

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

const initialDealForm: DealForm = {
  title: "",
  description: "",
  category: "Discounts",
  originalPrice: "",
  discountedPrice: "",
  expiresAt: "",
};

const initialBusinessForm: BusinessFormState = {
  name: "",
  city: "",
  type: "",
  description: "",
  address: "",
  businessNumber: "",
  businessUrl: "",
  phoneNumber: "",
  imageUrl: "",
};

export default function DashboardBusiness() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<DealForm>(initialDealForm);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [openDays, setOpenDays] = useState<OpenDaysForm>({
    mondayOpen: true,
    tuesdayOpen: true,
    wednesdayOpen: true,
    thursdayOpen: true,
    fridayOpen: true,
    saturdayOpen: false,
    sundayOpen: false,
  });
  const [openDaysLoading, setOpenDaysLoading] = useState(false);
  const [openDaysMessage, setOpenDaysMessage] = useState<string | null>(null);

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [bizLoading, setBizLoading] = useState(false);
  const [bizError, setBizError] = useState<string | null>(null);
  const [bizMessage, setBizMessage] = useState<string | null>(null);
  const [bizView, setBizView] = useState<BusinessView>({ mode: "list" });
  const [bizSubmitting, setBizSubmitting] = useState(false);
  const [bizForm, setBizForm] = useState<BusinessFormState>(initialBusinessForm);
  const [bizFieldErrors, setBizFieldErrors] = useState<Record<string, string>>({});

  const isEditBusiness = bizView.mode === "edit";
  const activeBusiness = bizView.mode === "edit" ? bizView.business : null;

  const bizSchema = useMemo(
    () => (isEditBusiness ? updateBusinessSchema : createBusinessSchema),
    [isEditBusiness],
  );

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== 1) {
      if (user.role === 0) router.replace("/dashboard-user");
      else if (user.role === 2) router.replace("/dashboard-admin");
    }
  }, [isLoading, router, user]);

  useEffect(() => {
    const loadOpenDays = async () => {
      if (!user?.token) return;
      setOpenDaysLoading(true);
      try {
        const response = await fetch(`${API_BASE}/api/owner/opendays`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (!response.ok) return;
        const payload = (await response.json()) as OpenDaysForm;
        setOpenDays({
          mondayOpen: !!payload.mondayOpen,
          tuesdayOpen: !!payload.tuesdayOpen,
          wednesdayOpen: !!payload.wednesdayOpen,
          thursdayOpen: !!payload.thursdayOpen,
          fridayOpen: !!payload.fridayOpen,
          saturdayOpen: !!payload.saturdayOpen,
          sundayOpen: !!payload.sundayOpen,
        });
      } finally {
        setOpenDaysLoading(false);
      }
    };
    void loadOpenDays();
  }, [user?.token]);

  useEffect(() => {
    const loadMyBusinesses = async () => {
      if (!user?.token) return;
      setBizLoading(true);
      setBizError(null);
      try {
        const items = await getMyBusinesses(user.token);
        setBusinesses(items);
      } catch (e: any) {
        setBizError(e?.message ?? "Failed to load your businesses.");
      } finally {
        setBizLoading(false);
      }
    };
    void loadMyBusinesses();
  }, [user?.token]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/api/promotions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          category: form.category,
          originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
          discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : null,
          expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) {
        throw new Error(payload.message ?? "Failed to create deal.");
      }

      setMessage(
        `Deal u krijua me sukses te /${
          form.category === "FlashSales"
            ? "flash-sales"
            : form.category === "EarlyAccess"
              ? "early-access"
              : "discounts"
        }`,
      );
      setForm(initialDealForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ndodhi nje gabim.");
    } finally {
      setSubmitting(false);
    }
  };

  const onSaveOpenDays = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;
    setOpenDaysMessage(null);
    setOpenDaysLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/owner/opendays`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(openDays),
      });
      const payload = (await response.json().catch(() => ({}))) as { message?: string };
      if (!response.ok) {
        throw new Error(payload.message ?? "Failed to save open days.");
      }
      setOpenDaysMessage("Open days u ruajten me sukses.");
    } catch (err) {
      setOpenDaysMessage(err instanceof Error ? err.message : "Ndodhi nje gabim.");
    } finally {
      setOpenDaysLoading(false);
    }
  };

  function startCreateBusiness() {
    setBizMessage(null);
    setBizError(null);
    setBizFieldErrors({});
    setBizForm(initialBusinessForm);
    setBizView({ mode: "create" });
  }

  function startEditBusiness(b: Business) {
    setBizMessage(null);
    setBizError(null);
    setBizFieldErrors({});
    setBizForm({
      name: (b as any).name ?? "",
      city: (b as any).city ?? "",
      type: (b as any).type ?? "",
      description: (b as any).description ?? "",
      address: (b as any).address ?? "",
      businessNumber: (b as any).businessNumber ?? "",
      businessUrl: (b as any).businessUrl ?? "",
      phoneNumber: (b as any).phoneNumber ?? "",
      imageUrl: (b as any).imageUrl ?? "",
    });
    setBizView({ mode: "edit", business: b });
  }

  function cancelBusinessForm() {
    setBizFieldErrors({});
    setBizMessage(null);
    setBizError(null);
    setBizView({ mode: "list" });
    setBizForm(initialBusinessForm);
  }

  async function submitBusinessForm(e: React.FormEvent) {
    e.preventDefault();
    if (!user?.token) return;

    setBizSubmitting(true);
    setBizMessage(null);
    setBizError(null);
    setBizFieldErrors({});

    const normalizedUrl = normalizeUrl(bizForm.businessUrl);

    const toValidate = {
      ...bizForm,
      businessUrl: normalizedUrl,
    };

    const result = bizSchema.safeParse(toValidate);
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0];
        if (typeof k === "string") errs[k] = issue.message;
      }
      setBizFieldErrors(errs);
      setBizSubmitting(false);
      return;
    }

    try {
      if (isEditBusiness && activeBusiness) {
        const input: UpdateBusinessInput = {
          name: bizForm.name.trim(),
          city: bizForm.city.trim(),
          type: bizForm.type.trim(),
          description: bizForm.description.trim() || undefined,
          address: bizForm.address.trim() || undefined,
          businessUrl: normalizedUrl || undefined,
          businessNumber: bizForm.businessNumber.trim(),
        };

        const updated = await updateBusiness(
          user.token,
          activeBusiness.id,
          {
            ...(input as any),
            phoneNumber: bizForm.phoneNumber.trim() || undefined,
            imageUrl: bizForm.imageUrl.trim() || undefined,
          } as any,
        );

        setBusinesses((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        setBizMessage("Business updated successfully.");
        setBizView({ mode: "list" });
      } else {
        const input: CreateBusinessInput = {
          name: bizForm.name.trim(),
          city: bizForm.city.trim(),
          type: bizForm.type.trim(),
          description: bizForm.description.trim() || undefined,
          address: bizForm.address.trim() || undefined,
          businessNumber: bizForm.businessNumber.trim(),
          businessUrl: normalizedUrl || undefined,
        };

        const created = await createBusiness(
          user.token,
          {
            ...(input as any),
            phoneNumber: bizForm.phoneNumber.trim() || undefined,
            imageUrl: bizForm.imageUrl.trim() || undefined,
          } as any,
        );

        setBusinesses((prev) => [created, ...prev]);
        setBizMessage("Business submitted successfully.");
        setBizView({ mode: "list" });
      }

      setBizForm(initialBusinessForm);
    } catch (e: any) {
      setBizError(e?.message ?? "Failed to submit business.");
    } finally {
      setBizSubmitting(false);
    }
  }

  if (isLoading || !user) return null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-5xl space-y-10">
          <section className="rounded-2xl border border-oak/35 bg-paper/95 p-8 shadow-panel">
            <h1 className="text-3xl font-bold text-espresso">Deals & Promotions</h1>
            <p className="mt-2 text-espresso/80">
              Zgjedh kategorine ne dropdown dhe deal paraqitet automatikisht te /discounts, /flash-sales ose /early-access.
            </p>

            <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
              <input
                className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                placeholder="Deal title"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                required
              />
              <textarea
                className="min-h-24 rounded-lg border border-oak/30 bg-white px-3 py-2"
                placeholder="Deal description"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                required
              />

              <select
                className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category: e.target.value as DealForm["category"] }))
                }
              >
                <option value="Discounts">Discounts</option>
                <option value="FlashSales">Flash Sales</option>
                <option value="EarlyAccess">Early Access</option>
              </select>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <input
                  type="number"
                  step="0.01"
                  className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                  placeholder="Original price"
                  value={form.originalPrice}
                  onChange={(e) => setForm((prev) => ({ ...prev, originalPrice: e.target.value }))}
                />
                <input
                  type="number"
                  step="0.01"
                  className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                  placeholder="Discounted price"
                  value={form.discountedPrice}
                  onChange={(e) => setForm((prev) => ({ ...prev, discountedPrice: e.target.value }))}
                />
                <input
                  type="datetime-local"
                  className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                  value={form.expiresAt}
                  onChange={(e) => setForm((prev) => ({ ...prev, expiresAt: e.target.value }))}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-fit rounded-lg bg-espresso px-4 py-2 font-semibold text-paper disabled:opacity-60"
              >
                {submitting ? "Saving..." : "Create Deal"}
              </button>

              {message ? <p className="text-green-700">{message}</p> : null}
              {error ? <p className="text-red-700">{error}</p> : null}
            </form>
          </section>

          <section className="rounded-2xl border border-oak/35 bg-paper/95 p-8 shadow-panel">
            <h2 className="text-2xl font-bold text-espresso">Open Days Checklist</h2>
            <p className="mt-2 text-espresso/80">Menaxho ditet e hapura per biznesin tend. Kjo shfaqet te /opendays.</p>

            <form className="mt-4 grid gap-3" onSubmit={onSaveOpenDays}>
              {[
                ["mondayOpen", "Monday"],
                ["tuesdayOpen", "Tuesday"],
                ["wednesdayOpen", "Wednesday"],
                ["thursdayOpen", "Thursday"],
                ["fridayOpen", "Friday"],
                ["saturdayOpen", "Saturday"],
                ["sundayOpen", "Sunday"],
              ].map(([key, label]) => (
                <label key={key} className="flex items-center gap-3 text-espresso">
                  <input
                    type="checkbox"
                    checked={openDays[key as keyof OpenDaysForm]}
                    onChange={(e) => setOpenDays((prev) => ({ ...prev, [key]: e.target.checked }))}
                  />
                  <span>{label}</span>
                </label>
              ))}

              <button
                type="submit"
                disabled={openDaysLoading}
                className="mt-2 w-fit rounded-lg bg-espresso px-4 py-2 font-semibold text-paper disabled:opacity-60"
              >
                {openDaysLoading ? "Saving..." : "Save Open Days"}
              </button>

              {openDaysMessage ? <p className="text-espresso">{openDaysMessage}</p> : null}
            </form>
          </section>

          <section className="rounded-2xl border border-oak/35 bg-paper/95 p-8 shadow-panel">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-espresso">My Businesses</h2>
                <p className="mt-1 text-espresso/80">Dërgo një biznes të ri ose përditëso një biznes ekzistues.</p>
              </div>

              {bizView.mode === "list" ? (
                <button
                  type="button"
                  onClick={startCreateBusiness}
                  className="w-fit rounded-lg bg-espresso px-4 py-2 font-semibold text-paper"
                >
                  Submit New Business
                </button>
              ) : (
                <button
                  type="button"
                  onClick={cancelBusinessForm}
                  className="w-fit rounded-lg border border-oak/40 bg-white px-4 py-2 font-semibold text-espresso"
                >
                  Back to list
                </button>
              )}
            </div>

            {bizMessage ? <p className="mt-4 text-green-700">{bizMessage}</p> : null}
            {bizError ? <p className="mt-4 text-red-700">{bizError}</p> : null}

            {bizView.mode === "list" ? (
              <div className="mt-6">
                {bizLoading ? (
                  <p className="text-espresso/80">Loading...</p>
                ) : businesses.length === 0 ? (
                  <p className="text-espresso/80">You haven’t submitted any businesses yet.</p>
                ) : (
                  <div className="grid gap-3">
                    {businesses.map((b) => (
                      <div key={b.id} className="rounded-xl border border-oak/25 bg-white p-4">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="flex gap-4">
                            {(b as any).imageUrl ? (
                              <img
                                src={(b as any).imageUrl}
                                alt="logo"
                                className="h-14 w-14 rounded-lg border border-oak/20 object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="h-14 w-14 rounded-lg border border-oak/20 bg-paper" />
                            )}

                            <div>
                              <p className="text-lg font-bold text-espresso">{(b as any).name}</p>
                              <p className="text-sm text-espresso/70">
                                {(b as any).city ?? "—"} · {(b as any).type ?? "—"} · Status: {(b as any).status ?? "—"}
                              </p>
                              <p className="mt-1 text-sm text-espresso/70">Address: {(b as any).address ?? "—"}</p>
                              <p className="text-sm text-espresso/70">Business number: {(b as any).businessNumber ?? "—"}</p>
                              <p className="text-sm text-espresso/70">
                                Phone: {(b as any).phoneNumber ?? "—"}
                              </p>
                              <p className="text-sm text-espresso/70">
                                Website:{" "}
                                {(b as any).businessUrl ? (
                                  <a className="underline" href={(b as any).businessUrl} target="_blank" rel="noreferrer">
                                    {(b as any).businessUrl}
                                  </a>
                                ) : (
                                  "—"
                                )}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => startEditBusiness(b)}
                            className="w-fit rounded-lg border border-oak/40 bg-white px-4 py-2 font-semibold text-espresso"
                          >
                            Edit
                          </button>
                        </div>

                        {(b as any).description ? <p className="mt-3 text-espresso/80">{(b as any).description}</p> : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <form className="mt-6 grid gap-4" onSubmit={submitBusinessForm}>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="grid gap-1">
                    <label className="text-sm font-semibold text-espresso">Business Name</label>
                    <input
                      className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                      value={bizForm.name}
                      onChange={(e) => setBizForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Cafe Uno"
                    />
                    {bizFieldErrors.name ? <p className="text-sm text-red-700">{bizFieldErrors.name}</p> : null}
                  </div>

                  <div className="grid gap-1">
                    <label className="text-sm font-semibold text-espresso">City</label>
                    <input
                      className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                      value={bizForm.city}
                      onChange={(e) => setBizForm((p) => ({ ...p, city: e.target.value }))}
                      placeholder="Prishtina"
                    />
                    {bizFieldErrors.city ? <p className="text-sm text-red-700">{bizFieldErrors.city}</p> : null}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="grid gap-1">
                    <label className="text-sm font-semibold text-espresso">Type</label>
                    <input
                      className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                      value={bizForm.type}
                      onChange={(e) => setBizForm((p) => ({ ...p, type: e.target.value }))}
                      placeholder="Cafe"
                    />
                    {bizFieldErrors.type ? <p className="text-sm text-red-700">{bizFieldErrors.type}</p> : null}
                  </div>

                  <div className="grid gap-1">
                    <label className="text-sm font-semibold text-espresso">Address</label>
                    <input
                      className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                      value={bizForm.address}
                      onChange={(e) => setBizForm((p) => ({ ...p, address: e.target.value }))}
                      placeholder="Street, number, area..."
                    />
                    {bizFieldErrors.address ? <p className="text-sm text-red-700">{bizFieldErrors.address}</p> : null}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="grid gap-1">
                    <label className="text-sm font-semibold text-espresso">
                      Business Number {isEditBusiness ? "(locked)" : ""}
                    </label>
                    <input
                      className={`rounded-lg border border-oak/30 px-3 py-2 ${
                        isEditBusiness ? "bg-gray-100 text-gray-700" : "bg-white"
                      }`}
                      value={bizForm.businessNumber}
                      onChange={(e) => setBizForm((p) => ({ ...p, businessNumber: e.target.value }))}
                      placeholder="Registration number"
                      disabled={isEditBusiness}
                    />
                    {!isEditBusiness && bizFieldErrors.businessNumber ? (
                      <p className="text-sm text-red-700">{bizFieldErrors.businessNumber}</p>
                    ) : null}
                    <div className="h-10">
                      <p className="text-xs leading-5 text-espresso/60 line-clamp-2">
                        Këshillë: Shkruaj Numrin e Regjistrimit të Biznesit (NRB) që e gjen në ARBK.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-1">
                    <label className="text-sm font-semibold text-espresso">Business URL</label>
                    <input
                      className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                      value={bizForm.businessUrl}
                      onChange={(e) => setBizForm((p) => ({ ...p, businessUrl: e.target.value }))}
                      placeholder="example.com or https://example.com"
                    />
                    {bizFieldErrors.businessUrl ? (
                      <p className="text-sm text-red-700">{bizFieldErrors.businessUrl}</p>
                    ) : null}
                    <div className="h-10">
                      <p className="text-xs leading-5 text-espresso/60 line-clamp-2">
                        Këshillë: shkruaj “example.com” dhe ne do t’i shtojmë automatikisht “https://”.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="grid gap-1">
                    <label className="text-sm font-semibold text-espresso">Phone Number</label>
                    <input
                      className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                      value={bizForm.phoneNumber}
                      onChange={(e) => setBizForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                      placeholder="+383..."
                    />
                    {bizFieldErrors.phoneNumber ? (
                      <p className="text-sm text-red-700">{bizFieldErrors.phoneNumber}</p>
                    ) : null}
                  </div>

                  <div className="grid gap-1">
                    <label className="text-sm font-semibold text-espresso">Image URL (Logo)</label>
                    <input
                      className="rounded-lg border border-oak/30 bg-white px-3 py-2"
                      value={bizForm.imageUrl}
                      onChange={(e) => setBizForm((p) => ({ ...p, imageUrl: e.target.value }))}
                      placeholder="https://.../logo.png"
                    />
                    {bizFieldErrors.imageUrl ? (
                      <p className="text-sm text-red-700">{bizFieldErrors.imageUrl}</p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-1">
                  <label className="text-sm font-semibold text-espresso">Description</label>
                  <textarea
                    className="min-h-24 rounded-lg border border-oak/30 bg-white px-3 py-2"
                    value={bizForm.description}
                    onChange={(e) => setBizForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Describe your business..."
                  />
                  {bizFieldErrors.description ? (
                    <p className="text-sm text-red-700">{bizFieldErrors.description}</p>
                  ) : null}
                </div>

                <button
                  type="submit"
                  disabled={bizSubmitting}
                  className="w-fit rounded-lg bg-espresso px-4 py-2 font-semibold text-paper disabled:opacity-60"
                >
                  {bizSubmitting ? "Saving..." : isEditBusiness ? "Save Changes" : "Submit Business"}
                </button>
              </form>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
