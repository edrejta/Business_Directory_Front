"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5003";

const initialForm: DealForm = {
  title: "",
  description: "",
  category: "Discounts",
  originalPrice: "",
  discountedPrice: "",
  expiresAt: "",
};

export default function DashboardBusiness() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<DealForm>(initialForm);
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
        const response = await fetch(`${API_BASE}/owner/opendays`, {
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

  if (isLoading || !user) return null;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/promotions`, {
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

      setMessage(`Deal u krijua me sukses te /${form.category === "FlashSales" ? "flash-sales" : form.category === "EarlyAccess" ? "early-access" : "discounts"}`);
      setForm(initialForm);
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
      const response = await fetch(`${API_BASE}/owner/opendays`, {
        method: "PUT",
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

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 py-10">
        <div className="mx-auto max-w-5xl rounded-2xl border border-oak/35 bg-paper/95 p-8 shadow-panel">
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

          <hr className="my-8 border-oak/20" />

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
                  onChange={(e) =>
                    setOpenDays((prev) => ({ ...prev, [key]: e.target.checked }))
                  }
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
        </div>
      </main>
    </>
  );
}
